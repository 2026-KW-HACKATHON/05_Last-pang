-- 딜 알림을 "시간표의 비는 시간"에 맞춘다
-- 규칙: 딜 시간(지금~끝)과 주민의 오늘 비는 시간이 30분 이상 이어서 겹치면, 딜이 열리자마자 알린다
--       알림 문구에 겹치는 구간(예: 13:00~14:00)을 넣는다
-- 비는 시간 = 방해 금지가 아닌 시간(기본 08:00~22:00) - 그날 요일의 시간표 일정. 일정이 없으면 하루 전체가 비는 시간
-- 그대로 두는 조건: 동의 · 딜 알림 켬 · 걸을 거리 · 좋아하는 업종 · 방해 금지 · 하루 3건 · 같은 가게 하루 1건

-- ───── 1) 비는 시간 계산 ─────
-- 그날(KST) 비는 시간 구간들. 방해 금지 구간이 자정을 넘지 않는 설정(예: 01:00~06:00)은 하루 전체를 창으로 본다
create or replace function public._free_windows(p_user_id uuid, p_day date)
returns setof tstzrange
language sql stable security definer set search_path = public as $$
  with st as (
    select coalesce(ns.quiet_enabled, true) and coalesce(ns.quiet_start, '22:00'::time) > coalesce(ns.quiet_end, '08:00'::time) as split,
           coalesce(ns.quiet_start, '22:00'::time) as q_start,
           coalesce(ns.quiet_end, '08:00'::time) as q_end
    from (select 1) x left join notification_settings ns on ns.user_id = p_user_id
  ),
  win as (
    select tstzrange(
      (p_day + case when split then q_end else '00:00'::time end) at time zone 'Asia/Seoul',
      case when split then (p_day + q_start) at time zone 'Asia/Seoul'
           else (p_day + 1)::timestamp at time zone 'Asia/Seoul' end) as r
    from st
  ),
  busy as (
    select coalesce(range_agg(tstzrange((p_day + s.start_time) at time zone 'Asia/Seoul',
                                        (p_day + s.end_time) at time zone 'Asia/Seoul')),
                    '{}'::tstzmultirange) as m
    from schedules s
    where s.user_id = p_user_id and extract(dow from p_day)::smallint = any (s.days)
  )
  select unnest(tstzmultirange(win.r) - busy.m) from win, busy;
$$;
revoke all on function public._free_windows(uuid, date) from public, anon, authenticated;

-- 딜 시간 [p_from, p_to)와 겹치는 가장 긴 비는 구간. 30분 미만이면 null
create or replace function public._free_overlap(p_user_id uuid, p_from timestamptz, p_to timestamptz)
returns tstzrange
language sql stable security definer set search_path = public as $$
  select o
  from (
    select w * tstzrange(p_from, p_to) as o
    from public._free_windows(p_user_id, (p_from at time zone 'Asia/Seoul')::date) w
  ) x
  where not isempty(o)
    and upper(o) - lower(o) >= make_interval(mins => coalesce((app_policy() ->> 'push_min_free_overlap_min')::int, 30))
  order by upper(o) - lower(o) desc, lower(o)
  limit 1;
$$;
revoke all on function public._free_overlap(uuid, timestamptz, timestamptz) from public, anon, authenticated;

-- 가게·딜 시간에 맞는 주민 (한도·방해 금지·기기는 부르는 쪽에서 본다)
create or replace function public._deal_push_candidates(p_store_id uuid, p_from timestamptz, p_to timestamptz)
returns table (user_id uuid, free_from timestamptz, free_to timestamptz)
language sql stable security definer set search_path = public as $$
  select c.id, lower(c.o), upper(c.o)
  from (
    select p.id, public._free_overlap(p.id, p_from, p_to) as o
    from profiles p
    join resident_preferences rp on rp.user_id = p.id
    join stores st on st.id = p_store_id
    left join notification_settings ns on ns.user_id = p.id
    where p.role = 'resident'
      and p.agreed_terms_at is not null
      and p.agreed_push_at is not null
      and coalesce(ns.deal_alerts, true)
      and rp.base_lat is not null and rp.base_lng is not null
      and public.distance_m(rp.base_lat, rp.base_lng, st.lat, st.lng) <= coalesce(rp.radius_m, 800)
      and (coalesce(cardinality(rp.categories), 0) = 0 or st.category = any (rp.categories))
  ) c
  where c.o is not null;
$$;
revoke all on function public._deal_push_candidates(uuid, timestamptz, timestamptz) from public, anon, authenticated;

