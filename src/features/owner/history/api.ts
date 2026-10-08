// O11 딜 기록 · O12 딜 상세(사장님). 집계는 서버 RPC가 한다 (get_owner_deal_history · get_owner_deal_result)
import { z } from 'zod';

import { toAppError } from '@/shared/lib/errors';
import { supabase } from '@/shared/lib/supabase';

export type HistoryTab = 'live' | 'scheduled' | 'past';
export type CloseReason =
  'sold_out' | 'time_ended' | 'owner' | 'admin' | 'report' | 'store_suspended';

const historyItemSchema = z.object({
  id: z.string(),
  type: z.string(),
  rule_id: z.string().nullable(),
  title: z.string(),
  original_price: z.number(),
  deal_price: z.number(),
  starts_at: z.string(),
  ends_at: z.string(),
  total_qty: z.number(),
  remaining_qty: z.number(),
  coupon_ttl_min: z.number(),
  status: z.enum(['active', 'paused', 'closed']),
  close_reason: z.string().nullable(),
  sold_out_at: z.string().nullable(),
  claimed_count: z.number(),
  used_count: z.number(),
});

export interface HistoryDeal {
  id: string;
  type: 'instant' | 'weekly';
  title: string;
  originalPrice: number;
  dealPrice: number;
  startsAt: string;
  endsAt: string;
  totalQty: number;
  remainingQty: number;
  couponTtlMin: number;
  status: 'active' | 'paused' | 'closed';
  closeReason: CloseReason | null;
  soldOutAt: string | null;
  claimedCount: number;
  usedCount: number;
}

const historySchema = z.object({
  counts: z.object({ live: z.number(), scheduled: z.number(), past: z.number() }),
  items: z.array(historyItemSchema),
});

const CLOSE_REASONS: readonly string[] = [
  'sold_out',
  'time_ended',
  'owner',
  'admin',
  'report',
  'store_suspended',
];

const toHistoryDeal = (row: z.infer<typeof historyItemSchema>): HistoryDeal => ({
  id: row.id,
  type: row.type === 'weekly' ? 'weekly' : 'instant',
  title: row.title,
  originalPrice: row.original_price,
  dealPrice: row.deal_price,
  startsAt: row.starts_at,
  endsAt: row.ends_at,
  totalQty: row.total_qty,
  remainingQty: row.remaining_qty,
  couponTtlMin: row.coupon_ttl_min,
  status: row.status,
  closeReason:
    row.close_reason && CLOSE_REASONS.includes(row.close_reason)
      ? (row.close_reason as CloseReason)
      : null,
  soldOutAt: row.sold_out_at,
  claimedCount: row.claimed_count,
  usedCount: row.used_count,
});

export async function fetchDealHistory(tab: HistoryTab) {
  const { data, error } = await supabase.rpc('get_owner_deal_history', { p_tab: tab });
  if (error) throw toAppError(error);
  const parsed = historySchema.parse(data);
  return { counts: parsed.counts, items: parsed.items.map(toHistoryDeal) };
}

/** 딜 하나 (사장님 본인 가게만 RLS로 보인다). 없으면 null */
export async function fetchOwnerDeal(dealId: string): Promise<HistoryDeal | null> {
  const { data, error } = await supabase
    .from('deals')
    .select(
      'id, type, rule_id, title, original_price, deal_price, starts_at, ends_at, total_qty, remaining_qty, coupon_ttl_min, status, close_reason, sold_out_at',
    )
    .eq('id', dealId)
    .maybeSingle();
  if (error) throw toAppError(error);
  if (!data) return null;
  return toHistoryDeal(historyItemSchema.parse({ ...data, claimed_count: 0, used_count: 0 }));
}

export interface DealCouponRow {
  id: string;
  confirmNumber: string; // 손님 화면의 확인번호 (쿠폰 id 끝 4자리)
  status: 'issued' | 'used' | 'expired' | 'canceled';
  usedAt: string | null;
}

/** 이 딜의 쿠폰 (주민 이름·연락처는 담지 않는다) */
export async function fetchDealCoupons(dealId: string): Promise<DealCouponRow[]> {
  const { data, error } = await supabase
    .from('coupons')
    .select('id, status, used_at')
    .eq('deal_id', dealId)
    .order('used_at', { ascending: false, nullsFirst: false });
  if (error) throw toAppError(error);
  return data.map((row) => ({
    id: row.id,
    confirmNumber: row.id.slice(-4).toUpperCase(),
    status:
      row.status === 'used' || row.status === 'expired' || row.status === 'canceled'
        ? row.status
        : 'issued',
    usedAt: row.used_at,
  }));
}

const resultSchema = z.object({
  claimed_users: z.number(),
  used_count: z.number(),
  expired_count: z.number(),
  new_visitor_count: z.number(),
  estimated_revenue: z.number(),
  push_sent_count: z.number(),
  sold_out_after_min: z.number().nullable(),
});

export interface DealResult {
  claimedUsers: number;
  usedCount: number;
  expiredCount: number;
  newVisitorCount: number;
  estimatedRevenue: number;
  pushSentCount: number;
  soldOutAfterMin: number | null;
}

export async function fetchDealResult(dealId: string): Promise<DealResult | null> {
  const { data, error } = await supabase.rpc('get_owner_deal_result', { p_deal_id: dealId });
  if (error) throw toAppError(error);
  if (!data) return null;
  const row = resultSchema.parse(data);
  return {
    claimedUsers: row.claimed_users,
    usedCount: row.used_count,
    expiredCount: row.expired_count,
    newVisitorCount: row.new_visitor_count,
    estimatedRevenue: row.estimated_revenue,
    pushSentCount: row.push_sent_count,
    soldOutAfterMin: row.sold_out_after_min,
  };
}
