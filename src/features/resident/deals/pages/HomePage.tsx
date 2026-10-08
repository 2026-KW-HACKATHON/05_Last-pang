import { useState } from 'react';
import { Navigate } from 'react-router-dom';

import { DEFAULT_RADIUS_M } from '@/shared/constants/domain';
import { useGeolocation } from '@/shared/hooks/useGeolocation';
import { useNow } from '@/shared/hooks/useNow';
import { WOLGYE1_CENTER } from '@/shared/lib/geo';

import { ResidentTabBar } from '../../navigation/components/ResidentTabBar';
import { BaseLocationPrompt } from '../../preferences/components/BaseLocationPrompt';
import { useMyPreferences, useUpdatePreferences } from '../../preferences/hooks';
import { useMyProfile } from '../../profile/hooks';
import { CategoryChips } from '../components/CategoryChips';
import { HomeDealSection } from '../components/HomeDealSection';
import { HomeErrorState } from '../components/HomeErrorState';
import { HomeGreeting } from '../components/HomeGreeting';
import { HomeHeader } from '../components/HomeHeader';
import { HomeSkeleton } from '../components/HomeSkeleton';
import { LocationOffCard } from '../components/LocationOffCard';
import { NeighborhoodSheet } from '../components/NeighborhoodSheet';
import { PopularDealList } from '../components/PopularDealList';
import { ViewSettingsSheet } from '../components/ViewSettingsSheet';
import { sortDeals } from '../dealStatus';
import { useRecommendedDeals } from '../hooks';
import { useHomeFilters } from '../useHomeFilters';

import type { DealSort } from '../types';

const LOCATION_OFF_RADIUS_M = 1500; // 위치를 모르면 기준 위치에서 넓게 (피그마 R6 위치 꺼짐)

export function HomePage() {
  const [openSheet, setOpenSheet] = useState<'settings' | 'neighborhood' | null>(null);
  const [isBaseMode, setIsBaseMode] = useState(false); // "기준 위치로 보기"를 눌렀는지
  const { category, sort, setCategory, setSort } = useHomeFilters();
  const geo = useGeolocation();
  const profile = useMyProfile();
  const preferences = useMyPreferences();
  const updatePreferences = useUpdatePreferences();
  const nowMs = useNow(60_000);

  // 위치를 모르면 내 기준 위치(없으면 월계1동 중심)에서 넓게 찾고, 거리는 보여주지 않는다
  const isLocationOff = geo.isFallback && !geo.isLoading;
  const radiusM = preferences.data?.radiusM ?? DEFAULT_RADIUS_M;
  const { baseLat, baseLng } = preferences.data ?? {};
  const base = baseLat != null && baseLng != null ? { lat: baseLat, lng: baseLng } : WOLGYE1_CENTER;
  const origin = isLocationOff ? base : geo;
  const deals = useRecommendedDeals(
    origin.lat,
    origin.lng,
    isLocationOff ? LOCATION_OFF_RADIUS_M : radiusM,
    !geo.isLoading && !(isLocationOff && preferences.isPending),
  );
  const filteredDeals = (deals.data ?? []).filter(
    (deal) => !category || deal.category === category,
  );

  const handleSettingsApply = (nextRadiusM: number, nextSort: DealSort) => {
    setSort(nextSort);
    if (!isLocationOff && nextRadiusM !== radiusM)
      updatePreferences.mutate({ radiusM: nextRadiusM });
    setOpenSheet(null);
  };
  const handleRequestLocation = () => {
    setOpenSheet(null);
    geo.requestPosition();
  };

  // 동의를 마치지 않은 주민은 온보딩부터 (seed 계정은 동의 시각이 들어 있다)
  if (profile.data && !profile.data.agreedTermsAt) {
    return <Navigate to="/onboarding/consent" replace />;
  }

  const isLoading = geo.isLoading || deals.isPending;
  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-surface">
      <HomeHeader
        radiusM={radiusM}
        onNeighborhoodClick={() => setOpenSheet('neighborhood')}
        onRadiusClick={() => setOpenSheet('settings')}
      />
      {isLoading && <HomeSkeleton />}
      {!isLoading && deals.isError && (
        <HomeErrorState error={deals.error} onRetry={() => void deals.refetch()} />
      )}
      {!isLoading && deals.isSuccess && (
        <>
          <div className="px-5 pt-4">
            <HomeGreeting
              nickname={profile.data?.nickname ?? null}
              onSettingsClick={() => setOpenSheet('settings')}
            />
            <BaseLocationPrompt className="mt-4 mb-3" />
            <CategoryChips selected={category} onSelect={setCategory} />
          </div>
          {isLocationOff && !isBaseMode ? (
            <>
              <div className="px-5 pt-5">
                <LocationOffCard
                  isRequesting={geo.isLoading}
                  onRequest={geo.requestPosition}
                  onUseBase={() => setIsBaseMode(true)}
                />
              </div>
              <PopularDealList deals={filteredDeals} nowMs={nowMs} />
            </>
          ) : (
            <HomeDealSection
              deals={sortDeals(filteredDeals, sort)}
              sort={sort}
              isDistanceKnown={!isLocationOff}
              nowMs={nowMs}
              onSettingsClick={() => setOpenSheet('settings')}
            />
          )}
        </>
      )}

      <ResidentTabBar />
      {openSheet === 'settings' && (
        <ViewSettingsSheet
          radiusM={radiusM}
          sort={sort}
          isLocationOff={isLocationOff}
          onRequestLocation={handleRequestLocation}
          onApply={handleSettingsApply}
          onClose={() => setOpenSheet(null)}
        />
      )}
      {openSheet === 'neighborhood' && <NeighborhoodSheet onClose={() => setOpenSheet(null)} />}
    </main>
  );
}
