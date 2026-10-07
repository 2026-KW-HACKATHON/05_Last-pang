import { useCallback, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import { useGeolocation } from '@/shared/hooks/useGeolocation';
import { useNow } from '@/shared/hooks/useNow';
import { toAppError } from '@/shared/lib/errors';
import { distanceMeters } from '@/shared/lib/geo';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Toast } from '@/shared/ui/Toast';

import { ClaimBar } from '../components/ClaimBar';
import { DealInfoRows } from '../components/DealInfoRows';
import { DealNotice } from '../components/DealNotice';
import { DealStatusBanner } from '../components/DealStatusBanner';
import { DealSummarySection } from '../components/DealSummarySection';
import { ShareButton } from '../components/ShareButton';
import { toDealPhase } from '../dealStatus';
import { useClaimCoupon, useDeal, useMyCouponForDeal, useRecordDealView } from '../hooks';

export function DealDetailPage() {
  const { dealId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const deal = useDeal(dealId);
  const myCoupon = useMyCouponForDeal(dealId);
  const claim = useClaimCoupon(dealId);
  const geo = useGeolocation();
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
      right={
        deal.data && (
          <ShareButton
            title={deal.data.title}
            onCopied={() => setToastMessage('링크를 복사했어요')}
          />
        )
      }
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
      <main className="mx-auto min-h-dvh max-w-[480px]">
        {header}
        <LoadingState />
      </main>
    );
  }
  if (deal.isError || myCoupon.isError) {
    const isNotFound = deal.isError && toAppError(deal.error).code === 'NOT_FOUND';
    return (
      <main className="mx-auto min-h-dvh max-w-[480px]">
        {header}
        {isNotFound ? (
          <EmptyState
            title="이미 끝났거나 볼 수 없는 딜이에요"
            description="홈에서 지금 진행 중인 다른 딜을 찾아보세요"
            action={
              <Link to="/" className="rounded-button bg-accent px-6 py-3 font-semibold text-white">
                홈으로
              </Link>
            }
          />
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

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-surface">
      {header}
      <div className="px-5 pt-5">
        <DealStatusBanner deal={deal.data} phase={phase} myCoupon={activeCoupon} />
        <DealSummarySection deal={deal.data} distanceM={distanceM} isDimmed={phase !== 'active'} />
        <DealInfoRows deal={deal.data} isEnded={phase === 'ended'} />
        <DealNotice couponTtlMin={deal.data.couponTtlMin} />
      </div>
      <ClaimBar
        deal={deal.data}
        phase={phase}
        myCoupon={activeCoupon}
        isClaiming={claim.isPending}
        errorMessage={claim.isError ? toAppError(claim.error).message : null}
        onClaim={handleClaim}
      />
      {toastMessage && <Toast message={toastMessage} onClose={handleToastClose} />}
    </main>
  );
}
