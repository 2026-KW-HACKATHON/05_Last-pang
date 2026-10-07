import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '@/app/useAuth';
import { useSignOut } from '@/features/auth/hooks';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Toast } from '@/shared/ui/Toast';

import { useMyCoupons } from '../../coupons/hooks';
import { ResidentTabBar } from '../../navigation/components/ResidentTabBar';
import { useMyProfile } from '../../profile/hooks';
import { IconConfirmDialog } from '../components/IconConfirmDialog';
import { MenuRow } from '../components/MenuRow';
import { MyInfoFooterLinks } from '../components/MyInfoFooterLinks';
import { OwnerMenuRow } from '../components/OwnerMenuRow';
import { ProfileCard } from '../components/ProfileCard';
import { PushSettingRow } from '../components/PushSettingRow';
import { SavingsSummary } from '../components/SavingsSummary';

// 다른 화면에서 저장하고 돌아올 때 넘겨준 토스트 문구 (R4-2 저장 완료)
const readToast = (state: unknown): string | null => {
  if (typeof state !== 'object' || state === null || !('toast' in state)) return null;
  return typeof state.toast === 'string' ? state.toast : null;
};

// 내 정보 (피그마 R12): 프로필 · 아낀 금액 · 설정 메뉴 · 로그아웃
export function MyInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, role } = useAuth();
  const profile = useMyProfile();
  const coupons = useMyCoupons();
  const signOut = useSignOut();
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(() => readToast(location.state));
  const handleToastClose = useCallback(() => setToastMessage(null), []);

  // 토스트는 한 번만: 뒤로 왔다 다시 와도 뜨지 않게 기록의 state를 비운다
  const hasRouteToast = readToast(location.state) !== null;
  useEffect(() => {
    if (hasRouteToast) navigate(location.pathname, { replace: true, state: null });
  }, [hasRouteToast, location.pathname, navigate]);

  const usedCoupons = (coupons.data ?? []).filter((coupon) => coupon.status === 'used');
  const savedPrice = usedCoupons.reduce(
    (sum, coupon) => sum + coupon.originalPrice - coupon.dealPrice,
    0,
  );
  const isKakao = session?.user.app_metadata.provider === 'kakao';

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
          <MenuRow to="/me/preferences" label="좋아하는 가게·거리" />
          <MenuRow to="/me/schedules" label="내 시간표" />
          <PushSettingRow agreedPushAt={profile.data.agreedPushAt} />
          <MenuRow to="/install-guide" label="홈 화면에 추가하는 법" />
          <OwnerMenuRow isOwner={role === 'owner'} />
        </nav>
        <MyInfoFooterLinks onSignOut={() => setIsSignOutOpen(true)} />
      </div>
      <ResidentTabBar />
      {isSignOutOpen && (
        <IconConfirmDialog
          icon="logout"
          title="로그아웃할까요?"
          description={'다시 로그인하면 받은 쿠폰을\n그대로 볼 수 있어요.'}
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
