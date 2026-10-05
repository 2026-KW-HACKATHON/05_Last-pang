import { z } from 'zod';

import { toAppError } from '@/shared/lib/errors';
import { supabase } from '@/shared/lib/supabase';

import type { DealFormInput, WeeklyDealInput } from './schema';

export async function createDeal(
  storeId: string,
  input: DealFormInput,
  now = new Date(),
): Promise<string> {
  const endsAt = new Date(now.getTime() + input.durationMin * 60_000);
  const { data, error } = await supabase
    .from('deals')
    .insert({
      store_id: storeId,
      type: 'instant',
      title: input.title,
      original_price: input.originalPrice,
      deal_price: input.dealPrice,
      total_qty: input.totalQty,
      remaining_qty: input.totalQty, // 타입상 필요. 실제 값은 2-1 트리거가 total_qty로 덮어씀
      coupon_ttl_min: input.couponTtlMin,
      starts_at: now.toISOString(),
      ends_at: endsAt.toISOString(),
    })
    .select('id')
    .single();
  if (error) throw toAppError(error); // 승인 안 된 가게면 RLS 42501 → FORBIDDEN
  return data.id;
}

export interface OwnerDeal {
  id: string;
  title: string;
  originalPrice: number;
  dealPrice: number;
  remainingQty: number;
  totalQty: number;
  startsAt: string;
  endsAt: string;
}

export async function fetchMyActiveDeals(storeId: string): Promise<OwnerDeal[]> {
  const { data, error } = await supabase
    .from('deals')
    .select('id, title, original_price, deal_price, remaining_qty, total_qty, starts_at, ends_at')
    .eq('store_id', storeId)
    .eq('status', 'active')
    .gt('ends_at', new Date().toISOString())
    .order('ends_at');
  if (error) throw toAppError(error);
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    originalPrice: row.original_price,
    dealPrice: row.deal_price,
    remainingQty: row.remaining_qty,
    totalQty: row.total_qty,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
  }));
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

/** 조기 종료. 이미 발급된 쿠폰은 유효 (컨벤션 9장) */
export async function closeDeal(dealId: string): Promise<void> {
  const { error } = await supabase.from('deals').update({ status: 'closed' }).eq('id', dealId);
  if (error) throw toAppError(error);
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
  dealPrice: number;
  repeatDays: number[];
  startTime: string; // "15:00"
  endTime: string;
  qty: number;
  isActive: boolean;
}

export async function fetchDealRules(storeId: string): Promise<DealRule[]> {
  const { data, error } = await supabase
    .from('deal_rules')
    .select('id, title, deal_price, repeat_days, start_time, end_time, qty, is_active')
    .eq('store_id', storeId)
    .order('created_at');
  if (error) throw toAppError(error);
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    dealPrice: row.deal_price,
    repeatDays: row.repeat_days,
    startTime: row.start_time.slice(0, 5), // DB time "15:00:00" → "15:00"
    endTime: row.end_time.slice(0, 5),
    qty: row.qty,
    isActive: row.is_active,
  }));
}

export async function setDealRuleActive(ruleId: string, isActive: boolean): Promise<void> {
  const { error } = await supabase
    .from('deal_rules')
    .update({ is_active: isActive })
    .eq('id', ruleId);
  if (error) throw toAppError(error);
}
