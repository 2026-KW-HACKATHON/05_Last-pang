-- 피그마 "동네냠냠 UI 최종"(10/7) 반영 ⓪ 딜 상태(신고로 멈춤)·종료 사유·신고 테이블
-- 뒤 파일(store_management, admin_and_deal_rpcs)이 이 컬럼과 테이블을 쓰므로 먼저 실행된다

-- ───── deals: 멈춤 상태와 종료 기록 (O11 딜 기록의 소진/종료/신고 중지/중지 칩) ─────
alter table public.deals drop constraint deals_status_check;
alter table public.deals add constraint deals_status_check check (status in ('active', 'paused', 'closed'));

alter table public.deals
  add column paused_at    timestamptz,
  add column closed_at    timestamptz,
  add column close_reason text check (close_reason in ('sold_out', 'time_ended', 'owner', 'admin', 'report', 'store_suspended')),
  add column sold_out_at  timestamptz,
  add column created_by   uuid references public.profiles(id) on delete set null;   -- 운영자가 대신 올린 딜 구분

-- 이미 끝난 딜은 시간 종료로 정리
update public.deals set status = 'closed', closed_at = ends_at, close_reason = 'time_ended'
where status = 'active' and ends_at < now();
update public.deals set close_reason = 'owner', closed_at = coalesce(closed_at, now())
where status = 'closed' and close_reason is null;

-- ───── 신고 (R7-1 신고 사유 선택 → A3 신고·이슈) ─────
create table public.deal_reports (
  id           uuid primary key default gen_random_uuid(),
  deal_id      uuid not null references public.deals(id) on delete cascade,
  store_id     uuid not null references public.stores(id) on delete cascade,
  reporter_id  uuid references public.profiles(id) on delete set null,
  reason       text not null check (reason in ('benefit_mismatch', 'store_closed', 'coupon_refused', 'inappropriate', 'etc')),
  detail       text check (char_length(detail) <= 150),
  status       text not null default 'pending' check (status in ('pending', 'confirmed', 'dismissed')),
  resolved_by  uuid references public.profiles(id) on delete set null,
  resolved_at  timestamptz,
  created_at   timestamptz not null default now(),
  unique (deal_id, reporter_id)       -- 한 사람이 같은 딜을 두 번 신고하지 못함
);
create index idx_deal_reports_store on public.deal_reports (store_id, created_at desc);
create index idx_deal_reports_pending on public.deal_reports (status, created_at desc);
alter table public.deal_reports enable row level security;
-- 정책 없음 = 클라이언트 직접 접근 불가. 주민은 report_deal, 운영자는 admin_* RPC로만 (신고자는 사장님께 비공개)

-- ───── 정지된 가게의 사장님도 본인 딜·쿠폰 기록은 읽을 수 있게 (O3-1 이용 정지 화면) ─────
create or replace function public.my_store_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from stores where owner_id = auth.uid();
$$;

create policy "사장님은 본인 가게 딜 전체 조회" on public.deals
  for select to authenticated using (store_id = public.my_store_id());

drop policy "쿠폰 조회: 본인, 본인 가게, 운영자" on public.coupons;
create policy "쿠폰 조회: 본인, 본인 가게, 운영자" on public.coupons
  for select to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from deals d where d.id = deal_id and d.store_id = public.my_store_id())
    or public.is_admin()
  );

-- 운영자는 모든 딜을 읽는다 (정지된 가게 포함)
create policy "운영자는 딜 전체 조회" on public.deals
  for select to authenticated using (public.is_admin());

-- 딜 등록·종료는 이제 RPC(create_instant_deal, close_deal)로만 한다: 하루 3개·시간 겹침·종료 사유를 서버가 지킨다
drop policy "승인된 사장님은 본인 가게 즉시딜 등록" on public.deals;
drop policy "사장님은 본인 가게 딜 종료" on public.deals;
revoke insert, update on public.deals from authenticated;
