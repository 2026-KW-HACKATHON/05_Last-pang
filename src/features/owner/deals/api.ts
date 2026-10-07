import { z } from 'zod';

import { toAppError } from '@/shared/lib/errors';
import { unwrapRpc } from '@/shared/lib/rpc';
import { supabase } from '@/shared/lib/supabase';

import { kstTodayWindow } from '../lib/period';

import type { DealFormInput, WeeklyDealInput } from './schema';

const createdDealSchema = z.object({
  deal_id: z.string(),
  starts_at: z.string(),
  ends_at: z.string(),
  push_targets: z.number(),
});
export type CreatedDeal = z.infer<typeof createdDealSchema>;

/** 즉시딜 올리기. 하루 3개·같은 시간대·코드 미발급은 서버가 막는다 (DAILY_LIMIT_REACHED · TIME_OVERLAP · CODE_NOT_ISSUED) */
export async function createInstantDeal(input: DealFormInput): Promise<CreatedDeal> {
  const { data, error } = await supabase.rpc('create_instant_deal', {
    p_title: input.title,
    p_original_price: input.originalPrice,
    p_deal_price: input.dealPrice,
    p_duration_min: input.durationMin,
    p_total_qty: input.totalQty,
    p_coupon_ttl_min: input.couponTtlMin,
  });
  return unwrapRpc(data, error, createdDealSchema);
}

/** 오늘 올린 즉시딜 수와 한도 (O4-1 "오늘은 딜을 3개 모두 올렸어요") */
export async function fetchTodayDealQuota(): Promise<{ used: number; limit: number }> {
  const { data, error } = await supabase.rpc('get_today_deal_quota');
  if (error) throw toAppError(error);
  return z.object({ used: z.number(), limit: z.number() }).parse(data);
}

export interface OwnerDeal {
  id: string;
  type: 'instant' | 'weekly';
  title: string;
  originalPrice: number;
  dealPrice: number;
  remainingQty: number;
  totalQty: number;
  startsAt: string;
  endsAt: string;
  status: 'active' | 'paused' | 'closed';
  pausedAt: string | null;
  couponTtlMin: number;
}

const DEAL_COLUMNS =
  'id, type, title, original_price, deal_price, remaining_qty, total_qty, starts_at, ends_at, status, paused_at, coupon_ttl_min';

interface DealRow {
  id: string;
  type: string;
  title: string;
  original_price: number;
  deal_price: number;
  remaining_qty: number;
  total_qty: number;
  starts_at: string;
  ends_at: string;
  status: string;
  paused_at: string | null;
  coupon_ttl_min: number;
}

const toDealStatus = (value: string): OwnerDeal['status'] =>
  value === 'paused' || value === 'closed' ? value : 'active';

const toOwnerDeal = (row: DealRow): OwnerDeal => ({
  id: row.id,
  type: row.type === 'weekly' ? 'weekly' : 'instant',
  title: row.title,
  originalPrice: row.original_price,
  dealPrice: row.deal_price,
  remainingQty: row.remaining_qty,
  totalQty: row.total_qty,
  startsAt: row.starts_at,
  endsAt: row.ends_at,
  status: toDealStatus(row.status),
  pausedAt: row.paused_at,
  couponTtlMin: row.coupon_ttl_min,
});

/** 지금 진행 중인 딜 (시작했고 아직 안 끝난 것) */
export async function fetchMyActiveDeals(storeId: string, now = new Date()): Promise<OwnerDeal[]> {
  const { data, error } = await supabase
    .from('deals')
    .select(DEAL_COLUMNS)
    .eq('store_id', storeId)
    .in('status', ['active', 'paused'])
    .lte('starts_at', now.toISOString())
    .gt('ends_at', now.toISOString())
    .order('ends_at');
  if (error) throw toAppError(error);
  return data.map(toOwnerDeal);
}

/** 오늘 안에 시작할 예정인 딜. 요일 반복딜은 밤 12시 5분에 그날 딜이 미리 만들어진다 (6-5 cron) */
export async function fetchTodayScheduledDeals(
  storeId: string,
  now = new Date(),
): Promise<OwnerDeal[]> {
  const today = kstTodayWindow(now);
  const { data, error } = await supabase
    .from('deals')
    .select(DEAL_COLUMNS)
    .eq('store_id', storeId)
    .eq('status', 'active')
    .gt('starts_at', now.toISOString())
    .lt('starts_at', today.to)
    .order('starts_at');
  if (error) throw toAppError(error);
  return data.map(toOwnerDeal);
}

export interface DealCouponCounts {
  claimed: number; // 받음 (만료 포함 전체)
  used: number; // 사용
  pending: number; // 아직 안 씀 (유효)
}

