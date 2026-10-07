import { z } from 'zod';

import { fetchCurrentUserId } from '@/shared/lib/currentUser';
import { AppError, toAppError } from '@/shared/lib/errors';
import { supabase } from '@/shared/lib/supabase';

import type { ConsentInput, MyProfile } from './types';

const profileRowSchema = z.object({
  nickname: z.string().nullable(),
  agreed_terms_at: z.string().nullable(),
  agreed_location_at: z.string().nullable(),
  agreed_push_at: z.string().nullable(),
});

/** 운영자는 RLS상 profiles 전체를 읽을 수 있으므로 본인 id로 거른다 (합의 1-2) */
export async function fetchMyProfile(): Promise<MyProfile> {
  const userId = await fetchCurrentUserId();
  const { data, error } = await supabase
    .from('profiles')
    .select('nickname, agreed_terms_at, agreed_location_at, agreed_push_at')
    .eq('id', userId)
    .single();
  if (error) throw toAppError(error);
  const row = profileRowSchema.safeParse(data);
  if (!row.success) throw new AppError('UNKNOWN');
  return {
    nickname: row.data.nickname,
    agreedTermsAt: row.data.agreed_terms_at,
    agreedLocationAt: row.data.agreed_location_at,
    agreedPushAt: row.data.agreed_push_at,
  };
}

export async function updateNickname(nickname: string): Promise<void> {
  const userId = await fetchCurrentUserId();
  const { error } = await supabase.from('profiles').update({ nickname }).eq('id', userId);
  if (error) throw toAppError(error);
}

/** 필수 동의 시각을 남기고, 선택 동의는 체크한 것만 시각을 남긴다 (체크 해제 = null) */
export async function updateConsents({ hasLocationConsent, hasPushConsent }: ConsentInput) {
  const userId = await fetchCurrentUserId();
  const now = new Date().toISOString();
  const { error } = await supabase
    .from('profiles')
    .update({
      agreed_terms_at: now,
      agreed_location_at: hasLocationConsent ? now : null,
      agreed_push_at: hasPushConsent ? now : null,
    })
    .eq('id', userId);
  if (error) throw toAppError(error);
}
