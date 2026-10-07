import { Icon } from '@/shared/ui/Icon';

import { DealCard } from './DealCard';
import { SoldOutDealCard } from './SoldOutDealCard';

import type { DealSummary } from '../types';

interface DealListProps {
  deals: DealSummary[];
  sortLabel: string;
  isDistanceKnown: boolean;
  onSortClick: () => void;
}

export function DealList({ deals, sortLabel, isDistanceKnown, onSortClick }: DealListProps) {
  const activeCount = deals.filter((deal) => deal.remainingQty > 0).length;

  return (
    <section className="px-5">
      <div className="mt-6 mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">
          지금 진행 중 <span className="text-accent">{activeCount}개</span>
        </h2>
        <button
          type="button"
          onClick={onSortClick}
          className="flex items-center gap-0.5 text-sm text-sub"
        >
          {sortLabel}
          <Icon name="sort" size={16} />
        </button>
      </div>
      <ul className="space-y-3">
        {deals.map((deal) => (
          <li key={deal.dealId}>
            {deal.remainingQty > 0 ? (
              <DealCard deal={deal} isDistanceKnown={isDistanceKnown} />
            ) : (
              <SoldOutDealCard deal={deal} isDistanceKnown={isDistanceKnown} />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
