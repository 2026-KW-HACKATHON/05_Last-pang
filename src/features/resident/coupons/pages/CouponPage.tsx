import { Link, useParams } from 'react-router-dom';

import { useNow } from '@/shared/hooks/useNow';
import { toAppError } from '@/shared/lib/errors';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { PageHeader } from '@/shared/ui/PageHeader';

import { CouponActions } from '../components/CouponActions';
import { CouponDealCard } from '../components/CouponDealCard';
import { CouponExpired } from '../components/CouponExpired';
import { CouponCanceled } from '../components/CouponCanceled';
import { CouponSoldOut } from '../components/CouponSoldOut';
import { CouponTimerBox } from '../components/CouponTimerBox';
import { RedeemPanel } from '../components/RedeemPanel';
import { RedeemSuccess } from '../components/RedeemSuccess';
import { toDisplayStatus } from '../couponStatus';
import { useCoupon } from '../hooks';

const PAGE = 'mx-auto min-h-dvh max-w-[480px] bg-surface';

// 쿠폰 사용 (R8~R10). 쿠폰 상태에 따라 코드 입력 · 사용 완료 · 만료 · 소진 화면을 고른다
export function CouponPage() {
  const { couponId = '' } = useParams();
  const coupon = useCoupon(couponId);
  const now = useNow();

  if (coupon.isPending) {
    return (
      <main className={PAGE}>
        <PageHeader title="쿠폰 사용" hasBack />
        <LoadingState label="쿠폰을 불러오고 있어요" />
      </main>
    );
  }
  if (coupon.isError) {
    const isNotFound = toAppError(coupon.error).code === 'NOT_FOUND';
    return (
      <main className={PAGE}>
        <PageHeader title="쿠폰 사용" hasBack />
        {isNotFound ? (
          <EmptyState
            title="쿠폰을 찾을 수 없어요"
            description="내 쿠폰에서 다시 골라 주세요"
            action={
              <Link
                to="/coupons"
                className="inline-block rounded-[12px] bg-accent px-6 py-3 font-semibold text-white"
              >
                내 쿠폰으로
              </Link>
            }
          />
        ) : (
          <ErrorState
            error={coupon.error}
            description="인터넷 연결을 확인하고 다시 시도해 주세요."
            onRetry={() => void coupon.refetch()}
          />
        )}
      </main>
    );
  }

  const status = toDisplayStatus(coupon.data, now);

  return (
    <main className={PAGE}>
      <PageHeader title="쿠폰 사용" hasBack />
      <div className="px-5 pt-3 pb-8">
        {status === 'issued' && (
          <>
            <CouponDealCard coupon={coupon.data} />
            <CouponTimerBox expiresAt={coupon.data.expiresAt} nowMs={now} />
            <RedeemPanel coupon={coupon.data} nowMs={now} />
          </>
        )}
        {status === 'used' && coupon.data.usedAt && (
          <RedeemSuccess coupon={coupon.data} usedAt={coupon.data.usedAt} />
        )}
        {status === 'expired' && <CouponExpired coupon={coupon.data} />}
        {status === 'soldOut' && <CouponSoldOut coupon={coupon.data} />}
        {status === 'canceled' && <CouponCanceled coupon={coupon.data} />}
      </div>
      <CouponActions status={status} dealId={coupon.data.dealId} />
    </main>
  );
}
