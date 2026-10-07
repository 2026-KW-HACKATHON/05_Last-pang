import { formatKstTime } from '@/shared/lib/time';
import { BottomBar } from '@/shared/ui/BottomBar';
import { Icon, type IconName } from '@/shared/ui/Icon';

import { ClaimNotice } from './ClaimNotice';

import type { DealPhase } from '../dealStatus';
import type { DealDetail } from '../types';

interface ClaimBarProps {
  deal: DealDetail;
  phase: DealPhase;
  dailyLimit: number | null; // 오늘 사용 한도를 다 썼으면 한도(3), 아니면 null
  isOnline: boolean;
  isClaiming: boolean;
  errorMessage: string | null;
  onClaim: () => void;
}

const toDisabled = (
  deal: DealDetail,
  phase: DealPhase,
): { label: string; icon?: IconName } | null => {
  if (phase === 'upcoming')
    return { label: `${formatKstTime(deal.startsAt)}부터 받을 수 있어요`, icon: 'clock' };
  if (phase === 'soldOut') return { label: '오늘 준비된 수량이 모두 소진됐어요' };
  if (phase === 'ended') return { label: '종료된 딜이에요', icon: 'calendar' };
  if (phase === 'paused') return { label: '잠시 멈춘 딜이에요' };
  return null;
};

// 하단 쿠폰 받기 버튼 (화면 명세 S04 [쿠폰 받기] 버튼 상태 표, 피그마 R7·R7-1·C9)
export function ClaimBar(props: ClaimBarProps) {
  const { deal, phase, dailyLimit, isOnline, isClaiming, errorMessage, onClaim } = props;
  const disabled =
    toDisabled(deal, phase) ??
    (dailyLimit !== null ? { label: '내일 다시 받을 수 있어요' } : null) ??
    (isOnline ? null : { label: '인터넷에 연결되면 받을 수 있어요', icon: 'wifiOff' as const });

  return (
    <BottomBar>
      {phase === 'upcoming' && (
        <ClaimNotice
          icon="clock"
          title={`${formatKstTime(deal.startsAt)}에 딜이 열리면 알림으로 알려드려요`}
        />
      )}
      {phase === 'active' && dailyLimit !== null && (
        <ClaimNotice
          icon="alertCircle"
          title={`오늘은 쿠폰을 ${dailyLimit}번 모두 썼어요`}
          description={`쿠폰 사용은 하루 ${dailyLimit}번까지예요. 내일 다시 받을 수 있어요.`}
        />
      )}
      {errorMessage && !disabled && (
        <p className="mb-2 text-center text-sm text-danger">{errorMessage}</p>
      )}
      {disabled ? (
        <button
          type="button"
          disabled
          className="flex h-[52px] w-full items-center justify-center gap-1.5 rounded-[12px] bg-gray font-semibold text-faint"
        >
          {disabled.icon && <Icon name={disabled.icon} size={20} />}
          {disabled.label}
        </button>
      ) : (
        <button
          type="button"
          onClick={onClaim}
          disabled={isClaiming}
          aria-busy={isClaiming}
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] bg-accent font-semibold text-white disabled:opacity-70"
        >
          {isClaiming ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              쿠폰을 받고 있어요
            </>
          ) : (
            <>
              <Icon name="ticket" size={20} />
              쿠폰 받기 ({deal.remainingQty}장 남음)
            </>
          )}
        </button>
      )}
    </BottomBar>
  );
}
