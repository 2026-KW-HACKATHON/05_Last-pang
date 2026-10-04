// import.meta.env 값의 타입. 설정하지 않으면 undefined라서 모두 선택 값으로 둔다.
// 실제 검증은 src/shared/lib/env.ts의 zod 스키마가 한다
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly VITE_VAPID_PUBLIC_KEY?: string;
  readonly VITE_USE_MOCKS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
