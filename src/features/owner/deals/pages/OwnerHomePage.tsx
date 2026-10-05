// O2·O3 사장님 홈 — 승인 대기·거절이면 상태 화면, 승인이면 오늘 현황 (합의 2-8: 같은 주소의 상태)
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { useNow } from '@/shared/hooks/useNow';
import { formatPrice } from '@/shared/lib/format';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  InfoRow,
  Mascot,
  SectionTitle,
  Toast,
} from '../../components/ui';
import { OwnerShell } from '../../components/OwnerTabBar';
import { formatClock, formatTimeLeft } from '../../lib/format';
import { useRedemptions } from '../../redemptions/hooks';
import { useTodayReport } from '../../report/hooks';
import { useMyStore } from '../../store/hooks';
import { useCloseDeal, useDealCouponCounts, useMyActiveDeals } from '../hooks';

import type { MyStore } from '../../store/api';
import type { OwnerDeal } from '../api';

export function OwnerHomePage() {
  const myStore = useMyStore();

  if (myStore.isPending) return <LoadingState />;
  if (myStore.isError)
    return <ErrorState error={myStore.error} onRetry={() => void myStore.refetch()} />;
  if (!myStore.data) return <Navigate to="/owner/signup" replace />;
  if (myStore.data.status !== 'approved') return <StorePendingView store={myStore.data} />;
  return <OwnerDashboard store={myStore.data} />;
}

/* ───── O2 승인 대기·거절 ───── */
function StorePendingView({ store }: { store: MyStore }) {
  const navigate = useNavigate();
  const isRejected = store.status === 'rejected';

  return (
    <div className="mx-auto min-h-dvh max-w-[480px] px-5 pt-6 pb-10">
      <h1 className="text-xl font-semibold">{store.name}</h1>
      <div className="flex flex-col items-center pt-8 text-center">
        <Mascot pose="map" />
        <div className="mt-5">
          {isRejected ? (
            <Badge tone="danger">승인 거절</Badge>
          ) : (
            <Badge tone="warning">승인 대기 중</Badge>
          )}
        </div>
        <h2 className="mt-3 text-[22px] leading-[30px] font-semibold whitespace-pre-line">
          {isRejected ? '가게 등록이 거절됐어요' : '운영자가 가게 정보를\n확인하고 있어요'}
        </h2>
      </div>

      {isRejected ? (
        <Card className="mt-6" tinted>
          <p className="text-[13px] font-semibold text-accent">거절 사유</p>
          <p className="mt-1 text-[15px]">{store.rejectReason ?? '운영자에게 문의해 주세요'}</p>
        </Card>
      ) : (
        <Card className="mt-6">
          <InfoRow label="가게 이름" value={store.name} />
          <InfoRow label="상태" value="확인 중" />
        </Card>
      )}

      <p className="mt-4 text-center text-[13px] text-faint">
        {isRejected
          ? '정보를 고쳐 다시 신청하려면 운영자에게 알려 주세요'
          : '승인되면 바로 딜을 올릴 수 있어요'}
      </p>
      <Button variant="secondary" block className="mt-6" onClick={() => navigate('/')}>
        주민 화면으로 돌아가기
      </Button>
    </div>
  );
}

