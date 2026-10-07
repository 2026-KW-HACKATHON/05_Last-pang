import { formatRemaining } from '@/shared/lib/time';
import { Icon } from '@/shared/ui/Icon';

import type { CodeFeedback } from '../useCodeEntry';

interface RedeemFeedbackProps {
  feedback: CodeFeedback | null;
  isLocked: boolean;
  lockedLeftMs: number;
  isPending: boolean;
  onRetry: () => void;
}

// 코드 칸 아래 한 줄 안내: 틀림 · 잠김 · 연결 끊김 · 코드 미발급 (R8 · R8-1)
export function RedeemFeedback({
  feedback,
  isLocked,
  lockedLeftMs,
  isPending,
  onRetry,
}: RedeemFeedbackProps) {
  if (isLocked) {
    return (
      <p className="flex items-center gap-2 px-2 text-sm font-semibold text-danger" role="alert">
        <Icon name="lock" size={18} />
        <span className="flex-1">5번 틀려서 잠시 입력할 수 없어요</span>
        <span className="tabular-nums">{formatRemaining(lockedLeftMs)}</span>
      </p>
    );
  }
  if (isPending) return <p className="text-center text-sm text-muted">확인하는 중...</p>;
  if (!feedback) return null;

  switch (feedback.kind) {
    case 'wrong':
      return (
        <p className="text-center text-sm font-semibold text-danger" role="alert">
          가게 코드가 맞지 않아요
          {feedback.remainingAttempts !== undefined && ` · ${feedback.remainingAttempts}번 남음`}
        </p>
      );
    case 'offline':
      return (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-1.5 rounded-pill px-4 py-2 text-sm font-semibold text-accent ring-1 ring-accent"
          >
            <Icon name="refresh" size={16} />
            다시 보내기
          </button>
        </div>
      );
    case 'notIssued':
      return (
        <div className="flex gap-2 rounded-card bg-gray px-4 py-3 text-sm" role="alert">
          <Icon name="info" size={18} className="mt-0.5 shrink-0 text-muted" />
          <p>
            <span className="font-semibold">아직 가게 코드가 준비되지 않았어요</span>
            <br />
            <span className="text-muted">사장님께 가게 코드 발급을 부탁해 주세요.</span>
          </p>
        </div>
      );
    case 'notUsable':
      return (
        <p className="text-center text-sm font-semibold text-danger" role="alert">
          사용할 수 없는 쿠폰이에요
        </p>
      );
    case 'error':
      return (
        <p className="text-center text-sm font-semibold text-danger" role="alert">
          {feedback.message}
        </p>
      );
    default:
      return null;
  }
}
