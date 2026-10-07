-- 주민 화면 완성 + 웹 푸시 파이프라인 (피그마 "동네냠냠 UI 최종" R6·R17·C10)
-- 1) recommend_deals: 홈 보기 설정의 거리(p_radius_m)와 시작 시각·쿠폰 유효시간을 함께 돌려준다
-- 2) enqueue_deal_pushes: 딜이 열리면 조건에 맞는 주민에게 알림함 행 + 푸시 대기열을 만든다
-- 3) invoke_push_sender: 대기열을 send-push Edge Function이 보내도록 1분마다 깨운다 (Vault 값이 있을 때만)

-- ───── 1) 홈 추천 딜 ─────
drop function if exists public.recommend_deals(double precision, double precision);

create or replace function public.recommend_deals(
  p_lat double precision,
  p_lng double precision,
  p_radius_m int default null
)
returns table (
  deal_id uuid, store_id uuid, store_name text, category text, title text,
  original_price int, deal_price int, remaining_qty int, total_qty int,
  starts_at timestamptz, ends_at timestamptz, coupon_ttl_min int, distance_m int
)
language sql stable security invoker set search_path = public as $$   -- invoker: RLS가 그대로 적용됨
  with me as (
    select coalesce(
      p_radius_m,
      (select radius_m from resident_preferences where user_id = auth.uid()),
      800
    ) as radius_m
  ),
  candidates as (
    select d.*, s.name as store_name, s.category,
      public.distance_m(p_lat, p_lng, s.lat, s.lng)::int as distance_m
    from deals d
    join stores s on s.id = d.store_id and s.status = 'approved'
    where d.status = 'active' and now() between d.starts_at and d.ends_at
  )
  select c.id, c.store_id, c.store_name, c.category, c.title,
         c.original_price, c.deal_price, c.remaining_qty, c.total_qty,
         c.starts_at, c.ends_at, c.coupon_ttl_min, c.distance_m
  from candidates c, me
  where c.distance_m <= least(me.radius_m, 3000)
  order by c.remaining_qty = 0, c.distance_m   -- 소진된 딜은 맨 뒤로
  limit 50;
$$;
revoke all on function public.recommend_deals(double precision, double precision, int) from public, anon;
grant execute on function public.recommend_deals(double precision, double precision, int) to authenticated;

