import { Link } from 'react-router-dom';

import { CATEGORIES } from '@/shared/constants/domain';
import { walkingMinutes } from '@/shared/lib/geo';
import { calculateDiscountRate, formatPrice } from '@/shared/lib/format';
import { formatKstTime } from '@/shared/lib/time';
import { Icon } from '@/shared/ui/Icon';

import { isEndingSoon } from '../dealStatus';
import { CategoryIcon } from './CategoryIcon';

import type { DealSummary } from '../types';

interface DealCardProps {
  deal: DealSummary;
  isDistanceKnown: boolean;
  nowMs: number;
}

// 홈 목록의 진행 중 딜 카드 (피그마 R6 기본)
export function DealCard({ deal, isDistanceKnown, nowMs }: DealCardProps) {
  const categoryLabel = CATEGORIES.find((category) => category.value === deal.category)?.label;
  const discountRate = calculateDiscountRate(deal.originalPrice, deal.dealPrice);

  return (
    <Link
      to={`/deals/${deal.dealId}`}
      className="block rounded-card bg-surface p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-line"
    >
      <div className="flex gap-3">
        <CategoryIcon category={deal.category} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
            <span className="truncate">{deal.storeName}</span>
            <span className="rounded-md px-1.5 py-0.5 text-xs ring-1 ring-line">
              {categoryLabel}
            </span>
            {isEndingSoon(deal.endsAt, nowMs) && (
              <span className="rounded-md bg-accent-tint px-1.5 py-0.5 text-xs text-accent">
                마감임박
              </span>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-[17px] font-semibold">{deal.title}</p>
        </div>
      </div>
      <p className="mt-3 flex items-baseline gap-2">
        <span className="text-lg font-bold text-accent">{discountRate}%</span>
        <span className="text-xl font-bold">{formatPrice(deal.dealPrice)}</span>
        <span className="text-sm text-faint line-through">{formatPrice(deal.originalPrice)}</span>
      </p>
      <div className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-sm text-muted">
        <Icon name="walk" size={16} />
        <span className="flex-1">
          {isDistanceKnown
            ? `도보 ${walkingMinutes(deal.distanceM)}분 (${deal.distanceM}m)`
            : '거리 미확인'}
        </span>
        <span className="rounded-pill bg-accent-tint px-2 py-0.5 text-xs font-semibold text-accent">
          남은 쿠폰 {deal.remainingQty}개
        </span>
        <span className="text-xs text-faint">~{formatKstTime(deal.endsAt)}</span>
      </div>
    </Link>
  );
}
