interface LoadingStateProps {
  label?: string;
}

// 데이터를 기다리는 동안 카드 모양 자리만 보여준다 (화면 4상태 중 로딩, 컨벤션 9장)
export function LoadingState({ label }: LoadingStateProps) {
  return (
    <div className="space-y-3 p-5" aria-busy="true" aria-label={label ?? '불러오는 중'}>
      <div className="h-32 animate-pulse rounded-card bg-cream" />
      <div className="h-32 animate-pulse rounded-card bg-cream" />
      <div className="h-32 animate-pulse rounded-card bg-cream" />
      {label && (
        <p className="flex items-center justify-center gap-2 pt-4 text-sm text-sub">
          <span className="size-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          {label}
        </p>
      )}
    </div>
  );
}
