-- 피그마 "동네냠냠 UI 최종"(10/7) 반영 ① 가게: 입점 신청 정보 · 심사 기록 · 이용 정지 · 운영자 직접 등록
-- 이미 배포된 마이그레이션은 고치지 않고 이 파일에서 바꾼다 (컨벤션 8장)

-- ───── 정책 수치 (A4 운영 설정 화면과 1:1). 바꾸면 화면 문구(src/shared/constants/policy.ts)도 같은 PR에서 고친다 ─────
create or replace function public.app_policy()
returns jsonb language sql immutable set search_path = public as $$
  select jsonb_build_object(
    'neighborhood_name', '월계1동',
    'center_lat', 37.6206,                  -- 월계1동 중심 추정값 (src/shared/lib/geo.ts WOLGYE1_CENTER와 같음)
    'center_lng', 127.058,
    'store_radius_m', 1500,                 -- 입점 가능 범위
    'resident_daily_push', 3,               -- 주민당 하루 알림
    'same_store_daily_push', 1,             -- 같은 가게 알림
    'quiet_start', '22:00',                 -- 방해 금지 시간
    'quiet_end', '08:00',
    'resident_daily_redeem', 3,             -- 주민 하루 쿠폰 사용
    'owner_daily_deals', 3,                 -- 사장님 하루 딜 등록 (즉시딜만 셈)
    'report_auto_pause', 3,                 -- 신고 자동 중지
    'confirmed_reports_suspend', 3          -- 가게 이용 정지
  );
$$;
grant execute on function public.app_policy() to anon, authenticated;

-- 두 좌표 사이 거리(m). recommend_deals와 같은 하버사인 식
create or replace function public.distance_m(lat1 double precision, lng1 double precision,
                                             lat2 double precision, lng2 double precision)
returns int language sql immutable set search_path = public as $$
  select (2 * 6371000 * asin(sqrt(
    power(sin(radians(lat2 - lat1) / 2), 2)
    + cos(radians(lat1)) * cos(radians(lat2)) * power(sin(radians(lng2 - lng1) / 2), 2)
  )))::int;
$$;

create or replace function public.is_in_service_area(p_lat double precision, p_lng double precision)
returns boolean language sql immutable set search_path = public as $$
  select p_lat is not null and p_lng is not null
     and public.distance_m((public.app_policy()->>'center_lat')::float8, (public.app_policy()->>'center_lng')::float8,
                           p_lat, p_lng) <= (public.app_policy()->>'store_radius_m')::int;
$$;

-- ───── stores 컬럼 추가 ─────
-- 운영자가 사장님 계정 없이 직접 넣는 가게(시연용, 사전 동의 받은 가게)를 위해 owner_id를 비울 수 있게 한다.
-- 사장님이 탈퇴해도 가게 기록(딜·쿠폰 통계)은 남도록 on delete set null
alter table public.stores alter column owner_id drop not null;
alter table public.stores drop constraint stores_owner_id_fkey;
alter table public.stores add constraint stores_owner_id_fkey
  foreign key (owner_id) references public.profiles(id) on delete set null;

alter table public.stores drop constraint stores_status_check;
alter table public.stores add constraint stores_status_check
  check (status in ('pending', 'approved', 'rejected', 'suspended'));

alter table public.stores
  add column description        text check (char_length(description) <= 40),          -- "베이커리 · 디저트" 같은 한 줄 소개
  add column representative_name text check (char_length(representative_name) between 1 and 20),
  add column business_no        text check (business_no ~ '^[0-9]{10}$'),              -- 하이픈 없이 10자리
  add column phone              text check (char_length(phone) <= 20),
  add column license_path       text,                                                 -- Storage business-licenses 버킷 안 경로
  add column submitted_at       timestamptz not null default now(),                   -- 신청(재신청) 시각
  add column reviewed_at        timestamptz,                                          -- 승인·거절한 시각 (평균 처리 시간)
  add column approved_at        timestamptz,
  add column reject_code        text check (reject_code in ('out_of_area', 'missing_info', 'duplicate', 'license_unreadable', 'etc')),
  add column suspended_at       timestamptz,
  add column suspend_code       text check (suspend_code in ('fake_deal_repeat', 'closed', 'owner_request', 'etc')),
  add column suspend_note       text check (char_length(suspend_note) <= 150),
  add column created_by_admin   boolean not null default false,                       -- 운영자가 직접 등록한 가게
  add column link_code_hash     text,                                                 -- 운영자 등록 가게를 사장님 계정에 잇는 일회용 코드
  -- 주소 변경 재심사 (심사 중에도 진행 중인 딜은 그대로 → status는 approved 유지, 아래 칸에 새 주소를 둔다)
  add column pending_address    text,
  add column pending_lat        double precision,
  add column pending_lng        double precision,
  add column address_requested_at timestamptz;

