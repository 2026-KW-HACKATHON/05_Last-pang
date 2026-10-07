const BAR = 'animate-pulse rounded-pill bg-gray';

// 홈 첫 로딩 (피그마 R6 로딩): 인사 · 업종 칩 · 카드 3장 자리
export function HomeSkeleton() {
  return (
    <div className="px-5 pt-4" aria-busy="true" aria-label="월계1동 타임딜을 찾고 있어요">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className={`h-4 w-36 ${BAR}`} />
          <div className={`h-3 w-24 ${BAR}`} />
        </div>
        <div className="size-8 animate-pulse rounded-full bg-gray" />
      </div>
      <div className="mt-4 flex gap-2">
        {[12, 14, 16, 16, 14].map((width, index) => (
          <div key={index} className={`h-8 ${BAR}`} style={{ width: `${width * 4}px` }} />
        ))}
      </div>
      <div className="mt-6 mb-3 flex justify-between">
        <div className={`h-4 w-24 ${BAR}`} />
        <div className={`h-3 w-10 ${BAR}`} />
      </div>
      <ul className="space-y-3">
        {[0, 1, 2].map((key) => (
          <li key={key} className="rounded-card p-4 ring-1 ring-line">
            <div className="flex gap-3">
              <div className="size-12 animate-pulse rounded-xl bg-gray" />
              <div className="flex-1 space-y-2 pt-1">
                <div className={`h-3.5 w-3/5 ${BAR}`} />
                <div className={`h-3 w-2/5 ${BAR}`} />
              </div>
            </div>
            <div className={`mt-4 h-4 w-1/2 ${BAR}`} />
            <div className="mt-4 flex justify-between border-t border-line pt-3">
              <div className={`h-3 w-1/3 ${BAR}`} />
              <div className={`h-3 w-12 ${BAR}`} />
            </div>
          </li>
        ))}
      </ul>
      <p className="flex items-center justify-center gap-2 pt-8 text-sm text-muted">
        <span className="size-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        월계1동 타임딜을 찾고 있어요...
      </p>
    </div>
  );
}
