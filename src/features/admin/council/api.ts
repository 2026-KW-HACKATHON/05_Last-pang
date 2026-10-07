// 자치회 리포트 (A5). 집계는 get_council_report가 하고, 요약 초안은 Edge Function council-summary가 만든다
import { z } from 'zod';

import { toAppError } from '@/shared/lib/errors';
import { unwrapRpc } from '@/shared/lib/rpc';
import { supabase } from '@/shared/lib/supabase';

const kpiSchema = z.object({ value: z.number().nullable(), prev: z.number().nullable() });

const reportSchema = z.object({
  month: z.string(),
  range_end: z.string(),
  service_start: z.string().nullable(),
  days_running: z.number(),
  ready_from: z.string().nullable(),
  is_ready: z.boolean(),
  totals: z.object({ deals: z.number(), used: z.number(), stores: z.number() }),
  kpis: z.object({
    deals: kpiSchema,
    claimed: kpiSchema,
    used: kpiSchema,
    stores: kpiSchema,
    first_visit_pct: kpiSchema,
  }),
  zones: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      is_redistribution: z.boolean(),
      exposure_weight: z.number(),
      hidden: z.boolean(),
      share_pct: z.number().nullable(),
      delta_pp: z.number().nullable(),
    }),
  ),
  heatmap: z.array(
    z.object({
      dow: z.number(),
      hour: z.number(),
      supply: z.number(),
      used: z.number(),
      free_people: z.number(),
    }),
  ),
  summary: z
    .object({
      month: z.string(),
      source: z.enum(['ai', 'template']),
      ai_text: z.string().nullable(),
      edited_text: z.string().nullable(),
      status: z.enum(['draft', 'reviewed', 'sent']),
      reviewed_at: z.string().nullable(),
      sent_at: z.string().nullable(),
    })
    .nullable(),
});
export type CouncilReport = z.infer<typeof reportSchema>;
export type HeatCell = CouncilReport['heatmap'][number];

/** month = 그 달 1일 'YYYY-MM-01'. 운영자가 아니면 서버가 null → FORBIDDEN */
export async function fetchCouncilReport(month: string): Promise<CouncilReport> {
  const { data, error } = await supabase.rpc('get_council_report', { p_month: month });
  if (error) throw toAppError(error);
  if (!data) throw toAppError({ code: '42501' });
  return reportSchema.parse(data);
}

export async function generateSummary(month: string) {
  const { data, error } = await supabase.functions.invoke('council-summary', { body: { month } });
  return unwrapRpc(data, error, z.object({ text: z.string(), source: z.string() }));
}

/** Edge Function이 없을 때(로컬 등) 화면이 만든 기본 문장을 저장 */
export async function saveSummaryDraft(input: { month: string; text: string }) {
  const { data, error } = await supabase.rpc('save_council_summary_draft', {
    p_month: input.month,
    p_text: input.text,
    p_source: 'template',
  });
  return unwrapRpc(data, error, z.object({ month: z.string() }));
}

export async function updateSummary(input: { month: string; text: string }) {
  const { data, error } = await supabase.rpc('update_council_summary', {
    p_month: input.month,
    p_text: input.text,
  });
  return unwrapRpc(data, error, z.object({ status: z.string() }));
}

export async function setSummaryStatus(input: { month: string; status: 'reviewed' | 'sent' }) {
  const { data, error } = await supabase.rpc('set_council_summary_status', {
    p_month: input.month,
    p_status: input.status,
  });
  return unwrapRpc(data, error, z.object({ status: z.string() }));
}
