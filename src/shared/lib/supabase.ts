import { createClient } from '@supabase/supabase-js';

import type { Database } from '@/shared/types/database';

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  throw new Error('.env.local에 VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY를 설정하세요');
}

// 앱 전체에서 이 인스턴스 하나만 쓴다
export const supabase = createClient<Database>(url, publishableKey, {
  // 카카오 로그인 후 /auth/callback?code=... 로 돌아오면 클라이언트가 세션으로 교환한다
  auth: { flowType: 'pkce', detectSessionInUrl: true, persistSession: true },
});