/** 딜별 쿠폰 현황. RLS상 사장님은 본인 가게 쿠폰만 읽을 수 있다 */
export async function fetchDealCouponCounts(
  dealIds: string[],
): Promise<Record<string, DealCouponCounts>> {
  if (dealIds.length === 0) return {};
  const { data, error } = await supabase
    .from('coupons')
    .select('deal_id, status')
    .in('deal_id', dealIds);
  if (error) throw toAppError(error);
  const counts: Record<string, DealCouponCounts> = {};
  for (const id of dealIds) counts[id] = { claimed: 0, used: 0, pending: 0 };
  for (const row of data) {
    const count = counts[row.deal_id];
    if (!count) continue;
    count.claimed += 1;
    if (row.status === 'used') count.used += 1;
    if (row.status === 'issued') count.pending += 1;
  }
  return counts;
}

/** 조기 종료. 이미 발급된 쿠폰은 유효 (컨벤션 9장). 종료 사유 owner는 서버가 기록 */
export async function closeDeal(dealId: string): Promise<void> {
  const { data, error } = await supabase.rpc('close_deal', { p_deal_id: dealId });
  unwrapRpc(data, error, z.object({ deal_id: z.string() }));
}

/** 딜 등록 화면의 "근처 주민 N명에게 알림" — 읽기 RPC는 결과 그대로 (컨벤션 8장) */
export async function fetchPushTargetEstimate(startsAt: Date): Promise<number> {
  const { data, error } = await supabase.rpc('estimate_push_targets', {
    p_starts_at: startsAt.toISOString(),
  });
  if (error) throw toAppError(error);
  return z.number().int().nonnegative().parse(data);
}

/** 요일 반복딜 규칙. deal_rules는 RLS가 승인된 본인 가게만 허용 (2-2) */
export async function createDealRule(storeId: string, input: WeeklyDealInput): Promise<void> {
  const { error } = await supabase.from('deal_rules').insert({
    store_id: storeId,
    title: input.title,
    original_price: input.originalPrice,
    deal_price: input.dealPrice,
    repeat_days: input.repeatDays,
    start_time: input.startTime,
    end_time: input.endTime,
    qty: input.qty,
    coupon_ttl_min: input.couponTtlMin,
  });
  if (error) throw toAppError(error);
}

export interface DealRule {
  id: string;
  title: string;
  originalPrice: number;
  dealPrice: number;
  repeatDays: number[];
  startTime: string; // "15:00"
  endTime: string;
  qty: number;
  couponTtlMin: number;
  isActive: boolean;
}

const RULE_COLUMNS =
  'id, title, original_price, deal_price, repeat_days, start_time, end_time, qty, coupon_ttl_min, is_active';

interface RuleRow {
  id: string;
  title: string;
  original_price: number;
  deal_price: number;
  repeat_days: number[];
  start_time: string;
  end_time: string;
  qty: number;
  coupon_ttl_min: number;
  is_active: boolean;
}

const toDealRule = (row: RuleRow): DealRule => ({
  id: row.id,
  title: row.title,
  originalPrice: row.original_price,
  dealPrice: row.deal_price,
  repeatDays: row.repeat_days,
  startTime: row.start_time.slice(0, 5), // DB time "15:00:00" → "15:00"
  endTime: row.end_time.slice(0, 5),
  qty: row.qty,
  couponTtlMin: row.coupon_ttl_min,
  isActive: row.is_active,
});

export async function fetchDealRules(storeId: string): Promise<DealRule[]> {
  const { data, error } = await supabase
    .from('deal_rules')
    .select(RULE_COLUMNS)
    .eq('store_id', storeId)
    .order('created_at');
  if (error) throw toAppError(error);
  return data.map(toDealRule);
}

/** 반복딜 하나. 다른 가게 규칙이거나 지워졌으면 null (RLS로 안 보임) */
export async function fetchDealRule(ruleId: string): Promise<DealRule | null> {
  const { data, error } = await supabase
    .from('deal_rules')
    .select(RULE_COLUMNS)
    .eq('id', ruleId)
    .maybeSingle();
  if (error) throw toAppError(error);
  return data ? toDealRule(data) : null;
}

export async function setDealRuleActive(ruleId: string, isActive: boolean): Promise<void> {
  const { error } = await supabase
    .from('deal_rules')
    .update({ is_active: isActive })
    .eq('id', ruleId);
  if (error) throw toAppError(error);
}

/** 반복딜 수정. 오늘 이미 만들어진 딜은 그대로, 내일 만들어지는 딜부터 바뀐다 */
export async function updateDealRule(
  ruleId: string,
  input: WeeklyDealInput & { isActive: boolean },
): Promise<void> {
  const { error } = await supabase
    .from('deal_rules')
    .update({
      title: input.title,
      original_price: input.originalPrice,
      deal_price: input.dealPrice,
      repeat_days: input.repeatDays,
      start_time: input.startTime,
      end_time: input.endTime,
      qty: input.qty,
      coupon_ttl_min: input.couponTtlMin,
      is_active: input.isActive,
    })
    .eq('id', ruleId);
  if (error) throw toAppError(error);
}

/** 반복딜 삭제. 이미 만들어진 딜은 rule_id만 비워지고 그대로 진행된다 (on delete set null) */
export async function deleteDealRule(ruleId: string): Promise<void> {
  const { error } = await supabase.from('deal_rules').delete().eq('id', ruleId);
  if (error) throw toAppError(error);
}
