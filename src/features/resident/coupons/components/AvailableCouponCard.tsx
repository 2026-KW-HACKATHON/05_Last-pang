import { Link } from 'react-router-dom';

import { formatPrice } from '@/shared/lib/format';
import { formatRemaining } from '@/shared/lib/time';
import { Icon } from '@/shared/ui/Icon';

import type { MyCoupon } from '../types';

interface AvailableCouponCardProps {
  coupon: MyCoupon;
  nowMs: number;
}

// 사용 가능한 쿠폰 카드 (R11). 남은 시간은 서버가 정한 만료 시각 기준
export function AvailableCouponCard({ coupon, nowMs }: AvailableCouponCardProps) {
  const remainingMs = new Date(coupon.expiresAt).getTime() - nowMs;

  return (
    <article className="rounded-card p-4 ring-[1.5px] ring-accent">
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent">
          <Icon name={coupon.category} size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted">{coupon.storeName}</p>
          <p className="truncate font-bold">{coupon.title}</p>
          <p className="font-bold text-accent">{formatPrice(coupon.dealPrice)}</p>
        </div>
        <span className="shrink-0 rounded-pill bg-accent-tint px-2.5 py-1 text-sm font-bold text-accent tabular-nums">
          {formatRemaining(remainingMs)} 남음
        </span>
      </div>
      <Link
        to={`/coupons/${coupon.id}`}
        className="mt-3 flex h-11 items-center justify-center rounded-[12px] bg-accent text-sm font-semibold text-white"
      >
        가게에서 사용하기
      </Link>
    </article>
  );
}
