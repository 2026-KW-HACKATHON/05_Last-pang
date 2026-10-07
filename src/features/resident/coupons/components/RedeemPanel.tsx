import { useState } from 'react';

import { ERROR_MESSAGES, toAppError } from '@/shared/lib/errors';
import { formatRemaining } from '@/shared/lib/time';
import { CodeInput } from '@/shared/ui/CodeInput';
import { Icon } from '@/shared/ui/Icon';

import { useRedeemCoupon } from '../hooks';

const LOCK_MS = 10 * 60_000; // redeem_coupon: 10분 안에 5번 틀리면 차단

interface RedeemPanelProps {
  couponId: string;
  nowMs: number;
}

// 가게 코드 6자리 입력 (피그마 R8 · R8-1). 코드는 서버에서 해시와 비교만 한다
export function RedeemPanel({ couponId, nowMs }: RedeemPanelProps) {
  const redeem = useRedeemCoupon(couponId);
  // 잠금이 풀리는 시각은 서버가 알려주지 않아 마지막 실패 시각 + 10분으로 어림한다
  const [lockedUntilMs, setLockedUntilMs] = useState<number | null>(null);

  const isLocked = lockedUntilMs !== null && lockedUntilMs > nowMs;
  const appError = redeem.isError ? toAppError(redeem.error) : null;

  const handleComplete = (code: string) => {
    redeem.mutate(code, {
      onError: (error) => {
        const { code: errorCode, remainingAttempts } = toAppError(error);
        if (errorCode === 'TOO_MANY_ATTEMPTS' || remainingAttempts === 0) {
          setLockedUntilMs(Date.now() + LOCK_MS);
        }
      },
    });
  };

  return (
    <section className="mt-6">
      <h2 className="text-center text-lg font-bold">가게 코드 6자리를 입력해 주세요</h2>
      <p className="mt-1 mb-4 text-center text-sm text-sub">사장님께 가게 코드를 물어보세요</p>
      <CodeInput
        disabled={isLocked || redeem.isPending}
        hasError={appError !== null && !isLocked}
        onComplete={handleComplete}
      />
      <div className="mt-3 min-h-6 text-center text-sm font-semibold" aria-live="polite">
        {isLocked && lockedUntilMs !== null && (
          <p className="flex items-center justify-center gap-1.5 text-danger">
            <Icon name="lock" size={16} />
            5번 틀려서 잠시 입력할 수 없어요 · {formatRemaining(lockedUntilMs - nowMs)}
          </p>
        )}
        {!isLocked && appError?.code === 'WRONG_CODE' && (
          <p className="text-danger">
            {ERROR_MESSAGES.WRONG_CODE}
            {appError.remainingAttempts !== undefined && (
              <span className="font-normal"> · {appError.remainingAttempts}번 남음</span>
            )}
          </p>
        )}
        {!isLocked && appError && appError.code !== 'WRONG_CODE' && (
          <p className="text-danger">{appError.message}</p>
        )}
        {redeem.isPending && <p className="text-sub">확인하는 중...</p>}
      </div>
    </section>
  );
}
