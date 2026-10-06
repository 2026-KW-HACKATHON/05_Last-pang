// 한국 날짜 기준 기간 계산 (기기 시간대와 상관없이 KST 자정을 경계로 쓴다)
import { toKstDateString } from '@/shared/lib/time';

const DAY_MS = 86_400_000;

/** 'YYYY-MM-DD'(한국 날짜)의 자정 ISO. 예: "2026-10-06T00:00:00+09:00" */
export const kstMidnightIso = (kstDate: string) => `${kstDate}T00:00:00+09:00`;

/** 'YYYY-MM-DD' 다음 날 (한국 날짜) */
export function nextKstDate(kstDate: string): string {
  return toKstDateString(new Date(new Date(kstMidnightIso(kstDate)).getTime() + DAY_MS));
}

/** 오늘(한국) 자정 ~ 내일 자정 */
export function kstTodayWindow(now = new Date()): { from: string; to: string } {
  const today = toKstDateString(now);
  return { from: kstMidnightIso(today), to: kstMidnightIso(nextKstDate(today)) };
}

/** 양 끝 포함 기간 [from, to] 바로 앞의 같은 길이 기간. 예: 7일 → 그 전 7일 */
export function previousRange(range: { from: string; to: string }): { from: string; to: string } {
  const fromMs = new Date(kstMidnightIso(range.from)).getTime();
  const toMs = new Date(kstMidnightIso(range.to)).getTime();
  const lengthMs = toMs - fromMs + DAY_MS;
  return {
    from: toKstDateString(new Date(fromMs - lengthMs)),
    to: toKstDateString(new Date(fromMs - DAY_MS)),
  };
}

/** 지난 기간 대비 증감률(%). 지난 기간이 0이면 비교할 수 없어 null */
export function changePercent(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}
