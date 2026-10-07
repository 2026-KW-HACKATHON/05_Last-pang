-- 피그마 "동네냠냠 UI 최종"(10/7) 반영 ④ 자치회 리포트(A5 · A5-1): 구역·월간 집계·AI 요약 검수
-- 개인을 알아볼 수 있는 값은 내보내지 않는다: 구역 표본이 10명 미만이면 숨기고, 주민 id·닉네임은 집계에 쓰지 않는다

create table public.zones (
  id                text primary key,
  name              text not null,
  center_lat        double precision not null,
  center_lng        double precision not null,
  is_redistribution boolean not null default false,   -- 재분배 구역 (노출 가중치 대상)
  exposure_weight   numeric(3, 2) not null default 1.0,
  sort              int not null default 0
);
alter table public.zones enable row level security;
create policy "구역은 누구나 조회" on public.zones for select to authenticated using (true);

-- 구역 중심은 대략값(추측). 시연 전에 실제 지도에서 확인해 고친다
insert into public.zones (id, name, center_lat, center_lng, is_redistribution, exposure_weight, sort) values
  ('uicheon_west', '우이천 서쪽', 37.6235, 127.0545, true, 1.5, 1),
  ('wolgye_station', '월계역 주변', 37.6330, 127.0590, false, 1.0, 2),
  ('kw_univ', '광운대 주변', 37.6195, 127.0610, false, 1.0, 3),
  ('wolgye1_center', '월계1동 중심', 37.6206, 127.0580, false, 1.0, 4),
  ('nokcheon', '녹천 방면', 37.6445, 127.0510, false, 1.0, 5);

-- 가게가 속한 구역 = 가장 가까운 구역 중심
create or replace function public.store_zone_id(p_lat double precision, p_lng double precision)
returns text language sql stable set search_path = public as $$
  select id from zones order by public.distance_m(center_lat, center_lng, p_lat, p_lng) limit 1;
$$;

create table public.council_report_summaries (
  month        date primary key,                              -- 그 달 1일
  source       text not null default 'template' check (source in ('ai', 'template')),
  ai_text      text check (char_length(ai_text) <= 1000),
  edited_text  text check (char_length(edited_text) <= 1000),
  status       text not null default 'draft' check (status in ('draft', 'reviewed', 'sent')),
  generated_at timestamptz not null default now(),
  reviewed_by  uuid references public.profiles(id) on delete set null,
  reviewed_at  timestamptz,
  sent_at      timestamptz
);
alter table public.council_report_summaries enable row level security;
-- 정책 없음: 운영자 RPC로만

-- 월간 집계 (읽기 RPC). 운영자가 아니면 null
create or replace function public.get_council_report(p_month date)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_start      timestamptz;
  v_end        timestamptz;
  v_prev_start timestamptz;
  v_service_start date;
  v_today      date := (now() at time zone 'Asia/Seoul')::date;
  v_month      date := date_trunc('month', p_month)::date;
  v_result     jsonb;
