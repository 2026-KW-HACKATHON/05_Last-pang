import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Icon } from '../../components/Icon';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyCard } from '../../components/ui/EmptyCard';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Toast } from '../../components/ui/Toast';
import { useToast } from '../../lib/useToast';
import { useCloseDeal, useDealCouponCounts, useMyActiveDeals } from '../hooks';
import { LiveDealCard } from './LiveDealCard';

import type { OwnerDeal } from '../api';

/** O3 진행 중인 딜 + 딜 종료 확인 팝업 */
export function LiveDealsSection({ storeId }: { storeId: string }) {
  const activeDeals = useMyActiveDeals(storeId);
  const live = activeDeals.data ?? [];
  const counts = useDealCouponCounts(live.map((deal) => deal.id));
  const closeDeal = useCloseDeal();
  const { toastMessage, showToast } = useToast();
  const [closingDeal, setClosingDeal] = useState<OwnerDeal | null>(null);

  const handleCloseConfirm = () => {
    if (!closingDeal) return;
    closeDeal.mutate(closingDeal.id, {
      onSuccess: () => showToast('딜을 종료했어요'),
      onSettled: () => setClosingDeal(null),
    });
  };

  return (
    <section>
      <SectionTitle
        count={live.length > 0 ? live.length : undefined}
        right={
          live.length > 0 ? (
            '월계1동 동네 알림 노출 중'
          ) : (
            <Link to="/owner/deals">0개 운영중 ›</Link>
          )
        }
      >
        <Link to="/owner/deals">진행 중인 딜</Link>
      </SectionTitle>
      {live.length === 0 ? (
        <EmptyCard icon="timerOff" title="지금 진행 중인 딜이 없어요" />
      ) : (
        <div className="space-y-3">
          {live.map((deal) => (
            <LiveDealCard
              key={deal.id}
              deal={deal}
              counts={counts.data?.[deal.id]}
              onCloseClick={setClosingDeal}
            />
          ))}
        </div>
      )}
      {closingDeal && (
        <ConfirmDialog
          icon="timerOff"
          title="딜을 지금 종료할까요?"
          body={
            <>
              이미 받은 쿠폰은 유효시간까지 쓸 수 있어요.
              <br />
              진행 중인 타임딜 노출이 즉시 중단됩니다.
              <span className="mt-3 inline-flex items-center gap-1 rounded-pill bg-gray px-3 py-1 text-[13px] text-ink">
                <Icon name="bolt" size={12} /> {closingDeal.title}
              </span>
            </>
          }
          confirmLabel="종료하기"
          isPending={closeDeal.isPending}
          onConfirm={handleCloseConfirm}
          onCancel={() => setClosingDeal(null)}
        />
      )}
      {toastMessage && <Toast>{toastMessage}</Toast>}
    </section>
  );
}
