import { useQuery } from '@tanstack/react-query';

import { ROOT_KEYS } from '@/shared/constants/queryKeys';

import { fetchOpenCouponCount } from '../api';

/** 딜 종료 확인 팝업 안내: 안 쓴 쿠폰은 함께 취소되고 손님에게 알림이 간다 */
export function CloseDealCouponNote({ dealId }: { dealId: string }) {
  const count = useQuery({
    queryKey: [...ROOT_KEYS.deals, 'openCoupons', dealId],
    queryFn: () => fetchOpenCouponCount(dealId),
    staleTime: 0,
  });
  if (count.isPending) return <>받은 쿠폰을 확인하고 있어요…</>;
  if (!count.data) return <>아직 받은 쿠폰이 없어요. 타임딜 노출이 바로 중단돼요.</>;
  return (
    <>
      <b className="text-accent">받은 쿠폰 {count.data}장도 함께 취소</b>되고, 손님에게 알림이 가요.
    </>
  );
}
