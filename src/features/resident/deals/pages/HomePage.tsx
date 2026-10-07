import { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

import { CATEGORIES, DEFAULT_RADIUS_M, type Category } from '@/shared/constants/domain';
import { useGeolocation } from '@/shared/hooks/useGeolocation';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Icon } from '@/shared/ui/Icon';
import { LoadingState } from '@/shared/ui/LoadingState';

import { ResidentTabBar } from '../../navigation/components/ResidentTabBar';
import { useMyPreferences, useUpdatePreferences } from '../../preferences/hooks';
import { useMyProfile } from '../../profile/hooks';
import { CategoryChips } from '../components/CategoryChips';
import { DealList } from '../components/DealList';
import { HomeGreeting } from '../components/HomeGreeting';
import { HomeHeader } from '../components/HomeHeader';
import { LocationOffCard } from '../components/LocationOffCard';
import { ViewSettingsSheet } from '../components/ViewSettingsSheet';
import { sortDeals } from '../dealStatus';
import { useRecommendedDeals } from '../hooks';

import type { DealSort } from '../types';

const SORT_LABELS: Record<DealSort, string> = {
  distance: '가까운 순',
  ending: '마감 임박 순',
  discount: '할인 많은 순',
};

const toCategory = (value: string | null) =>
  CATEGORIES.find((category) => category.value === value)?.value ?? null;
const toSort = (value: string | null): DealSort =>
  value === 'ending' || value === 'discount' ? value : 'distance';

export function HomePage() {
  // 필터·정렬은 쿼리스트링에 둔다: 상세에 갔다 돌아와도 그대로 (컨벤션 7장)
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLocationCardHidden, setIsLocationCardHidden] = useState(false);
  const geo = useGeolocation();
  const profile = useMyProfile();
  const preferences = useMyPreferences();
  const updatePreferences = useUpdatePreferences();
  const deals = useRecommendedDeals(geo.lat, geo.lng, !geo.isLoading);

  const category = toCategory(searchParams.get('category'));
  const sort = toSort(searchParams.get('sort'));
  const radiusM = preferences.data?.radiusM ?? DEFAULT_RADIUS_M;
  const visibleDeals = sortDeals(
    (deals.data ?? []).filter((deal) => !category || deal.category === category),
    sort,
  );

  const handleCategorySelect = (next: Category | null) => {
    setSearchParams((prev) => {
      if (next) prev.set('category', next);
      else prev.delete('category');
      return prev;
    });
  };

  const handleSettingsApply = (nextRadiusM: number, nextSort: DealSort) => {
    setSearchParams((prev) => {
      prev.set('sort', nextSort);
      return prev;
    });
    if (nextRadiusM !== radiusM) updatePreferences.mutate({ radiusM: nextRadiusM });
    setIsSettingsOpen(false);
  };

  // 동의를 마치지 않은 주민은 온보딩부터 (seed 계정은 동의 시각이 들어 있다)
  if (profile.data && !profile.data.agreedTermsAt) {
    return <Navigate to="/onboarding/consent" replace />;
  }

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-surface">
      <HomeHeader radiusM={radiusM} onRadiusClick={() => setIsSettingsOpen(true)} />
      <div className="px-5 pt-4">
        <HomeGreeting
          nickname={profile.data?.nickname ?? null}
          onSettingsClick={() => setIsSettingsOpen(true)}
        />
        <CategoryChips selected={category} onSelect={handleCategorySelect} />
      </div>

      {geo.isFallback && !geo.isLoading && !isLocationCardHidden && (
        <div className="px-5 pt-5">
          <LocationOffCard
            isRequesting={geo.isLoading}
            onRequest={geo.requestPosition}
            onDismiss={() => setIsLocationCardHidden(true)}
          />
        </div>
      )}

      {(geo.isLoading || deals.isPending) && (
        <LoadingState label="월계1동 타임딜을 찾고 있어요..." />
      )}
      {deals.isError && (
        <ErrorState
          error={deals.error}
          description="월계동 맛집들의 반짝 타임딜을 불러오지 못했어요."
          onRetry={() => void deals.refetch()}
        />
      )}
      {deals.isSuccess && visibleDeals.length === 0 && (
        <EmptyState
          title="지금 근처에 진행 중인 딜이 없어요"
          description="새로운 타임딜이 열리면 가장 먼저 알려드릴게요"
          action={
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 rounded-pill px-4 py-2 text-sm font-semibold ring-1 ring-line"
            >
              <Icon name="compass" size={16} className="text-accent" />
              걸을 거리 넓히기 ›
            </button>
          }
        />
      )}
      {deals.isSuccess && visibleDeals.length > 0 && (
        <DealList
          deals={visibleDeals}
          sortLabel={SORT_LABELS[sort]}
          isDistanceKnown={!geo.isFallback}
          onSortClick={() => setIsSettingsOpen(true)}
        />
      )}

      <ResidentTabBar />
      {isSettingsOpen && (
        <ViewSettingsSheet
          radiusM={radiusM}
          sort={sort}
          onApply={handleSettingsApply}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </main>
  );
}
