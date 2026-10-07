import { useCodeEntry } from '../useCodeEntry';
import { CodeBoxes, type CodeBoxesTone } from './CodeBoxes';
import { CodeKeypad } from './CodeKeypad';
import { OfflineToast } from './OfflineToast';
import { RedeemFeedback } from './RedeemFeedback';
import { SoldOutNotice } from './SoldOutNotice';

import type { MyCoupon } from '../types';

interface RedeemPanelProps {
  coupon: MyCoupon;
  nowMs: number;
}

// 가게 코드 6자리 입력 (피그마 R8 · R8-1 · R8-2). 6자리를 채우면 바로 보낸다
export function RedeemPanel({ coupon, nowMs }: RedeemPanelProps) {
  const entry = useCodeEntry(coupon.id, nowMs);
  const kind = entry.feedback?.kind;
  // 받은 쿠폰은 수량을 잡아두지만, 서버가 쓸 수 없다고 하고 딜 수량도 0이면 소진으로 안내한다
  const isSoldOut = kind === 'soldOut' || (kind === 'notUsable' && coupon.dealRemainingQty === 0);

  const toTone = (): CodeBoxesTone => {
    if (entry.isLocked) return 'disabled';
    if (kind === 'wrong') return 'error';
    if (kind === 'offline' || entry.isPending) return 'pending';
    return 'normal';
  };

  return (
    <section className="mt-6">
      <h2 className="text-center text-lg font-bold">가게 코드 6자리를 입력해 주세요</h2>
      <p className="mt-1 mb-4 text-center text-sm text-muted">사장님께 가게 코드를 물어보세요</p>
      <CodeBoxes digits={entry.digits} tone={isSoldOut ? 'normal' : toTone()} />
      <div className="mt-4 mb-4 min-h-6" aria-live="polite">
        {isSoldOut ? (
          <SoldOutNotice />
        ) : (
          <RedeemFeedback
            feedback={entry.feedback}
            isLocked={entry.isLocked}
            lockedLeftMs={entry.lockedUntilMs - nowMs}
            isPending={entry.isPending}
            onRetry={entry.retry}
          />
        )}
      </div>
      <CodeKeypad disabled={entry.isFrozen || entry.isPending} onPress={entry.press} />
      {kind === 'offline' && <OfflineToast />}
    </section>
  );
}
