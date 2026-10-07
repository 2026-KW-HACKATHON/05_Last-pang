// O10 사장님 알림 — 소진 · 승인 · 신고 중지 · 재개 · 정지 소식
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

import { Icon, type IconName } from '../../components/Icon';
import { EmptyCard } from '../../components/ui/EmptyCard';
import { TopBar } from '../../components/ui/TopBar';
import { formatClock, formatRelativeDay } from '../../lib/format';
import { useMarkNotificationsRead, useOwnerNotifications } from '../hooks';

import type { OwnerNotification } from '../api';

const ICONS: Record<string, IconName> = {
  deal_sold_out: 'ticket',
  store_approved: 'checkCircle',
  store_rejected: 'alert',
  deal_paused: 'pause',
  deal_resumed: 'refresh',
  deal_closed_by_report: 'flag',
  store_suspended: 'ban',
  store_unsuspended: 'refresh',
  address_approved: 'pin',
  address_rejected: 'pin',
};

function groupByDay(items: OwnerNotification[]) {
  const groups: Array<{ day: string; items: OwnerNotification[] }> = [];
  for (const item of items) {
    const day = formatRelativeDay(item.createdAt);
    const last = groups.at(-1);
    if (last?.day === day) last.items.push(item);
    else groups.push({ day, items: [item] });
  }
  return groups;
}

export function OwnerNotificationsPage() {
  const navigate = useNavigate();
  const notifications = useOwnerNotifications();
  const { mutate: markAllRead } = useMarkNotificationsRead();
  const hasUnread = notifications.data?.some((item) => !item.isRead) ?? false;

  // 화면을 열면 모두 읽음 (안 읽은 점은 이번에 열었을 때까지만 보인다)
  useEffect(() => {
    if (hasUnread) {
      const timer = window.setTimeout(() => markAllRead(undefined), 1500);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [hasUnread, markAllRead]);

  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-10">
      <TopBar title="알림" />
      <div className="space-y-5 px-5 pt-4">
        {notifications.isPending && <LoadingState />}
        {notifications.isError && (
          <ErrorState error={notifications.error} onRetry={() => void notifications.refetch()} />
        )}
        {notifications.data?.length === 0 && (
          <EmptyCard
            icon="bell"
            title="아직 받은 알림이 없어요"
            body={'딜 소진, 승인 결과, 신고 처리 소식을\n여기서 알려드려요.'}
          />
        )}
        {notifications.data &&
          groupByDay(notifications.data).map((group) => (
            <section key={group.day}>
              <h2 className="mb-2 text-[13px] text-muted">{group.day}</h2>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      disabled={!item.link}
                      onClick={() => item.link && navigate(item.link)}
                      className="flex w-full gap-3 rounded-field p-3 text-left active:bg-gray"
                    >
                      <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-pill ${item.isRead ? 'bg-gray text-muted' : 'bg-accent-tint text-accent'}`}
                      >
                        <Icon name={ICONS[item.kind] ?? 'bell'} size={20} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-semibold">{item.title}</span>
                        <span className="block text-[13px] text-muted">
                          {item.body ? `${item.body} · ` : ''}
                          {formatClock(item.createdAt)}
                        </span>
                      </span>
                      {!item.isRead && (
                        <span className="mt-1.5 size-2 shrink-0 rounded-pill bg-accent" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </div>
    </div>
  );
}
