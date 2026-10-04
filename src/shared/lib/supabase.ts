import { createClient } from '@supabase/supabase-js';

import { env } from '@/shared/lib/env';
import type { Database } from '@/shared/types/database';

// 앱 전체에서 이 인스턴스 하나만 쓴다
export const supabase = createClient<Database>(env.supabaseUrl, env.supabasePublishableKey, {
  // PKCE + detectSessionInUrl: /auth/callback?code=... 로 돌아오면 클라이언트가 자동으로 세션으로 바꾼다.
  // 콜백 페이지에서 exchangeCodeForSession을 또 부르면 코드를 두 번 써서 실패하므로 부르지 않는다
  auth: { flowType: 'pkce', detectSessionInUrl: true, persistSession: true },
});
