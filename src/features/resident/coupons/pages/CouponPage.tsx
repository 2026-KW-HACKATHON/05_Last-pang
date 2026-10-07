import { Link, useParams } from 'react-router-dom';

import { useNow } from '@/shared/hooks/useNow';
import { toAppError } from '@/shared/lib/errors';
import { BottomBar } from '@/shared/ui/BottomBar';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { PageHeader } from '@/shared/ui/PageHeader';

import { CouponDealCard } from '../components/CouponDealCard';
import { CouponExpired } from '../components/CouponExpired';
import { CouponTimerBox } from '../components/CouponTimerBox';
import { RedeemPanel } from '../components/RedeemPanel';
import { RedeemSuccess } from '../components/RedeemSuccess';
import { toEffectiveStatus } from '../couponStatus';
import { useCoupon } from '../hooks';

const PRIMARY_LINK = 'flex h-14 items-center justify-center rounded-card font-semibold';

export function CouponPage() {
  const { couponId = '' } = useParams();
  const coupon = useCoupon(couponId);
  const now = useNow();

  if (coupon.isPending) {
    return (
      <main className="mx-auto min-h-dvh max-w-[480px]">
        <PageHeader title="쿠폰 사용" hasBack />
        <LoadingState />
      </main>
    );
  }
  if (coupon.isError) {
    const isNotFound = toAppError(coupon.error).code === 'NOT_FOUND';
    return (
      <main className="mx-auto min-h-dvh max-w-[480px]">
        <PageHeader title="쿠폰 사용" hasBack />
        {isNotFound ? (
          <EmptyState
            title="쿠폰을 찾을 수 없어요"
            description="내 쿠폰에서 다시 골라 주세요"
            action={
              <Link
                to="/coupons"
                className="rounded-button bg-accent px-6 py-3 font-semibold text-white"
              >
                내 쿠폰으로
              </Link>
            }
          />
        ) : (
          <ErrorState error={coupon.error} onRetry={() => void coupon.refetch()} />
        )}
      </main>
    );
  }

  const status = toEffectiveStatus(coupon.data, now);

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-surface">
      <PageHeader title="쿠폰 사용" hasBack />
      <div className="px-5 pt-3 pb-8">
        {status === 'issued' && (
          <>
            <CouponDealCard coupon={coupon.data} />
            <CouponTimerBox expiresAt={coupon.data.expiresAt} nowMs={now} />
            <RedeemPanel couponId={coupon.data.id} nowMs={now} />
          </>
        )}
        {status === 'used' && coupon.data.usedAt && (
          <RedeemSuccess coupon={coupon.data} usedAt={coupon.data.usedAt} />
        )}
        {status === 'expired' && <CouponExpired coupon={coupon.data} />}
      </div>

      {status === 'used' && (
        <BottomBar>
          <Link to="/coupons?tab=past" className={`${PRIMARY_LINK} bg-accent text-white`}>
            내 쿠폰으로
          </Link>
        </BottomBar>
      )}
      {status === 'expired' && (
        <BottomBar>
          <Link
            to={`/deals/${coupon.data.dealId}`}
            className={`${PRIMARY_LINK} bg-accent text-white`}
          >
            딜 다시 보기
          </Link>
          <Link to="/" className={`${PRIMARY_LINK} mt-2 ring-1 ring-line`}>
            홈으로
          </Link>
        </BottomBar>
      )}
    </main>
  );
}
