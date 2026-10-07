import { toKstDateString } from '@/shared/lib/time';

import { PastCouponCard } from './PastCouponCard';

import type { MyCoupon } from '../types';

interface PastCouponListProps {
  coupons: MyCoupon[];
}

const toDateLabel = (kstDate: string, todayKstDate: string) => {
  if (kstDate === todayKstDate) return '오늘';
  const [, month, day] = kstDate.split('-');
  return `${Number(month)}월 ${Number(day)}일`;
};

// 받은 날짜(한국 시각)별로 묶어 최신순으로 보여준다
export function PastCouponList({ coupons }: PastCouponListProps) {
  const todayKstDate = toKstDateString(new Date());
  const groups = new Map<string, MyCoupon[]>();
  for (const coupon of coupons) {
    const kstDate = toKstDateString(new Date(coupon.usedAt ?? coupon.expiresAt));
    groups.set(kstDate, [...(groups.get(kstDate) ?? []), coupon]);
  }

  return (
    <div className="space-y-5">
      {[...groups.entries()].map(([kstDate, items]) => (
        <section key={kstDate}>
          <h2 className="mb-2 text-sm font-semibold text-sub">
            {toDateLabel(kstDate, todayKstDate)}
          </h2>
          <ul className="space-y-3">
            {items.map((coupon) => (
              <li key={coupon.id}>
                <PastCouponCard coupon={coupon} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
