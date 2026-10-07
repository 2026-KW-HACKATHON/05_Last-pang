// R17 알림 설정: notification_settings 본인 행 읽기 · upsert
import { fetchCurrentUserId } from '@/shared/lib/currentUser';
import { AppError, toAppError } from '@/shared/lib/errors';
import { supabase } from '@/shared/lib/supabase';

import { notificationSettingsRowSchema } from './schema';

import type { NotificationSettings } from './types';

/** 행이 아직 없을 때의 기본값 (공지만 끔, 방해 금지 22:00~08:00) */
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  dealAlerts: true,
  startAlerts: true,
  notices: false,
  useLocation: true,
  quietEnabled: true,
  quietStart: '22:00',
  quietEnd: '08:00',
};

// DB time "22:00:00" → "22:00"
const toHourMinute = (time: string) => time.slice(0, 5);

export async function fetchNotificationSettings(): Promise<NotificationSettings> {
  const userId = await fetchCurrentUserId();
  const { data, error } = await supabase
    .from('notification_settings')
    .select(
      'deal_alerts, start_alerts, notices, use_location, quiet_enabled, quiet_start, quiet_end',
    )
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw toAppError(error);
  if (!data) return DEFAULT_NOTIFICATION_SETTINGS;
  const row = notificationSettingsRowSchema.safeParse(data);
  if (!row.success) throw new AppError('UNKNOWN');
  return {
    dealAlerts: row.data.deal_alerts,
    startAlerts: row.data.start_alerts,
    notices: row.data.notices,
    useLocation: row.data.use_location,
    quietEnabled: row.data.quiet_enabled,
    quietStart: toHourMinute(row.data.quiet_start),
    quietEnd: toHourMinute(row.data.quiet_end),
  };
}

export async function saveNotificationSettings(settings: NotificationSettings): Promise<void> {
  const userId = await fetchCurrentUserId();
  const { error } = await supabase.from('notification_settings').upsert(
    {
      user_id: userId,
      deal_alerts: settings.dealAlerts,
      start_alerts: settings.startAlerts,
      notices: settings.notices,
      use_location: settings.useLocation,
      quiet_enabled: settings.quietEnabled,
      quiet_start: settings.quietStart,
      quiet_end: settings.quietEnd,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );
  if (error) throw toAppError(error);
}
