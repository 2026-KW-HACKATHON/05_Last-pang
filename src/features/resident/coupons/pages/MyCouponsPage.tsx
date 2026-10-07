import { Link, useSearchParams } from 'react-router-dom';

import { useNow } from '@/shared/hooks/useNow';
import { EmptyState } from '@/shared/ui/EmptyState';
import { PageHeader } from '@/shared/ui/PageHeader';

import { ResidentTabBar } from '../../navigation/components/ResidentTabBar';
import { AvailableCouponCard } from '../components/AvailableCouponCard';
import { CouponListError } from '../components/CouponListError';
import { CouponListSkeleton } from '../components/CouponListSkeleton';
import { CouponTabs } from '../components/CouponTabs';
import { PastCouponList } from '../components/PastCouponList';
import { splitCoupons } from '../couponStatus';
import { useMyCoupons } from '../hooks';

// 내 쿠폰 (R11): 사용 가능 / 지난 쿠폰(?tab=past)
export function MyCouponsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const coupons = useMyCoupons();
  const now = useNow();

  const isPastTab = searchParams.get('tab') === 'past';
  const { available, past } = splitCoupons(coupons.data ?? [], now);
  const visibleCount = isPastTab ? past.length : available.length;

  const handleTabChange = (nextIsPastTab: boolean) => {
    setSearchParams(nextIsPastTab ? { tab: 'past' } : {}, { replace: true });
  };

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-surface">
      <PageHeader title="내 쿠폰" />
      <div className="px-5 pt-3">
        <CouponTabs
          isPastTab={isPastTab}
          availableCount={coupons.isSuccess ? available.length : undefined}
          onChange={handleTabChange}
        />
      </div>

      {coupons.isPending && <CouponListSkeleton />}
      {coupons.isError && <CouponListError onRetry={() => void coupons.refetch()} />}
      {coupons.isSuccess && visibleCount === 0 && (
        <EmptyState
          pose="rice"
          title={isPastTab ? '지난 쿠폰이 없어요' : '아직 받은 쿠폰이 없어요'}
          description="근처 가게의 딜을 확인해 보세요"
          action={
            <Link
              to="/"
              className="inline-block rounded-[12px] bg-accent px-14 py-3 font-semibold text-white"
            >
              근처 딜 보러 가기
            </Link>
          }
        />
      )}
      {coupons.isSuccess && visibleCount > 0 && (
        <div className="px-5 pt-5">
          {isPastTab ? (
            <PastCouponList coupons={past} nowMs={now} />
          ) : (
            <>
              <ul className="space-y-3">
                {available.map((coupon) => (
                  <li key={coupon.id}>
                    <AvailableCouponCard coupon={coupon} nowMs={now} />
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-faint">
                쿠폰은 받은 뒤 유효시간 안에 가게에서 사용해야 해요
              </p>
            </>
          )}
        </div>
      )}
      <ResidentTabBar />
    </main>
  );
}
