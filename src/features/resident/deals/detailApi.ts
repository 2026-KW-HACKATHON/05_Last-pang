// 딜 상세의 부가 요청: 오늘 사용 한도 · 신고 · 조회 기록
import { AppError, toAppError } from '@/shared/lib/errors';
import { unwrapRpc } from '@/shared/lib/rpc';
import { supabase } from '@/shared/lib/supabase';
import type { ReportReason } from '@/shared/constants/policy';

import { dailyUsageSchema, reportResultSchema } from './schema';

import type { DailyUsage } from './types';

/** 오늘 쓴 쿠폰 수와 하루 한도 (R7-1 오늘 사용 한도 도달) */
export async function fetchMyDailyUsage(): Promise<DailyUsage> {
  const { data, error } = await supabase.rpc('get_my_daily_usage');
  if (error) throw toAppError(error);
  const row = dailyUsageSchema.safeParse(data);
  if (!row.success) throw new AppError('UNKNOWN');
  return { usedToday: row.data.used_today, limit: row.data.limit };
}

/** 딜 신고. 같은 딜에 신고가 3건 모이면 서버가 딜을 잠시 멈춘다 */
export async function reportDeal(dealId: string, reason: ReportReason, detail: string) {
  const { data, error } = await supabase.rpc('report_deal', {
    p_deal_id: dealId,
    p_reason: reason,
    p_detail: detail.trim() || undefined,
  });
  unwrapRpc(data, error, reportResultSchema);
}

/** 행동 기록은 실패해도 화면에 영향을 주지 않는다 (호출하는 쪽에서 오류를 무시) */
export async function createDealEvent(dealId: string, type: 'detail_view' | 'push_click') {
  const { error } = await supabase.rpc('log_deal_event', { p_deal_id: dealId, p_type: type });
  if (error) throw toAppError(error);
}