-- ───── 2) 대상 고르기 · 알림 넣기 (한 딜) ─────
alter table public.push_queue add column if not exists body text;   -- 사람마다 다른 둘째 줄 (겹치는 시간)

create or replace function public._enqueue_deal_push(p_deal_id uuid)
returns int
language plpgsql security definer set search_path = public as $$
declare
  v_policy    jsonb := app_policy();
  v_day_start timestamptz := date_trunc('day', now() at time zone 'Asia/Seoul') at time zone 'Asia/Seoul';
  v_count     int;
  r           record;
begin
  select d.id as deal_id, d.store_id, d.title, d.deal_price, d.remaining_qty, d.total_qty, d.ends_at,
         s.name as store_name
    into r
  from deals d join stores s on s.id = d.store_id and s.status = 'approved'
  where d.id = p_deal_id and d.status = 'active'
    and d.starts_at <= now() and d.ends_at > now() and d.remaining_qty > 0;
  if not found then return 0; end if;

  with targets as (
    select c.user_id,
           left(format('%s원 · %s~%s 비는 시간에 딱 · 선착순 사용 %s/%s명',
                to_char(r.deal_price, 'FM999,999,999'),
                to_char(c.free_from at time zone 'Asia/Seoul', 'HH24:MI'),
                to_char(c.free_to at time zone 'Asia/Seoul', 'HH24:MI'),
                r.remaining_qty, r.total_qty), 200) as body
    from public._deal_push_candidates(r.store_id, now(), r.ends_at) c
    where not public._is_quiet_now(c.user_id)
      and (select count(*) from notifications n
           where n.user_id = c.user_id and n.audience = 'resident' and n.kind in ('deal', 'deal_start')
             and n.created_at >= v_day_start) < (v_policy ->> 'resident_daily_push')::int
      and not exists (select 1 from notifications n
           where n.user_id = c.user_id and n.audience = 'resident' and n.store_id = r.store_id
             and n.created_at >= v_day_start)
      and not exists (select 1 from push_queue q where q.user_id = c.user_id and q.deal_id = r.deal_id)
  ),
  queued as (
    insert into push_queue (user_id, deal_id, reason, body)
    select user_id, r.deal_id, 'new_deal', body from targets
    on conflict (user_id, deal_id) do nothing
    returning user_id, body
  )
  insert into notifications (user_id, audience, kind, title, body, deal_id, store_id, link)
  select q.user_id, 'resident', 'deal',
         left(format('[할인] %s %s', r.store_name, r.title), 80),
         q.body, r.deal_id, r.store_id, format('/deals/%s?src=push', r.deal_id)
  from queued q;
  get diagnostics v_count = row_count;
  return v_count;
end $$;
revoke all on function public._enqueue_deal_push(uuid) from public, anon, authenticated;

-- ───── 3) 딜 등록: 바로 시작하는 딜은 등록하자마자 알린다 (예약 딜은 시작 시각에 cron이 1분 안에) ─────
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
  v_targets  int;
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

  if v_starts <= now() then
    v_targets := public._enqueue_deal_push(v_deal_id);   -- 실제로 알림함에 넣은 인원
    perform public.invoke_push_sender();                -- pg_net은 커밋 뒤에 보낸다
  else
    v_targets := public._estimate_push_targets(p_store_id, v_starts, p_duration_min);
  end if;

  return jsonb_build_object('ok', true, 'data', jsonb_build_object(
    'deal_id', v_deal_id, 'starts_at', v_starts, 'ends_at', v_ends, 'push_targets', v_targets));
end $$;
revoke all on function public._validate_and_insert_deal(uuid, text, int, int, timestamptz, int, int, int) from public, anon, authenticated;

-- ───── 4) 등록 화면의 예상 인원: 같은 규칙 + 기기 있는 주민 ─────
drop function if exists public.estimate_push_targets(timestamptz);
drop function if exists public._estimate_push_targets(uuid, timestamptz);

create or replace function public._estimate_push_targets(p_store_id uuid, p_starts_at timestamptz, p_duration_min int default 60)
returns int language sql stable security definer set search_path = public as $$
  select count(*)::int
  from public._deal_push_candidates(p_store_id, greatest(p_starts_at, now()),
                                    p_starts_at + make_interval(mins => coalesce(p_duration_min, 60))) c
  where exists (select 1 from push_subscriptions ps where ps.user_id = c.user_id);
$$;
revoke all on function public._estimate_push_targets(uuid, timestamptz, int) from public, anon, authenticated;

