-- <시각>_create_core_tables.sql
-- Supabase는 확장을 extensions 스키마에 설치한다
create extension if not exists pgcrypto with schema extensions;

-- ───── 사용자 ─────
create table public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  role                text not null default 'resident' check (role in ('resident', 'owner', 'admin')),
  nickname            text check (char_length(nickname) between 1 and 20),
  agreed_terms_at     timestamptz,   -- 필수 동의 시각 (null이면 온보딩으로)
  agreed_location_at  timestamptz,   -- 선택 동의 (null = 미동의)
  agreed_push_at      timestamptz,
  created_at          timestamptz not null default now()
);

-- 카카오로 처음 로그인하면 auth.users에 행이 생기고, 이 트리거가 profiles 행을 만든다
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───── 주민 설정 (사용자와 1:1 → PK가 user_id, created_at 대신 updated_at: 컨벤션 8장 예외) ─────
create table public.resident_preferences (
  user_id      uuid primary key references public.profiles(id) on delete cascade,
  active_days  smallint[] not null default '{0,1,2,3,4,5,6}',   -- 0=일 ~ 6=토
  time_slots   text[] not null default '{morning,lunch,afternoon,evening}',
  categories   text[] not null default '{meal,cafe,bakery,snack}',
  radius_m     int not null default 800 check (radius_m between 200 and 2000),
  base_lat     double precision,   -- 자주 있는 곳, 약 100m 단위로 흐려서 저장
  base_lng     double precision,
  updated_at   timestamptz not null default now(),
  check (cardinality(categories) >= 1)
);

create table public.schedules (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  name          text not null check (char_length(name) between 1 and 20),
  trigger_type  text not null check (trigger_type in ('departure', 'arrival', 'free_time')),
  days          smallint[] not null,
  at_time       time,      -- departure / arrival
  start_time    time,      -- free_time
  end_time      time,
  created_at    timestamptz not null default now(),
  check (
    (trigger_type in ('departure', 'arrival') and at_time is not null)
    or (trigger_type = 'free_time' and start_time is not null and end_time > start_time)
  )
);
create index idx_schedules_user_id on public.schedules (user_id);

-- ───── 가게 ─────
create table public.stores (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid not null unique references public.profiles(id),   -- 사장님 1명 = 가게 1개
  name           text not null check (char_length(name) between 1 and 30),
  category       text not null check (category in ('meal', 'cafe', 'bakery', 'snack', 'etc')),
  address        text not null,
  lat            double precision not null,
  lng            double precision not null,
  status         text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reject_reason  text,
  created_at     timestamptz not null default now()
);

-- 고유코드 해시는 별도 테이블 (가게와 1:1 → PK가 store_id: 컨벤션 8장 예외).
-- RLS만 켜고 정책을 만들지 않아 클라이언트는 절대 읽을 수 없다
create table public.store_secrets (
  store_id          uuid primary key references public.stores(id) on delete cascade,
  redeem_code_hash  text not null,
  code_version      int not null default 1,
  code_rotated_at   timestamptz not null default now()
);

-- ───── 딜 ─────
create table public.deal_rules (
  id              uuid primary key default gen_random_uuid(),
  store_id        uuid not null references public.stores(id) on delete cascade,
  title           text not null check (char_length(title) between 1 and 40),
  original_price  int not null check (original_price > 0),
  deal_price      int not null check (deal_price > 0 and deal_price < original_price),
  repeat_days     smallint[] not null,
  start_time      time not null,
  end_time        time not null check (end_time > start_time),
  qty             int not null check (qty between 1 and 100),
  coupon_ttl_min  int not null default 15 check (coupon_ttl_min in (10, 15, 20, 30)),
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);
create index idx_deal_rules_store_id on public.deal_rules (store_id);

