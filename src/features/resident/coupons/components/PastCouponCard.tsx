import { Link } from 'react-router-dom';

import { formatKstTime } from '@/shared/lib/time';

import { toConfirmNumber, toDisplayStatus } from '../couponStatus';

import type { MyCoupon } from '../types';

interface PastCouponCardProps {
  coupon: MyCoupon;
  nowMs: number;
}

// 지난 쿠폰 한 장: 사용 완료(확인번호 · 시각) · 만료 · 사용 불가 · 소진 (R11 · R8-2)
export function PastCouponCard({ coupon, nowMs }: PastCouponCardProps) {
  const status = toDisplayStatus(coupon, nowMs);
  const isUsed = status === 'used' && coupon.usedAt !== null;

  const toPill = () => {
    if (isUsed) return { label: '사용 완료', className: 'bg-success text-white' };
    if (status === 'soldOut') return { label: '사용 불가 · 소진', className: 'bg-gray text-muted' };
    return { label: '만료', className: 'bg-gray text-muted' };
  };
  const toMeta = () => {
    if (isUsed && coupon.usedAt) {
      return `확인번호 ${toConfirmNumber(coupon.id)} · ${formatKstTime(coupon.usedAt)}`;
    }
    if (status === 'soldOut') {
      return `${formatKstTime(coupon.dealSoldOutAt ?? coupon.expiresAt)} 소진`;
    }
    return `${formatKstTime(coupon.expiresAt)} 만료`;
  };
  const pill = toPill();

  return (
    <Link to={`/coupons/${coupon.id}`} className="block rounded-card p-4 ring-1 ring-line">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate font-bold">{coupon.storeName}</p>
        <span className={`shrink-0 rounded-pill px-2.5 py-0.5 text-xs font-bold ${pill.className}`}>
          {pill.label}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">{coupon.title}</p>
      <p className={`mt-1 text-sm ${isUsed ? 'text-ink' : 'text-faint'}`}>{toMeta()}</p>
    </Link>
  );
}
