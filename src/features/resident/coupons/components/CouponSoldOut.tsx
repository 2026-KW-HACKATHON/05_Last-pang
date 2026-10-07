import { Icon } from '@/shared/ui/Icon';
import { Mascot } from '@/shared/ui/Mascot';

import type { MyCoupon } from '../types';

interface CouponSoldOutProps {
  coupon: MyCoupon;
}

// 코드 입력 전에 수량이 다 떨어진 경우 (피그마 R8-2)
export function CouponSoldOut({ coupon }: CouponSoldOutProps) {
  return (
    <section className="flex flex-col items-center pt-16 text-center">
      <Mascot pose="rice" size={128} />
      <h2 className="mt-4 text-xl font-bold">준비된 수량이 모두 소진됐어요</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        쿠폰을 받은 뒤 다른 이웃이 먼저 사용해서
        <br />
        오늘 수량이 다 떨어졌어요.
      </p>
      <div className="mt-8 flex w-full items-center gap-3 rounded-card p-4 text-left ring-1 ring-line">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-gray text-muted">
          <Icon name={coupon.category} size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-faint">{coupon.storeName}</p>
          <p className="truncate font-semibold">{coupon.title}</p>
        </div>
        <span className="rounded-pill bg-gray px-2.5 py-0.5 text-xs font-semibold text-muted">
          사용 불가
        </span>
      </div>
    </section>
  );
}
