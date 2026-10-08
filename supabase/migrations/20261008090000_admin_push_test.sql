-- 운영자 알림 시험 도구: 운영자가 직접 올린 가게·딜로 푸시가 오는지 바로 확인한다
-- 1) _enqueue_deal_push: 딜 하나의 대상 고르기 (cron과 운영자 "지금 보내기"가 같은 규칙을 쓴다)
-- 2) admin_push_readiness: 발송 준비 상태 (cron · pg_net · Vault 이름 · 구독 수). 값은 돌려주지 않는다
-- 3) admin_push_funnel: 이 가게 기준으로 주민이 어느 조건에서 빠지는지 단계별 인원
--    inbox_targets = 알림함에 들어갈 사람, push_targets = 그중 푸시 받을 기기가 등록된 사람
-- 4) admin_deal_push_status / admin_send_deal_push_now: 딜별 발송 결과와 즉시 발송
-- 5) admin_send_test_push: 운영자 본인 기기로 이 딜 푸시를 보낸다 (주민 계정 없이 두 사람이 시험)

-- ───── 1) 딜 하나의 대상 고르기 ─────
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
         s.name as store_name, s.category, s.lat, s.lng
    into r
  from deals d join stores s on s.id = d.store_id and s.status = 'approved'
  where d.id = p_deal_id and d.status = 'active'
    and d.starts_at <= now() and d.ends_at > now() and d.remaining_qty > 0;
  if not found then return 0; end if;

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
  return v_count;
end $$;
revoke all on function public._enqueue_deal_push(uuid) from public, anon, authenticated;

-- cron은 그대로 매분 부르고, 안쪽만 위 함수를 쓰도록 바꾼다 (열린 지 15분 안의 딜만)
create or replace function public.enqueue_deal_pushes()
returns int
language plpgsql security definer set search_path = public as $$
declare
  v_total int := 0;
  d record;
begin
  for d in
    select id from deals
    where status = 'active' and starts_at <= now() and starts_at > now() - interval '15 minutes'
      and ends_at > now() and remaining_qty > 0
  loop
    v_total := v_total + public._enqueue_deal_push(d.id);
  end loop;
  return v_total;
end $$;
revoke all on function public.enqueue_deal_pushes() from public, anon, authenticated;

-- ───── 2) 발송 준비 상태 ─────
create or replace function public.admin_push_readiness()
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_cron boolean := false;
  v_net boolean := to_regnamespace('net') is not null;
  v_url boolean := false;
  v_secret boolean := false;
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  if to_regclass('cron.job') is not null then
    execute $q$select exists (select 1 from cron.job where jobname = 'deal-push')$q$ into v_cron;
  end if;
  if to_regclass('vault.secrets') is not null then   -- 이름만 확인, 값은 읽지 않는다
    execute $q$select exists (select 1 from vault.secrets where name = 'project_url')$q$ into v_url;
    execute $q$select exists (select 1 from vault.secrets where name = 'push_cron_secret')$q$ into v_secret;
  end if;
  return jsonb_build_object('ok', true, 'data', jsonb_build_object(
    'cron_job', v_cron,
    'pg_net', v_net,
    'vault_project_url', v_url,
    'vault_push_secret', v_secret,
    'subscriptions', (select count(*) from push_subscriptions),
    'quiet_now', public._is_quiet_now(null)
  ));
end $$;

-- ───── 3) 단계별 대상 인원 (이 가게에 지금 딜을 올리면) ─────
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
      count(*) filter (where f_agreed and deal_alerts and f_range and f_cat and f_time) as inbox_targets,
      count(*) filter (where f_agreed and deal_alerts and f_range and f_cat and f_time and has_sub) as push_targets
    from flags
  )
  select to_jsonb(steps) into v from steps;
  return jsonb_build_object('ok', true, 'data', v);
end $$;

