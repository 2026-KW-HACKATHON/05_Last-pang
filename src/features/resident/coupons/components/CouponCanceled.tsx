import { Icon } from '@/shared/ui/Icon';
import { Mascot } from '@/shared/ui/Mascot';

import type { MyCoupon } from '../types';

interface CouponCanceledProps {
  coupon: MyCoupon;
}

// 사장님·운영자가 딜을 일찍 종료해 서버가 쿠폰을 취소한 경우
export function CouponCanceled({ coupon }: CouponCanceledProps) {
  return (
    <section className="flex flex-col items-center pt-16 text-center">
      <Mascot pose="rice" size={128} />
      <h2 className="mt-4 text-xl font-bold">쿠폰이 취소됐어요</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {coupon.dealCloseReason === 'owner' ? '가게 사정으로 딜이 일찍 종료돼' : '딜이 종료돼'}
        <br />
        받은 쿠폰을 쓸 수 없게 됐어요.
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
          취소됨
        </span>
      </div>
    </section>
  );
}
