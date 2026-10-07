import { POLICY } from '@/shared/constants/policy';
import { Icon } from '@/shared/ui/Icon';

import { pickPopularDeals } from '../dealStatus';
import { PopularDealItem } from './PopularDealItem';

import type { DealSummary } from '../types';

const POPULAR_COUNT = 5;

interface PopularDealListProps {
  deals: DealSummary[];
  nowMs: number;
}

// 위치 없이 보는 인기 딜 목록 (피그마 R6 위치 꺼짐 아래쪽)
export function PopularDealList({ deals, nowMs }: PopularDealListProps) {
  const popularDeals = pickPopularDeals(deals, POPULAR_COUNT);
  if (popularDeals.length === 0) return null;

  return (
    <section className="px-5 pt-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-bold">🔥 지금 {POLICY.neighborhoodName}에서 인기 있는 냠냠</h2>
        <span className="flex items-center gap-0.5 text-xs text-muted">
          <Icon name="lock" size={14} />
          거리 미확인
        </span>
      </div>
      <ul className="space-y-3">
        {popularDeals.map((deal) => (
          <li key={deal.dealId}>
            <PopularDealItem deal={deal} nowMs={nowMs} />
          </li>
        ))}
      </ul>
    </section>
  );
}
