-- 딜이 시간·수량이 아닌 이유(사장님 종료 · 운영자 종료 · 신고 확정 · 가게 정지)로 닫히면
-- 아직 안 쓴 쿠폰(issued)을 취소(canceled)하고 받은 주민 알림함에 알린다
-- 시간 종료(time_ended)·수량 소진(sold_out)은 그대로: 받은 쿠폰은 유효시간까지 쓸 수 있다

alter table public.coupons drop constraint coupons_status_check;
alter table public.coupons add constraint coupons_status_check
  check (status in ('issued', 'used', 'expired', 'canceled'));
alter table public.coupons add column if not exists canceled_at timestamptz;

alter table public.notifications drop constraint notifications_kind_check;
alter table public.notifications add constraint notifications_kind_check check (kind in (
  'deal', 'deal_start', 'notice',
  'store_approved', 'store_rejected', 'store_suspended', 'store_unsuspended',
  'address_approved', 'address_rejected',
  'deal_sold_out', 'deal_paused', 'deal_resumed', 'deal_closed_by_report',
  'coupon_canceled'));   -- 주민: 받은 쿠폰이 딜 종료로 취소됨

create or replace function public._cancel_coupons_on_deal_close()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_store_name text;
  v_reason     text;
begin
  if new.status <> 'closed' or old.status = 'closed'
     or coalesce(new.close_reason, '') not in ('owner', 'admin', 'report', 'store_suspended') then
    return new;
  end if;
  select name into v_store_name from stores where id = new.store_id;
  v_reason := case new.close_reason when 'owner' then '사장님이 딜을 일찍 종료해서'
                                    else '운영 기준에 따라 딜이 종료돼서' end;
  with canceled as (
    update coupons set status = 'canceled', canceled_at = now()
    where deal_id = new.id and status = 'issued'
    returning user_id
  )
  insert into notifications (user_id, audience, kind, title, body, deal_id, store_id, link)
  select user_id, 'resident', 'coupon_canceled',
         left(format('[쿠폰 취소] %s %s', v_store_name, new.title), 80),
         left(v_reason || ' 받은 쿠폰이 취소됐어요. 다른 딜을 찾아볼까요?', 200),
         new.id, new.store_id, '/coupons'
  from canceled;
  return new;
end $$;
revoke all on function public._cancel_coupons_on_deal_close() from public, anon, authenticated;

drop trigger if exists deals_cancel_coupons_on_close on public.deals;
create trigger deals_cancel_coupons_on_close
  after update of status on public.deals
  for each row execute function public._cancel_coupons_on_deal_close();

-- 사장님 종료 팝업에 "받은 쿠폰 N장도 취소돼요"를 보여 주기 위한 수
create or replace function public.get_deal_open_coupon_count(p_deal_id uuid)
returns int language sql stable security definer set search_path = public as $$
  select count(*)::int from coupons c join deals d on d.id = c.deal_id
  where c.deal_id = p_deal_id and c.status = 'issued' and c.expires_at > now()
    and (d.store_id = public.my_store_id() or public.is_admin());
$$;
revoke all on function public.get_deal_open_coupon_count(uuid) from public, anon;
grant execute on function public.get_deal_open_coupon_count(uuid) to authenticated;
