-- 딜 등록 화면의 "예상 알림 대상 수" (읽기 RPC → int 그대로)
create or replace function public.estimate_push_targets(p_starts_at timestamptz)
returns int language sql stable security definer set search_path = public as $$
  with st as (select * from stores where id = public.my_approved_store_id())
  select count(distinct p.user_id)::int
  from resident_preferences p
  join push_subscriptions ps on ps.user_id = p.user_id
  cross join st
  where st.category = any (p.categories)
    and extract(dow from p_starts_at at time zone 'Asia/Seoul')::smallint = any (p.active_days)
    and p.base_lat is not null
    and 2 * 6371000 * asin(sqrt(
          power(sin(radians(st.lat - p.base_lat) / 2), 2)
          + cos(radians(p.base_lat)) * cos(radians(st.lat)) * power(sin(radians(st.lng - p.base_lng) / 2), 2)
        )) <= p.radius_m;
$$;

revoke all on function public.estimate_push_targets(timestamptz) from public, anon;
grant execute on function public.estimate_push_targets(timestamptz) to authenticated;
