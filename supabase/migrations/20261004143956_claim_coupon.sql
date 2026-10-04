create or replace function public.claim_coupon(p_deal_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deal   deals;
  v_coupon coupons;
begin
  if auth.uid() is null then
    return jsonb_build_object('ok', false, 'error', 'UNAUTHENTICATED');
  end if;

  -- 1. 딜 행 잠금: 동시에 들어온 두 번째 요청은 첫 번째가 끝날 때까지 여기서 기다린다
  select * into v_deal from deals where id = p_deal_id for update;

  if not found
     or v_deal.status <> 'active'
     or now() not between v_deal.starts_at and v_deal.ends_at then
    return jsonb_build_object('ok', false, 'error', 'DEAL_NOT_ACTIVE');
  end if;

  if v_deal.remaining_qty <= 0 then
    return jsonb_build_object('ok', false, 'error', 'SOLD_OUT');
  end if;

  -- 2. 1인 1딜 (유효·사용 쿠폰이 있으면 거절, 만료 쿠폰만 있으면 다시 받기 가능)
  if exists (
    select 1 from coupons
    where deal_id = p_deal_id and user_id = auth.uid() and status in ('issued', 'used')
  ) then
    return jsonb_build_object('ok', false, 'error', 'ALREADY_CLAIMED');
  end if;

  -- 3. 차감 + 발급 + 기록
  update deals set remaining_qty = remaining_qty - 1 where id = p_deal_id;

  insert into coupons (deal_id, user_id, expires_at)
  values (p_deal_id, auth.uid(), now() + make_interval(mins => v_deal.coupon_ttl_min))
  returning * into v_coupon;

  insert into deal_events (deal_id, user_id, type) values (p_deal_id, auth.uid(), 'claim');

  return jsonb_build_object(
    'ok', true,
    'data', jsonb_build_object('coupon_id', v_coupon.id, 'expires_at', v_coupon.expires_at)
  );
end $$;

revoke all on function public.claim_coupon(uuid) from public, anon;
grant execute on function public.claim_coupon(uuid) to authenticated;
