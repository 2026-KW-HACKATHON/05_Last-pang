import { formatKstTime } from '@/shared/lib/time';
import { CountdownTimer } from '@/shared/ui/CountdownTimer';
import { Icon } from '@/shared/ui/Icon';

import type { DealPhase } from '../dealStatus';
import type { DealDetail, MyDealCoupon } from '../types';

interface DealStatusBannerProps {
  deal: DealDetail;
  phase: DealPhase;
  myCoupon: MyDealCoupon | null;
}

// 상태별 안내 띠 (피그마 R7 기발급 · 모두 소진 · 시간 종료, R7-1 시작 전). 받을 수 있는 딜이면 없음
export function DealStatusBanner({ deal, phase, myCoupon }: DealStatusBannerProps) {
  if (myCoupon?.status === 'issued') {
    return (
      <div className="mb-5 flex gap-3 rounded-card bg-accent-tint p-4">
        <span className="flex size-6 items-center justify-center rounded-full bg-accent text-white">
          <Icon name="check" size={14} strokeWidth={3} />
        </span>
        <div className="text-sm">
          <p className="text-base font-semibold">이미 받은 쿠폰이 있어요</p>
          <p className="mt-1 text-muted">
            남은 시간 <CountdownTimer expiresAt={myCoupon.expiresAt} /> 안에 매장에 방문해 주세요
          </p>
        </div>
      </div>
    );
  }
  const grayText = toGrayText(deal, phase, myCoupon);
  if (!grayText) return null;
  return (
    <p className="mb-5 flex items-center gap-2 rounded-pill bg-gray px-4 py-2 text-sm text-muted">
      <span className="size-1.5 rounded-full bg-faint" />
      {grayText}
    </p>
  );
}

function toGrayText(deal: DealDetail, phase: DealPhase, myCoupon: MyDealCoupon | null) {
  if (myCoupon?.status === 'used') return '이미 사용한 딜이에요';
  if (phase === 'ended') return '진행 시간이 끝난 딜이에요';
  if (phase === 'soldOut') return '준비된 수량이 모두 소진되었어요';
  if (phase === 'upcoming') return `${formatKstTime(deal.startsAt)}에 시작하는 딜이에요`;
  return null;
}
