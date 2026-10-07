import { toAppError } from '@/shared/lib/errors';

import { dayLabel, formatDays, leadLabel, toHHMM, toMinutes } from './time';

import type { AlertPreviewItem, AlertSlot, Schedule } from './types';

/** 받침 유무로 조사를 고른다 ('공강'과 / '요가'와) */
export function withJosa(word: string, withBatchim: string, withoutBatchim: string): string {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  const hasBatchim = code >= 0 && code <= 11171 && code % 28 !== 0;
  return `'${word}'${hasBatchim ? withBatchim : withoutBatchim}`;
}

export function overlapMessage(schedule: Schedule, dow: number): string {
  const range = `${toHHMM(schedule.startMin)}~${toHHMM(schedule.endMin)}`;
  return `${dayLabel(dow)}요일 ${range} ${withJosa(schedule.name, '과', '와')} 시간이 겹쳐요`;
}

export const OVERLAP_HINT = '겹치지 않게 시간을 바꾸거나 기존 항목을 수정해 주세요.';

/** 저장 실패 문구. 겹침은 시간표 말투로 바꾼다 */
export function saveErrorMessage(error: unknown): string {
  const appError = toAppError(error);
  return appError.code === 'TIME_OVERLAP' ? '다른 일정과 시간이 겹쳐요' : appError.message;
}

export function firstOutingMessage(days: number[], startMin: number, leadMin: number): string {
  const alertAt = toHHMM(startMin - leadMin);
  return `${formatDays(days)}요일은 이 일정이 첫 외출이 돼요. ${leadLabel(leadMin)} 전(${alertAt})에 근처 딜을 먼저 알려드려요`;
}

const SHORT_SLOT_LABELS: Record<AlertSlot, string> = {
  morning: '외출 전',
  lunch: '점심',
  dinner: '저녁',
};

export function shortSlotLabel(slot: AlertSlot): string {
  return SHORT_SLOT_LABELS[slot];
}

/** '저녁 · 일정 끝나고'는 끝난 일정 이름으로 ('알바 끝나고') */
export function alertLabel(item: AlertPreviewItem, todaySchedules: Schedule[]): string {
  if (!item.label.includes('일정 끝나고')) return item.label;
  const ended = todaySchedules.find((schedule) => schedule.endMin === toMinutes(item.at));
  return ended ? `${ended.name} 끝나고` : item.label;
}
