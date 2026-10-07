// O12 딜 상세(사장님) — 진행 중이면 실시간 소진 현황, 끝났으면 결과
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useNow } from '@/shared/hooks/useNow';
import { formatPrice } from '@/shared/lib/format';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

import { Icon } from '../../components/Icon';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { StatusBlock } from '../../components/ui/StatusBlock';
import { StickyBar } from '../../components/ui/StickyBar';
import { TopBar } from '../../components/ui/TopBar';
import { CouponProgress } from '../../deals/components/CouponProgress';
import { useCloseDeal } from '../../deals/hooks';
import { calcDiscount } from '../../deals/schema';
import { formatRelativeDay, formatTimeLeft, formatTimeRange } from '../../lib/format';
import { DealCouponList } from '../components/DealCouponList';
import { DealResultPanel } from '../components/DealResultPanel';
import { DealStateChip } from '../components/DealStateChip';
import { useDealCoupons, useDealResult, useOwnerDeal } from '../hooks';

import type { HistoryDeal } from '../api';

export function OwnerDealDetailPage() {
  const { dealId = '' } = useParams();
  const deal = useOwnerDeal(dealId);
  if (deal.isPending) return <LoadingState />;
  if (deal.isError) return <ErrorState error={deal.error} onRetry={() => void deal.refetch()} />;
  if (!deal.data) return <StatusBlock pose="map" title="딜을 찾을 수 없어요" />;
  return <OwnerDealDetail deal={deal.data} />;
}

function OwnerDealDetail({ deal }: { deal: HistoryDeal }) {
  const navigate = useNavigate();
  const now = useNow(30_000);
  const isLive = deal.status !== 'closed' && new Date(deal.endsAt).getTime() > now;
  const coupons = useDealCoupons(deal.id, isLive);
  const result = useDealResult(deal.id, !isLive);
  const closeDeal = useCloseDeal();
  const [isConfirming, setIsConfirming] = useState(false);
  const discount = calcDiscount(deal.originalPrice, deal.dealPrice);
  const list = coupons.data ?? [];
  const counts = {
    claimed: list.length,
    used: list.filter((coupon) => coupon.status === 'used').length,
    pending: list.filter((coupon) => coupon.status === 'issued').length,
  };

  const handleRepost = () =>
    navigate('/owner/deals/new', {
      state: {
        title: deal.title,
        originalPrice: deal.originalPrice,
        dealPrice: deal.dealPrice,
        totalQty: deal.totalQty,
      },
    });

  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-28">
      <TopBar title="딜 상세" />
      <div className="space-y-5 px-5 pt-5">
        <div className="flex items-center justify-between">
          <DealStateChip deal={deal} />
          <span className="text-[13px] text-muted">
            {isLive
              ? formatTimeLeft(deal.endsAt, now)
              : `${formatRelativeDay(deal.startsAt)} ${formatTimeRange(deal.startsAt, deal.endsAt)}`}
          </span>
        </div>
        <div>
          <h1 className="text-[22px] font-bold">{deal.title}</h1>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-accent">{formatPrice(deal.dealPrice)}</span>
            <span className="text-faint line-through">{formatPrice(deal.originalPrice)}</span>
            {isLive && (
              <span className="rounded bg-accent-tint px-1.5 text-sm font-semibold text-accent">
                {discount.percent}% 할인
              </span>
            )}
          </p>
          {isLive && (
            <p className="mt-1 flex items-center gap-1 text-[13px] text-muted">
              <Icon name="clock" size={14} /> 오늘 {formatTimeRange(deal.startsAt, deal.endsAt)} ·
              쿠폰 유효 {deal.couponTtlMin}분
            </p>
          )}
        </div>
        {isLive && (
          <CouponProgress
            totalQty={deal.totalQty}
            remainingQty={deal.remainingQty}
            counts={counts}
          />
        )}
        {isLive && <DealCouponList coupons={list} />}
        {!isLive && result.data && <DealResultPanel deal={deal} result={result.data} />}
      </div>
      <StickyBar>
        {isLive ? (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => navigate(`/owner/deals/${deal.id}/preview`)}>
              <Icon name="smartphone" size={18} /> 미리보기
            </Button>
            <Button
              variant="outline"
              disabled={deal.status === 'paused'}
              onClick={() => setIsConfirming(true)}
            >
              <Icon name="pause" size={18} /> 지금 종료하기
            </Button>
          </div>
        ) : (
          <Button block onClick={handleRepost}>
            <Icon name="refresh" size={18} /> 같은 딜 다시 올리기
          </Button>
        )}
      </StickyBar>
      {isConfirming && (
        <ConfirmDialog
          icon="timerOff"
          title="딜을 지금 종료할까요?"
          body={
            '이미 받은 쿠폰은 유효시간까지 쓸 수 있어요.\n진행 중인 타임딜 노출이 즉시 중단됩니다.'
          }
          confirmLabel="종료하기"
          isPending={closeDeal.isPending}
          onConfirm={() => closeDeal.mutate(deal.id, { onSettled: () => setIsConfirming(false) })}
          onCancel={() => setIsConfirming(false)}
        />
      )}
    </div>
  );
}
