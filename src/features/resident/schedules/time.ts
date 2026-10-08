import { DAY_LABELS, WEEK_DAYS } from './constants';

import type { FreeRange, FreeTimeItem, Schedule } from './types';

const SEOUL = 'Asia/Seoul';

/** 'HH:MM' 또는 'HH:MM:SS' → 분 */
export function toMinutes(time: string): number {
  const [hour = '0', minute = '0'] = time.split(':');
  return Number(hour) * 60 + Number(minute);
}

/** 분 → 'HH:MM' */
export function toHHMM(minutes: number): string {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/** 서울 기준 오늘 날짜 'YYYY-MM-DD' */
export function todaySeoul(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: SEOUL });
}

/** 'YYYY-MM-DD' → 요일 (0=일) */
export function dowOf(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

/** 요일 배열을 월~일 순으로 '월·수' 처럼 */
export function formatDays(days: number[]): string {
  return WEEK_DAYS.filter((day) => days.includes(day.dow))
    .map((day) => day.label)
    .join('·');
}

export function dayLabel(dow: number): string {
  return DAY_LABELS[dow] ?? '';
}

export function formatRange(startMin: number, endMin: number): string {
  return `${toHHMM(startMin)} – ${toHHMM(endMin)}`;
}

/** 같은 요일·겹치는 시간의 다른 일정 (자기 자신 제외) */
export function findOverlap(
  schedules: Schedule[],
  draft: Pick<Schedule, 'days' | 'startMin' | 'endMin'>,
  excludeId?: string,
): { schedule: Schedule; dow: number } | null {
  for (const schedule of schedules) {
    if (schedule.id === excludeId) continue;
    const dow = WEEK_DAYS.find(
      (day) => draft.days.includes(day.dow) && schedule.days.includes(day.dow),
    )?.dow;
    if (dow === undefined) continue;
    if (schedule.startMin < draft.endMin && draft.startMin < schedule.endMin) {
      return { schedule, dow };
    }
  }
  return null;
}

/** 서버의 비는 시간 → 시간표에 칠할 범위 ('00:00'으로 끝나면 자정) */
export function toFreeRanges(items: FreeTimeItem[]): FreeRange[] {
  return items.map((item) => ({
    dow: dowOf(item.day),
    startMin: toMinutes(item.from),
    endMin: item.to === '00:00' ? 24 * 60 : toMinutes(item.to),
  }));
}

export function formatFreeTime(item: Pick<FreeTimeItem, 'from' | 'to'>): string {
  return `${item.from}~${item.to === '00:00' ? '24:00' : item.to}`;
}
