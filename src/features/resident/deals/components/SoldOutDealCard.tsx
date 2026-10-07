import { CATEGORIES } from '@/shared/constants/domain';
import { walkingMinutes } from '@/shared/lib/geo';
import { formatPrice } from '@/shared/lib/format';
import { Icon } from '@/shared/ui/Icon';

import { CategoryIcon } from './CategoryIcon';

import type { DealSummary } from '../types';

interface SoldOutDealCardProps {
  deal: DealSummary;
  isDistanceKnown: boolean;
}

// 수량이 모두 나간 딜: 흐리게, 목록 맨 아래, 눌러도 상세로 가지 않는다 (화면 명세 S03)
export function SoldOutDealCard({ deal, isDistanceKnown }: SoldOutDealCardProps) {
  const categoryLabel = CATEGORIES.find((category) => category.value === deal.category)?.label;

  return (
    <article className="rounded-card bg-gray p-4 text-faint" aria-label={`${deal.title} 소진`}>
      <div className="flex gap-3">
        <CategoryIcon category={deal.category} isMuted />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-sm">
            <span className="truncate">{deal.storeName}</span>
            <span className="rounded-md bg-surface px-1.5 py-0.5 text-xs">{categoryLabel}</span>
            <span className="rounded-md bg-surface px-1.5 py-0.5 text-xs">마감</span>
            <Icon name="lock" size={18} className="ml-auto" />
          </div>
          <p className="mt-1 line-clamp-2 text-[17px] line-through">{deal.title}</p>
        </div>
      </div>
      <p className="mt-3 flex items-baseline gap-2 text-sm">
        <span className="text-base line-through">{formatPrice(deal.dealPrice)}</span>
        오늘 수량 소진
      </p>
      <div className="mt-3 flex justify-between border-t border-line pt-3 text-sm">
        <span>
          {isDistanceKnown
            ? `도보 ${walkingMinutes(deal.distanceM)}분 (${deal.distanceM}m)`
            : '거리 미확인'}
        </span>
        <span>내일 다시 열려요!</span>
      </div>
    </article>
  );
}
