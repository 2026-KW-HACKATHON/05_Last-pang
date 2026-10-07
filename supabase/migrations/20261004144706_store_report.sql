-- 사장님 성과 리포트 (읽기 RPC → 결과 그대로 반환). 기간은 한국 날짜, 양 끝 포함
create or replace function public.get_store_report(p_from date, p_to date)
returns jsonb language sql stable security definer set search_path = public as $$
  with st as (select public.my_approved_store_id() as id),
  used as (
    select c.user_id, c.used_at, d.deal_price
    from coupons c join deals d on d.id = c.deal_id, st
    where d.store_id = st.id and c.status = 'used'
      and (c.used_at at time zone 'Asia/Seoul')::date between p_from and p_to
  ),
  first_visit as (   -- 이 가게에서 처음 쿠폰을 쓴 날
    select c.user_id, min(c.used_at) as first_at
    from coupons c join deals d on d.id = c.deal_id, st
    where d.store_id = st.id and c.status = 'used'
    group by c.user_id
  )
  select jsonb_build_object(
    'used_count', (select count(*) from used),
    'estimated_revenue', (select coalesce(sum(deal_price), 0) from used),   -- 추정치: 딜 판매가 합 (v1의 est_revenue)
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

revoke all on function public.get_store_report(date, date) from public, anon;
grant execute on function public.get_store_report(date, date) to authenticated;
