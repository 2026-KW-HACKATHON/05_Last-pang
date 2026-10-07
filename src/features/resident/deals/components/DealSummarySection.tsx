import { walkingMinutes } from '@/shared/lib/geo';
import { calculateDiscountRate, formatPrice } from '@/shared/lib/format';

import type { DealDetail } from '../types';

interface DealSummarySectionProps {
  deal: DealDetail;
  distanceM: number | null; // null = 위치를 몰라 거리를 보여주지 않음
  isDimmed: boolean; // 소진·종료면 가격을 흐리게
}

// 가게 · 제목 · 가격 · 남은 수량 (피그마 R7 기본)
export function DealSummarySection({ deal, distanceM, isDimmed }: DealSummarySectionProps) {
  const discountRate = calculateDiscountRate(deal.originalPrice, deal.dealPrice);

  return (
    <section>
      <p className="flex items-center gap-1.5 text-sm">
        <span className="font-semibold">{deal.storeName}</span>
        {distanceM !== null && (
          <span className="text-muted">
            · 도보 {walkingMinutes(distanceM)}분 ({Math.round(distanceM)}m)
          </span>
        )}
      </p>
      <h2 className="mt-1 text-2xl font-bold">{deal.title}</h2>
      <p className="mt-2 flex items-center gap-2">
        <span className={`text-2xl font-bold ${isDimmed ? 'text-faint' : 'text-accent'}`}>
          {formatPrice(deal.dealPrice)}
        </span>
        <span className="text-faint line-through">{formatPrice(deal.originalPrice)}</span>
        <span className="rounded-md bg-accent-tint px-2 py-0.5 text-xs font-bold text-accent">
          {discountRate}% 할인
        </span>
      </p>
      <div className="mt-4 flex items-center justify-between rounded-xl bg-gray px-4 py-3 text-sm">
        <span className="text-muted">남은 수량</span>
        <span>
          <b className="text-lg text-accent">{deal.remainingQty}</b> / {deal.totalQty}개
        </span>
      </div>
    </section>
  );
}
