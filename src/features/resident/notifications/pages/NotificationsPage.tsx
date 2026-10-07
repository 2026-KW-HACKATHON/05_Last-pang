import { useSearchParams } from 'react-router-dom';

import { PageHeader } from '@/shared/ui/PageHeader';

import { ResidentTabBar } from '../../navigation/components/ResidentTabBar';
import { InboxTab } from '../components/inbox/InboxTab';
import { SegmentTabs, type NotificationsTab } from '../components/SegmentTabs';
import { SettingsTab } from '../components/settings/SettingsTab';
import { useMarkResidentNotificationsRead } from '../inboxHooks';

// 알림함 (피그마 R17). 탭은 ?tab=settings로 주소에 남겨 뒤로 가기·공유에도 유지한다
export function NotificationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const markRead = useMarkResidentNotificationsRead();
  const tab: NotificationsTab = searchParams.get('tab') === 'settings' ? 'settings' : 'inbox';

  const handleTabChange = (next: NotificationsTab) =>
    setSearchParams(next === 'settings' ? { tab: 'settings' } : {}, { replace: true });

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-surface">
      <PageHeader
        title="알림함"
        right={
          tab === 'inbox' && (
            <button
              type="button"
              onClick={() => markRead.mutate(undefined)}
              disabled={markRead.isPending}
              className="text-sm text-muted"
            >
              모두 읽음
            </button>
          )
        }
      />
      <div className="sticky top-14 z-10 bg-surface px-5 pt-2">
        <SegmentTabs value={tab} onChange={handleTabChange} />
      </div>
      {tab === 'inbox' ? <InboxTab /> : <SettingsTab />}
      <ResidentTabBar />
    </main>
  );
}
