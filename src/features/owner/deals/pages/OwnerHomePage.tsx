// O2 승인 전 · O3 사장님 홈 · O3-1 추가 상태(예정 딜 · 신고로 멈춘 딜 · 가게 이용 정지)
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

import { OwnerShell } from '../../components/OwnerShell';
import { IconButton } from '../../components/ui/IconButton';
import { ProfileButton } from '../../components/ui/ProfileButton';
import { RootHeader } from '../../components/ui/RootHeader';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { useHasUnreadOwnerNotification } from '../../notifications/hooks';
import { StoreReviewView } from '../../store/components/StoreReviewView';
import { useMyStore } from '../../store/hooks';
import { HomeActions } from '../components/HomeActions';
import { LiveDealsSection } from '../components/LiveDealsSection';
import { RecentRedemptions } from '../components/RecentRedemptions';
import { ScheduledDealCard } from '../components/ScheduledDealCard';
import { StoreNotices } from '../components/StoreNotices';
import { StoreStatusBadge } from '../components/StoreStatusBadge';
import { TodaySummaryCard } from '../components/TodaySummaryCard';
import { useTodayScheduledDeals } from '../hooks';

import type { MyStore } from '../../store/api';

export function OwnerHomePage() {
  const myStore = useMyStore();

  if (myStore.isPending) return <LoadingState />;
  if (myStore.isError)
    return <ErrorState error={myStore.error} onRetry={() => void myStore.refetch()} />;
  if (!myStore.data) return <Navigate to="/owner/signup" replace />;
  if (myStore.data.status === 'pending' || myStore.data.status === 'rejected') {
    return <StoreReviewView store={myStore.data} />;
  }
  return <OwnerDashboard store={myStore.data} />;
}

function OwnerDashboard({ store }: { store: MyStore }) {
  const navigate = useNavigate();
  const hasUnread = useHasUnreadOwnerNotification();
  const scheduledDeals = useTodayScheduledDeals(store.id);
  const scheduled = scheduledDeals.data ?? [];
  const isSuspended = store.status === 'suspended';

  return (
    <OwnerShell>
      <RootHeader
        title="동네냠냠"
        roleLabel="사장님"
        isLogo
        right={<ProfileButton to="/owner/me" />}
      />
      <div className="space-y-6 px-5 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{store.name}</h2>
            <StoreStatusBadge status={store.status} />
          </div>
          <IconButton
            icon="bell"
            label="알림"
            filled
            hasDot={hasUnread}
            onClick={() => navigate('/owner/notifications')}
          />
        </div>
        <StoreNotices store={store} />
        <TodaySummaryCard />
        <HomeActions canCreate={!isSuspended && !store.pendingAddress} />
        {isSuspended && (
          <Link to="/help" className="-mt-3 block text-center text-sm text-muted underline">
            운영자에게 문의하기
          </Link>
        )}
        {scheduled.length > 0 && (
          <section>
            <SectionTitle count={scheduled.length} right="시작하면 주민에게 알림이 가요">
              오늘 예정된 딜
            </SectionTitle>
            <div className="space-y-2">
              {scheduled.map((deal) => (
                <ScheduledDealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </section>
        )}
        <LiveDealsSection storeId={store.id} />
        <RecentRedemptions storeId={store.id} category={store.category} />
      </div>
    </OwnerShell>
  );
}
