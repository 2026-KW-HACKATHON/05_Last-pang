import { Link } from 'react-router-dom';

import { formatKstTime } from '@/shared/lib/time';
import { BottomBar } from '@/shared/ui/BottomBar';
import { Icon } from '@/shared/ui/Icon';

import type { DealPhase } from '../dealStatus';
import type { DealDetail, MyDealCoupon } from '../types';

interface ClaimBarProps {
  deal: DealDetail;
  phase: DealPhase;
  myCoupon: MyDealCoupon | null;
  isClaiming: boolean;
  errorMessage: string | null;
  onClaim: () => void;
}

const DISABLED_LABELS: Record<Exclude<DealPhase, 'active'>, (deal: DealDetail) => string> = {
  upcoming: (deal) => `${formatKstTime(deal.startsAt)}에 시작해요`,
  soldOut: () => '오늘 준비된 수량이 모두 소진됐어요',
  ended: () => '종료된 딜이에요',
};

// 하단 쿠폰 받기 버튼 (화면 명세 S04 [쿠폰 받기] 버튼 상태 표)
export function ClaimBar({
  deal,
  phase,
  myCoupon,
  isClaiming,
  errorMessage,
  onClaim,
}: ClaimBarProps) {
  if (myCoupon) {
    return (
      <BottomBar>
        {myCoupon.status === 'issued' && (
          <p className="mb-2 flex items-center justify-center gap-1 text-xs text-sub">
            <Icon name="check" size={14} className="text-accent" />내 쿠폰에 안전하게 저장됐어요
          </p>
        )}
        <Link
          to={`/coupons/${myCoupon.id}`}
          className="flex h-14 items-center justify-center gap-1 rounded-card bg-accent font-semibold text-white"
        >
          {myCoupon.status === 'issued' ? '내 쿠폰 사용하러 가기' : '사용 내역 보기'}
          <Icon name="chevronRight" size={18} />
        </Link>
      </BottomBar>
    );
  }

  return (
    <BottomBar>
      {errorMessage && <p className="mb-2 text-center text-sm text-danger">{errorMessage}</p>}
      {phase === 'active' ? (
        <button
          type="button"
          onClick={onClaim}
          disabled={isClaiming}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-card bg-accent font-semibold text-white disabled:opacity-60"
        >
          <Icon name="ticket" size={20} />
          {isClaiming ? '쿠폰을 받는 중...' : `쿠폰 받기 (${deal.remainingQty}장 남음)`}
        </button>
      ) : (
        <button
          type="button"
          disabled
          className="h-14 w-full rounded-card bg-cream font-semibold text-muted"
        >
          {DISABLED_LABELS[phase](deal)}
        </button>
      )}
    </BottomBar>
  );
}
