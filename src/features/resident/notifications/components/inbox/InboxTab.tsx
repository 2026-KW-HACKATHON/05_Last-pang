import { useNavigate } from 'react-router-dom';

import { useNow } from '@/shared/hooks/useNow';
import { toKstDateString } from '@/shared/lib/time';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

import { useMarkResidentNotificationsRead, useResidentNotifications } from '../../inboxHooks';
import { InboxEmptyState } from './InboxEmptyState';
import { NotificationCard } from './NotificationCard';

import type { ResidentNotification } from '../../types';

const DAY_MS = 24 * 60 * 60 * 1000;

// 한국 날짜 기준으로 오늘 / 어제 / M월 D일
function dayLabel(dateKey: string, now: number) {
  if (dateKey === toKstDateString(new Date(now))) return '오늘';
  if (dateKey === toKstDateString(new Date(now - DAY_MS))) return '어제';
  const [, month, day] = dateKey.split('-');
  return `${Number(month)}월 ${Number(day)}일`;
}

function groupByDay(items: ResidentNotification[]) {
  const groups = new Map<string, ResidentNotification[]>();
  for (const item of items) {
    const key = toKstDateString(new Date(item.createdAt));
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return [...groups.entries()];
}

// 받은 알림 목록 (R17 받은 알림)
export function InboxTab() {
  const navigate = useNavigate();
  const now = useNow(30_000); // 딜 종료 표시만 갱신하면 되므로 30초마다
  const notifications = useResidentNotifications();
  const markRead = useMarkResidentNotificationsRead();

  if (notifications.isPending) return <LoadingState />;
  if (notifications.isError) {
    return <ErrorState error={notifications.error} onRetry={() => void notifications.refetch()} />;
  }
  if (notifications.data.length === 0) return <InboxEmptyState />;

  const handleCardClick = (notification: ResidentNotification) => {
    if (!notification.isRead) markRead.mutate([notification.id]);
    void navigate(notification.link);
  };

  return (
    <div className="px-5 pt-4">
      {groupByDay(notifications.data).map(([dateKey, items]) => (
        <section key={dateKey} className="mb-4">
          <h2 className="mb-2 text-xs text-muted">{dayLabel(dateKey, now)}</h2>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id}>
                <NotificationCard notification={item} now={now} onClick={handleCardClick} />
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="py-4 text-center text-xs text-faint">알림은 30일 동안 보관돼요</p>
    </div>
  );
}
