-- 피그마 "동네냠냠 UI 최종"(10/7) 반영 ③ 주민: 에브리타임형 시간표(R13) · 하루 3번 알림 슬롯 · 알림 설정(R17) · 닉네임 규칙(R3)

-- ───── 닉네임: 1~12자, 한글·영문·숫자만 (R3 "1~12자, 한글·영문·숫자") ─────
alter table public.profiles drop constraint profiles_nickname_check;
alter table public.profiles add constraint profiles_nickname_check
  check (char_length(nickname) between 1 and 12 and nickname ~ '^[가-힣A-Za-z0-9]+$');

-- ───── 시간표: 출발/도착/한가한 시간 구분을 없애고 "반복 일정 블록"만 둔다 ─────
-- 일정만 입력하면 서버가 그날 첫 외출 전 · 점심 · 저녁 3번을 계산한다 (get_alert_times)
delete from public.schedules where trigger_type <> 'free_time' and start_time is null;   -- 시각만 있던 옛 행은 블록이 될 수 없음
alter table public.schedules drop constraint schedules_check;
alter table public.schedules drop column trigger_type;
alter table public.schedules drop column at_time;
alter table public.schedules alter column start_time set not null;
alter table public.schedules alter column end_time set not null;
alter table public.schedules add constraint schedules_time_check check (end_time > start_time);
alter table public.schedules add constraint schedules_days_check
  check (cardinality(days) between 1 and 7 and days <@ array[0, 1, 2, 3, 4, 5, 6]::smallint[]);
alter table public.schedules
  add column kind  text check (kind in ('class', 'work', 'parttime', 'exercise', 'academy', 'etc')),
  add column color text not null default 'crimson' check (color in ('crimson', 'orange', 'yellow', 'green', 'blue', 'purple', 'gray'));

-- 같은 요일·같은 시간에 두 일정이 겹치면 거절 (R13 "시간이 겹쳐요")
create or replace function public.check_schedule_overlap()
returns trigger language plpgsql set search_path = public as $$
begin
  if exists (
    select 1 from schedules s
    where s.user_id = new.user_id and s.id <> new.id
      and s.days && new.days
      and s.start_time < new.end_time and new.start_time < s.end_time
  ) then
    raise exception 'SCHEDULE_OVERLAP' using errcode = 'P0001';
  end if;
  return new;
end $$;
create trigger schedules_no_overlap
  before insert or update on public.schedules
  for each row execute function public.check_schedule_overlap();

-- ───── 알림 슬롯 설정 (R13-5 딜 알림 시간) ─────
alter table public.resident_preferences
  add column alert_morning         boolean not null default true,   -- 아침 · 첫 외출 전
  add column alert_lunch           boolean not null default true,   -- 점심 11:30쯤
  add column alert_dinner          boolean not null default true,   -- 저녁 17:30쯤
  add column first_outing_lead_min int not null default 30 check (first_outing_lead_min in (15, 30, 60));
alter table public.resident_preferences alter column categories set default '{meal,cafe,bakery,snack,etc}';
alter table public.resident_preferences drop constraint resident_preferences_radius_m_check;
alter table public.resident_preferences add constraint resident_preferences_radius_m_check
  check (radius_m in (300, 800, 1500) or radius_m between 200 and 2000);

-- ───── 알림 설정 (R17 알림 설정 탭) ─────
create table public.notification_settings (
  user_id       uuid primary key references public.profiles(id) on delete cascade,
  deal_alerts   boolean not null default true,    -- 딜 알림: 내 일정에 맞는 딜이 열리면
  start_alerts  boolean not null default true,    -- 시작 알림: 시작 전 딜이 열리면
  notices       boolean not null default false,   -- 서비스 공지
  use_location  boolean not null default true,    -- 걸어갈 수 있는 거리 안의 딜만
  quiet_enabled boolean not null default true,
  quiet_start   time not null default '22:00',
  quiet_end     time not null default '08:00',
  updated_at    timestamptz not null default now()
);
alter table public.notification_settings enable row level security;
create policy "본인 알림 설정 전체" on public.notification_settings
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ───── 하루 알림 시각 계산 (R13 요약 · R13-5 미리보기 · 발송 cron 공용) ─────
-- 규칙: 아침 = 그날 첫 일정 시작 - lead분 / 점심 11:30 · 저녁 17:30, 그 시각에 일정 중이면 일정 끝난 시각
--       두 알림이 1시간 안이면 하나로 합침 / 방해 금지 시간이면 보내지 않음 / 일정 없는 날은 점심·저녁 2번
create or replace function public.get_alert_times(p_user_id uuid, p_day date)
returns table (slot text, at_time time, label text)
language plpgsql stable security definer set search_path = public as $$
declare
  v_pref   resident_preferences;
  v_set    notification_settings;
  v_dow    smallint := extract(dow from p_day)::smallint;
  v_first  time;
  v_items  jsonb := '[]'::jsonb;
  v_t      time;
  v_name   text;
  r        record;
  v_prev_t time;
