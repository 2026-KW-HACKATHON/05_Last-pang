-- 정책 안에서 profiles를 다시 조회하면 정책이 자기 자신을 부를 수 있어 security definer로 감싼다
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- 로그인한 사장님의 '승인된' 가게 id (없으면 null)
create or replace function public.my_approved_store_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from stores where owner_id = auth.uid() and status = 'approved';
$$;

-- ───── profiles ─────
create policy "본인 프로필 조회, 운영자는 전체 조회" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "본인 프로필 수정" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from authenticated;          -- role은 본인이 못 바꿈
grant update (nickname, agreed_terms_at, agreed_location_at, agreed_push_at)
  on public.profiles to authenticated;

-- ───── 본인 행만 전부 ─────
create policy "본인 설정 전체" on public.resident_preferences
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "본인 일정 전체" on public.schedules
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "본인 푸시 구독 전체" on public.push_subscriptions
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ───── stores ─────
create policy "가게 조회: 승인된 가게 전체, 본인·운영자" on public.stores
  for select to authenticated
  using (status = 'approved' or owner_id = auth.uid() or public.is_admin());
create policy "사장님은 본인 가게 기본 정보만 수정" on public.stores
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
revoke insert, update on public.stores from authenticated;               -- 등록은 register_store RPC
grant update (name, category, address) on public.stores to authenticated; -- status는 못 바꿈

-- store_secrets: 정책 없음 = 클라이언트 접근 불가

-- ───── deal_rules (요일반복딜 규칙) ─────
create policy "사장님은 본인 가게 반복 규칙 전체" on public.deal_rules
  for all to authenticated
  using (store_id = public.my_approved_store_id())
  with check (store_id = public.my_approved_store_id());

-- ───── deals ─────
create policy "승인된 가게의 딜은 누구나 조회" on public.deals
  for select to authenticated
  using (exists (select 1 from stores s where s.id = store_id and s.status = 'approved'));
create policy "승인된 사장님은 본인 가게 즉시딜 등록" on public.deals
  for insert to authenticated
  with check (store_id = public.my_approved_store_id() and type = 'instant');
create policy "사장님은 본인 가게 딜 종료" on public.deals
  for update to authenticated
  using (store_id = public.my_approved_store_id())
  with check (store_id = public.my_approved_store_id());
revoke update on public.deals from authenticated;
grant update (status) on public.deals to authenticated;   -- 조기 종료만. 수량은 RPC만

-- ───── coupons: 쓰기 정책 없음 (RPC만) ─────
create policy "쿠폰 조회: 본인, 본인 가게, 운영자" on public.coupons
  for select to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from deals d where d.id = deal_id and d.store_id = public.my_approved_store_id())
    or public.is_admin()
  );

-- redemption_attempts, deal_events, push_queue: 정책 없음 (RPC·cron·Edge Function만 접근)
