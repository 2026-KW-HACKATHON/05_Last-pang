import { formatPrice } from '@/shared/lib/format';
import { Mascot } from '@/shared/ui/Mascot';

import type { MyCoupon } from '../types';

interface CouponExpiredProps {
  coupon: MyCoupon;
}

// 쿠폰 만료 (피그마 R10). expire_coupons가 수량을 딜에 되돌려 놓는다
export function CouponExpired({ coupon }: CouponExpiredProps) {
  return (
    <section className="flex flex-col items-center pt-10 text-center">
      <Mascot pose="wave" size={112} />
      <h2 className="mt-4 text-2xl font-bold">쿠폰 시간이 지났어요</h2>
      <p className="mt-2 leading-relaxed text-muted">
        쿠폰은 자동으로 반환됐어요.
        <br />
        딜이 남아 있으면 다시 받을 수 있어요.
      </p>
      <div className="mt-6 w-full rounded-card p-4 text-left ring-1 ring-line">
        <div className="flex items-center justify-between">
          <p className="font-bold">{coupon.storeName}</p>
          <span className="rounded-pill bg-gray px-2.5 py-0.5 text-xs font-semibold text-muted">
            만료
          </span>
        </div>
        <p className="mt-1 text-sm text-muted">
          {coupon.title} · {formatPrice(coupon.dealPrice)}
        </p>
      </div>
    </section>
  );
}
