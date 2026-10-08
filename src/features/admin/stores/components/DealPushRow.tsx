// 딜 하나의 알림 결과 (알림함 · 발송 대기 · 성공 · 실패 · 기기 없음 · 눌러 본 수) + 지금 보내기 · 내 기기로 시험
import { AppError } from '@/shared/lib/errors';

import { useDealPushStatus, useSendDealPushNow, useSendTestPushToMe } from '../hooks';

export function DealPushRow({ dealId, isLive }: { dealId: string; isLive: boolean }) {
  const status = useDealPushStatus(dealId, isLive);
  const sendNow = useSendDealPushNow();
  const sendMe = useSendTestPushToMe();
  const s = status.data;
  const error = sendNow.error ?? sendMe.error;
  const done =
    sendNow.data !== undefined
      ? `새로 ${sendNow.data.new_notifications}명에게 보냈어요`
      : sendMe.data !== undefined
        ? `내 기기 ${sendMe.data.devices}대로 보냈어요. 1분 안에 와요`
        : null;

  return (
    <div className="mt-2 space-y-2 border-t border-line pt-2">
      {s && (
        <p className="text-xs text-muted">
          알림함 {s.notified} · 대기 {s.pending} ·{' '}
          <span className="text-success">성공 {s.sent}</span> ·{' '}
          <span className={s.failed ? 'text-danger' : ''}>실패 {s.failed}</span> · 기기 없음{' '}
          {s.skipped} · 눌러 봄 {s.clicks}
        </p>
      )}
      {isLive && (
        <div className="flex gap-2">
          <button
            type="button"
            disabled={sendNow.isPending}
            onClick={() => sendNow.mutate(dealId)}
            className="h-9 flex-1 rounded-button bg-accent text-[13px] font-semibold text-white disabled:opacity-50"
          >
            주민에게 지금 보내기
          </button>
          <button
            type="button"
            disabled={sendMe.isPending}
            onClick={() => sendMe.mutate(dealId)}
            className="h-9 flex-1 rounded-button border border-accent text-[13px] font-semibold text-accent disabled:opacity-50"
          >
            내 기기로 시험
          </button>
        </div>
      )}
      {done && <p className="text-xs text-success">{done}</p>}
      {error instanceof AppError && <p className="text-xs text-danger">{error.message}</p>}
    </div>
  );
}
