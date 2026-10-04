// import.meta.env 값의 타입. 새 VITE_ 변수를 만들면 여기와 .env.example에 함께 추가한다
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_VAPID_PUBLIC_KEY: string;
  readonly VITE_USE_MOCKS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
