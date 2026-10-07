import { formatKstTime } from '@/shared/lib/time';
import { Icon } from '@/shared/ui/Icon';

import type { ResidentNotification } from '../../types';

interface NotificationCardProps {
  notification: ResidentNotification;
  now: number;
  onClick: (notification: ResidentNotification) => void;
}

// 받은 알림 카드 한 장. 끝난 딜은 흐리게 (R17 받은 알림)
export function NotificationCard({ notification, now, onClick }: NotificationCardProps) {
  const { deal } = notification;
  const isEnded =
    deal !== null &&
    (deal.status !== 'active' || deal.remainingQty <= 0 || Date.parse(deal.endsAt) <= now);

  return (
    <button
      type="button"
      onClick={() => onClick(notification)}
      className={`w-full rounded-card bg-surface p-4 text-left ring-1 ring-line ${isEnded ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-2 text-sm">
        <span className="rounded bg-accent-tint px-1.5 py-0.5 text-xs text-accent">
          {notification.chipLabel}
        </span>
        {notification.storeName && (
          <span className="truncate text-muted">{notification.storeName}</span>
        )}
        <span className="ml-auto shrink-0 text-xs text-faint">
          {formatKstTime(notification.createdAt)}
        </span>
        {!notification.isRead && (
          <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-label="읽지 않음" />
        )}
      </div>
      <p className="mt-2 font-semibold">{notification.title}</p>
      {deal && (
        <div className="mt-2 flex items-center gap-1 text-xs text-faint">
          <Icon name="clock" size={14} />
          {formatKstTime(deal.startsAt)} ~ {formatKstTime(deal.endsAt)}
          {isEnded ? (
            <span className="ml-auto rounded-pill bg-gray px-2.5 py-1 text-muted">종료됐어요</span>
          ) : (
            <span className="ml-auto rounded-pill bg-accent-tint px-2.5 py-1 text-accent">
              사용 가능 {deal.remainingQty}/{deal.totalQty}명
            </span>
          )}
        </div>
      )}
    </button>
  );
}