-- ───── 4) 딜별 발송 결과 · 지금 보내기 ─────
create or replace function public.admin_deal_push_status(p_deal_id uuid)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  return jsonb_build_object('ok', true, 'data', jsonb_build_object(
    'notified', (select count(*) from notifications where deal_id = p_deal_id and audience = 'resident'),
    'pending',  (select count(*) from push_queue where deal_id = p_deal_id and status = 'pending'),
    'sent',     (select count(*) from push_queue where deal_id = p_deal_id and status = 'sent'),
    'failed',   (select count(*) from push_queue where deal_id = p_deal_id and status = 'failed'),
    'skipped',  (select count(*) from push_queue where deal_id = p_deal_id and status = 'skipped'),
    'clicks',   (select count(*) from deal_events where deal_id = p_deal_id and type = 'push_click')
  ));
end $$;

create or replace function public.admin_send_deal_push_now(p_deal_id uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_new int;
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  if not exists (select 1 from deals where id = p_deal_id and status = 'active'
                 and starts_at <= now() and ends_at > now() and remaining_qty > 0) then
    return jsonb_build_object('ok', false, 'error', 'DEAL_NOT_ACTIVE');
  end if;
  v_new := public._enqueue_deal_push(p_deal_id);   -- 15분 제한 없이 이 딜만
  perform public.invoke_push_sender();              -- 대기열이 있으면 send-push를 바로 깨운다
  return jsonb_build_object('ok', true, 'data', jsonb_build_object('new_notifications', v_new));
end $$;

-- ───── 5) 내 기기로 시험 알림 ─────
-- 주민 대상 규칙(거리·업종·하루 3건)을 건너뛰고 부른 운영자의 기기로만 보낸다. 알림함에도 남겨 눌러 볼 수 있게 한다
create or replace function public.admin_send_test_push(p_deal_id uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_devices int;
  r record;
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  select d.id, d.store_id, d.title, d.deal_price, d.remaining_qty, d.total_qty, d.ends_at, s.name as store_name
    into r
  from deals d join stores s on s.id = d.store_id
  where d.id = p_deal_id and d.status = 'active' and d.ends_at > now();
  if not found then
    return jsonb_build_object('ok', false, 'error', 'DEAL_NOT_ACTIVE');
  end if;
  select count(*) into v_devices from push_subscriptions where user_id = v_uid;
  if v_devices = 0 then
    return jsonb_build_object('ok', false, 'error', 'NO_PUSH_DEVICE');
  end if;
  insert into push_queue (user_id, deal_id, reason) values (v_uid, r.id, 'new_deal')
  on conflict (user_id, deal_id) do update set status = 'pending', sent_at = null, created_at = now();
  insert into notifications (user_id, audience, kind, title, body, deal_id, store_id, link)
  values (v_uid, 'resident', 'deal',
          left(format('[시험] %s %s', r.store_name, r.title), 80),
          left(format('%s원 · 선착순 사용 %s/%s명 · %s까지', to_char(r.deal_price, 'FM999,999,999'),
               r.remaining_qty, r.total_qty, to_char(r.ends_at at time zone 'Asia/Seoul', 'HH24:MI')), 200),
          r.id, r.store_id, format('/deals/%s?src=push', r.id));
  perform public.invoke_push_sender();
  return jsonb_build_object('ok', true, 'data', jsonb_build_object('devices', v_devices));
end $$;

revoke all on function public.admin_send_test_push(uuid) from public, anon;
grant execute on function public.admin_send_test_push(uuid) to authenticated;
revoke all on function public.admin_push_readiness() from public, anon;
revoke all on function public.admin_push_funnel(uuid) from public, anon;
revoke all on function public.admin_deal_push_status(uuid) from public, anon;
revoke all on function public.admin_send_deal_push_now(uuid) from public, anon;
grant execute on function public.admin_push_readiness() to authenticated;
grant execute on function public.admin_push_funnel(uuid) to authenticated;
grant execute on function public.admin_deal_push_status(uuid) to authenticated;
grant execute on function public.admin_send_deal_push_now(uuid) to authenticated;
