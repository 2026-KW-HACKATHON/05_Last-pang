import { Link } from 'react-router-dom';

import { calculateDiscountRate, formatPrice } from '@/shared/lib/format';

import { isEndingSoon } from '../dealStatus';
import { CategoryIcon } from './CategoryIcon';

import type { DealSummary } from '../types';

interface PopularDealItemProps {
  deal: DealSummary;
  nowMs: number;
}

// 위치를 모를 때의 인기 딜 한 줄 (피그마 R6 위치 꺼짐). 거리는 보여주지 않는다
export function PopularDealItem({ deal, nowMs }: PopularDealItemProps) {
  const chip = isEndingSoon(deal.endsAt, nowMs) ? '마감임박' : `수량 ${deal.remainingQty}개`;

  return (
    <Link
      to={`/deals/${deal.dealId}`}
      className="flex items-center gap-3 rounded-card bg-surface p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-line"
    >
      <CategoryIcon category={deal.category} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5">
          <span className="shrink-0 rounded-md bg-accent-tint px-1.5 py-0.5 text-xs text-accent">
            {chip}
          </span>
          <span className="truncate font-semibold">{deal.storeName}</span>
        </p>
        <p className="mt-1 truncate text-sm text-muted">{deal.title}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-xs text-faint line-through">{formatPrice(deal.originalPrice)}</p>
        <p className="font-bold">
          <span className="text-accent">
            {calculateDiscountRate(deal.originalPrice, deal.dealPrice)}%
          </span>{' '}
          <span className="text-accent">{formatPrice(deal.dealPrice)}</span>
        </p>
      </div>
    </Link>
  );
}
