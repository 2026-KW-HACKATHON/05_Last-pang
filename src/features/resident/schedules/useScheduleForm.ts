import { useState } from 'react';

import { scheduleDraftSchema } from './schema';
import { overlapMessage } from './text';
import { findOverlap } from './time';

import type { Schedule, ScheduleDraft } from './types';

/** 추가·고치기 시트 공용: 입력값 + 겹침 검사 + 저장 가능 여부 */
export function useScheduleForm(initial: ScheduleDraft, schedules: Schedule[], editingId?: string) {
  const [draft, setDraft] = useState<ScheduleDraft>(initial);

  const patch = (changes: Partial<ScheduleDraft>) => setDraft((prev) => ({ ...prev, ...changes }));

  // 서버 트리거와 같은 규칙으로 미리 막는다 (서버 거절은 저장 오류로 한 번 더 보여줌)
  const overlap = findOverlap(schedules, draft, editingId);
  const overlapText = overlap ? overlapMessage(overlap.schedule, overlap.dow) : null;
  const isValid = scheduleDraftSchema.safeParse(draft).success && !overlap;

  return { draft, patch, overlapText, isValid };
}
