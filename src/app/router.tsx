import { createBrowserRouter } from 'react-router-dom';

import { StoreApprovalPage } from '@/features/admin/stores/pages/StoreApprovalPage';
import { AuthCallbackPage } from '@/features/auth/pages/AuthCallbackPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { DealFormPage } from '@/features/owner/deals/pages/DealFormPage';
import { OwnerHomePage } from '@/features/owner/deals/pages/OwnerHomePage';
import { WeeklyDealFormPage } from '@/features/owner/deals/pages/WeeklyDealFormPage';
import { RedemptionsPage } from '@/features/owner/redemptions/pages/RedemptionsPage';
import { ReportPage } from '@/features/owner/report/pages/ReportPage';
import { OwnerSignupPage } from '@/features/owner/store/pages/OwnerSignupPage';
import { StoreSettingsPage } from '@/features/owner/store/pages/StoreSettingsPage';
import { CouponPage } from '@/features/resident/coupons/pages/CouponPage';
import { MyCouponsPage } from '@/features/resident/coupons/pages/MyCouponsPage';
import { DealDetailPage } from '@/features/resident/deals/pages/DealDetailPage';
import { HomePage } from '@/features/resident/deals/pages/HomePage';
import { NotificationsOnboardingPage } from '@/features/resident/notifications/pages/NotificationsOnboardingPage';
import { ConsentPage } from '@/features/resident/onboarding/pages/ConsentPage';
import { ProfilePage } from '@/features/resident/onboarding/pages/ProfilePage';
import { PreferencesPage } from '@/features/resident/preferences/pages/PreferencesPage';
import { SchedulesPage } from '@/features/resident/schedules/pages/SchedulesPage';

import { RequireAuth } from './RequireAuth';
import { RequireRole } from './RequireRole';
import { RouteErrorPage } from './RouteErrorPage';

// 컨벤션 6장 라우트 표와 1:1. 경로를 추가하면 표도 고치고, 기능 PR이 아닌 작은 공동 PR로 올린다
export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorPage />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/auth/callback', element: <AuthCallbackPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/onboarding/consent', element: <ConsentPage /> },
          { path: '/onboarding/profile', element: <ProfilePage /> },
          { path: '/onboarding/preferences', element: <PreferencesPage /> },
          { path: '/onboarding/notifications', element: <NotificationsOnboardingPage /> },
          { path: '/deals/:dealId', element: <DealDetailPage /> },
          { path: '/coupons', element: <MyCouponsPage /> },
          { path: '/coupons/:couponId', element: <CouponPage /> },
          { path: '/me/schedules', element: <SchedulesPage /> },
          { path: '/owner/signup', element: <OwnerSignupPage /> },
          {
            element: <RequireRole role="owner" />,
            children: [
              // 승인 대기·거절도 이 화면의 상태로 보여준다 (합의 2-8)
              { path: '/owner', element: <OwnerHomePage /> },
              { path: '/owner/deals/new', element: <DealFormPage /> },
              { path: '/owner/weekly-deals/new', element: <WeeklyDealFormPage /> },
              { path: '/owner/redemptions', element: <RedemptionsPage /> },
              { path: '/owner/report', element: <ReportPage /> },
              { path: '/owner/settings', element: <StoreSettingsPage /> },
            ],
          },
          {
            element: <RequireRole role="admin" />,
            children: [{ path: '/admin/stores', element: <StoreApprovalPage /> }],
          },
        ],
      },
    ],
  },
]);