create or replace function public.estimate_push_targets(p_starts_at timestamptz, p_duration_min int default 60)
returns int language sql stable security definer set search_path = public as $$
  select coalesce(public._estimate_push_targets(public.my_approved_store_id(), p_starts_at, p_duration_min), 0);
$$;
revoke all on function public.estimate_push_targets(timestamptz, int) from public, anon;
grant execute on function public.estimate_push_targets(timestamptz, int) to authenticated;

-- ───── 5) 운영자 퍼널: "비는 시간 30분 이상 겹침" 단계 추가 (지금부터 1시간짜리 딜 기준) ─────
create or replace function public.admin_push_funnel(p_store_id uuid)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_policy    jsonb := app_policy();
  v_day_start timestamptz := date_trunc('day', now() at time zone 'Asia/Seoul') at time zone 'Asia/Seoul';
  s record;
  v jsonb;
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  select id, category, lat, lng into s from stores where id = p_store_id;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;
  with base as (
    select p.id, p.agreed_terms_at, p.agreed_push_at, rp.base_lat, rp.base_lng, rp.radius_m, rp.categories,
           coalesce(ns.deal_alerts, true) as deal_alerts,
           exists (select 1 from push_subscriptions ps where ps.user_id = p.id) as has_sub,
           public._is_quiet_now(p.id) as quiet,
           public._free_overlap(p.id, now(), now() + interval '60 minutes') is not null as free_ok,
           (select count(*) from notifications n where n.user_id = p.id and n.audience = 'resident'
              and n.kind in ('deal', 'deal_start') and n.created_at >= v_day_start) as today_cnt,
           exists (select 1 from notifications n where n.user_id = p.id and n.audience = 'resident'
              and n.store_id = s.id and n.created_at >= v_day_start) as got_store_today
    from profiles p
    left join resident_preferences rp on rp.user_id = p.id
    left join notification_settings ns on ns.user_id = p.id
    where p.role = 'resident'
  ),
  flags as (
    select *,
      (agreed_terms_at is not null and agreed_push_at is not null) as f_agreed,
      (base_lat is not null and public.distance_m(base_lat, base_lng, s.lat, s.lng) <= coalesce(radius_m, 800)) as f_range,
      (coalesce(cardinality(categories), 0) = 0 or s.category = any (categories)) as f_cat,
      (not quiet and today_cnt < (v_policy ->> 'resident_daily_push')::int and not got_store_today) as f_time
    from base
  ),
  steps as (   -- 앞 조건을 모두 통과한 사람만 다음 단계로 센다 (실제 대상 고르기와 같은 순서)
    select
      count(*) as residents,
      count(*) filter (where f_agreed) as push_agreed,
      count(*) filter (where f_agreed and deal_alerts) as alerts_on,
      count(*) filter (where f_agreed and deal_alerts and f_range) as in_range,
      count(*) filter (where f_agreed and deal_alerts and f_range and f_cat) as category_ok,
      count(*) filter (where f_agreed and deal_alerts and f_range and f_cat and free_ok) as free_ok,
      count(*) filter (where f_agreed and deal_alerts and f_range and f_cat and free_ok and f_time) as inbox_targets,
      count(*) filter (where f_agreed and deal_alerts and f_range and f_cat and free_ok and f_time and has_sub) as push_targets
    from flags
  )
  select to_jsonb(steps) into v from steps;
  return jsonb_build_object('ok', true, 'data', v);
end $$;

-- ───── 6) 화면용: 이번 주 비는 시간 미리 보기 (30분 이상인 구간만) ─────
create or replace function public.get_my_free_times(p_from date default null)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
           'day', d::date,
           'from', to_char(lower(w) at time zone 'Asia/Seoul', 'HH24:MI'),
           'to', to_char(upper(w) at time zone 'Asia/Seoul', 'HH24:MI'))
         order by d, lower(w)), '[]'::jsonb)
  from generate_series(coalesce(p_from, (now() at time zone 'Asia/Seoul')::date),
                       coalesce(p_from, (now() at time zone 'Asia/Seoul')::date) + 6, interval '1 day') d
  cross join lateral public._free_windows(auth.uid(), d::date) w
  where auth.uid() is not null
    and upper(w) - lower(w) >= make_interval(mins => coalesce((app_policy() ->> 'push_min_free_overlap_min')::int, 30));
$$;
revoke all on function public.get_my_free_times(date) from public, anon;
grant execute on function public.get_my_free_times(date) to authenticated;