-- ───── 2) 푸시 대상 고르기 ─────
-- 지금 방해 금지 시간인지 (설정이 없으면 운영 정책 22:00~08:00, 자정을 넘는 구간도 처리)
create or replace function public._is_quiet_now(p_user_id uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  with s as (
    select
      coalesce(ns.quiet_enabled, true) as enabled,
      coalesce(ns.quiet_start, (app_policy() ->> 'quiet_start')::time) as q_start,
      coalesce(ns.quiet_end, (app_policy() ->> 'quiet_end')::time) as q_end,
      (now() at time zone 'Asia/Seoul')::time as t
    from (select 1) x
    left join notification_settings ns on ns.user_id = p_user_id
  )
  select enabled and case
    when q_start = q_end then false
    when q_start < q_end then t >= q_start and t < q_end
    else t >= q_start or t < q_end
  end
  from s;
$$;
revoke all on function public._is_quiet_now(uuid) from public, anon, authenticated;

-- 딜이 열린 뒤 15분 안에 1번만 대상자를 고른다 (cron 1분마다). 반환값: 새로 만든 알림 수
-- 조건 (C10): 푸시 동의 · 딜 알림 켬 · 기준 위치에서 걸을 거리 안 · 좋아하는 업종 · 방해 금지 시간 아님
--            · 하루 3건 · 같은 가게 하루 1건 · 남은 수량 있음
create or replace function public.enqueue_deal_pushes()
returns int
language plpgsql security definer set search_path = public as $$
declare
  v_policy      jsonb := app_policy();
  v_day_start   timestamptz := date_trunc('day', now() at time zone 'Asia/Seoul') at time zone 'Asia/Seoul';
  v_total       int := 0;
  v_count       int;
  r             record;
begin
  for r in
    select d.id as deal_id, d.store_id, d.title, d.deal_price, d.original_price,
           d.remaining_qty, d.total_qty, d.ends_at, s.name as store_name, s.category, s.lat, s.lng
    from deals d
    join stores s on s.id = d.store_id and s.status = 'approved'
    where d.status = 'active'
      and d.starts_at <= now() and d.starts_at > now() - interval '15 minutes'
      and d.ends_at > now() and d.remaining_qty > 0
  loop
    with targets as (
      select p.id as user_id
      from profiles p
      join resident_preferences rp on rp.user_id = p.id
      left join notification_settings ns on ns.user_id = p.id
      where p.role = 'resident'
        and p.agreed_terms_at is not null
        and p.agreed_push_at is not null
        and coalesce(ns.deal_alerts, true)
        and rp.base_lat is not null and rp.base_lng is not null
        and public.distance_m(rp.base_lat, rp.base_lng, r.lat, r.lng) <= coalesce(rp.radius_m, 800)
        and (coalesce(cardinality(rp.categories), 0) = 0 or r.category = any (rp.categories))
        and not public._is_quiet_now(p.id)
        and (select count(*) from notifications n
             where n.user_id = p.id and n.audience = 'resident' and n.kind in ('deal', 'deal_start')
               and n.created_at >= v_day_start) < (v_policy ->> 'resident_daily_push')::int
        and not exists (select 1 from notifications n
             where n.user_id = p.id and n.audience = 'resident' and n.store_id = r.store_id
               and n.created_at >= v_day_start)
        and not exists (select 1 from push_queue q where q.user_id = p.id and q.deal_id = r.deal_id)
    ),
    queued as (
      insert into push_queue (user_id, deal_id, reason)
      select user_id, r.deal_id, 'new_deal' from targets
      on conflict (user_id, deal_id) do nothing
      returning user_id
    )
    insert into notifications (user_id, audience, kind, title, body, deal_id, store_id, link)
    select q.user_id, 'resident', 'deal',
           left(format('[할인] %s %s', r.store_name, r.title), 80),
           left(format('%s원 · 선착순 사용 %s/%s명 · %s까지',
                to_char(r.deal_price, 'FM999,999,999'), r.remaining_qty, r.total_qty,
                to_char(r.ends_at at time zone 'Asia/Seoul', 'HH24:MI')), 200),
           r.deal_id, r.store_id, format('/deals/%s?src=push', r.deal_id)
    from queued q;
    get diagnostics v_count = row_count;
    v_total := v_total + v_count;
  end loop;
  return v_total;
end $$;
revoke all on function public.enqueue_deal_pushes() from public, anon, authenticated;

-- 주민이 알림함 "모두 읽음"과 알림을 고를 수 있게 kind 인덱스
create index if not exists idx_notifications_user_created on public.notifications (user_id, created_at desc);

-- ───── 3) 발송기 깨우기 ─────
-- send-push Edge Function을 부른다. URL과 비밀값은 Vault에만 둔다 (마이그레이션·코드에 값 금지)
--   select vault.create_secret('https://<project-ref>.supabase.co', 'project_url');
--   select vault.create_secret('<PUSH_CRON_SECRET과 같은 값>', 'push_cron_secret');
-- 둘 중 하나라도 없거나 pg_net이 없으면 아무것도 하지 않는다 (로컬·설정 전에도 cron이 실패하지 않게)
create or replace function public.invoke_push_sender()
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_url    text;
  v_secret text;
begin
  if to_regnamespace('net') is null or to_regclass('vault.decrypted_secrets') is null then
    return;
  end if;
  if not exists (select 1 from push_queue where status = 'pending') then
    return;
  end if;
  execute $q$select decrypted_secret from vault.decrypted_secrets where name = 'project_url'$q$ into v_url;
  execute $q$select decrypted_secret from vault.decrypted_secrets where name = 'push_cron_secret'$q$ into v_secret;
  if v_url is null or v_secret is null then
    return;
  end if;
  execute 'select net.http_post(url := $1, headers := $2, body := $3)'
    using v_url || '/functions/v1/send-push',
          jsonb_build_object('Content-Type', 'application/json', 'x-push-secret', v_secret),
          '{}'::jsonb;
end $$;
revoke all on function public.invoke_push_sender() from public, anon, authenticated;

do $$
begin
  if exists (select 1 from pg_available_extensions where name = 'pg_net') then
    create extension if not exists pg_net;
  end if;
  if to_regnamespace('cron') is not null then
    -- 같은 이름으로 다시 부르면 pg_cron이 기존 작업을 바꾼다
    perform cron.schedule('deal-push', '* * * * *',
      'select public.enqueue_deal_pushes(); select public.invoke_push_sender();');
  end if;
end $$;
