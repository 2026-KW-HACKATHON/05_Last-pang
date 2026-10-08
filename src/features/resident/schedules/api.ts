import { fetchCurrentUserId } from '@/shared/lib/currentUser';
import { AppError, toAppError } from '@/shared/lib/errors';
import { supabase } from '@/shared/lib/supabase';

import { freeTimesSchema, scheduleDraftSchema, scheduleRowSchema } from './schema';
import { toHHMM, toMinutes } from './time';

import type { FreeTimeItem, Schedule, ScheduleDraft } from './types';

/** DB 트리거의 SCHEDULE_OVERLAP 예외는 TIME_OVERLAP으로 바꾼다 */
function toScheduleError(error: unknown): AppError {
  const message =
    typeof error === 'object' && error !== null && 'message' in error ? String(error.message) : '';
  if (message.includes('SCHEDULE_OVERLAP')) return new AppError('TIME_OVERLAP');
  const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : '';
  if (code === '23514') return new AppError('INVALID_INPUT'); // check 제약 위반
  return toAppError(error);
}

function toRowValues(draft: ScheduleDraft) {
  if (!scheduleDraftSchema.safeParse(draft).success) throw new AppError('INVALID_INPUT');
  return {
    name: draft.name.trim(),
    days: [...draft.days].sort((a, b) => a - b),
    start_time: toHHMM(draft.startMin),
    end_time: toHHMM(draft.endMin),
    kind: draft.kind,
    color: draft.color,
  };
}

export async function fetchMySchedules(): Promise<Schedule[]> {
  const userId = await fetchCurrentUserId();
  const { data, error } = await supabase
    .from('schedules')
    .select('id, name, days, start_time, end_time, kind, color')
    .eq('user_id', userId)
    .order('start_time');
  if (error) throw toAppError(error);
  return data.map((item) => {
    const row = scheduleRowSchema.safeParse(item);
    if (!row.success) throw new AppError('UNKNOWN');
    return {
      id: row.data.id,
      name: row.data.name,
      days: row.data.days,
      startMin: toMinutes(row.data.start_time),
      endMin: toMinutes(row.data.end_time),
      kind: row.data.kind,
      color: row.data.color,
    };
  });
}

export async function createSchedule(draft: ScheduleDraft): Promise<void> {
  const userId = await fetchCurrentUserId();
  const { error } = await supabase
    .from('schedules')
    .insert({ user_id: userId, ...toRowValues(draft) });
  if (error) throw toScheduleError(error);
}

export async function updateSchedule({ id, ...draft }: Schedule): Promise<void> {
  const { error } = await supabase.from('schedules').update(toRowValues(draft)).eq('id', id);
  if (error) throw toScheduleError(error);
}

export async function deleteSchedule(id: string): Promise<void> {
  const { error } = await supabase.from('schedules').delete().eq('id', id);
  if (error) throw toAppError(error);
}

/** 오늘부터 7일 동안의 비는 시간 (서버 계산, 30분 이상만) */
export async function fetchFreeTimes(): Promise<FreeTimeItem[]> {
  const { data, error } = await supabase.rpc('get_my_free_times', {});
  if (error) throw toAppError(error);
  const parsed = freeTimesSchema.safeParse(data);
  if (!parsed.success) throw new AppError('UNKNOWN');
  return parsed.data;
}
