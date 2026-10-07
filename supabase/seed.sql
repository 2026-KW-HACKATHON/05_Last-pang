-- 로컬 전용 시연 데이터. npx supabase db reset이 마이그레이션 뒤에 넣는다.
-- 원격에는 들어가지 않는다(db push는 시드를 넣지 않음). 실제 사람의 이름·번호는 쓰지 않는다.

-- crypt·gen_salt는 extensions 스키마에 있다
set search_path = public, extensions;

-- ───── 테스트 계정: 운영자 1 · 사장님 3 · 주민 20 ─────
-- id 규칙: 00000000-0000-0000-0000-0000000000NN (1 = 운영자, 2~4 = 사장님, 5~24 = 주민)
-- 앱에서는 개발 빌드의 "데모 로그인"(3-5)으로 들어간다. 비밀번호는 모두 demo-password
insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
  -- NULL이면 로그인할 때 오류가 나는 GoTrue 버전이 있어 빈 문자열로 둔다
  confirmation_token, recovery_token, email_change_token_new, email_change
)
select
  ('00000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid,
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  case when n = 1 then 'admin@demo.test'
       when n between 2 and 4 then 'owner' || (n - 1) || '@demo.test'
       else 'resident' || (n - 4) || '@demo.test' end,
  crypt('demo-password', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}', '{}',
  '', '', '', ''
from generate_series(1, 24) as n;
-- → on_auth_user_created 트리거가 profiles 24행을 만든다

-- 이메일·비밀번호 로그인에는 identities 행이 필요하다
insert into auth.identities (
  id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
)
select gen_random_uuid(), u.id, u.id::text,
       jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
       'email', now(), now(), now()
from auth.users u
where u.email like '%@demo.test';

update profiles set role = 'admin', nickname = '운영자', agreed_terms_at = now()
where id = '00000000-0000-0000-0000-000000000001';

-- 닉네임 번호는 이메일 번호와 같게 (owner1@demo.test = 사장님1, resident1@demo.test = 주민1)
update profiles set role = 'owner', nickname = '사장님' || (right(id::text, 2)::int - 1), agreed_terms_at = now()
where id in ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003',
             '00000000-0000-0000-0000-000000000004');

update profiles set nickname = '주민' || (right(id::text, 2)::int - 4), agreed_terms_at = now(), agreed_push_at = now()
where role = 'resident';

-- ───── 월계1동 예시 가게 (좌표는 대략값. 시연 전 실제 주변 좌표로 교체) ─────
-- 3번 사장님 가게는 승인 대기 화면 확인용으로 pending
-- 사업자 정보는 가짜 값(0으로 시작하는 번호)이다
insert into stores (id, owner_id, name, category, description, address, lat, lng, status,
                    representative_name, business_no, approved_at, reviewed_at) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002',
   '데모 베이커리', 'bakery', '베이커리 · 디저트', '노원구 월계1동 (예시)', 37.6215, 127.0585, 'approved',
   '데모사장일', '0000000001', now(), now()),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003',
   '데모 카페', 'cafe', '커피 · 디저트', '노원구 월계1동 (예시)', 37.6230, 127.0570, 'approved',
   '데모사장이', '0000000002', now(), now()),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004',
   '데모 분식', 'snack', '떡볶이 · 김밥', '노원구 월계1동 (예시)', 37.6200, 127.0600, 'pending',
   '데모사장삼', '0000000003', null, null);

-- 운영자가 직접 넣은 가게 (사장님 계정 없음) — 운영자 화면 "가게 추가" 확인용
insert into stores (id, owner_id, name, category, description, address, lat, lng, status,
                    created_by_admin, approved_at, reviewed_at) values
  ('10000000-0000-0000-0000-000000000004', null,
   '데모 국수집', 'meal', '칼국수 · 수제비', '노원구 월계1동 (예시)', 37.6210, 127.0592, 'approved', true, now(), now());

-- 시연용 가게 코드: 승인된 가게 모두 123456 (로컬 전용. 원격에는 절대 넣지 않음)
insert into store_secrets (store_id, redeem_code_hash, code_issued_at)
select id, crypt('123456', gen_salt('bf')), now() from stores where status = 'approved';

-- ───── 주민 20명: 월계1동 중심 근처(약 100m 단위), 생활 패턴은 기본값 ─────
insert into resident_preferences (user_id, base_lat, base_lng)
select id, 37.621, 127.058 from profiles where role = 'resident';

-- ───── 지금부터 3시간 진행하는 즉시딜 2개 (remaining_qty는 트리거가 total_qty로 맞춘다) ─────
insert into deals (store_id, type, title, original_price, deal_price, starts_at, ends_at,
                   total_qty, remaining_qty, coupon_ttl_min) values
  ('10000000-0000-0000-0000-000000000001', 'instant', '소금빵 2개 세트', 6000, 4200,
   now(), now() + interval '3 hours', 5, 5, 10),
  ('10000000-0000-0000-0000-000000000002', 'instant', '아메리카노 + 쿠키', 7500, 4900,
   now(), now() + interval '3 hours', 10, 10, 15);