-- 같은 사업자등록번호로 두 번 신청 금지 (DUPLICATE_BUSINESS_NO)
create unique index uq_stores_business_no on public.stores (business_no) where business_no is not null;
create index idx_stores_status on public.stores (status);

update public.stores set approved_at = created_at, reviewed_at = created_at where status = 'approved';

-- 사업자 정보는 주민에게 보이면 안 된다: 주민이 읽는 컬럼만 열어 준다 (사장님 본인·운영자는 RPC로 읽음)
revoke select on public.stores from authenticated;
grant select (id, owner_id, name, category, description, address, lat, lng, status, reject_reason, reject_code,
              submitted_at, reviewed_at, approved_at, suspended_at, suspend_code, suspend_note, created_at,
              pending_address, address_requested_at, created_by_admin)
  on public.stores to authenticated;
-- 사장님이 직접 고칠 수 있는 것은 이름·업종·한 줄 소개뿐 (주소는 request_store_address_change)
revoke update on public.stores from authenticated;
grant update (name, category, description) on public.stores to authenticated;

-- ───── store_secrets: 코드 발급 여부 (O6 "코드 발급 필요" 상태) ─────
alter table public.store_secrets add column code_issued_at timestamptz;
alter table public.store_secrets alter column redeem_code_hash drop not null;
-- 기존 행(승인 시 아무도 모르는 코드로 만든 자리)은 미발급으로 본다
update public.store_secrets set code_issued_at = null;

-- ───── 사장님 약관 동의 (O0) ─────
alter table public.profiles
  add column owner_terms_agreed_at     timestamptz,
  add column owner_marketing_agreed_at timestamptz;

-- ───── 알림함 (주민·사장님 공용, R17 · O10) ─────
create table public.notifications (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  audience    text not null check (audience in ('resident', 'owner')),
  kind        text not null check (kind in (
                'deal',               -- 주민: 일정에 맞는 딜
                'deal_start',         -- 주민: 알림 신청한 딜 시작
                'notice',             -- 주민: 서비스 공지
                'store_approved', 'store_rejected', 'store_suspended', 'store_unsuspended',
                'address_approved', 'address_rejected',
                'deal_sold_out', 'deal_paused', 'deal_resumed', 'deal_closed_by_report')),
  title       text not null check (char_length(title) <= 80),
  body        text check (char_length(body) <= 200),
  deal_id     uuid references public.deals(id) on delete set null,
  store_id    uuid references public.stores(id) on delete cascade,
  link        text,                                   -- 눌렀을 때 갈 앱 안 경로 (예: /owner/deals/<id>)
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);
create index idx_notifications_user_recent on public.notifications (user_id, created_at desc);
alter table public.notifications enable row level security;
create policy "본인 알림 조회" on public.notifications
  for select to authenticated using (user_id = auth.uid());
create policy "본인 알림 읽음 처리" on public.notifications
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
revoke insert, update, delete on public.notifications from authenticated;
grant update (read_at) on public.notifications to authenticated;
alter publication supabase_realtime add table public.notifications;

-- 서버 함수 안에서만 부르는 알림 넣기 (가게 주인이 없으면 아무것도 안 함)
create or replace function public.notify_store_owner(p_store_id uuid, p_kind text, p_title text,
                                                     p_body text default null, p_deal_id uuid default null,
                                                     p_link text default null)
returns void language sql security definer set search_path = public as $$
  insert into notifications (user_id, audience, kind, title, body, deal_id, store_id, link)
  select s.owner_id, 'owner', p_kind, p_title, p_body, p_deal_id, s.id, p_link
  from stores s where s.id = p_store_id and s.owner_id is not null;
$$;
revoke all on function public.notify_store_owner(uuid, text, text, text, uuid, text) from public, anon, authenticated;

