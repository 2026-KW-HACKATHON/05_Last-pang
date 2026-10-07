import { walkingMinutes } from '@/shared/lib/geo';
import { calculateDiscountRate, formatPrice } from '@/shared/lib/format';
import { formatKstTime } from '@/shared/lib/time';

import type { DealPhase } from '../dealStatus';
import type { DealDetail } from '../types';

interface DealSummarySectionProps {
  deal: DealDetail;
  phase: DealPhase;
  distanceM: number | null; // null = 위치를 몰라 거리를 보여주지 않음
}

// 가게 · 제목 · 가격 · 남은 수량 (피그마 R7 기본, 시작 전이면 "14:00 시작" · 준비 수량)
export function DealSummarySection({ deal, phase, distanceM }: DealSummarySectionProps) {
  const discountRate = calculateDiscountRate(deal.originalPrice, deal.dealPrice);
  const isUpcoming = phase === 'upcoming';
  const isDimmed = phase === 'soldOut' || phase === 'ended' || phase === 'paused';

  return (
    <section>
      <p className="text-sm text-muted">
        {deal.storeName}
        {distanceM !== null && ` · 도보 ${walkingMinutes(distanceM)}분 (${Math.round(distanceM)}m)`}
      </p>
      <h2 className="mt-1 text-2xl font-bold">{deal.title}</h2>
      <p className="mt-2 flex flex-wrap items-center gap-2">
        <span className={`text-2xl font-bold ${isDimmed ? 'text-faint' : 'text-accent'}`}>
          {formatPrice(deal.dealPrice)}
        </span>
        <span className="text-faint line-through">{formatPrice(deal.originalPrice)}</span>
        <span className="rounded-md bg-accent-tint px-2 py-0.5 text-xs font-bold text-accent">
          {discountRate}% 할인
        </span>
        {isUpcoming && (
          <span className="rounded-md bg-ink px-2 py-0.5 text-xs font-bold text-white">
            {formatKstTime(deal.startsAt)} 시작
          </span>
        )}
      </p>
      <div className="mt-4 flex items-center justify-between rounded-[12px] bg-gray px-4 py-3 text-sm">
        <span className="text-muted">{isUpcoming ? '준비 수량' : '남은 수량'}</span>
        {isUpcoming ? (
          <span>
            <b className="text-base">{deal.totalQty}</b>개
          </span>
        ) : (
          <span>
            <b className={`text-base ${isDimmed ? 'text-faint' : 'text-accent'}`}>
              {deal.remainingQty}
            </b>{' '}
            / {deal.totalQty}개
          </span>
        )}
      </div>
    </section>
  );
}
