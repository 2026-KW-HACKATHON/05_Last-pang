create extension if not exists pg_cron;

create or replace function public.expire_coupons()
returns void
language sql
security definer
set search_path = public
as $$
  with expired as (
    update coupons set status = 'expired'
    where status = 'issued' and expires_at < now()
    returning deal_id, user_id
  ),
  logged as (
    insert into deal_events (deal_id, user_id, type)
    select deal_id, user_id, 'expire' from expired
  )
  update deals d
  set remaining_qty = least(d.total_qty, d.remaining_qty + x.expired_count)   -- 전체 수량을 넘지 않게
  from (select deal_id, count(*) as expired_count from expired group by deal_id) x
  where d.id = x.deal_id;
$$;

-- cron 전용: 로그인한 사용자도 직접 부를 수 없게
revoke all on function public.expire_coupons() from public, anon, authenticated;

select cron.schedule('expire-coupons', '* * * * *', 'select public.expire_coupons()');
