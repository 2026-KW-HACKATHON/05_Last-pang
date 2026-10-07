import type { DealCouponCounts } from '../api';

interface CouponProgressProps {
  totalQty: number;
  /** DB의 남은 수량 (받는 순간 줄고, 시간이 지나 반환되면 다시 늘어난다) */
  remainingQty: number;
  counts: DealCouponCounts | undefined;
}

/** "쿠폰 소진 현황 · 남은 수량 3 / 10개" 막대 (O3 · O12) */
export function CouponProgress({ totalQty, remainingQty, counts }: CouponProgressProps) {
  const goneRate = totalQty > 0 ? ((totalQty - remainingQty) / totalQty) * 100 : 0;
  return (
    <div className="rounded-field bg-gray p-3">
      <div className="flex justify-between text-[13px]">
        <span className="text-muted">쿠폰 소진 현황</span>
        <span className="font-semibold text-accent">
          남은 수량 {remainingQty} / {totalQty}개
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-pill bg-surface">
        <div className="h-full rounded-pill bg-accent" style={{ width: `${goneRate}%` }} />
      </div>
      <div className="mt-2 grid grid-cols-3 text-center text-xs text-muted">
        <span>
          받음 <b className="text-ink">{counts?.claimed ?? 0}</b>
        </span>
        <span>
          사용 완료 <b className="text-ink">{counts?.used ?? 0}</b>
        </span>
        <span>
          미사용 <b className="text-ink">{counts?.pending ?? 0}</b>
        </span>
      </div>
    </div>
  );
}
