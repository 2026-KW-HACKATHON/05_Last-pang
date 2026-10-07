import { z } from 'zod';

import { toAppError } from '@/shared/lib/errors';
import { supabase } from '@/shared/lib/supabase';

import { kstMidnightIso, nextKstDate } from '../lib/period';

const reportSchema = z.object({
  used_count: z.number(),
  estimated_revenue: z.number(),
  visitor_count: z.number(),
  new_visitor_count: z.number(),
  by_hour: z.record(z.string(), z.number()),
});

export interface StoreReport {
  usedCount: number;
  estimatedRevenue: number;
  visitorCount: number;
  newVisitorCount: number;
  newVisitorRate: number; // 0~1
  byHour: Array<{ hour: number; count: number }>;
}

export async function fetchStoreReport(from: string, to: string): Promise<StoreReport> {
  const { data, error } = await supabase.rpc('get_store_report', { p_from: from, p_to: to });
  if (error) throw toAppError(error);
  const parsed = reportSchema.safeParse(data); // 읽기 RPC: 봉투 없이 결과 그대로 (컨벤션 8장)
  if (!parsed.success) throw toAppError(parsed.error);
  const report = parsed.data;
  return {
    usedCount: report.used_count,
    estimatedRevenue: report.estimated_revenue,
    visitorCount: report.visitor_count,
    newVisitorCount: report.new_visitor_count,
    newVisitorRate: report.visitor_count ? report.new_visitor_count / report.visitor_count : 0,
    byHour: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: report.by_hour[String(hour)] ?? 0,
    })),
  };
}

export interface DealPerformance {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  totalQty: number;
  claimedQty: number; // 받아 간 수량 (total - remaining)
  claimRate: number; // 0~1, 소진율
}

interface PerformanceRow {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  total_qty: number;
  remaining_qty: number;
}

/** 소진율 높은 순 → 같으면 많이 나간 순. 상위 limit개 */
export function rankDealPerformance(rows: PerformanceRow[], limit = 3): DealPerformance[] {
  return rows
    .map((row) => {
      const claimedQty = row.total_qty - row.remaining_qty;
      return {
        id: row.id,
        title: row.title,
        startsAt: row.starts_at,
        endsAt: row.ends_at,
        totalQty: row.total_qty,
        claimedQty,
        claimRate: row.total_qty > 0 ? claimedQty / row.total_qty : 0,
      };
    })
    .filter((deal) => deal.claimedQty > 0)
    .sort((a, b) => b.claimRate - a.claimRate || b.claimedQty - a.claimedQty)
    .slice(0, limit);
}

/** 기간(한국 날짜, 양 끝 포함) 안에 시작한 우리 가게 딜의 소진 성과 */
export async function fetchDealPerformance(
  storeId: string,
  from: string,
  to: string,
): Promise<DealPerformance[]> {
  const { data, error } = await supabase
    .from('deals')
    .select('id, title, starts_at, ends_at, total_qty, remaining_qty')
    .eq('store_id', storeId)
    .gte('starts_at', kstMidnightIso(from))
    .lt('starts_at', kstMidnightIso(nextKstDate(to)));
  if (error) throw toAppError(error);
  return rankDealPerformance(data);
}
