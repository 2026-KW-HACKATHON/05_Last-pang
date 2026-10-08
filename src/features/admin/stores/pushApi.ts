// 운영자 알림 시험: 발송 준비 상태 · 대상 단계별 인원 · 딜별 발송 결과 · 지금 보내기 · 내 기기로 시험
import { z } from 'zod';

import { unwrapRpc } from '@/shared/lib/rpc';
import { supabase } from '@/shared/lib/supabase';

const readinessSchema = z.object({
  cron_job: z.boolean(),
  pg_net: z.boolean(),
  vault_project_url: z.boolean(),
  vault_push_secret: z.boolean(),
  subscriptions: z.number(),
  quiet_now: z.boolean(),
});
export type PushReadiness = z.infer<typeof readinessSchema>;

const funnelSchema = z.object({
  residents: z.number(),
  push_agreed: z.number(),
  alerts_on: z.number(),
  in_range: z.number(),
  category_ok: z.number(),
  free_ok: z.number(),
  inbox_targets: z.number(),
  push_targets: z.number(),
});
export type PushFunnel = z.infer<typeof funnelSchema>;

const statusSchema = z.object({
  notified: z.number(),
  pending: z.number(),
  sent: z.number(),
  failed: z.number(),
  skipped: z.number(),
  clicks: z.number(),
});
export type DealPushStatus = z.infer<typeof statusSchema>;

export async function fetchPushReadiness(): Promise<PushReadiness> {
  const { data, error } = await supabase.rpc('admin_push_readiness');
  return unwrapRpc(data, error, readinessSchema);
}

export async function fetchPushFunnel(storeId: string): Promise<PushFunnel> {
  const { data, error } = await supabase.rpc('admin_push_funnel', { p_store_id: storeId });
  return unwrapRpc(data, error, funnelSchema);
}

export async function fetchDealPushStatus(dealId: string): Promise<DealPushStatus> {
  const { data, error } = await supabase.rpc('admin_deal_push_status', { p_deal_id: dealId });
  return unwrapRpc(data, error, statusSchema);
}

/** 주민 대상 규칙 그대로 이 딜만 지금 대상 고르기 + 발송기 깨우기 (1분 cron을 기다리지 않음) */
export async function sendDealPushNow(dealId: string) {
  const { data, error } = await supabase.rpc('admin_send_deal_push_now', { p_deal_id: dealId });
  return unwrapRpc(data, error, z.object({ new_notifications: z.number() }));
}

/** 운영자 본인 기기로만 이 딜 푸시 (주민 계정 없이 시험) */
export async function sendTestPushToMe(dealId: string) {
  const { data, error } = await supabase.rpc('admin_send_test_push', { p_deal_id: dealId });
  return unwrapRpc(data, error, z.object({ devices: z.number() }));
}