create table public.deals (
  id              uuid primary key default gen_random_uuid(),
  store_id        uuid not null references public.stores(id) on delete cascade,
  rule_id         uuid references public.deal_rules(id) on delete set null,
  type            text not null check (type in ('instant', 'weekly')),
  title           text not null check (char_length(title) between 1 and 40),
  original_price  int not null check (original_price > 0),
  deal_price      int not null check (deal_price > 0 and deal_price < original_price),
  starts_at       timestamptz not null,
  ends_at         timestamptz not null,
  total_qty       int not null check (total_qty between 1 and 100),
  remaining_qty   int not null check (remaining_qty >= 0 and remaining_qty <= total_qty),
  coupon_ttl_min  int not null default 15 check (coupon_ttl_min in (10, 15, 20, 30)),
  status          text not null default 'active' check (status in ('active', 'closed')),
  created_at      timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index idx_deals_store_id on public.deals (store_id);
create index idx_deals_rule_id on public.deals (rule_id);
create index idx_deals_active_time on public.deals (status, starts_at, ends_at);

-- 딜 등록 시 남은 수량을 전체 수량으로 강제 (클라이언트가 다른 값을 보내도 무시)
create or replace function public.set_initial_remaining_qty()
returns trigger language plpgsql as $$
begin
  new.remaining_qty := new.total_qty;
  return new;
end $$;

create trigger deals_set_remaining_qty
  before insert on public.deals
  for each row execute function public.set_initial_remaining_qty();

-- ───── 쿠폰 ─────
create table public.coupons (
  id          uuid primary key default gen_random_uuid(),
  deal_id     uuid not null references public.deals(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  status      text not null default 'issued' check (status in ('issued', 'used', 'expired')),
  issued_at   timestamptz not null default now(),
  expires_at  timestamptz not null,
  used_at     timestamptz,
  created_at  timestamptz not null default now()          -- v2 추가 (합의 2-10)
);
-- 한 사람은 한 딜에 유효(issued)·사용(used) 쿠폰 1개만
create unique index uq_coupons_active_per_user
  on public.coupons (deal_id, user_id) where status in ('issued', 'used');
create index idx_coupons_user_id on public.coupons (user_id);
create index idx_coupons_deal_id on public.coupons (deal_id);
create index idx_coupons_expire on public.coupons (expires_at) where status = 'issued';

create table public.redemption_attempts (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  store_id    uuid not null references public.stores(id) on delete cascade,
  coupon_id   uuid references public.coupons(id) on delete set null,
  success     boolean not null,
  created_at  timestamptz not null default now()
);
create index idx_redemption_attempts_user_recent on public.redemption_attempts (user_id, created_at);

create table public.deal_events (
  id          bigint generated always as identity primary key,
  deal_id     uuid not null references public.deals(id) on delete cascade,
  user_id     uuid references public.profiles(id) on delete set null,
  type        text not null check (type in ('impression', 'detail_view', 'claim', 'redeem', 'expire', 'push_click')),
  created_at  timestamptz not null default now()
);
create index idx_deal_events_deal_type on public.deal_events (deal_id, type);

-- ───── 푸시 ─────
create table public.push_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  endpoint    text not null unique,
  p256dh      text not null,
  auth        text not null,
  created_at  timestamptz not null default now(),         -- v2 추가 (합의 2-10)
  updated_at  timestamptz not null default now()
);
create index idx_push_subscriptions_user_id on public.push_subscriptions (user_id);

create table public.push_queue (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  deal_id     uuid not null references public.deals(id) on delete cascade,
  reason      text not null check (reason in ('new_deal', 'schedule')),
  status      text not null default 'pending' check (status in ('pending', 'sent', 'failed', 'skipped')),
  created_at  timestamptz not null default now(),
  sent_at     timestamptz,
  unique (user_id, deal_id)   -- 같은 딜 알림 중복 금지
);
create index idx_push_queue_pending on public.push_queue (status, created_at);

-- ───── RLS 켜기 (정책은 2-2) ─────
alter table public.profiles             enable row level security;
alter table public.resident_preferences enable row level security;
alter table public.schedules            enable row level security;
alter table public.stores               enable row level security;
alter table public.store_secrets        enable row level security;
alter table public.deal_rules           enable row level security;
alter table public.deals                enable row level security;
alter table public.coupons              enable row level security;
alter table public.redemption_attempts  enable row level security;
alter table public.deal_events          enable row level security;
alter table public.push_subscriptions   enable row level security;
alter table public.push_queue           enable row level security;
