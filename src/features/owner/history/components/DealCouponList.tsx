import { Badge } from '../../components/ui/Badge';
import { formatClock } from '../../lib/format';

import type { DealCouponRow } from '../api';

/** O12 "이 딜의 사용 내역" — 사용 완료된 쿠폰의 확인번호와 시각 */
export function DealCouponList({ coupons }: { coupons: DealCouponRow[] }) {
  const used = coupons.filter((coupon) => coupon.status === 'used' && coupon.usedAt);
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">이 딜의 사용 내역</h2>
        <Badge tone="success" withDot>
          실시간
        </Badge>
      </div>
      {used.length === 0 ? (
        <p className="rounded-field bg-gray p-4 text-center text-sm text-muted">
          아직 사용된 쿠폰이 없어요
        </p>
      ) : (
        <ul className="space-y-2">
          {used.map((coupon) => (
            <li
              key={coupon.id}
              className="flex items-center justify-between rounded-field border border-line px-4 py-3"
            >
              <span className="flex items-center gap-4">
                <b className="font-mono text-lg tracking-wider">{coupon.confirmNumber}</b>
                <span className="text-sm text-muted">
                  {coupon.usedAt && formatClock(coupon.usedAt)}
                </span>
              </span>
              <span className="text-sm text-accent">사용 완료</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
