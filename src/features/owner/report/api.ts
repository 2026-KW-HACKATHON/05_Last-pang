import { z } from 'zod';

import { toAppError } from '@/shared/lib/errors';
import { supabase } from '@/shared/lib/supabase';

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
