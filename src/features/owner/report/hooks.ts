import { useQuery } from '@tanstack/react-query';

import { ROOT_KEYS } from '@/shared/constants/queryKeys';
import { toKstDateString } from '@/shared/lib/time';

import { fetchStoreReport } from './api';

export function useStoreReport(from: string, to: string) {
  return useQuery({
    queryKey: [...ROOT_KEYS.report, from, to] as const,
    queryFn: () => fetchStoreReport(from, to),
  });
}

/** 오늘(한국 날짜) 요약 — 사장님 홈 상단 숫자 3개 */
export function useTodayReport() {
  const today = toKstDateString(new Date());
  return useStoreReport(today, today);
}

export type ReportPeriod = 'today' | 'week' | 'month';
const PERIOD_DAYS: Record<ReportPeriod, number> = { today: 1, week: 7, month: 30 };

/** 기간 칩 → [시작, 끝] 한국 날짜 (양 끝 포함) */
export function periodRange(period: ReportPeriod, now = new Date()): { from: string; to: string } {
  const from = new Date(now.getTime() - (PERIOD_DAYS[period] - 1) * 86_400_000);
  return { from: toKstDateString(from), to: toKstDateString(now) };
}