begin
  select * into v_pref from resident_preferences where user_id = p_user_id;
  select * into v_set from notification_settings where user_id = p_user_id;
  if v_set.user_id is not null and not v_set.deal_alerts then
    return;
  end if;

  select min(s.start_time) into v_first from schedules s where s.user_id = p_user_id and v_dow = any (s.days);
  if coalesce(v_pref.alert_morning, true) and v_first is not null then
    v_items := v_items || jsonb_build_object('slot', 'morning', 't',
      (v_first - make_interval(mins => coalesce(v_pref.first_outing_lead_min, 30)))::time, 'label', '첫 외출 전');
  end if;

  foreach v_name in array array['lunch', 'dinner'] loop
    continue when (v_name = 'lunch' and not coalesce(v_pref.alert_lunch, true))
               or (v_name = 'dinner' and not coalesce(v_pref.alert_dinner, true));
    v_t := case v_name when 'lunch' then '11:30'::time else '17:30'::time end;
    -- 그 시각에 일정 중이면 그 일정이 끝난 뒤로 (연달아 있는 일정은 끝까지 따라감)
    loop
      select s.end_time into r from schedules s
      where s.user_id = p_user_id and v_dow = any (s.days) and s.start_time <= v_t and v_t < s.end_time
      order by s.end_time desc limit 1;
      exit when not found;
      v_t := r.end_time;
    end loop;
    v_items := v_items || jsonb_build_object('slot', v_name, 't', v_t,
      'label', case when v_t = case v_name when 'lunch' then '11:30'::time else '17:30'::time end
                    then case v_name when 'lunch' then '점심' else '저녁' end
                    else case v_name when 'lunch' then '점심 · 일정 끝나고' else '저녁 · 일정 끝나고' end end);
  end loop;

  v_prev_t := null;
  for r in select x->>'slot' as slot, (x->>'t')::time as t, x->>'label' as label
           from jsonb_array_elements(v_items) x order by (x->>'t')::time loop
    -- 방해 금지 시간 (기본 22:00~08:00, 자정을 넘는 구간 처리)
    if coalesce(v_set.quiet_enabled, true) and (
         (coalesce(v_set.quiet_start, '22:00') > coalesce(v_set.quiet_end, '08:00')
            and (r.t >= coalesce(v_set.quiet_start, '22:00') or r.t < coalesce(v_set.quiet_end, '08:00')))
      or (coalesce(v_set.quiet_start, '22:00') < coalesce(v_set.quiet_end, '08:00')
            and r.t >= coalesce(v_set.quiet_start, '22:00') and r.t < coalesce(v_set.quiet_end, '08:00'))) then
      continue;
    end if;
    if v_prev_t is not null and r.t - v_prev_t < interval '1 hour' then
      continue;   -- 1시간 안의 두 번째 알림은 앞 알림에 합침
    end if;
    slot := r.slot; at_time := r.t; label := r.label;
    return next;
    v_prev_t := r.t;
  end loop;
end $$;
revoke all on function public.get_alert_times(uuid, date) from public, anon, authenticated;

-- 화면용: 내 일주일 알림 미리보기 (읽기 RPC → 결과 그대로)
create or replace function public.get_my_alert_preview(p_from date default null)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object('day', d::date, 'slot', a.slot, 'at', to_char(a.at_time, 'HH24:MI'),
                                               'label', a.label) order by d, a.at_time), '[]'::jsonb)
  from generate_series(coalesce(p_from, (now() at time zone 'Asia/Seoul')::date),
                       coalesce(p_from, (now() at time zone 'Asia/Seoul')::date) + 6, interval '1 day') d
  cross join lateral public.get_alert_times(auth.uid(), d::date) a;
$$;
revoke all on function public.get_my_alert_preview(date) from public, anon;
grant execute on function public.get_my_alert_preview(date) to authenticated;
