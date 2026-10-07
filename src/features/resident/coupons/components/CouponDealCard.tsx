import { CATEGORIES } from '@/shared/constants/domain';
import { formatPrice } from '@/shared/lib/format';

import type { MyCoupon } from '../types';

interface CouponDealCardProps {
  coupon: MyCoupon;
}

// 쿠폰 사용 화면 맨 위 딜 요약 (피그마 R8)
export function CouponDealCard({ coupon }: CouponDealCardProps) {
  const categoryLabel = CATEGORIES.find((category) => category.value === coupon.category)?.label;

  return (
    <section className="rounded-card p-4 ring-1 ring-line">
      <p className="flex items-center gap-2 text-sm text-muted">
        <span className="rounded-md bg-accent-tint px-2 py-0.5 text-xs font-semibold text-accent">
          {categoryLabel}
        </span>
        {coupon.storeName}
      </p>
      <p className="mt-2 text-lg font-bold">{coupon.title}</p>
      <p className="mt-1 flex items-baseline gap-2">
        <span className="text-xl font-bold text-accent">{formatPrice(coupon.dealPrice)}</span>
        <span className="text-sm text-faint line-through">{formatPrice(coupon.originalPrice)}</span>
      </p>
    </section>
  );
}
