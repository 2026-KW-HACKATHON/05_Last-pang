import { EmptyState } from '@/shared/ui/EmptyState';
import { Icon } from '@/shared/ui/Icon';

import { DealList } from './DealList';

import type { DealSort, DealSummary } from '../types';

const SORT_LABELS: Record<DealSort, string> = {
  distance: '가까운 순',
  ending: '마감 임박 순',
  discount: '할인 많은 순',
};

interface HomeDealSectionProps {
  deals: DealSummary[]; // 업종으로 거르고 정렬까지 마친 목록
  sort: DealSort;
  isDistanceKnown: boolean;
  nowMs: number;
  onSettingsClick: () => void;
}

// 홈 딜 목록, 비어 있으면 빈 상태 (피그마 R6 기본 · 빈 상태)
export function HomeDealSection(props: HomeDealSectionProps) {
  const { deals, sort, isDistanceKnown, nowMs, onSettingsClick } = props;

  if (deals.length === 0) {
    return (
      <EmptyState
        title="지금 근처에 진행 중인 딜이 없어요"
        description="새로운 타임딜이 열리면 가장 먼저 알려드릴게요"
        action={
          <button
            type="button"
            onClick={onSettingsClick}
            className="flex items-center gap-1.5 rounded-pill px-4 py-2 text-sm font-semibold shadow-sm ring-1 ring-line"
          >
            <Icon name="compass" size={16} className="text-accent" />
            걸을 거리 넓히기 ›
          </button>
        }
      />
    );
  }
  return (
    <DealList
      deals={deals}
      sortLabel={SORT_LABELS[sort]}
      isDistanceKnown={isDistanceKnown}
      nowMs={nowMs}
      onSortClick={onSettingsClick}
    />
  );
}
