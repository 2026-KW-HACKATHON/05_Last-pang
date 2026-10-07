import { useNavigate } from 'react-router-dom';

import { useNow } from '@/shared/hooks/useNow';
import { formatPrice } from '@/shared/lib/format';

import { Icon } from '../../components/Icon';
import { Badge } from '../../components/ui/Badge';
import { formatClock, formatTimeLeft, formatTimeRange } from '../../lib/format';
import { calcDiscount } from '../schema';
import { CouponProgress } from './CouponProgress';

import type { DealCouponCounts, OwnerDeal } from '../api';

interface LiveDealCardProps {
  deal: OwnerDeal;
  counts: DealCouponCounts | undefined;
  onCloseClick: (deal: OwnerDeal) => void;
}

/** O3 진행 중 딜 카드. 신고로 멈춘 딜은 O3-1 "신고 확인 중" 모양 */
export function LiveDealCard({ deal, counts, onCloseClick }: LiveDealCardProps) {
  const navigate = useNavigate();
  const now = useNow(30_000);
  const discount = calcDiscount(deal.originalPrice, deal.dealPrice);
  const isPaused = deal.status === 'paused';
  return (
    <article className="rounded-card border border-line bg-surface p-4">
      <div className="flex items-center justify-between">
        {isPaused ? (
          <Badge tone="danger">
            <Icon name="ban" size={12} /> 신고 확인 중
          </Badge>
        ) : (
          <Badge tone="accent" withDot>
            LIVE 딜
          </Badge>
        )}
        {isPaused ? (
          <span className="text-[13px] text-muted">
            {deal.pausedAt && `${formatClock(deal.pausedAt)}부터 멈춤`}
          </span>
        ) : (
          <button
            type="button"
            className="text-[13px] text-muted"
            onClick={() => onCloseClick(deal)}
          >
            지금 종료하기
          </button>
        )}
      </div>
      <button
        type="button"
        className="mt-2 block w-full text-left"
        onClick={() => navigate(`/owner/deals/${deal.id}`)}
      >
        <h3 className="text-lg font-semibold">{deal.title}</h3>
        <p className="mt-1 flex items-baseline gap-2">
          <span className={`text-2xl font-bold ${isPaused ? 'text-muted' : 'text-accent'}`}>
            {formatPrice(deal.dealPrice)}
          </span>
          <span className="text-sm text-faint line-through">{formatPrice(deal.originalPrice)}</span>
          {!isPaused && (
            <span className="text-sm font-semibold text-accent">{discount.percent}% 할인</span>
          )}
        </p>
        {!isPaused && (
          <p className="mt-1 flex items-center gap-1 text-[13px] text-muted">
            <Icon name="clock" size={14} />
            {formatTimeRange(deal.startsAt, deal.endsAt)} · {formatTimeLeft(deal.endsAt, now)}
          </p>
        )}
      </button>
      <div className="mt-3">
        {isPaused ? (
          <p className="rounded-field bg-accent-tint p-3 text-[13px] leading-5">
            주민 신고가 3건 접수돼 딜을 잠시 멈췄어요. 운영자가 확인하고 결과를 알려드려요. 이미
            받은 쿠폰은 그대로 쓸 수 있어요.
          </p>
        ) : (
          <CouponProgress
            totalQty={deal.totalQty}
            remainingQty={deal.remainingQty}
            counts={counts}
          />
        )}
      </div>
    </article>
  );
}
