import { toAppError } from '@/shared/lib/errors';

import { dayLabel, toHHMM } from './time';

import type { Schedule } from './types';

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