/* ───── O3 승인된 사장님 홈 ───── */
function OwnerDashboard({ store }: { store: MyStore }) {
  const navigate = useNavigate();
  const todayReport = useTodayReport();
  const activeDeals = useMyActiveDeals(store.id);
  const redemptions = useRedemptions(store.id, 'today');
  const closeDeal = useCloseDeal();
  const [dealToClose, setDealToClose] = useState<OwnerDeal | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const deals = activeDeals.data ?? [];
  const counts = useDealCouponCounts(deals.map((deal) => deal.id));

  const handleConfirmClose = () => {
    if (!dealToClose) return;
    closeDeal.mutate(dealToClose.id, {
      onSuccess: () => {
        setDealToClose(null);
        setToast('딜을 종료했어요');
        window.setTimeout(() => setToast(null), 2500);
      },
    });
  };

  return (
    <OwnerShell>
      <header className="flex items-center gap-2 px-5 pt-6 pb-4">
        <h1 className="text-xl font-semibold">{store.name}</h1>
        <Badge tone="success">승인됨</Badge>
      </header>

      <div className="space-y-6 px-5">
        {/* 오늘 요약 */}
        <Card>
          <div className="grid grid-cols-3 divide-x divide-line text-center">
            <SummaryNumber label="오늘 사용" value={`${todayReport.data?.usedCount ?? 0}건`} />
            <SummaryNumber
              label="예상 매출"
              value={formatPrice(todayReport.data?.estimatedRevenue ?? 0)}
            />
            <SummaryNumber
              label="처음 온 손님"
              value={`${todayReport.data?.newVisitorCount ?? 0}명`}
            />
          </div>
        </Card>

        {/* 진행 중인 딜 */}
        <section>
          <SectionTitle>진행 중인 딜</SectionTitle>
          {activeDeals.isPending && <LoadingState />}
          {activeDeals.isError && (
            <ErrorState error={activeDeals.error} onRetry={() => void activeDeals.refetch()} />
          )}
          {activeDeals.isSuccess && deals.length === 0 && (
            <Card className="py-8 text-center">
              <p className="text-[15px] text-muted">지금 진행 중인 딜이 없어요</p>
              <Button className="mt-4" onClick={() => navigate('/owner/deals/new')}>
                첫 딜 올리기 (30초)
              </Button>
            </Card>
          )}
          <div className="space-y-3">
            {deals.map((deal) => (
              <LiveDealCard
                key={deal.id}
                deal={deal}
                counts={counts.data?.[deal.id]}
                onClose={() => setDealToClose(deal)}
              />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => navigate('/owner/deals/new')}>즉시딜 올리기</Button>
          <Button variant="secondary" onClick={() => navigate('/owner/weekly-deals/new')}>
            요일 반복딜
          </Button>
        </div>

        {/* 방금 사용된 쿠폰 */}
        <section>
          <SectionTitle
            right={
              <button
                type="button"
                className="text-sm text-muted"
                onClick={() => navigate('/owner/redemptions')}
              >
                전체 보기
              </button>
            }
          >
            방금 사용된 쿠폰
          </SectionTitle>
          <Card className="py-1">
            {(redemptions.data ?? []).length === 0 ? (
              <p className="py-4 text-center text-[15px] text-faint">아직 사용된 쿠폰이 없어요</p>
            ) : (
              <ul className="divide-y divide-line">
                {(redemptions.data ?? []).slice(0, 3).map((item) => (
                  <li key={item.couponId} className="flex items-center gap-3 py-3 text-[15px]">
                    <span className="w-12 text-muted tabular-nums">{formatClock(item.usedAt)}</span>
                    <span className="font-mono font-semibold tracking-wider">
                      {item.confirmNumber}
                    </span>
                    <span className="flex-1 truncate text-right text-muted">{item.dealTitle}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      </div>

      {dealToClose && (
        <ConfirmDialog
          title="딜을 지금 종료할까요?"
          body="이미 받은 쿠폰은 유효시간까지 쓸 수 있어요"
          confirmLabel="종료하기"
          isPending={closeDeal.isPending}
          onConfirm={handleConfirmClose}
          onCancel={() => setDealToClose(null)}
        />
      )}
      {toast && <Toast>{toast}</Toast>}
    </OwnerShell>
  );
}

function SummaryNumber({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-1">
      <p className="text-[13px] text-muted">{label}</p>
      <p className="mt-1 text-[17px] font-semibold tabular-nums">{value}</p>
    </div>
  );
}

interface LiveDealCardProps {
  deal: OwnerDeal;
  counts?: { claimed: number; used: number; pending: number };
  onClose: () => void;
}

function LiveDealCard({ deal, counts, onClose }: LiveDealCardProps) {
  const now = useNow(30_000);
  const soldRatio = deal.totalQty === 0 ? 0 : (deal.totalQty - deal.remainingQty) / deal.totalQty;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <Badge tone="accent">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-pill bg-accent-soft opacity-75" />
            <span className="relative inline-flex size-2 rounded-pill bg-accent-soft" />
          </span>
          LIVE
        </Badge>
        <span className="text-[13px] text-muted">
          {formatClock(deal.startsAt)} ~ {formatClock(deal.endsAt)} ·{' '}
          {formatTimeLeft(deal.endsAt, now)}
        </span>
      </div>
      <h3 className="mt-3 text-[17px] font-semibold">{deal.title}</h3>
      <p className="mt-1">
        <span className="text-xl font-semibold text-accent">{formatPrice(deal.dealPrice)}</span>
        <span className="ml-2 text-sm text-faint line-through">
          {formatPrice(deal.originalPrice)}
        </span>
      </p>

      <div className="mt-4 flex items-end justify-between">
        <span className="text-[13px] text-muted">남은 쿠폰</span>
        <span className="text-2xl font-semibold tabular-nums">
          {deal.remainingQty} <span className="text-base text-faint">/ {deal.totalQty}</span>
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-pill bg-accent-tint">
        <div
          className="h-full rounded-pill bg-accent transition-all"
          style={{ width: `${soldRatio * 100}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[13px] text-muted">
          받음 {counts?.claimed ?? 0} · 사용 {counts?.used ?? 0} · 미사용 {counts?.pending ?? 0}
        </span>
        <Button variant="text" onClick={onClose}>
          지금 종료하기
        </Button>
      </div>
    </Card>
  );
}
