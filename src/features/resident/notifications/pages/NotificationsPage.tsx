import { Link } from 'react-router-dom';

import { EmptyState } from '@/shared/ui/EmptyState';
import { PageHeader } from '@/shared/ui/PageHeader';

import { ResidentTabBar } from '../../navigation/components/ResidentTabBar';
import { isIosBrowserTab } from '../api';
import { PushStatusCard } from '../components/PushStatusCard';
import { usePushSubscription } from '../hooks';

// 알림함 (피그마 R17). 받은 알림 목록은 push_queue를 본인이 읽는 정책이 생기면 붙인다
export function NotificationsPage() {
  const push = usePushSubscription();

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-surface">
      <PageHeader title="알림함" />
      <div className="px-5 pt-3">
        <PushStatusCard permission={push.permission} isIosTab={isIosBrowserTab()} />
      </div>
      <EmptyState
        pose="phone"
        title="받은 알림은 곧 여기서 볼 수 있어요"
        description="그동안 홈에서 지금 진행 중인 딜을 확인해 보세요"
        action={
          <Link to="/" className="rounded-xl bg-accent px-6 py-3 font-semibold text-white">
            홈으로
          </Link>
        }
      />
      <ResidentTabBar />
    </main>
  );
}