create or replace function public.mark_notifications_read(p_ids bigint[] default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_count int;
begin
  if auth.uid() is null then
    return jsonb_build_object('ok', false, 'error', 'UNAUTHENTICATED');
  end if;
  update notifications set read_at = now()
  where user_id = auth.uid() and read_at is null and (p_ids is null or id = any (p_ids));
  get diagnostics v_count = row_count;
  return jsonb_build_object('ok', true, 'data', jsonb_build_object('updated', v_count));
end $$;

-- 30일 지난 알림 정리 (R17 "알림은 30일 동안 보관돼요")
create or replace function public.purge_old_notifications()
returns void language sql security definer set search_path = public as $$
  delete from notifications where created_at < now() - interval '30 days';
$$;
revoke all on function public.purge_old_notifications() from public, anon, authenticated;
select cron.schedule('purge-old-notifications', '20 18 * * *', 'select public.purge_old_notifications()');  -- 한국 03:20

-- ───── 사장님 입점 신청 (O0 → O1 → O1-2 → O1-3). 거절된 가게는 같은 함수로 재신청 ─────
drop function public.register_store(text, text, text, double precision, double precision);

create or replace function public.register_store(
  p_name text, p_category text, p_address text, p_lat double precision, p_lng double precision,
  p_representative_name text, p_business_no text, p_phone text default null,
  p_license_path text default null, p_description text default null, p_marketing_agreed boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_store stores;
  v_business_no text := regexp_replace(coalesce(p_business_no, ''), '[^0-9]', '', 'g');
begin
  if auth.uid() is null then
    return jsonb_build_object('ok', false, 'error', 'UNAUTHENTICATED');
  end if;
  if p_category not in ('meal', 'cafe', 'bakery', 'snack', 'etc')
     or char_length(coalesce(p_name, '')) not between 1 and 30
     or char_length(coalesce(p_address, '')) not between 1 and 100
     or char_length(coalesce(p_representative_name, '')) not between 1 and 20
     or v_business_no !~ '^[0-9]{10}$'
     or (p_license_path is not null and p_license_path not like auth.uid()::text || '/%') then
    return jsonb_build_object('ok', false, 'error', 'INVALID_INPUT');
  end if;
  if not public.is_in_service_area(p_lat, p_lng) then
    return jsonb_build_object('ok', false, 'error', 'OUT_OF_SERVICE_AREA');
  end if;

  select * into v_store from stores where owner_id = auth.uid() for update;
  if found and v_store.status <> 'rejected' then
    return jsonb_build_object('ok', false, 'error', 'ALREADY_REGISTERED');
  end if;
  if exists (select 1 from stores where business_no = v_business_no and id is distinct from v_store.id) then
    return jsonb_build_object('ok', false, 'error', 'DUPLICATE_BUSINESS_NO');
  end if;

  if v_store.id is null then
    insert into stores (owner_id, name, category, description, address, lat, lng,
                        representative_name, business_no, phone, license_path)
    values (auth.uid(), p_name, p_category, p_description, p_address, p_lat, p_lng,
            p_representative_name, v_business_no, nullif(p_phone, ''), p_license_path)
    returning * into v_store;
  else
    update stores set name = p_name, category = p_category, description = p_description,
                      address = p_address, lat = p_lat, lng = p_lng,
                      representative_name = p_representative_name, business_no = v_business_no,
                      phone = nullif(p_phone, ''), license_path = coalesce(p_license_path, license_path),
                      status = 'pending', reject_code = null, reject_reason = null,
                      submitted_at = now(), reviewed_at = null
    where id = v_store.id
    returning * into v_store;
  end if;

  update profiles
  set role = case when role = 'resident' then 'owner' else role end,
      owner_terms_agreed_at = coalesce(owner_terms_agreed_at, now()),
      owner_marketing_agreed_at = case when p_marketing_agreed then now() else null end
  where id = auth.uid();

  return jsonb_build_object('ok', true, 'data', jsonb_build_object('store_id', v_store.id));
end $$;

-- 사장님 본인 가게 (사업자 정보 포함, 사업자번호는 뒤 5자리 가림)
create or replace function public.get_my_store()
returns jsonb language sql stable security definer set search_path = public as $$
  select to_jsonb(x) from (
    select s.id, s.name, s.category, s.description, s.address, s.lat, s.lng, s.status,
           s.reject_code, s.reject_reason, s.submitted_at, s.reviewed_at, s.approved_at,
           s.suspended_at, s.suspend_code, s.suspend_note, s.created_at,
           s.representative_name, s.phone,
           case when s.business_no is null then null
                else substr(s.business_no, 1, 3) || '-' || substr(s.business_no, 4, 2) || '-*****' end as business_no_masked,
           s.pending_address, s.address_requested_at,
           (select count(*) from deals d where d.store_id = s.id and d.close_reason = 'report')::int as confirmed_report_count,
           (ss.code_issued_at is not null) as code_issued,
           ss.code_issued_at
    from stores s left join store_secrets ss on ss.store_id = s.id
    where s.owner_id = auth.uid()
  ) x;
$$;

-- 주소 변경 요청 (O9): 운영자가 확인할 때까지 새 딜 등록만 막고, 진행 중인 딜은 그대로 둔다
create or replace function public.request_store_address_change(p_address text, p_lat double precision, p_lng double precision)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_store_id uuid := public.my_store_id();
begin
  if v_store_id is null then
    return jsonb_build_object('ok', false, 'error', 'STORE_NOT_APPROVED');
  end if;
  if char_length(coalesce(p_address, '')) not between 1 and 100 then
    return jsonb_build_object('ok', false, 'error', 'INVALID_INPUT');
  end if;
  if not public.is_in_service_area(p_lat, p_lng) then
    return jsonb_build_object('ok', false, 'error', 'OUT_OF_SERVICE_AREA');
  end if;
  update stores set pending_address = p_address, pending_lat = p_lat, pending_lng = p_lng,
                    address_requested_at = now()
  where id = v_store_id;
  return jsonb_build_object('ok', true, 'data', jsonb_build_object('store_id', v_store_id));
end $$;

-- ───── 가게 코드 ─────
-- 승인할 때는 더 이상 자리를 만들지 않는다. 사장님(또는 운영자)이 처음 발급할 때 행이 생긴다
create or replace function public.rotate_store_code()
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  v_store_id uuid := public.my_approved_store_id();
  v_code     text;
begin
  if v_store_id is null then
    return jsonb_build_object('ok', false, 'error', 'STORE_NOT_APPROVED');
  end if;
  v_code := public.generate_redeem_code();
  insert into store_secrets (store_id, redeem_code_hash, code_issued_at)
  values (v_store_id, crypt(v_code, gen_salt('bf')), now())
  on conflict (store_id) do update
    set redeem_code_hash = excluded.redeem_code_hash,
        code_version     = store_secrets.code_version + 1,
        code_rotated_at  = now(),
        code_issued_at   = now();
  return jsonb_build_object('ok', true, 'data', jsonb_build_object('code', v_code));
end $$;

-- ───── 운영자: 입점 심사 (A1 · A1-1) ─────
drop function public.approve_store(uuid, boolean, text);

create or replace function public.approve_store(
  p_store_id uuid, p_approve boolean, p_reject_code text default null, p_reject_reason text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_store stores;
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  select * into v_store from stores where id = p_store_id for update;
  if not found or v_store.status <> 'pending' then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;

  if not p_approve then
    if p_reject_code is null or p_reject_code not in ('out_of_area', 'missing_info', 'duplicate', 'license_unreadable', 'etc')
       or char_length(coalesce(p_reject_reason, '')) > 150 then
      return jsonb_build_object('ok', false, 'error', 'INVALID_INPUT');
    end if;
    update stores set status = 'rejected', reject_code = p_reject_code, reject_reason = nullif(p_reject_reason, ''),
                      reviewed_at = now()
    where id = p_store_id;
    perform public.notify_store_owner(p_store_id, 'store_rejected', '가게 등록이 거절됐어요',
                                      '사유를 확인하고 정보를 고쳐 다시 신청해 주세요', null, '/owner');
    return jsonb_build_object('ok', true, 'data', jsonb_build_object('status', 'rejected'));
  end if;

  update stores set status = 'approved', reject_code = null, reject_reason = null,
                    reviewed_at = now(), approved_at = now()
  where id = p_store_id;
  perform public.notify_store_owner(p_store_id, 'store_approved', '입점이 승인됐어요',
                                    '가게 코드를 발급하면 딜을 올릴 수 있어요', null, '/owner/settings');
  return jsonb_build_object('ok', true, 'data', jsonb_build_object('status', 'approved'));
end $$;

-- 주소 변경 승인·거절
create or replace function public.approve_store_address(p_store_id uuid, p_approve boolean)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_store stores;
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  select * into v_store from stores where id = p_store_id for update;
  if not found or v_store.pending_address is null then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;
  if p_approve then
    update stores set address = pending_address, lat = pending_lat, lng = pending_lng,
                      pending_address = null, pending_lat = null, pending_lng = null, address_requested_at = null
    where id = p_store_id;
    perform public.notify_store_owner(p_store_id, 'address_approved', '새 주소가 확인됐어요',
                                      '이제 새 딜을 올릴 수 있어요', null, '/owner');
  else
    update stores set pending_address = null, pending_lat = null, pending_lng = null, address_requested_at = null
    where id = p_store_id;
    perform public.notify_store_owner(p_store_id, 'address_rejected', '주소 변경이 거절됐어요',
                                      '기존 주소로 계속 운영돼요. 운영자에게 문의해 주세요', null, '/owner/me');
  end if;
  return jsonb_build_object('ok', true, 'data', jsonb_build_object('approved', p_approve));
end $$;

-- 입점 심사 목록·상세 (사업자 정보와 사장님 닉네임 포함 → 운영자만)
create or replace function public.admin_list_applications(p_status text default 'pending')
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  return jsonb_build_object('ok', true, 'data', jsonb_build_object(
    'items', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.sort_at desc) from (
        select s.id, s.name, s.category, s.description, s.address, s.lat, s.lng, s.status,
               s.submitted_at, s.reviewed_at, s.reject_code, s.reject_reason,
               s.pending_address, s.address_requested_at,
               (s.pending_address is not null and s.status = 'approved') as is_address_change,
               p.nickname as owner_nickname,
               coalesce(s.address_requested_at, s.reviewed_at, s.submitted_at) as sort_at
        from stores s left join profiles p on p.id = s.owner_id
        where s.created_by_admin = false and (
          (p_status = 'pending' and (s.status = 'pending' or (s.status = 'approved' and s.pending_address is not null)))
          or (p_status = 'approved' and s.status = 'approved' and s.reviewed_at is not null)
          or (p_status = 'rejected' and s.status = 'rejected'))
        limit 100
      ) x), '[]'::jsonb),
    'counts', (
      select jsonb_build_object(
        'pending', count(*) filter (where s.status = 'pending' or (s.status = 'approved' and s.pending_address is not null)),
        'approved', count(*) filter (where s.status = 'approved' and s.reviewed_at is not null),
        'rejected', count(*) filter (where s.status = 'rejected'),
        'reviewed_today', count(*) filter (where (s.reviewed_at at time zone 'Asia/Seoul')::date = (now() at time zone 'Asia/Seoul')::date),
        'avg_review_min', round(avg(extract(epoch from s.reviewed_at - s.submitted_at) / 60)
                                filter (where s.reviewed_at > now() - interval '30 days'))::int)
      from stores s where s.created_by_admin = false)
  ));
