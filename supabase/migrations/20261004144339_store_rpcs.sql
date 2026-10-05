-- 6자리 코드 생성: random()은 예측 가능하므로 gen_random_bytes
create or replace function public.generate_redeem_code()
returns text language sql volatile set search_path = public, extensions as $$
  select lpad(((('x' || encode(gen_random_bytes(4), 'hex'))::bit(32)::bigint) % 1000000)::text, 6, '0');
$$;
revoke all on function public.generate_redeem_code() from public, anon, authenticated;

-- 사장님 가입: 가게 등록 + 역할을 owner로 (role은 본인이 못 바꾸므로 서버가 바꿈)
create or replace function public.register_store(
  p_name text, p_category text, p_address text, p_lat double precision, p_lng double precision
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_store_id uuid;
begin
  if auth.uid() is null then
    return jsonb_build_object('ok', false, 'error', 'UNAUTHENTICATED');
  end if;
  if exists (select 1 from stores where owner_id = auth.uid()) then
    return jsonb_build_object('ok', false, 'error', 'ALREADY_REGISTERED');
  end if;
  if p_lat not between 33 and 39 or p_lng not between 124 and 132        -- 대한민국 대략 범위
     or p_category not in ('meal', 'cafe', 'bakery', 'snack', 'etc')
     or char_length(coalesce(p_name, '')) not between 1 and 30 then
    return jsonb_build_object('ok', false, 'error', 'INVALID_INPUT');
  end if;

  insert into stores (owner_id, name, category, address, lat, lng)
  values (auth.uid(), p_name, p_category, p_address, p_lat, p_lng)
  returning id into v_store_id;

  update profiles set role = 'owner' where id = auth.uid() and role = 'resident';
  return jsonb_build_object('ok', true, 'data', jsonb_build_object('store_id', v_store_id));
end $$;

-- 운영자 승인·거절. 승인하면 코드 해시 자리를 만들되 코드는 반환하지 않는다 (합의 2-4).
-- 사장님은 설정 화면에서 rotate_store_code로 첫 코드를 받는다
create or replace function public.approve_store(
  p_store_id uuid, p_approve boolean, p_reject_reason text default null
)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'error', 'FORBIDDEN');
  end if;

  if not p_approve then
    update stores set status = 'rejected', reject_reason = p_reject_reason where id = p_store_id;
    return jsonb_build_object('ok', true, 'data', jsonb_build_object('status', 'rejected'));
  end if;

  update stores set status = 'approved', reject_reason = null where id = p_store_id;
  insert into store_secrets (store_id, redeem_code_hash)
  values (p_store_id, crypt(public.generate_redeem_code(), gen_salt('bf')))   -- 아무도 모르는 코드로 자리만 만듦
  on conflict (store_id) do nothing;

  return jsonb_build_object('ok', true, 'data', jsonb_build_object('status', 'approved'));
end $$;

-- 사장님 코드 발급·재발급: 새 코드는 이번 응답에서만 보이고, 이전 코드는 즉시 무효
create or replace function public.rotate_store_code()
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  v_store_id uuid := public.my_approved_store_id();
  v_code     text;
begin
  if v_store_id is null then
    return jsonb_build_object('ok', false, 'error', 'STORE_NOT_APPROVED');
  end if;
  v_code := public.generate_redeem_code();
  insert into store_secrets (store_id, redeem_code_hash)
  values (v_store_id, crypt(v_code, gen_salt('bf')))
  on conflict (store_id) do update
    set redeem_code_hash = excluded.redeem_code_hash,
        code_version     = store_secrets.code_version + 1,
        code_rotated_at  = now();
  return jsonb_build_object('ok', true, 'data', jsonb_build_object('code', v_code));
end $$;

revoke all on function public.register_store(text, text, text, double precision, double precision) from public, anon;
revoke all on function public.approve_store(uuid, boolean, text) from public, anon;
revoke all on function public.rotate_store_code() from public, anon;
grant execute on function public.register_store(text, text, text, double precision, double precision) to authenticated;
grant execute on function public.approve_store(uuid, boolean, text) to authenticated;
grant execute on function public.rotate_store_code() to authenticated;
