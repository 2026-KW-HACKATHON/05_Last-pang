// 운영자: 신고·이슈 (A3). 신고자는 누구인지 내려받지 않는다
import { z } from 'zod';

import { unwrapRpc } from '@/shared/lib/rpc';
import { supabase } from '@/shared/lib/supabase';

export type ReportTab = 'pending' | 'resolved';

const groupSchema = z.object({
  deal_id: z.string(),
  deal_title: z.string(),
  store_id: z.string(),
  store_name: z.string(),
  report_count: z.number(),
  latest_at: z.string(),
  is_paused: z.boolean(),
  reason_counts: z.record(z.string(), z.number()),
  result: z.string().nullable(),
});
export type ReportGroup = z.infer<typeof groupSchema>;

const groupListSchema = z.object({
  counts: z.object({ pending: z.number(), resolved: z.number() }),
  items: z.array(groupSchema),
});

export async function fetchReportGroups(tab: ReportTab) {
  const { data, error } = await supabase.rpc('admin_list_report_groups', { p_status: tab });
  return unwrapRpc(data, error, groupListSchema);
}

const detailSchema = z.object({
  deal: z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
    starts_at: z.string(),
    ends_at: z.string(),
    total_qty: z.number(),
    used_count: z.number(),
    close_reason: z.string().nullable(),
  }),
  store: z.object({
    id: z.string(),
    name: z.string(),
    status: z.string(),
    confirmed_report_count: z.number(),
  }),
  reports: z.array(
    z.object({
      id: z.string(),
      reason: z.string(),
      detail: z.string().nullable(),
      status: z.string(),
      created_at: z.string(),
    }),
  ),
});
export type ReportDetail = z.infer<typeof detailSchema>;

export async function fetchReportDetail(dealId: string) {
  const { data, error } = await supabase.rpc('admin_get_report_detail', { p_deal_id: dealId });
  return unwrapRpc(data, error, detailSchema);
}

/** 확정: 딜 종료 + 확정 1회 (3회면 가게 자동 정지) / 기각: 딜 다시 열기 */
export async function resolveReports(input: { dealId: string; isConfirmed: boolean }) {
  const { data, error } = await supabase.rpc('admin_resolve_reports', {
    p_deal_id: input.dealId,
    p_confirm: input.isConfirmed,
  });
  return unwrapRpc(
    data,
    error,
    z.object({ confirmed_count: z.number(), store_suspended: z.boolean() }),
  );
}