end $$;

create or replace function public.admin_get_store(p_store_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v jsonb;
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  select to_jsonb(x) into v from (
    select s.*, p.nickname as owner_nickname,
           (ss.code_issued_at is not null) as code_issued,
           (s.link_code_hash is not null) as link_code_active,
           (select count(*) from deals d where d.store_id = s.id
              and d.starts_at >= date_trunc('month', now() at time zone 'Asia/Seoul') at time zone 'Asia/Seoul')::int as deals_this_month,
           (select count(*) from coupons c join deals d on d.id = c.deal_id where d.store_id = s.id and c.status = 'used'
              and c.used_at >= date_trunc('month', now() at time zone 'Asia/Seoul') at time zone 'Asia/Seoul')::int as coupons_used_this_month,
           (select count(*) from deals d where d.store_id = s.id and d.close_reason = 'report')::int as confirmed_report_count,
           coalesce((select jsonb_agg(jsonb_build_object('deal_id', r.deal_id, 'reason', r.reason, 'status', r.status,
                                                         'created_at', r.created_at) order by r.created_at desc)
                     from (select * from deal_reports r where r.store_id = s.id order by created_at desc limit 10) r),
                    '[]'::jsonb) as recent_reports
    from stores s
    left join profiles p on p.id = s.owner_id
    left join store_secrets ss on ss.store_id = s.id
    where s.id = p_store_id
  ) x;
  if v is null then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;
  return jsonb_build_object('ok', true, 'data', v - 'link_code_hash' - 'business_no'
    || jsonb_build_object('business_no', (select business_no from stores where id = p_store_id)));
end $$;
