import { z } from 'zod';

import { unwrapRpc } from '@/shared/lib/rpc';
import { supabase } from '@/shared/lib/supabase';

const deleteResultSchema = z.object({ deleted: z.literal(true) });

/** 회원 탈퇴. 본인 데이터는 cascade로 지워지고, 가게가 있으면 운영이 멈춘다 */
export async function deleteMyAccount(): Promise<void> {
  const { data, error } = await supabase.rpc('delete_my_account');
  unwrapRpc(data, error, deleteResultSchema);
}

/** 이미 지워진 계정이라 서버 호출 없이 이 기기의 세션만 지운다. 실패해도 넘어간다 */
export async function signOutLocally(): Promise<void> {
  try {
    await supabase.auth.signOut({ scope: 'local' });
  } catch {
    // 세션이 이미 없으면 무시
  }
}
