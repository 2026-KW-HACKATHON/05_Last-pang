-- 특정 사용자로 흉내 내어 확인 (2-7 시드 이후 실행)
begin;
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-000000000005","role":"authenticated"}';
select count(*) from coupons;                               -- 주민 본인 쿠폰 수만
select count(*) from store_secrets;                         -- 0행
update profiles set role = 'admin' where id = auth.uid();   -- 권한 오류가 나야 정상
rollback;
