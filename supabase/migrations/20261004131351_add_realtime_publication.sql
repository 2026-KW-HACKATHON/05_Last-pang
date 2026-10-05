-- 변경을 화면에 실시간으로 보낼 테이블 (남은 수량, 쿠폰 상태)
alter publication supabase_realtime add table public.deals, public.coupons;