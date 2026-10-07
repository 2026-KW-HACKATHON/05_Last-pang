import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/app/useAuth';
import { useSignOut } from '@/features/auth/hooks';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Toast } from '@/shared/ui/Toast';

import { useMyCoupons } from '../../coupons/hooks';
import { ResidentTabBar } from '../../navigation/components/ResidentTabBar';
import { usePushSubscription } from '../../notifications/hooks';
import { useMyProfile } from '../../profile/hooks';
import { MenuRow } from '../components/MenuRow';
import { ProfileCard } from '../components/ProfileCard';
import { PushToggleRow } from '../components/PushToggleRow';
import { SavingsSummary } from '../components/SavingsSummary';

// 내 정보 (피그마 R12): 프로필 · 아낀 금액 · 설정 메뉴 · 로그아웃
export function MyInfoPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const profile = useMyProfile();
  const coupons = useMyCoupons();
  const push = usePushSubscription();
  const signOut = useSignOut();
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const handleToastClose = useCallback(() => setToastMessage(null), []);

  const usedCoupons = (coupons.data ?? []).filter((coupon) => coupon.status === 'used');
  const savedPrice = usedCoupons.reduce(
    (sum, coupon) => sum + coupon.originalPrice - coupon.dealPrice,
    0,
  );
  const isKakao = session?.user.app_metadata.provider === 'kakao';
  const isPushOn = push.permission === 'granted' && Boolean(profile.data?.agreedPushAt);

  const handlePushToggle = () => {
    if (!isPushOn) {
      navigate('/onboarding/notifications?mode=edit');
      return;
    }
    // 웹에서는 앱이 권한을 거둘 수 없어 브라우저 설정으로 안내한다 (R12-1 알림 해제 방법 안내)
    setToastMessage('브라우저 설정 > 사이트 설정 > 알림에서 끌 수 있어요');
  };

  const handleSignOutConfirm = () => {
    signOut.mutate(undefined, { onSuccess: () => navigate('/login', { replace: true }) });
  };

  if (profile.isPending) return <LoadingState />;
  if (profile.isError) {
    return <ErrorState error={profile.error} onRetry={() => void profile.refetch()} />;
  }

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-surface">
      <PageHeader title="내 정보" />
      <div className="px-5 pt-3">
        <ProfileCard
          nickname={profile.data.nickname ?? '이웃'}
          loginLabel={isKakao ? '카카오 계정으로 로그인' : '이메일 계정으로 로그인'}
        />
        <SavingsSummary usedCount={usedCoupons.length} savedPrice={savedPrice} />
        <nav className="mt-4 divide-y divide-line rounded-card ring-1 ring-line">
          <MenuRow to="/onboarding/preferences?mode=edit" label="좋아하는 가게·거리" />
          <MenuRow to="/me/schedules" label="내 시간표" />
          <PushToggleRow isOn={isPushOn} onToggle={handlePushToggle} />
          <MenuRow
            to="/owner/signup"
            label="우리 가게 등록하기"
            badge={
              <span className="rounded-pill bg-accent-soft px-2 py-0.5 text-xs font-bold text-accent">
                사장님
              </span>
            }
          />
        </nav>
        <div className="mt-6 text-center text-sm text-muted">
          <button type="button" onClick={() => setIsSignOutOpen(true)}>
            로그아웃
          </button>
        </div>
      </div>
      <ResidentTabBar />
      {isSignOutOpen && (
        <ConfirmDialog
          title="로그아웃할까요?"
          description="다시 로그인하면 받은 쿠폰을 그대로 볼 수 있어요."
          confirmLabel="로그아웃"
          isPending={signOut.isPending}
          onConfirm={handleSignOutConfirm}
          onCancel={() => setIsSignOutOpen(false)}
        />
      )}
      {toastMessage && <Toast message={toastMessage} onClose={handleToastClose} />}
    </main>
  );
}
