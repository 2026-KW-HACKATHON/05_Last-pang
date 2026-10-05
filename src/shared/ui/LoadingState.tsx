// 데이터를 기다리는 동안 카드 모양 자리만 보여준다 (화면 4상태 중 로딩, 컨벤션 9장)
export function LoadingState() {
  return (
    <div className="space-y-3 p-4" aria-busy="true" aria-label="불러오는 중">
      <div className="h-24 animate-pulse rounded-card bg-muted/20" />
      <div className="h-24 animate-pulse rounded-card bg-muted/20" />
      <div className="h-24 animate-pulse rounded-card bg-muted/20" />
    </div>
  );
}