begin
  if not public.is_admin() then
    return null;
  end if;
  v_start      := v_month::timestamp at time zone 'Asia/Seoul';
  v_end        := (v_month + interval '1 month')::timestamp at time zone 'Asia/Seoul';
  v_prev_start := (v_month - interval '1 month')::timestamp at time zone 'Asia/Seoul';
  select min((starts_at at time zone 'Asia/Seoul')::date) into v_service_start from deals;

  with
  m as (select v_start as s, v_end as e union all select v_prev_start, v_start),
  used as (
    select c.id, c.user_id, c.used_at, d.store_id, s.lat, s.lng
    from coupons c join deals d on d.id = c.deal_id join stores s on s.id = d.store_id
    where c.status = 'used' and c.used_at >= v_prev_start and c.used_at < v_end
  ),
  first_use as (
    select c.user_id, d.store_id, min(c.used_at) as first_at
    from coupons c join deals d on d.id = c.deal_id where c.status = 'used' group by 1, 2
  ),
  kpi as (
    select m.s,
      (select count(*) from deals d where d.starts_at >= m.s and d.starts_at < m.e) as deals_count,
      (select count(*) from coupons c where c.issued_at >= m.s and c.issued_at < m.e) as claimed_count,
      (select count(*) from used u where u.used_at >= m.s and u.used_at < m.e) as used_count,
      (select count(distinct d.store_id) from deals d where d.starts_at >= m.s and d.starts_at < m.e) as store_count,
      (select count(*) from used u join first_use f on f.user_id = u.user_id and f.store_id = u.store_id and f.first_at = u.used_at
        where u.used_at >= m.s and u.used_at < m.e) as first_visit_count
    from m
  ),
  zone_use as (
    select public.store_zone_id(u.lat, u.lng) as zone_id, (u.used_at >= v_start) as is_current,
           count(*) as n, count(distinct u.user_id) as people
    from used u group by 1, 2
  ),
  zone_total as (select is_current, sum(n) as total from zone_use group by 1),
  cells as (   -- 월=1 … 일=7, 9시~20시
    select dow, hr from generate_series(1, 7) dow cross join generate_series(9, 20) hr
  ),
  supply as (
    select extract(isodow from h at time zone 'Asia/Seoul')::int as dow,
           extract(hour from h at time zone 'Asia/Seoul')::int as hr, count(*) as n
    from deals d cross join lateral generate_series(date_trunc('hour', d.starts_at), d.ends_at - interval '1 second', interval '1 hour') h
    where d.starts_at >= v_start and d.starts_at < v_end
    group by 1, 2
  ),
  demand_use as (
    select extract(isodow from used_at at time zone 'Asia/Seoul')::int as dow,
           extract(hour from used_at at time zone 'Asia/Seoul')::int as hr, count(*) as n
    from used where used_at >= v_start group by 1, 2
  ),
  residents as (select user_id from resident_preferences),
  free_people as (   -- 그 요일·시간에 시간표가 비어 있는 주민 수 ("주민 한가한 시간 N명")
    select c.dow, c.hr, count(r.user_id) as n
    from cells c cross join residents r
    where not exists (
      select 1 from schedules s where s.user_id = r.user_id and (c.dow % 7)::smallint = any (s.days)
        and s.start_time < make_time(c.hr + 1, 0, 0) and make_time(c.hr, 0, 0) < s.end_time)
    group by 1, 2
  )
  select jsonb_build_object(
    'month', v_month,
    'range_end', least(v_today, (v_month + interval '1 month' - interval '1 day')::date),
    'service_start', v_service_start,
    'days_running', case when v_service_start is null then 0 else v_today - v_service_start + 1 end,
    'ready_from', v_service_start + 14,
    'is_ready', v_service_start is not null and v_today >= v_service_start + 14,
    'totals', jsonb_build_object(
      'deals', (select count(*) from deals), 'used', (select count(*) from coupons where status = 'used'),
      'stores', (select count(distinct store_id) from deals)),
    'kpis', (select jsonb_build_object(
      'deals', jsonb_build_object('value', cur.deals_count, 'prev', prev.deals_count),
      'claimed', jsonb_build_object('value', cur.claimed_count, 'prev', prev.claimed_count),
      'used', jsonb_build_object('value', cur.used_count, 'prev', prev.used_count),
      'stores', jsonb_build_object('value', cur.store_count, 'prev', prev.store_count),
      'first_visit_pct', jsonb_build_object(
        'value', case when cur.used_count = 0 then null else round(100.0 * cur.first_visit_count / cur.used_count) end,
        'prev', case when prev.used_count = 0 then null else round(100.0 * prev.first_visit_count / prev.used_count) end))
      from kpi cur, kpi prev where cur.s = v_start and prev.s = v_prev_start),
    'zones', (select jsonb_agg(jsonb_build_object(
        'id', z.id, 'name', z.name, 'is_redistribution', z.is_redistribution, 'exposure_weight', z.exposure_weight,
        'hidden', coalesce(cu.people, 0) < 10,
        'share_pct', case when coalesce(cu.people, 0) < 10 then null
                          else round(100.0 * cu.n / nullif((select total from zone_total where is_current), 0)) end,
        'delta_pp', case when coalesce(cu.people, 0) < 10 or pu.n is null then null
                         else round(100.0 * cu.n / nullif((select total from zone_total where is_current), 0))
                            - round(100.0 * pu.n / nullif((select total from zone_total where not is_current), 0)) end)
        order by z.sort)
      from zones z
      left join zone_use cu on cu.zone_id = z.id and cu.is_current
      left join zone_use pu on pu.zone_id = z.id and not pu.is_current),
    'heatmap', (select jsonb_agg(jsonb_build_object(
        'dow', c.dow, 'hour', c.hr, 'supply', coalesce(sp.n, 0),
        'used', coalesce(du.n, 0), 'free_people', coalesce(fp.n, 0)) order by c.dow, c.hr)
      from cells c
      left join supply sp on sp.dow = c.dow and sp.hr = c.hr
      left join demand_use du on du.dow = c.dow and du.hr = c.hr
      left join free_people fp on fp.dow = c.dow and fp.hr = c.hr),
    'summary', (select to_jsonb(x) - 'reviewed_by' from council_report_summaries x where x.month = v_month)
  ) into v_result;
  return v_result;
