import { z } from 'zod';

import { DEFAULT_RADIUS_M } from '@/shared/constants/domain';
import { categorySchema, timeSlotSchema } from '@/shared/lib/domainSchema';
import { fetchCurrentUserId } from '@/shared/lib/currentUser';
import { AppError, toAppError } from '@/shared/lib/errors';
import { supabase } from '@/shared/lib/supabase';

import type { Preferences } from './types';

const preferencesRowSchema = z.object({
  active_days: z.array(z.number()),
  time_slots: z.array(timeSlotSchema),
  categories: z.array(categorySchema),
  radius_m: z.number(),
  base_lat: z.number().nullable(),
  base_lng: z.number().nullable(),
});

// 행이 없을 때 쓰는 값. DB 컬럼 기본값과 같다 (create_core_tables)
const DEFAULT_PREFERENCES: Preferences = {
  activeDays: [0, 1, 2, 3, 4, 5, 6],
  timeSlots: ['morning', 'lunch', 'afternoon', 'evening'],
  categories: ['meal', 'cafe', 'bakery', 'snack'],
  radiusM: DEFAULT_RADIUS_M,
  baseLat: null,
  baseLng: null,
};

export async function fetchMyPreferences(): Promise<Preferences> {
  const userId = await fetchCurrentUserId();
  const { data, error } = await supabase
    .from('resident_preferences')
    .select('active_days, time_slots, categories, radius_m, base_lat, base_lng')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw toAppError(error);
  if (!data) return DEFAULT_PREFERENCES;
  const row = preferencesRowSchema.safeParse(data);
  if (!row.success) throw new AppError('UNKNOWN');
  return {
    activeDays: row.data.active_days,
    timeSlots: row.data.time_slots,
    categories: row.data.categories,
    radiusM: row.data.radius_m,
    baseLat: row.data.base_lat,
    baseLng: row.data.base_lng,
  };
}

/** 바꾼 값만 보낸다. 행이 없으면 만들고(나머지는 DB 기본값), 있으면 그 값만 바꾼다 */
export async function updatePreferences(changes: Partial<Preferences>): Promise<void> {
  const userId = await fetchCurrentUserId();
  const { error } = await supabase.from('resident_preferences').upsert({
    user_id: userId,
    active_days: changes.activeDays,
    time_slots: changes.timeSlots,
    categories: changes.categories,
    radius_m: changes.radiusM,
    base_lat: changes.baseLat,
    base_lng: changes.baseLng,
    updated_at: new Date().toISOString(),
  });
  if (error) throw toAppError(error);
}
