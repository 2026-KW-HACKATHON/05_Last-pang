import { useState } from 'react';

import { toAppError } from '@/shared/lib/errors';

import { useRedeemCoupon, useRedeemLock } from './hooks';

export const CODE_LENGTH = 6;
const LOCK_MS = 10 * 60_000; // 서버가 잠금 시각을 안 보냈을 때만 쓰는 어림값

export type CodeKey =
  '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'clear' | 'delete';

/** 코드 입력 뒤 화면에 보여줄 결과 */
export type CodeFeedback =
  | { kind: 'wrong'; remainingAttempts?: number }
  | { kind: 'offline' }
  | { kind: 'soldOut' }
  | { kind: 'notUsable' }
  | { kind: 'notIssued' }
  | { kind: 'error'; message: string };

const toLockMs = (value: unknown) =>
  typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? Date.parse(value) : null;

// 가게 코드 입력 흐름 (R8 · R8-1 · R8-2). 코드는 서버에서 해시와 비교만 한다
export function useCodeEntry(couponId: string, nowMs: number) {
  const redeem = useRedeemCoupon(couponId);
  const serverLock = useRedeemLock();
  const [digits, setDigits] = useState('');
  const [feedback, setFeedback] = useState<CodeFeedback | null>(null);
  const [localLockMs, setLocalLockMs] = useState<number | null>(null);

  const lockedUntilMs = Math.max(localLockMs ?? 0, toLockMs(serverLock.data?.lockedUntil) ?? 0);
  const isLocked = lockedUntilMs > nowMs;
  // 소진되면 더 입력할 수 없다
  const isFrozen = isLocked || feedback?.kind === 'soldOut' || feedback?.kind === 'notUsable';

  const lock = (until: unknown) => {
    setLocalLockMs(toLockMs(until) ?? Date.now() + LOCK_MS);
    setDigits('');
    setFeedback(null);
  };

  const submit = (code: string) => {
    if (!navigator.onLine) {
      setFeedback({ kind: 'offline' });
      return;
    }
    setFeedback(null);
    redeem.mutate(code, {
      onError: (error) => {
        const appError = toAppError(error);
        switch (appError.code) {
          case 'WRONG_CODE':
            if (appError.remainingAttempts === 0) lock(appError.detail?.locked_until);
            else setFeedback({ kind: 'wrong', remainingAttempts: appError.remainingAttempts });
            return;
          case 'TOO_MANY_ATTEMPTS':
            lock(appError.detail?.locked_until);
            return;
          case 'NETWORK_ERROR':
            setFeedback({ kind: 'offline' }); // 입력값은 그대로 둔다
            return;
          case 'SOLD_OUT':
            setFeedback({ kind: 'soldOut' });
            return;
          case 'COUPON_NOT_USABLE':
            setFeedback({ kind: 'notUsable' });
            return;
          case 'CODE_NOT_ISSUED':
            setDigits('');
            setFeedback({ kind: 'notIssued' });
            return;
          default:
            setDigits('');
            setFeedback({ kind: 'error', message: appError.message });
        }
      },
    });
  };

  const press = (key: CodeKey) => {
    if (isFrozen || redeem.isPending) return;
    const isRetyping = feedback?.kind === 'wrong' && digits.length === CODE_LENGTH;
    if (key === 'clear' || key === 'delete') {
      setFeedback(null);
      setDigits(key === 'clear' || isRetyping ? '' : digits.slice(0, -1));
      return;
    }
    // 다 채운 상태(연결 끊김 등)에서는 숫자를 더 받지 않는다. 다시 보내기나 지우기로 이어간다
    if (digits.length === CODE_LENGTH && !isRetyping) return;
    setFeedback(null);
    // 틀린 코드를 보여주는 중에 누르면 처음부터 다시 입력한다
    const next = isRetyping ? key : digits + key;
    setDigits(next);
    if (next.length === CODE_LENGTH) submit(next);
  };

  return {
    digits: isLocked ? '' : digits,
    feedback: isLocked ? null : feedback,
    isLocked,
    lockedUntilMs,
    isFrozen,
    isPending: redeem.isPending,
    press,
    retry: () => submit(digits),
  };
}
