import { CountdownTimer } from '@/shared/ui/CountdownTimer';
import { Icon } from '@/shared/ui/Icon';

import type { DealPhase } from '../dealStatus';
import type { DealDetail, MyDealCoupon } from '../types';

interface DealStatusBannerProps {
  deal: DealDetail;
  phase: DealPhase;
  myCoupon: MyDealCoupon | null;
}

const GRAY_TEXTS: Partial<Record<DealPhase, string>> = {
  ended: '진행 시간이 끝난 딜이에요',
  soldOut: '준비된 수량이 모두 소진되었어요',
  paused: '운영자가 확인 중이라 잠시 멈춘 딜이에요',
};

// 상태별 안내 (피그마 R7 기발급 · 모두 소진 · 시간 종료). 받을 수 있는 딜이면 없음
export function DealStatusBanner({ deal, phase, myCoupon }: DealStatusBannerProps) {
  if (myCoupon?.status === 'issued') {
    return (
      <div className="mt-4 flex gap-3 rounded-card bg-accent-tint p-4">
        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-white">
          <Icon name="check" size={12} strokeWidth={3} />
        </span>
        <div className="text-sm">
          <p className="font-semibold">이미 발급받은 쿠폰이 있어요</p>
          <p className="mt-1 text-muted">
            {deal.couponTtlMin}분 이내 매장에 방문해 주세요 (남은 시간{' '}
            <b className="text-accent">
              <CountdownTimer expiresAt={myCoupon.expiresAt} />
            </b>
            )
          </p>
        </div>
      </div>
    );
  }
  const grayText = myCoupon?.status === 'used' ? '이미 사용한 딜이에요' : GRAY_TEXTS[phase];
  if (!grayText) return null;
  return (
    <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-gray px-3 py-1.5 text-sm text-muted">
      <span className="size-1.5 rounded-full bg-faint" />
      {grayText}
    </p>
  );
}
