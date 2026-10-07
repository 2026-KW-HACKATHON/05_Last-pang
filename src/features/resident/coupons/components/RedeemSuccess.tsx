import { formatPrice } from '@/shared/lib/format';
import { Mascot } from '@/shared/ui/Mascot';

import { toConfirmNumber } from '../couponStatus';

import type { MyCoupon } from '../types';

interface RedeemSuccessProps {
  coupon: MyCoupon;
  usedAt: string;
}

// "2026.10.06 (화) 14:23:08" — 사장님이 지금 사용한 화면인지 시각으로 확인한다
const formatUsedAt = (iso: string) => {
  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(iso));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';
  return `${part('year')}.${part('month')}.${part('day')} (${part('weekday')}) ${part('hour')}:${part('minute')}:${part('second')}`;
};

// 사용 완료 (피그마 R9). 확인번호는 서버 redeem_coupon과 같은 규칙으로 만든다
export function RedeemSuccess({ coupon, usedAt }: RedeemSuccessProps) {
  const rows = [
    { label: '가게', value: coupon.storeName },
    { label: '혜택', value: coupon.title },
    { label: '정상가', value: formatPrice(coupon.originalPrice) },
    { label: '결제할 금액', value: formatPrice(coupon.dealPrice) },
  ];

  return (
    <section className="flex flex-col items-center pt-4">
      <Mascot pose="heart" size={104} />
      <h2 className="mt-3 text-2xl font-bold">쿠폰을 사용했어요</h2>
      <p className="mt-2 text-muted">사장님께 이 화면을 보여주세요</p>
      <div className="mt-5 w-full rounded-card bg-accent-tint py-5 text-center">
        <p className="text-sm text-muted">확인번호</p>
        <p className="my-1 text-[40px] font-bold tracking-wide text-accent">
          {toConfirmNumber(coupon.id)}
        </p>
        <p className="flex items-center justify-center gap-2 text-sm font-semibold">
          <span className="size-2 animate-pulse rounded-full bg-success" />
          {formatUsedAt(usedAt)}
        </p>
      </div>
      <dl className="mt-4 w-full space-y-2 rounded-card p-4 text-sm ring-1 ring-line">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between">
            <dt className="text-muted">{row.label}</dt>
            <dd className={row.label === '결제할 금액' ? 'font-bold' : ''}>{row.value}</dd>
          </div>
        ))}
        <div className="flex justify-between border-t border-line pt-2">
          <dt className="text-muted">아낀 금액</dt>
          <dd className="font-bold text-accent">
            {formatPrice(coupon.originalPrice - coupon.dealPrice)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
