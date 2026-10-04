// 로그인한 내 id. api.ts에서 본인 행을 지정할 때 쓴다 (합의 2-13)
import { AppError } from './errors';
import { supabase } from './supabase';

export async function fetchCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();
  const userId = data.session?.user.id;
  if (error || !userId) throw new AppError('UNAUTHENTICATED');
  return userId;
}
