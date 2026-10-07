import { Link } from 'react-router-dom';

import { formatKstTime } from '@/shared/lib/time';

import { toConfirmNumber } from '../couponStatus';

import type { MyCoupon } from '../types';

interface PastCouponCardProps {
  coupon: MyCoupon;
}

// 사용 완료(확인번호 · 사용 시각) 또는 만료(만료 시각)
export function PastCouponCard({ coupon }: PastCouponCardProps) {
  const isUsed = coupon.status === 'used' && coupon.usedAt;

  return (
    <Link to={`/coupons/${coupon.id}`} className="block rounded-card p-4 ring-1 ring-line">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold">{coupon.storeName}</p>
        <span
          className={`rounded-pill px-2.5 py-0.5 text-xs font-bold ${isUsed ? 'bg-success text-white' : 'bg-gray text-muted'}`}
        >
          {isUsed ? '사용 완료' : '만료'}
        </span>
      </div>
      <p className="mt-1 text-muted">{coupon.title}</p>
      <p className={`mt-2 text-sm ${isUsed ? '' : 'text-faint'}`}>
        {coupon.usedAt
          ? `확인번호 ${toConfirmNumber(coupon.id)} · ${formatKstTime(coupon.usedAt)}`
          : `${formatKstTime(coupon.expiresAt)} 만료`}
      </p>
    </Link>
  );
}
