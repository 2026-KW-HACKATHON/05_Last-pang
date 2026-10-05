-- 2-4 redeem_coupon 보완: p_code가 null이면 형식 검사와 해시 비교가 모두 null이 되어
-- 가게 코드 없이 사용 처리되던 문제를 막는다. (이미 배포된 마이그레이션은 고치지 않고 함수만 다시 만든다)

create or replace function public.redeem_coupon(p_coupon_id uuid, p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions   -- crypt()가 extensions 스키마에 있음
as $$
declare
  v_coupon   coupons;
  v_store_id uuid;
  v_hash     text;
  v_fails    int;
begin
  if auth.uid() is null then
    return jsonb_build_object('ok', false, 'error', 'UNAUTHENTICATED');
  end if;
  -- null이면 아래 비교가 모두 null(=거짓 아님)이 되어 통과하므로 먼저 막는다
  if p_code is null or p_coupon_id is null or p_code !~ '^[0-9]{6}$' then
    return jsonb_build_object('ok', false, 'error', 'INVALID_INPUT');
  end if;

  -- 1. 본인 쿠폰만, 잠금
  select * into v_coupon from coupons
  where id = p_coupon_id and user_id = auth.uid()
  for update;
  if not found or v_coupon.status <> 'issued' or v_coupon.expires_at < now() then
    return jsonb_build_object('ok', false, 'error', 'COUPON_NOT_USABLE');
  end if;

  select d.store_id, s.redeem_code_hash into v_store_id, v_hash
  from deals d join store_secrets s on s.store_id = d.store_id
  where d.id = v_coupon.deal_id;

  -- 2. 무차별 대입 방지: 같은 주민이 10분 안에 5번 틀리면 차단
  select count(*) into v_fails from redemption_attempts
  where user_id = auth.uid() and success = false and created_at > now() - interval '10 minutes';
  if v_fails >= 5 then
    return jsonb_build_object('ok', false, 'error', 'TOO_MANY_ATTEMPTS');
  end if;

  -- 3. 코드 비교. 틀려도 예외를 던지지 않고 return (예외는 롤백 → 실패 기록이 사라짐)
  -- is distinct from: 한쪽이 null이어도 '다르다'로 판단 (<>는 null이면 통과해 버림)
  if v_hash is null or crypt(p_code, v_hash) is distinct from v_hash then
    insert into redemption_attempts (user_id, store_id, coupon_id, success)
    values (auth.uid(), v_store_id, p_coupon_id, false);
    return jsonb_build_object('ok', false, 'error', 'WRONG_CODE', 'remaining_attempts', 5 - (v_fails + 1));
  end if;

  -- 4. 사용 처리
  update coupons set status = 'used', used_at = now() where id = p_coupon_id returning * into v_coupon;
  insert into redemption_attempts (user_id, store_id, coupon_id, success)
  values (auth.uid(), v_store_id, p_coupon_id, true);
  insert into deal_events (deal_id, user_id, type) values (v_coupon.deal_id, auth.uid(), 'redeem');

  return jsonb_build_object(
    'ok', true,
    'data', jsonb_build_object(
      'used_at', v_coupon.used_at,
      'confirm_number', upper(right(v_coupon.id::text, 4))   -- 사장님이 눈으로 확인하는 번호 (v1의 confirm_no)
    )
  );
end $$;

revoke all on function public.redeem_coupon(uuid, text) from public, anon;
grant execute on function public.redeem_coupon(uuid, text) to authenticated;
