import { fetchCurrentUserId } from '@/shared/lib/currentUser';
import { AppError, toAppError } from '@/shared/lib/errors';
import { supabase } from '@/shared/lib/supabase';

import {
  alertPreviewSchema,
  alertSettingsRowSchema,
  scheduleDraftSchema,
  scheduleRowSchema,
} from './schema';
import { toHHMM, toMinutes } from './time';

import type { AlertPreviewItem, AlertSettings, Schedule, ScheduleDraft } from './types';

// 행이 없을 때 쓰는 값. DB 컬럼 기본값과 같다
const DEFAULT_ALERT_SETTINGS: AlertSettings = {
  morning: true,
  lunch: true,
  dinner: true,
  leadMin: 30,
};

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

/** 오늘부터 7일 동안 보낼 알림 시각 (서버 계산) */
export async function fetchAlertPreview(): Promise<AlertPreviewItem[]> {
  const { data, error } = await supabase.rpc('get_my_alert_preview', {});
  if (error) throw toAppError(error);
  const parsed = alertPreviewSchema.safeParse(data);
  if (!parsed.success) throw new AppError('UNKNOWN');
  return parsed.data;
}

export async function fetchAlertSettings(): Promise<AlertSettings> {
  const userId = await fetchCurrentUserId();
  const { data, error } = await supabase
    .from('resident_preferences')
    .select('alert_morning, alert_lunch, alert_dinner, first_outing_lead_min')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw toAppError(error);
  if (!data) return DEFAULT_ALERT_SETTINGS;
  const row = alertSettingsRowSchema.safeParse(data);
  if (!row.success) throw new AppError('UNKNOWN');
  return {
    morning: row.data.alert_morning,
    lunch: row.data.alert_lunch,
    dinner: row.data.alert_dinner,
    leadMin: row.data.first_outing_lead_min,
  };
}

/** 바꾼 값만 보낸다. 행이 없으면 만들고(나머지는 DB 기본값) */
export async function updateAlertSettings(changes: Partial<AlertSettings>): Promise<void> {
  const userId = await fetchCurrentUserId();
  const { error } = await supabase.from('resident_preferences').upsert({
    user_id: userId,
    alert_morning: changes.morning,
    alert_lunch: changes.lunch,
    alert_dinner: changes.dinner,
    first_outing_lead_min: changes.leadMin,
    updated_at: new Date().toISOString(),
  });
  if (error) throw toAppError(error);
}
