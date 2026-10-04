// 환경변수를 한 곳에서 검증한다. 다른 파일은 import.meta.env 대신 env를 쓴다
import { z } from 'zod';

// .env.example을 복사하면 빈 값(KEY=)이 ''로 들어오므로 '없음'으로 본다
function optional<T extends z.ZodType>(schema: T) {
  return z.preprocess((value) => (value === '' ? undefined : value), schema.optional());
}

const rawEnvSchema = z.object({
  VITE_SUPABASE_URL: optional(z.url()),
  VITE_SUPABASE_PUBLISHABLE_KEY: optional(z.string()),
  VITE_VAPID_PUBLIC_KEY: optional(z.string()),
  VITE_USE_MOCKS: optional(z.enum(['true', 'false'])),
});

const parsed = rawEnvSchema.safeParse(import.meta.env);
if (!parsed.success) {
  throw new Error(`.env.local 값 형식이 잘못됐어요: ${z.prettifyError(parsed.error)}`);
}
const raw = parsed.data;

// 목업 모드: Supabase 없이 mocks.ts 데이터로 화면만 확인 (로컬 전용, Vercel에는 넣지 않음)
export const isMockMode = raw.VITE_USE_MOCKS === 'true';

if (!isMockMode && (!raw.VITE_SUPABASE_URL || !raw.VITE_SUPABASE_PUBLISHABLE_KEY)) {
  throw new Error(
    '.env.local에 VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY를 넣거나 VITE_USE_MOCKS=true로 설정하세요',
  );
}

export const env = {
  // 목업 모드에서는 클라이언트를 만들기만 하고 호출하지 않으므로 자리표시 값을 쓴다
  supabaseUrl: raw.VITE_SUPABASE_URL ?? 'http://127.0.0.1:54321',
  supabasePublishableKey: raw.VITE_SUPABASE_PUBLISHABLE_KEY ?? 'mock-publishable-key',
  // 웹 푸시(6-1)에서만 필요하다. 그 전까지는 없어도 된다
  vapidPublicKey: raw.VITE_VAPID_PUBLIC_KEY,
} as const;
