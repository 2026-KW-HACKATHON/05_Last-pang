import { Link } from 'react-router-dom';

import { formatPrice } from '@/shared/lib/format';
import { formatRemaining } from '@/shared/lib/time';

import { CategoryIcon } from '../../deals/components/CategoryIcon';

import type { MyCoupon } from '../types';

interface AvailableCouponCardProps {
  coupon: MyCoupon;
  nowMs: number;
}

export function AvailableCouponCard({ coupon, nowMs }: AvailableCouponCardProps) {
  const remainingMs = new Date(coupon.expiresAt).getTime() - nowMs;

  return (
    <article className="rounded-card p-4 ring-[1.5px] ring-accent">
      <div className="flex items-center gap-3">
        <CategoryIcon category={coupon.category} />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted">{coupon.storeName}</p>
          <p className="truncate text-lg font-bold">{coupon.title}</p>
          <p className="font-bold text-accent">{formatPrice(coupon.dealPrice)}</p>
        </div>
        <span className="rounded-pill bg-accent-tint px-3 py-1 text-sm font-bold text-accent tabular-nums">
          {formatRemaining(remainingMs)} 남음
        </span>
      </div>
      <Link
        to={`/coupons/${coupon.id}`}
        className="mt-4 flex h-12 items-center justify-center rounded-button bg-accent font-semibold text-white"
      >
        가게에서 사용하기
      </Link>
    </article>
  );
}
