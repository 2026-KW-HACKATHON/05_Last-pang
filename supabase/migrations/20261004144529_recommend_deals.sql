create or replace function public.recommend_deals(p_lat double precision, p_lng double precision)
returns table (
  deal_id uuid, store_id uuid, store_name text, category text, title text,
  original_price int, deal_price int, remaining_qty int, total_qty int,
  ends_at timestamptz, distance_m int
)
language sql stable security invoker set search_path = public as $$   -- invoker: RLS가 그대로 적용됨
  with me as (
    select coalesce((select radius_m from resident_preferences where user_id = auth.uid()), 800) as radius_m
  ),
  candidates as (
    select d.*, s.name as store_name, s.category,
      (2 * 6371000 * asin(sqrt(
        power(sin(radians(s.lat - p_lat) / 2), 2)
        + cos(radians(p_lat)) * cos(radians(s.lat)) * power(sin(radians(s.lng - p_lng) / 2), 2)
      )))::int as distance_m
    from deals d
    join stores s on s.id = d.store_id and s.status = 'approved'
    where d.status = 'active' and now() between d.starts_at and d.ends_at
  )
  select c.id, c.store_id, c.store_name, c.category, c.title,
         c.original_price, c.deal_price, c.remaining_qty, c.total_qty, c.ends_at, c.distance_m
  from candidates c, me
  where c.distance_m <= me.radius_m
  order by c.remaining_qty = 0, c.distance_m   -- 마감된 딜은 맨 뒤로
  limit 50;
$$;

-- 화면에서 보내는 행동 기록 (노출·상세 조회·푸시 클릭만 허용. claim·redeem·expire는 서버가 기록)
create or replace function public.log_deal_event(p_deal_id uuid, p_type text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or p_type not in ('impression', 'detail_view', 'push_click') then
    return;
  end if;
  insert into deal_events (deal_id, user_id, type) values (p_deal_id, auth.uid(), p_type);
end $$;

revoke all on function public.recommend_deals(double precision, double precision) from public, anon;
revoke all on function public.log_deal_event(uuid, text) from public, anon;
grant execute on function public.recommend_deals(double precision, double precision) to authenticated;
grant execute on function public.log_deal_event(uuid, text) to authenticated;
