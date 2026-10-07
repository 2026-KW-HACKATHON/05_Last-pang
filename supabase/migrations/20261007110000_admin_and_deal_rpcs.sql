-- 피그마 "동네냠냠 UI 최종"(10/7) 반영 ② 딜 등록·종료·신고 RPC, 운영자 가맹점 관리(직접 추가·수정·정지·삭제)
-- 모든 쓰기 RPC는 { ok, data | error } 봉투를 돌려준다 (합의 2-3)

-- ───── 딜 공통: 넣기 전 검사 (서버 함수 안에서만) ─────
create or replace function public._validate_and_insert_deal(
  p_store_id uuid, p_title text, p_original_price int, p_deal_price int,
  p_starts_at timestamptz, p_duration_min int, p_total_qty int, p_coupon_ttl_min int
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_starts   timestamptz := coalesce(p_starts_at, now());
  v_ends     timestamptz;
  v_today    date := (now() at time zone 'Asia/Seoul')::date;
  v_used     int;
  v_overlap  deals;
  v_deal_id  uuid;
begin
  -- 가게 코드가 없으면 손님이 쿠폰을 쓸 수 없으므로 딜도 못 올린다 (O6 "코드 발급 필요")
  if not exists (select 1 from store_secrets where store_id = p_store_id and code_issued_at is not null) then
    return jsonb_build_object('ok', false, 'error', 'CODE_NOT_ISSUED');
  end if;
  if char_length(coalesce(trim(p_title), '')) not between 1 and 40
     or p_original_price is null or p_original_price <= 0
     or p_deal_price is null or p_deal_price <= 0 or p_deal_price >= p_original_price
     or p_total_qty not between 1 and 100
     or p_coupon_ttl_min not in (10, 15, 20, 30)
     or p_duration_min not in (60, 120, 180)
     or v_starts < now() - interval '5 minutes'
     or (v_starts at time zone 'Asia/Seoul')::date <> v_today then     -- 예약은 오늘 안에서만
    return jsonb_build_object('ok', false, 'error', 'INVALID_INPUT');
  end if;
  v_ends := v_starts + make_interval(mins => p_duration_min);

  -- 하루 3개 (KST 오늘 만든 즉시딜 수. 요일 반복딜 자동 생성분은 세지 않는다)
  select count(*) into v_used from deals
  where store_id = p_store_id and type = 'instant'
    and (created_at at time zone 'Asia/Seoul')::date = v_today;
  if v_used >= (public.app_policy()->>'owner_daily_deals')::int then
    return jsonb_build_object('ok', false, 'error', 'DAILY_LIMIT_REACHED');
  end if;

  -- 같은 시간대 진행·예정 딜과 겹치면 거절
  select * into v_overlap from deals
  where store_id = p_store_id and status in ('active', 'paused')
    and tstzrange(starts_at, ends_at) && tstzrange(v_starts, v_ends)
  order by starts_at limit 1;
  if found then
    return jsonb_build_object('ok', false, 'error', 'TIME_OVERLAP',
      'data', jsonb_build_object('starts_at', v_overlap.starts_at, 'ends_at', v_overlap.ends_at, 'title', v_overlap.title));
  end if;

  insert into deals (store_id, type, title, original_price, deal_price, starts_at, ends_at,
                     total_qty, remaining_qty, coupon_ttl_min, created_by)
  values (p_store_id, 'instant', trim(p_title), p_original_price, p_deal_price, v_starts, v_ends,
          p_total_qty, p_total_qty, p_coupon_ttl_min, auth.uid())
  returning id into v_deal_id;

  return jsonb_build_object('ok', true, 'data', jsonb_build_object(
    'deal_id', v_deal_id, 'starts_at', v_starts, 'ends_at', v_ends,
    'push_targets', public._estimate_push_targets(p_store_id, v_starts)));
end $$;
revoke all on function public._validate_and_insert_deal(uuid, text, int, int, timestamptz, int, int, int) from public, anon, authenticated;

-- 알림 대상 수 (가게 id를 받는 내부용). 화면용 estimate_push_targets는 아래에서 이 함수를 감싼다
create or replace function public._estimate_push_targets(p_store_id uuid, p_starts_at timestamptz)
returns int language sql stable security definer set search_path = public as $$
  select count(distinct p.user_id)::int
  from resident_preferences p
  join push_subscriptions ps on ps.user_id = p.user_id
  join stores st on st.id = p_store_id
  where st.category = any (p.categories)
    and extract(dow from p_starts_at at time zone 'Asia/Seoul')::smallint = any (p.active_days)
    and p.base_lat is not null
    and public.distance_m(st.lat, st.lng, p.base_lat, p.base_lng) <= p.radius_m;
$$;
revoke all on function public._estimate_push_targets(uuid, timestamptz) from public, anon, authenticated;

create or replace function public.estimate_push_targets(p_starts_at timestamptz)
returns int language sql stable security definer set search_path = public as $$
  select coalesce(public._estimate_push_targets(public.my_approved_store_id(), p_starts_at), 0);
$$;

-- ───── 사장님: 즉시딜 올리기 (O4 · O4-1) ─────
create or replace function public.create_instant_deal(
  p_title text, p_original_price int, p_deal_price int, p_duration_min int,
  p_total_qty int, p_coupon_ttl_min int, p_starts_at timestamptz default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_store stores;
begin
  if auth.uid() is null then
    return jsonb_build_object('ok', false, 'error', 'UNAUTHENTICATED');
  end if;
  select * into v_store from stores where id = public.my_approved_store_id() for update;   -- 같은 가게 동시 등록 직렬화
  if not found then
    return jsonb_build_object('ok', false, 'error', 'STORE_NOT_APPROVED');
  end if;
  if v_store.pending_address is not null then
    return jsonb_build_object('ok', false, 'error', 'STORE_UNDER_REVIEW');
  end if;
  return public._validate_and_insert_deal(v_store.id, p_title, p_original_price, p_deal_price,
                                          p_starts_at, p_duration_min, p_total_qty, p_coupon_ttl_min);
end $$;

-- 오늘 등록 수 (읽기 RPC → 결과 그대로)
create or replace function public.get_today_deal_quota()
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'used', (select count(*) from deals where store_id = public.my_store_id() and type = 'instant'
               and (created_at at time zone 'Asia/Seoul')::date = (now() at time zone 'Asia/Seoul')::date),
    'limit', (public.app_policy()->>'owner_daily_deals')::int);
$$;

-- 사장님 조기 종료 (O3 딜 종료 확인 팝업)
create or replace function public.close_deal(p_deal_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  update deals set status = 'closed', closed_at = now(), close_reason = 'owner'
  where id = p_deal_id and store_id = public.my_store_id() and status in ('active', 'paused');
  if not found then
    return jsonb_build_object('ok', false, 'error', 'DEAL_NOT_ACTIVE');
  end if;
  return jsonb_build_object('ok', true, 'data', jsonb_build_object('deal_id', p_deal_id));
end $$;

-- ───── 사장님: 딜 기록·결과 (O11 · O12) ─────
create or replace function public.get_owner_deal_history(p_tab text default 'past', p_limit int default 50)
returns jsonb language sql stable security definer set search_path = public as $$
  with st as (select public.my_store_id() as id),
  d as (
    select d.*,
      case when d.status = 'closed' or d.ends_at < now() then 'past'
           when d.starts_at > now() then 'scheduled'
           else 'live' end as tab,
      (select count(*) from coupons c where c.deal_id = d.id)::int as claimed_count,
      (select count(*) from coupons c where c.deal_id = d.id and c.status = 'used')::int as used_count
    from deals d, st where d.store_id = st.id
  )
  select jsonb_build_object(
    'counts', jsonb_build_object(
      'live', (select count(*) from d where tab = 'live'),
      'scheduled', (select count(*) from d where tab = 'scheduled'),
      'past', (select count(*) from d where tab = 'past')),
    'items', coalesce((
      select jsonb_agg(to_jsonb(x) order by
               case when p_tab = 'scheduled' then extract(epoch from x.starts_at) else -extract(epoch from x.starts_at) end)
      from (
        select id, type, rule_id, title, original_price, deal_price, starts_at, ends_at, total_qty, remaining_qty,
               coupon_ttl_min, status, close_reason, closed_at, paused_at, sold_out_at, claimed_count, used_count
        from d where tab = p_tab
        order by case when p_tab = 'scheduled' then starts_at end asc, starts_at desc
        limit least(greatest(p_limit, 1), 200)
      ) x), '[]'::jsonb));
$$;

create or replace function public.get_owner_deal_result(p_deal_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with d as (select * from deals where id = p_deal_id and store_id = public.my_store_id()),
  c as (select c.* from coupons c join d on d.id = c.deal_id),
  first_use as (   -- 이 가게에서 처음 쿠폰을 쓴 날이 이 딜인 손님
    select c.user_id from c
    where c.status = 'used' and not exists (
      select 1 from coupons c2 join deals d2 on d2.id = c2.deal_id
      where d2.store_id = (select store_id from d) and c2.user_id = c.user_id
        and c2.status = 'used' and c2.used_at < c.used_at)
  )
  select case when not exists (select 1 from d) then null else jsonb_build_object(
    'claimed_users', (select count(distinct user_id) from c),
    'used_count', (select count(*) from c where status = 'used'),
    'expired_count', (select count(*) from c where status = 'expired'),
    'new_visitor_count', (select count(*) from first_use),
    'estimated_revenue', (select count(*) from c where status = 'used') * (select deal_price from d),
    'push_sent_count', (select count(*) from push_queue q where q.deal_id = p_deal_id and q.status = 'sent'),
    'sold_out_after_min', (select round(extract(epoch from sold_out_at - starts_at) / 60)::int from d)
  ) end;
$$;

-- 리포트도 정지된 가게가 볼 수 있게 my_store_id로 (나머지는 2-? store_report와 같음)
create or replace function public.get_store_report(p_from date, p_to date)
returns jsonb language sql stable security definer set search_path = public as $$
  with st as (select public.my_store_id() as id),
  used as (
    select c.user_id, c.used_at, d.deal_price
    from coupons c join deals d on d.id = c.deal_id, st
    where d.store_id = st.id and c.status = 'used'
      and (c.used_at at time zone 'Asia/Seoul')::date between p_from and p_to
  ),
  first_visit as (
    select c.user_id, min(c.used_at) as first_at
    from coupons c join deals d on d.id = c.deal_id, st
    where d.store_id = st.id and c.status = 'used'
    group by c.user_id
  )
  select jsonb_build_object(
    'used_count', (select count(*) from used),
    'estimated_revenue', (select coalesce(sum(deal_price), 0) from used),
    'visitor_count', (select count(distinct user_id) from used),
    'new_visitor_count', (
      select count(*) from first_visit f where (f.first_at at time zone 'Asia/Seoul')::date between p_from and p_to
    ),
    'by_hour', (
      select coalesce(jsonb_object_agg(hour_kst, used_count), '{}'::jsonb) from (
        select extract(hour from used_at at time zone 'Asia/Seoul')::int as hour_kst, count(*) as used_count
        from used group by 1
      ) hourly
    )
  );
$$;

-- 가게 코드 발급 여부 (O6 미발급/정상 작동 중). 해시는 절대 돌려주지 않는다
create or replace function public.get_store_code_status()
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'issued', coalesce((select code_issued_at is not null from store_secrets where store_id = public.my_store_id()), false),
    'issued_at', (select code_issued_at from store_secrets where store_id = public.my_store_id()),
    'version', (select code_version from store_secrets where store_id = public.my_store_id()));
$$;

-- ───── 주민: 쿠폰 받기에 하루 사용 3회 한도 추가 (R7-1), 소진되면 사장님 알림 (O10) ─────
create or replace function public.claim_coupon(p_deal_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_deal   deals;
  v_coupon coupons;
  v_used_today int;
begin
  if auth.uid() is null then
    return jsonb_build_object('ok', false, 'error', 'UNAUTHENTICATED');
  end if;

  select * into v_deal from deals where id = p_deal_id for update;
  if not found or v_deal.status <> 'active' or now() not between v_deal.starts_at and v_deal.ends_at then
    return jsonb_build_object('ok', false, 'error', 'DEAL_NOT_ACTIVE');
  end if;
  if v_deal.remaining_qty <= 0 then
    return jsonb_build_object('ok', false, 'error', 'SOLD_OUT');
  end if;
  if exists (select 1 from coupons where deal_id = p_deal_id and user_id = auth.uid() and status in ('issued', 'used')) then
    return jsonb_build_object('ok', false, 'error', 'ALREADY_CLAIMED');
  end if;

  -- 하루 사용 3회 (KST 오늘 사용 완료한 쿠폰 수)
  select count(*) into v_used_today from coupons
  where user_id = auth.uid() and status = 'used'
    and (used_at at time zone 'Asia/Seoul')::date = (now() at time zone 'Asia/Seoul')::date;
  if v_used_today >= (public.app_policy()->>'resident_daily_redeem')::int then
    return jsonb_build_object('ok', false, 'error', 'DAILY_LIMIT_REACHED');
  end if;

  update deals set remaining_qty = remaining_qty - 1,
                   sold_out_at = case when remaining_qty - 1 = 0 then coalesce(sold_out_at, now()) else sold_out_at end
  where id = p_deal_id
  returning * into v_deal;

  insert into coupons (deal_id, user_id, expires_at)
  values (p_deal_id, auth.uid(), now() + make_interval(mins => v_deal.coupon_ttl_min))
  returning * into v_coupon;
  insert into deal_events (deal_id, user_id, type) values (p_deal_id, auth.uid(), 'claim');

  if v_deal.remaining_qty = 0 and not exists (
       select 1 from notifications where deal_id = p_deal_id and kind = 'deal_sold_out') then
    perform public.notify_store_owner(v_deal.store_id, 'deal_sold_out',
      v_deal.title || '이(가) 모두 소진됐어요', v_deal.total_qty || '개를 모두 나눠 드렸어요',
      p_deal_id, '/owner/deals/' || p_deal_id);
  end if;

  return jsonb_build_object('ok', true, 'data', jsonb_build_object('coupon_id', v_coupon.id, 'expires_at', v_coupon.expires_at));
end $$;

-- 주민 오늘 사용 수 (R7-1 버튼 상태용, 읽기 RPC)
create or replace function public.get_my_daily_usage()
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'used_today', (select count(*) from coupons where user_id = auth.uid() and status = 'used'
                     and (used_at at time zone 'Asia/Seoul')::date = (now() at time zone 'Asia/Seoul')::date),
    'limit', (public.app_policy()->>'resident_daily_redeem')::int);
$$;

-- ───── 주민: 가게 코드 입력 — 잠금 해제 시각과 코드 미발급 구분 추가 (R8-1) ─────
create or replace function public._redeem_lock_until(p_user_id uuid)
returns timestamptz language sql stable security definer set search_path = public as $$
  -- 10분 안에 5번 틀리면 잠금. 5번째로 최근 실패가 10분을 넘기는 순간 풀린다
  select created_at + interval '10 minutes' from redemption_attempts
  where user_id = p_user_id and success = false and created_at > now() - interval '10 minutes'
  order by created_at desc offset 4 limit 1;
$$;
revoke all on function public._redeem_lock_until(uuid) from public, anon, authenticated;

create or replace function public.get_redeem_lock()
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'locked_until', public._redeem_lock_until(auth.uid()),
    'remaining_attempts', greatest(0, 5 - (select count(*) from redemption_attempts
      where user_id = auth.uid() and success = false and created_at > now() - interval '10 minutes'))::int);
$$;

create or replace function public.redeem_coupon(p_coupon_id uuid, p_code text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  v_coupon   coupons;
  v_store_id uuid;
  v_hash     text;
  v_fails    int;
  v_lock     timestamptz;
begin
  if auth.uid() is null then
    return jsonb_build_object('ok', false, 'error', 'UNAUTHENTICATED');
  end if;
  if p_code is null or p_coupon_id is null or p_code !~ '^[0-9]{6}$' then
    return jsonb_build_object('ok', false, 'error', 'INVALID_INPUT');
  end if;

  select * into v_coupon from coupons where id = p_coupon_id and user_id = auth.uid() for update;
  if not found or v_coupon.status <> 'issued' or v_coupon.expires_at < now() then
    return jsonb_build_object('ok', false, 'error', 'COUPON_NOT_USABLE');
  end if;

  select d.store_id into v_store_id from deals d where d.id = v_coupon.deal_id;
  select redeem_code_hash into v_hash from store_secrets where store_id = v_store_id;

  v_lock := public._redeem_lock_until(auth.uid());
  if v_lock is not null then
    return jsonb_build_object('ok', false, 'error', 'TOO_MANY_ATTEMPTS', 'data', jsonb_build_object('locked_until', v_lock));
  end if;
  -- 사장님이 아직 코드를 발급하지 않았으면 주민 탓이 아니므로 실패로 세지 않는다
  if v_hash is null then
    return jsonb_build_object('ok', false, 'error', 'CODE_NOT_ISSUED');
  end if;

  select count(*) into v_fails from redemption_attempts
  where user_id = auth.uid() and success = false and created_at > now() - interval '10 minutes';

  if crypt(p_code, v_hash) is distinct from v_hash then
    insert into redemption_attempts (user_id, store_id, coupon_id, success)
    values (auth.uid(), v_store_id, p_coupon_id, false);
    return jsonb_build_object('ok', false, 'error', 'WRONG_CODE', 'remaining_attempts', 5 - (v_fails + 1),
      'data', jsonb_build_object('locked_until', public._redeem_lock_until(auth.uid())));
  end if;

  update coupons set status = 'used', used_at = now() where id = p_coupon_id returning * into v_coupon;
  insert into redemption_attempts (user_id, store_id, coupon_id, success) values (auth.uid(), v_store_id, p_coupon_id, true);
  insert into deal_events (deal_id, user_id, type) values (v_coupon.deal_id, auth.uid(), 'redeem');

  return jsonb_build_object('ok', true, 'data', jsonb_build_object(
    'used_at', v_coupon.used_at, 'confirm_number', upper(right(v_coupon.id::text, 4))));
end $$;

-- ───── 주민: 딜 신고 (R7-1). 같은 딜에 3건이 모이면 자동으로 멈춘다 ─────
create or replace function public.report_deal(p_deal_id uuid, p_reason text, p_detail text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_deal  deals;
  v_count int;
begin
  if auth.uid() is null then
    return jsonb_build_object('ok', false, 'error', 'UNAUTHENTICATED');
  end if;
  if p_reason not in ('benefit_mismatch', 'store_closed', 'coupon_refused', 'inappropriate', 'etc')
     or char_length(coalesce(p_detail, '')) > 150 then
    return jsonb_build_object('ok', false, 'error', 'INVALID_INPUT');
  end if;
  select * into v_deal from deals where id = p_deal_id for update;
  if not found or v_deal.status = 'closed' then
    return jsonb_build_object('ok', false, 'error', 'DEAL_NOT_ACTIVE');
  end if;
  if exists (select 1 from deal_reports where deal_id = p_deal_id and reporter_id = auth.uid()) then
    return jsonb_build_object('ok', false, 'error', 'ALREADY_REPORTED');
  end if;

  insert into deal_reports (deal_id, store_id, reporter_id, reason, detail)
  values (p_deal_id, v_deal.store_id, auth.uid(), p_reason, nullif(trim(p_detail), ''));

  select count(*) into v_count from deal_reports where deal_id = p_deal_id and status = 'pending';
  if v_deal.status = 'active' and v_count >= (public.app_policy()->>'report_auto_pause')::int then
    update deals set status = 'paused', paused_at = now() where id = p_deal_id;
    perform public.notify_store_owner(v_deal.store_id, 'deal_paused',
      '주민 신고로 ''' || v_deal.title || ''' 딜이 잠시 멈췄어요', '운영자가 확인 중이에요',
      p_deal_id, '/owner/deals/' || p_deal_id);
  end if;
  return jsonb_build_object('ok', true, 'data', jsonb_build_object('report_count', v_count));
end $$;

-- ───── 운영자: 신고·이슈 (A3) ─────
create or replace function public.admin_list_report_groups(p_status text default 'pending')
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  return jsonb_build_object('ok', true, 'data', jsonb_build_object(
    'counts', jsonb_build_object(
      'pending', (select count(distinct deal_id) from deal_reports where status = 'pending'),
      'resolved', (select count(distinct deal_id) from deal_reports where status <> 'pending')),
    'items', coalesce((
      select jsonb_agg(to_jsonb(g) order by g.is_paused desc, g.latest_at desc) from (
        select r.deal_id, d.title as deal_title, s.id as store_id, s.name as store_name,
               count(*)::int as report_count, max(r.created_at) as latest_at,
               (d.status = 'paused') as is_paused,
               jsonb_object_agg_strict_reasons.reasons as reason_counts,
               max(r.status) filter (where r.status <> 'pending') as result
        from deal_reports r
        join deals d on d.id = r.deal_id
        join stores s on s.id = r.store_id
        cross join lateral (
          select jsonb_object_agg(reason, n) as reasons from (
            select r2.reason, count(*) as n from deal_reports r2
            where r2.deal_id = r.deal_id and ((p_status = 'pending') = (r2.status = 'pending'))
            group by r2.reason) z
        ) jsonb_object_agg_strict_reasons
        where (p_status = 'pending') = (r.status = 'pending')
        group by r.deal_id, d.title, s.id, s.name, d.status, jsonb_object_agg_strict_reasons.reasons
        limit 100
      ) g), '[]'::jsonb)));
end $$;

create or replace function public.admin_get_report_detail(p_deal_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v jsonb;
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  select jsonb_build_object(
    'deal', jsonb_build_object('id', d.id, 'title', d.title, 'status', d.status, 'starts_at', d.starts_at,
                               'ends_at', d.ends_at, 'total_qty', d.total_qty, 'paused_at', d.paused_at,
                               'close_reason', d.close_reason,
                               'used_count', (select count(*) from coupons c where c.deal_id = d.id and c.status = 'used')),
    'store', jsonb_build_object('id', s.id, 'name', s.name, 'status', s.status,
                                'confirmed_report_count', (select count(*) from deals d2 where d2.store_id = s.id and d2.close_reason = 'report')),
    'reports', coalesce((select jsonb_agg(jsonb_build_object('id', r.id, 'reason', r.reason, 'detail', r.detail,
                                                             'status', r.status, 'created_at', r.created_at)
                                          order by r.created_at desc)
                         from deal_reports r where r.deal_id = d.id), '[]'::jsonb))
  into v
  from deals d join stores s on s.id = d.store_id where d.id = p_deal_id;
  if v is null then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;
  return jsonb_build_object('ok', true, 'data', v);
end $$;

-- 가게 이용 정지 공통 처리 (진행 딜 종료, 반복딜 끄기, 사장님 알림)
create or replace function public._suspend_store(p_store_id uuid, p_code text, p_note text)
returns void language plpgsql security definer set search_path = public as $$
begin
  update stores set status = 'suspended', suspended_at = now(), suspend_code = p_code, suspend_note = p_note
  where id = p_store_id;
  update deals set status = 'closed', closed_at = now(), close_reason = 'store_suspended'
  where store_id = p_store_id and status in ('active', 'paused');
  update deal_rules set is_active = false where store_id = p_store_id;
  perform public.notify_store_owner(p_store_id, 'store_suspended', '가게 이용이 정지됐어요',
    coalesce(p_note, '자세한 내용은 운영자에게 문의해 주세요'), null, '/owner');
end $$;
revoke all on function public._suspend_store(uuid, text, text) from public, anon, authenticated;

create or replace function public.admin_resolve_reports(p_deal_id uuid, p_confirm boolean)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_deal      deals;
  v_confirmed int;
  v_suspended boolean := false;
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  select * into v_deal from deals where id = p_deal_id for update;
  if not found or not exists (select 1 from deal_reports where deal_id = p_deal_id and status = 'pending') then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;

  update deal_reports set status = case when p_confirm then 'confirmed' else 'dismissed' end,
                          resolved_by = auth.uid(), resolved_at = now()
  where deal_id = p_deal_id and status = 'pending';

  if p_confirm then
    update deals set status = 'closed', closed_at = coalesce(closed_at, now()), close_reason = 'report' where id = p_deal_id;
    perform public.notify_store_owner(v_deal.store_id, 'deal_closed_by_report',
      '신고가 확인돼 ''' || v_deal.title || ''' 딜을 종료했어요', '같은 일이 3번 확인되면 가게 이용이 정지돼요',
      p_deal_id, '/owner/deals/' || p_deal_id);
    select count(*) into v_confirmed from deals where store_id = v_deal.store_id and close_reason = 'report';
    if v_confirmed >= (public.app_policy()->>'confirmed_reports_suspend')::int
       and (select status from stores where id = v_deal.store_id) = 'approved' then
      perform public._suspend_store(v_deal.store_id, 'fake_deal_repeat', '허위 딜 반복 (신고 확정 ' || v_confirmed || '회)');
      v_suspended := true;
    end if;
  else
    if v_deal.status = 'paused' then
      if v_deal.ends_at > now() then
        update deals set status = 'active', paused_at = null where id = p_deal_id;
      else
        update deals set status = 'closed', closed_at = ends_at, close_reason = 'time_ended' where id = p_deal_id;
      end if;
    end if;
    perform public.notify_store_owner(v_deal.store_id, 'deal_resumed',
      '신고를 확인했어요. 딜을 다시 열었어요', '문제없음으로 처리됐어요', p_deal_id, '/owner/deals/' || p_deal_id);
    select count(*) into v_confirmed from deals where store_id = v_deal.store_id and close_reason = 'report';
  end if;

  return jsonb_build_object('ok', true, 'data', jsonb_build_object(
    'confirmed_count', v_confirmed, 'store_suspended', v_suspended));
end $$;

-- ───── 운영자: 가맹점 목록·정지 (A2) ─────
create or replace function public.admin_list_stores(p_filter text default 'all', p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_month_start timestamptz := date_trunc('month', now() at time zone 'Asia/Seoul') at time zone 'Asia/Seoul';
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  return jsonb_build_object('ok', true, 'data', jsonb_build_object(
    'counts', (select jsonb_build_object(
                 'all', count(*), 'active', count(*) filter (where status = 'approved'),
                 'suspended', count(*) filter (where status = 'suspended'))
               from stores where status in ('approved', 'suspended')),
    'items', coalesce((
      select jsonb_agg(to_jsonb(x) order by x.status desc, x.name) from (
        select s.id, s.name, s.category, s.description, s.address, s.lat, s.lng, s.status, s.approved_at,
               s.suspended_at, s.created_by_admin, (s.owner_id is not null) as has_owner,
               (select count(*) from deals d where d.store_id = s.id and d.starts_at >= v_month_start)::int as deals_this_month,
               (select count(*) from coupons c join deals d on d.id = c.deal_id
                where d.store_id = s.id and c.status = 'used' and c.used_at >= v_month_start)::int as coupons_used_this_month,
               (select count(*) from deals d where d.store_id = s.id and d.close_reason = 'report')::int as confirmed_report_count
        from stores s
        where s.status in ('approved', 'suspended')
          and (p_filter = 'all' or (p_filter = 'active' and s.status = 'approved') or (p_filter = 'suspended' and s.status = 'suspended'))
          and (p_query is null or s.name ilike '%' || replace(replace(p_query, '%', ''), '_', '') || '%')
        limit 200
      ) x), '[]'::jsonb)));
end $$;

create or replace function public.admin_suspend_store(p_store_id uuid, p_code text, p_note text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  if p_code not in ('fake_deal_repeat', 'closed', 'owner_request', 'etc') or char_length(coalesce(p_note, '')) > 150 then
    return jsonb_build_object('ok', false, 'error', 'INVALID_INPUT');
  end if;
  if not exists (select 1 from stores where id = p_store_id and status = 'approved') then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;
  perform public._suspend_store(p_store_id, p_code, nullif(trim(p_note), ''));
  return jsonb_build_object('ok', true, 'data', jsonb_build_object('status', 'suspended'));
end $$;

create or replace function public.admin_unsuspend_store(p_store_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  update stores set status = 'approved', suspended_at = null, suspend_code = null, suspend_note = null
  where id = p_store_id and status = 'suspended';
  if not found then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;
  perform public.notify_store_owner(p_store_id, 'store_unsuspended', '가게 이용 정지가 풀렸어요',
    '다시 딜을 올릴 수 있어요. 반복딜은 직접 다시 켜 주세요', null, '/owner');
  return jsonb_build_object('ok', true, 'data', jsonb_build_object('status', 'approved'));
end $$;

-- ───── 운영자: 가게 직접 추가·수정·삭제 (시연용, 사장님 동의를 미리 받은 가게) ─────
-- 사장님 계정 없이 승인 상태로 바로 만든다. 운영 범위(반경 1.5km) 밖이어도 만들 수 있지만 out_of_area로 알려 준다
create or replace function public.admin_create_store(
  p_name text, p_category text, p_address text, p_lat double precision, p_lng double precision,
  p_description text default null, p_representative_name text default null,
  p_business_no text default null, p_phone text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_store_id uuid;
  v_business_no text := nullif(regexp_replace(coalesce(p_business_no, ''), '[^0-9]', '', 'g'), '');
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  if p_category not in ('meal', 'cafe', 'bakery', 'snack', 'etc')
     or char_length(coalesce(trim(p_name), '')) not between 1 and 30
     or char_length(coalesce(trim(p_address), '')) not between 1 and 100
     or p_lat not between 33 and 39 or p_lng not between 124 and 132
     or char_length(coalesce(p_description, '')) > 40
     or (v_business_no is not null and v_business_no !~ '^[0-9]{10}$') then
    return jsonb_build_object('ok', false, 'error', 'INVALID_INPUT');
  end if;
  if v_business_no is not null and exists (select 1 from stores where business_no = v_business_no) then
    return jsonb_build_object('ok', false, 'error', 'DUPLICATE_BUSINESS_NO');
  end if;

  insert into stores (owner_id, name, category, description, address, lat, lng, status,
                      representative_name, business_no, phone, created_by_admin, approved_at, reviewed_at)
  values (null, trim(p_name), p_category, nullif(trim(p_description), ''), trim(p_address), p_lat, p_lng, 'approved',
          nullif(trim(p_representative_name), ''), v_business_no, nullif(trim(p_phone), ''), true, now(), now())
  returning id into v_store_id;

  return jsonb_build_object('ok', true, 'data', jsonb_build_object(
    'store_id', v_store_id, 'out_of_area', not public.is_in_service_area(p_lat, p_lng)));
end $$;

create or replace function public.admin_update_store(
  p_store_id uuid, p_name text, p_category text, p_address text, p_lat double precision, p_lng double precision,
  p_description text default null, p_representative_name text default null,
  p_business_no text default null, p_phone text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_business_no text := nullif(regexp_replace(coalesce(p_business_no, ''), '[^0-9]', '', 'g'), '');
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  if p_category not in ('meal', 'cafe', 'bakery', 'snack', 'etc')
     or char_length(coalesce(trim(p_name), '')) not between 1 and 30
     or char_length(coalesce(trim(p_address), '')) not between 1 and 100
     or p_lat not between 33 and 39 or p_lng not between 124 and 132
     or char_length(coalesce(p_description, '')) > 40
     or (v_business_no is not null and v_business_no !~ '^[0-9]{10}$') then
    return jsonb_build_object('ok', false, 'error', 'INVALID_INPUT');
  end if;
  if v_business_no is not null and exists (select 1 from stores where business_no = v_business_no and id <> p_store_id) then
    return jsonb_build_object('ok', false, 'error', 'DUPLICATE_BUSINESS_NO');
  end if;
  update stores set name = trim(p_name), category = p_category, description = nullif(trim(p_description), ''),
                    address = trim(p_address), lat = p_lat, lng = p_lng,
                    representative_name = nullif(trim(p_representative_name), ''),
                    business_no = v_business_no, phone = nullif(trim(p_phone), '')
  where id = p_store_id;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;
  return jsonb_build_object('ok', true, 'data', jsonb_build_object(
    'store_id', p_store_id, 'out_of_area', not public.is_in_service_area(p_lat, p_lng)));
end $$;

-- 완전 삭제: 딜·쿠폰·신고 기록이 함께 지워진다(cascade). 화면에서 두 번 확인한 뒤 부른다
create or replace function public.admin_delete_store(p_store_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_owner uuid;
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  delete from stores where id = p_store_id returning owner_id into v_owner;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;
  -- 가게가 없어진 사장님은 주민으로 되돌린다 (다시 신청할 수 있게)
  update profiles set role = 'resident' where id = v_owner and role = 'owner';
  return jsonb_build_object('ok', true, 'data', jsonb_build_object('store_id', p_store_id));
end $$;

-- 운영자가 대신 가게 코드를 발급 (사장님 계정이 없는 가게의 카운터용). 새 코드는 이번 응답에서만 보인다
create or replace function public.admin_rotate_store_code(p_store_id uuid)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare v_code text;
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  if not exists (select 1 from stores where id = p_store_id and status = 'approved') then
    return jsonb_build_object('ok', false, 'error', 'STORE_NOT_APPROVED');
  end if;
  v_code := public.generate_redeem_code();
  insert into store_secrets (store_id, redeem_code_hash, code_issued_at)
  values (p_store_id, crypt(v_code, gen_salt('bf')), now())
  on conflict (store_id) do update
    set redeem_code_hash = excluded.redeem_code_hash, code_version = store_secrets.code_version + 1,
        code_rotated_at = now(), code_issued_at = now();
  return jsonb_build_object('ok', true, 'data', jsonb_build_object('code', v_code));
end $$;

-- 운영자가 대신 즉시딜을 올리고 끝낸다 (사장님 계정 없는 가게 시연용). 하루 3개·시간 겹침 규칙은 같다
create or replace function public.admin_create_deal(
  p_store_id uuid, p_title text, p_original_price int, p_deal_price int, p_duration_min int,
  p_total_qty int, p_coupon_ttl_min int, p_starts_at timestamptz default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  perform 1 from stores where id = p_store_id and status = 'approved' for update;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'STORE_NOT_APPROVED');
  end if;
  return public._validate_and_insert_deal(p_store_id, p_title, p_original_price, p_deal_price,
                                          p_starts_at, p_duration_min, p_total_qty, p_coupon_ttl_min);
end $$;

create or replace function public.admin_close_deal(p_deal_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  update deals set status = 'closed', closed_at = now(), close_reason = 'admin'
  where id = p_deal_id and status in ('active', 'paused');
  if not found then
    return jsonb_build_object('ok', false, 'error', 'DEAL_NOT_ACTIVE');
  end if;
  return jsonb_build_object('ok', true, 'data', jsonb_build_object('deal_id', p_deal_id));
end $$;

-- 운영자 가게 → 사장님 계정 연결 코드 (8자리, 일회용). 사장님이 로그인 후 /owner/signup에서 입력한다
create or replace function public.admin_issue_link_code(p_store_id uuid)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare v_code text;
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  -- 헷갈리는 글자(0 O 1 I)를 뺀 32글자에서 8자리
  select string_agg(substr('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', (get_byte(b, i) % 32) + 1, 1), '')
  into v_code
  from (select gen_random_bytes(8) as b) r, generate_series(0, 7) as i;
  update stores set link_code_hash = encode(digest(v_code, 'sha256'), 'hex')
  where id = p_store_id and owner_id is null;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'ALREADY_REGISTERED');   -- 이미 사장님이 있는 가게
  end if;
  return jsonb_build_object('ok', true, 'data', jsonb_build_object('code', v_code));
end $$;

create or replace function public.link_store_by_code(p_code text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare v_store_id uuid;
begin
  if auth.uid() is null then
    return jsonb_build_object('ok', false, 'error', 'UNAUTHENTICATED');
  end if;
  if exists (select 1 from stores where owner_id = auth.uid()) then
    return jsonb_build_object('ok', false, 'error', 'ALREADY_REGISTERED');
  end if;
  p_code := upper(trim(coalesce(p_code, '')));
  if p_code !~ '^[2-9A-HJ-NP-Z]{8}$' then
    return jsonb_build_object('ok', false, 'error', 'INVALID_INPUT');
  end if;
  update stores set owner_id = auth.uid(), link_code_hash = null
  where link_code_hash = encode(digest(p_code, 'sha256'), 'hex') and owner_id is null
  returning id into v_store_id;
  if v_store_id is null then
    return jsonb_build_object('ok', false, 'error', 'WRONG_CODE');
  end if;
  update profiles set role = 'owner', owner_terms_agreed_at = coalesce(owner_terms_agreed_at, now())
  where id = auth.uid() and role = 'resident';
  return jsonb_build_object('ok', true, 'data', jsonb_build_object('store_id', v_store_id));
end $$;

-- ───── 회원 탈퇴 (R14 · O9). 가게가 있으면 정지하고 기록은 남긴다(owner_id → null) ─────
create or replace function public.delete_my_account()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_store_id uuid;
begin
  if auth.uid() is null then
    return jsonb_build_object('ok', false, 'error', 'UNAUTHENTICATED');
  end if;
  if public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');   -- 운영자 계정은 앱에서 지우지 않는다
  end if;
  select id into v_store_id from stores where owner_id = auth.uid();
  if v_store_id is not null then
    perform public._suspend_store(v_store_id, 'owner_request', '사장님 탈퇴');
  end if;
  delete from auth.users where id = auth.uid();   -- profiles 이하 본인 데이터는 cascade
  return jsonb_build_object('ok', true, 'data', jsonb_build_object('deleted', true));
end $$;

-- ───── cron: 시간 지난 딜 닫기 (종료 사유 time_ended) ─────
create or replace function public.close_ended_deals()
returns void language sql security definer set search_path = public as $$
  update deals set status = 'closed', closed_at = ends_at, close_reason = 'time_ended'
  where status in ('active', 'paused') and ends_at < now();
$$;
revoke all on function public.close_ended_deals() from public, anon, authenticated;
select cron.schedule('close-ended-deals', '* * * * *', 'select public.close_ended_deals()');

-- ───── 사업자등록증 사진 버킷 (O1-2 업로드 → A1-1 운영자 확인). 로컬 테스트 DB에 storage가 없으면 건너뛴다 ─────
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'storage' and table_name = 'buckets') then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values ('business-licenses', 'business-licenses', false, 10485760, array['image/jpeg', 'image/png'])
    on conflict (id) do nothing;

    -- 경로 첫 폴더 = 올린 사람 id. 본인은 자기 폴더에 올리고 읽기만, 운영자는 전부 읽기
    execute $p$create policy "사업자등록증 본인 업로드" on storage.objects for insert to authenticated
      with check (bucket_id = 'business-licenses' and (storage.foldername(name))[1] = auth.uid()::text)$p$;
    execute $p$create policy "사업자등록증 본인·운영자 조회" on storage.objects for select to authenticated
      using (bucket_id = 'business-licenses' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()))$p$;
    execute $p$create policy "사업자등록증 본인 삭제" on storage.objects for delete to authenticated
      using (bucket_id = 'business-licenses' and (storage.foldername(name))[1] = auth.uid()::text)$p$;
  end if;
end $$;

-- ───── 권한: 새 RPC는 로그인한 사용자만 (내부 함수 _* 는 위에서 막음) ─────
do $$
declare f text;
begin
  foreach f in array array[
    'public.register_store(text, text, text, double precision, double precision, text, text, text, text, text, boolean)',
    'public.get_my_store()', 'public.request_store_address_change(text, double precision, double precision)',
    'public.rotate_store_code()', 'public.approve_store(uuid, boolean, text, text)',
    'public.approve_store_address(uuid, boolean)', 'public.admin_list_applications(text)', 'public.admin_get_store(uuid)',
    'public.mark_notifications_read(bigint[])', 'public.estimate_push_targets(timestamptz)',
    'public.create_instant_deal(text, int, int, int, int, int, timestamptz)', 'public.get_today_deal_quota()',
    'public.close_deal(uuid)', 'public.get_owner_deal_history(text, int)', 'public.get_owner_deal_result(uuid)',
    'public.get_store_report(date, date)', 'public.get_store_code_status()', 'public.claim_coupon(uuid)',
    'public.get_my_daily_usage()', 'public.get_redeem_lock()', 'public.redeem_coupon(uuid, text)',
    'public.report_deal(uuid, text, text)', 'public.admin_list_report_groups(text)', 'public.admin_get_report_detail(uuid)',
    'public.admin_resolve_reports(uuid, boolean)', 'public.admin_list_stores(text, text)',
    'public.admin_suspend_store(uuid, text, text)', 'public.admin_unsuspend_store(uuid)',
    'public.admin_create_store(text, text, text, double precision, double precision, text, text, text, text)',
    'public.admin_update_store(uuid, text, text, text, double precision, double precision, text, text, text, text)',
    'public.admin_delete_store(uuid)', 'public.admin_rotate_store_code(uuid)',
    'public.admin_create_deal(uuid, text, int, int, int, int, int, timestamptz)', 'public.admin_close_deal(uuid)',
    'public.admin_issue_link_code(uuid)', 'public.link_store_by_code(text)', 'public.delete_my_account()',
    'public.my_store_id()'
  ] loop
    execute format('revoke all on function %s from public, anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;