end $$;

-- 요약 문장 저장 (Edge Function council-summary가 AI로 만든 초안, 또는 화면이 만든 기본 문장)
create or replace function public.save_council_summary_draft(p_month date, p_text text, p_source text default 'template')
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  if char_length(coalesce(p_text, '')) not between 1 and 1000 or p_source not in ('ai', 'template') then
    return jsonb_build_object('ok', false, 'error', 'INVALID_INPUT');
  end if;
  insert into council_report_summaries (month, source, ai_text, status, generated_at)
  values (date_trunc('month', p_month)::date, p_source, p_text, 'draft', now())
  on conflict (month) do update
    set source = excluded.source, ai_text = excluded.ai_text, edited_text = null, status = 'draft',
        generated_at = now(), reviewed_by = null, reviewed_at = null
  where council_report_summaries.status = 'draft';   -- 검수 끝난 요약은 덮어쓰지 않는다
  return jsonb_build_object('ok', true, 'data', jsonb_build_object('month', date_trunc('month', p_month)::date));
end $$;

-- 문장 고치기
create or replace function public.update_council_summary(p_month date, p_text text)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  if char_length(coalesce(p_text, '')) not between 1 and 1000 then
    return jsonb_build_object('ok', false, 'error', 'INVALID_INPUT');
  end if;
  update council_report_summaries set edited_text = p_text, status = 'draft', reviewed_at = null, reviewed_by = null
  where month = date_trunc('month', p_month)::date and status <> 'sent';
  if not found then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;
  return jsonb_build_object('ok', true, 'data', jsonb_build_object('status', 'draft'));
end $$;

-- 검수 완료로 표시 / 보낸 것으로 표시 (내려받기·발송은 검수 완료 뒤에만)
create or replace function public.set_council_summary_status(p_month date, p_status text)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;
  if p_status = 'reviewed' then
    update council_report_summaries set status = 'reviewed', reviewed_by = auth.uid(), reviewed_at = now()
    where month = date_trunc('month', p_month)::date and status = 'draft';
  elsif p_status = 'sent' then
    update council_report_summaries set status = 'sent', sent_at = now()
    where month = date_trunc('month', p_month)::date and status in ('reviewed', 'sent');
  else
    return jsonb_build_object('ok', false, 'error', 'INVALID_INPUT');
  end if;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'NOT_FOUND');
  end if;
  return jsonb_build_object('ok', true, 'data', jsonb_build_object('status', p_status));
end $$;

do $$
declare f text;
begin
  foreach f in array array[
    'public.get_council_report(date)', 'public.save_council_summary_draft(date, text, text)',
    'public.update_council_summary(date, text)', 'public.set_council_summary_status(date, text)',
    'public.store_zone_id(double precision, double precision)'
  ] loop
    execute format('revoke all on function %s from public, anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;
