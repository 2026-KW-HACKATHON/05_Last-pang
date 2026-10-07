import { distanceMeters, WOLGYE1_CENTER } from '@/shared/lib/geo';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { PageHeader } from '@/shared/ui/PageHeader';

import { SERVICE_RADIUS_M } from '../../onboarding/currentPosition';
import { readBaseLocationLabel } from '../baseLocationLabel';
import { BaseLocationEditor, type PickedPlace } from '../components/BaseLocationEditor';
import { useMyPreferences } from '../hooks';

import type { Preferences } from '../types';

// 저장된 기준 위치가 없으면 월계1동 중심에서 시작한다
function toInitialPlace({ baseLat, baseLng }: Preferences): PickedPlace {
  if (baseLat === null || baseLng === null)
    return { ...WOLGYE1_CENTER, name: '월계1동', isInside: true };
  const distance = distanceMeters(baseLat, baseLng, WOLGYE1_CENTER.lat, WOLGYE1_CENTER.lng);
  return {
    lat: baseLat,
    lng: baseLng,
    name: readBaseLocationLabel() ?? '설정한 위치',
    isInside: distance <= SERVICE_RADIUS_M,
  };
}

// 기준 위치 (피그마 R4-1) — 내 정보·좋아하는 가게·거리에서 "변경"으로 들어온다
export function BaseLocationPage() {
  const preferences = useMyPreferences();

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-surface">
      <PageHeader title="기준 위치" hasBack />
      {preferences.isPending && <LoadingState />}
      {preferences.isError && (
        <ErrorState error={preferences.error} onRetry={() => void preferences.refetch()} />
      )}
      {preferences.data && <BaseLocationEditor initial={toInitialPlace(preferences.data)} />}
    </main>
  );
}
