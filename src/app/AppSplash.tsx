// C1 앱 시작 · 로그인 상태 확인 중 (manifest 스플래시와 같은 로고·문구)
export function AppSplash() {
  return (
    <main
      className="mx-auto flex min-h-dvh max-w-[480px] flex-col items-center justify-center bg-accent-tint px-6 text-center"
      aria-busy="true"
    >
      <img src="/brand/logo.webp" alt="동네냠냠" width={190} height={75} />
      <p className="mt-3 text-sm text-muted">한산한 가게와 한가한 주민의 시간을 이어줘요</p>
      <span className="mt-16 size-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      <p className="mt-4 text-xs text-faint">잠시만 기다려 주세요</p>
    </main>
  );
}
