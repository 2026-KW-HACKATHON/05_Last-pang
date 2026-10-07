import { useCallback, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { POLICY } from '@/shared/constants/policy';
import { useGeolocation } from '@/shared/hooks/useGeolocation';
import { useNow } from '@/shared/hooks/useNow';
import { toAppError } from '@/shared/lib/errors';
import { distanceMeters } from '@/shared/lib/geo';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Toast } from '@/shared/ui/Toast';

import { ClaimBar } from '../components/ClaimBar';
import { CouponLinkBar } from '../components/CouponLinkBar';
import { DealHeaderActions } from '../components/DealHeaderActions';
import { DealInfoRows } from '../components/DealInfoRows';
import { DealNotFound } from '../components/DealNotFound';
import { DealNotice } from '../components/DealNotice';
import { DealStatusBanner } from '../components/DealStatusBanner';
import { DealSummarySection } from '../components/DealSummarySection';
import { toDealPhase } from '../dealStatus';
import {
  useClaimCoupon,
  useDeal,
  useMyCouponForDeal,
  useMyDailyUsage,
  useRecordDealView,
} from '../hooks';
import { useIsOnline } from '../useIsOnline';

export function DealDetailPage() {
  const { dealId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const deal = useDeal(dealId);
  const myCoupon = useMyCouponForDeal(dealId);
  const dailyUsage = useMyDailyUsage();
  const claim = useClaimCoupon(dealId);
  const geo = useGeolocation();
  const isOnline = useIsOnline();
  const now = useNow();
  useRecordDealView(dealId, searchParams.get('src') === 'push');
  // useNow가 매초 다시 그리므로 Toast의 타이머가 매초 다시 시작되지 않게 같은 함수를 넘긴다
  const handleToastClose = useCallback(() => setToastMessage(null), []);

  // 만료 시각이 지난 쿠폰은 cron이 상태를 바꾸기 전이라도 없는 것으로 본다 (다시 받을 수 있음)
  const activeCoupon =
    myCoupon.data?.status === 'issued' && new Date(myCoupon.data.expiresAt).getTime() <= now
      ? null
      : (myCoupon.data ?? null);
  const header = (
    <PageHeader
      title="딜 상세"
      hasBack
      right={deal.data && <DealHeaderActions deal={deal.data} onToast={setToastMessage} />}
    />
  );

  const handleClaim = () => {
    claim.mutate(undefined, {
      onSuccess: () => {
        const ttlMin = deal.data?.couponTtlMin;
        setToastMessage(`쿠폰을 받았어요! ${ttlMin}분 안에 사용해 주세요`);
      },
    });
  };

  if (deal.isPending || myCoupon.isPending) {
    return (
      <main className="mx-auto min-h-dvh max-w-[480px] bg-surface">
        {header}
        <LoadingState />
      </main>
    );
  }
  if (deal.isError || myCoupon.isError) {
    const isNotFound = deal.isError && toAppError(deal.error).code === 'NOT_FOUND';
    return (
      <main className="mx-auto min-h-dvh max-w-[480px] bg-surface">
        {header}
        {isNotFound ? (
          <DealNotFound />
        ) : (
          <ErrorState
            error={deal.error ?? myCoupon.error}
            onRetry={() => void Promise.all([deal.refetch(), myCoupon.refetch()])}
          />
        )}
      </main>
    );
  }

  const phase = toDealPhase(deal.data, now);
  const distanceM = geo.isFallback
    ? null
    : distanceMeters(geo.lat, geo.lng, deal.data.storeLat, deal.data.storeLng);
  const claimError = claim.isError ? toAppError(claim.error) : null;
  // 오늘 사용 한도: 미리 읽은 횟수 또는 받기 실패(DAILY_LIMIT_REACHED)로 안다
  const usage = dailyUsage.data;
  const isLimitReached =
    claimError?.code === 'DAILY_LIMIT_REACHED' || (!!usage && usage.usedToday >= usage.limit);

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-surface">
      {header}
      <div className="px-5 pt-5 pb-16">
        <DealSummarySection deal={deal.data} phase={phase} distanceM={distanceM} />
        <DealStatusBanner deal={deal.data} phase={phase} myCoupon={activeCoupon} />
        <DealInfoRows deal={deal.data} isEnded={phase === 'ended'} />
        <DealNotice couponTtlMin={deal.data.couponTtlMin} />
      </div>
      {activeCoupon ? (
        <CouponLinkBar coupon={activeCoupon} isJustClaimed={claim.isSuccess} />
      ) : (
        <ClaimBar
          deal={deal.data}
          phase={phase}
          dailyLimit={isLimitReached ? (usage?.limit ?? POLICY.residentDailyRedeem) : null}
          isOnline={isOnline}
          isClaiming={claim.isPending}
          errorMessage={claimError?.message ?? null}
          onClaim={handleClaim}
        />
      )}
      {toastMessage && <Toast message={toastMessage} onClose={handleToastClose} />}
    </main>
  );
}
