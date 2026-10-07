const ROWS = [0, 1, 2];

// 목록 불러오는 중 (C9). 카드 모양 자리 + 안내 문구
export function CouponListSkeleton() {
  return (
    <div className="px-5 pt-5" aria-busy="true">
      <ul className="space-y-3">
        {ROWS.map((row) => (
          <li key={row} className="flex items-center gap-3 rounded-card p-4 ring-1 ring-line">
            <span className="size-12 shrink-0 animate-pulse rounded-[12px] bg-gray" />
            <span className="flex-1 space-y-2">
              <span className="block h-3.5 w-3/5 animate-pulse rounded-pill bg-gray" />
              <span className="block h-3 w-2/5 animate-pulse rounded-pill bg-gray" />
            </span>
            <span className="h-7 w-14 animate-pulse rounded-pill bg-gray" />
          </li>
        ))}
      </ul>
      <p className="flex flex-col items-center gap-3 pt-6 text-sm text-faint">
        <span className="size-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        쿠폰을 불러오고 있어요
      </p>
    </div>
  );
}
