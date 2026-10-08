import { createBrowserRouter } from 'react-router-dom';

import { CouncilReportPage } from '@/features/admin/council/pages/CouncilReportPage';
import { ReportDetailPage } from '@/features/admin/reports/pages/ReportDetailPage';
import { ReportsPage } from '@/features/admin/reports/pages/ReportsPage';
import { AdminSettingsPage } from '@/features/admin/settings/pages/AdminSettingsPage';
import { AdminDealFormPage } from '@/features/admin/stores/pages/AdminDealFormPage';
import { AdminStoreDetailPage } from '@/features/admin/stores/pages/AdminStoreDetailPage';
import { AdminStoreFormPage } from '@/features/admin/stores/pages/AdminStoreFormPage';
import { ApplicationDetailPage } from '@/features/admin/stores/pages/ApplicationDetailPage';
import { StoreApprovalPage } from '@/features/admin/stores/pages/StoreApprovalPage';
import { StoreListPage } from '@/features/admin/stores/pages/StoreListPage';
import { AuthCallbackPage } from '@/features/auth/pages/AuthCallbackPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { DealFormPage } from '@/features/owner/deals/pages/DealFormPage';
import { DealPreviewPage } from '@/features/owner/deals/pages/DealPreviewPage';
import { OwnerHomePage } from '@/features/owner/deals/pages/OwnerHomePage';
import { WeeklyDealEditPage } from '@/features/owner/deals/pages/WeeklyDealEditPage';
import { WeeklyDealFormPage } from '@/features/owner/deals/pages/WeeklyDealFormPage';
import { DealHistoryPage } from '@/features/owner/history/pages/DealHistoryPage';
import { OwnerDealDetailPage } from '@/features/owner/history/pages/OwnerDealDetailPage';
import { OwnerMePage } from '@/features/owner/me/pages/OwnerMePage';
import { StoreInfoEditPage } from '@/features/owner/me/pages/StoreInfoEditPage';
import { OwnerNotificationsPage } from '@/features/owner/notifications/pages/OwnerNotificationsPage';
import { RedemptionsPage } from '@/features/owner/redemptions/pages/RedemptionsPage';
import { ReportPage } from '@/features/owner/report/pages/ReportPage';
import { OwnerSignupPage } from '@/features/owner/store/pages/OwnerSignupPage';
import { PrintGuidePage } from '@/features/owner/store/pages/PrintGuidePage';
import { StoreSettingsPage } from '@/features/owner/store/pages/StoreSettingsPage';
import { CouponPage } from '@/features/resident/coupons/pages/CouponPage';
import { MyCouponsPage } from '@/features/resident/coupons/pages/MyCouponsPage';
import { DealDetailPage } from '@/features/resident/deals/pages/DealDetailPage';
import { HomePage } from '@/features/resident/deals/pages/HomePage';
import { InstallGuidePage } from '@/features/resident/install/pages/InstallGuidePage';
import { TermsPage } from '@/features/resident/legal/pages/TermsPage';
import { MyInfoPage } from '@/features/resident/my-info/pages/MyInfoPage';
import { WithdrawPage } from '@/features/resident/my-info/pages/WithdrawPage';
import { NotificationSettingsPage } from '@/features/resident/notifications/pages/NotificationSettingsPage';
import { NotificationsOnboardingPage } from '@/features/resident/notifications/pages/NotificationsOnboardingPage';
import { NotificationsPage } from '@/features/resident/notifications/pages/NotificationsPage';
import { ConsentPage } from '@/features/resident/onboarding/pages/ConsentPage';
import { ProfilePage } from '@/features/resident/onboarding/pages/ProfilePage';
import { BaseLocationPage } from '@/features/resident/preferences/pages/BaseLocationPage';
import { PreferencesPage } from '@/features/resident/preferences/pages/PreferencesPage';
import { FreeTimesPage } from '@/features/resident/schedules/pages/FreeTimesPage';
import { SchedulesPage } from '@/features/resident/schedules/pages/SchedulesPage';

import { HelpPage } from './HelpPage';
import { RequireAuth } from './RequireAuth';
import { RequireRole } from './RequireRole';
import { RootLayout } from './RootLayout';
import { RouteErrorPage } from './RouteErrorPage';

// 컨벤션 6장 라우트 표와 1:1. 경로를 추가하면 표도 고치고, 기능 PR이 아닌 작은 공동 PR로 올린다
// 화면 번호(R·O·A·C)는 피그마 "동네냠냠 UI 최종"(10/7) 기준
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/auth/callback', element: <AuthCallbackPage /> },
      // 로그인 전에도 볼 수 있어야 하는 화면 (R15 약관 · R16 설치 안내)
      { path: '/terms/:kind', element: <TermsPage /> },
      { path: '/install-guide', element: <InstallGuidePage /> },
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
          { path: '/notifications', element: <NotificationsPage /> },
          { path: '/notifications/settings', element: <NotificationSettingsPage /> },
          { path: '/me', element: <MyInfoPage /> },
          { path: '/me/nickname', element: <ProfilePage mode="edit" /> },
          { path: '/me/preferences', element: <PreferencesPage /> },
          { path: '/me/location', element: <BaseLocationPage /> },
          { path: '/me/schedules', element: <SchedulesPage /> },
          { path: '/me/schedules/alerts', element: <FreeTimesPage /> },
          { path: '/me/withdraw', element: <WithdrawPage /> },
          { path: '/help', element: <HelpPage /> },
          // O0~O1-4: 주민도 들어와 신청한다 (승인 대기·거절은 /owner의 상태 화면, 합의 2-8)
          { path: '/owner/signup', element: <OwnerSignupPage /> },
          {
            element: <RequireRole role="owner" />,
            children: [
              { path: '/owner', element: <OwnerHomePage /> },
              { path: '/owner/deals', element: <DealHistoryPage /> },
              { path: '/owner/deals/new', element: <DealFormPage /> },
              { path: '/owner/deals/:dealId', element: <OwnerDealDetailPage /> },
              { path: '/owner/deals/:dealId/preview', element: <DealPreviewPage /> },
              { path: '/owner/weekly-deals/new', element: <WeeklyDealFormPage /> },
              { path: '/owner/weekly-deals/:ruleId', element: <WeeklyDealEditPage /> },
              { path: '/owner/redemptions', element: <RedemptionsPage /> },
              { path: '/owner/report', element: <ReportPage /> },
              { path: '/owner/settings', element: <StoreSettingsPage /> },
              { path: '/owner/settings/print', element: <PrintGuidePage /> },
              { path: '/owner/me', element: <OwnerMePage /> },
              { path: '/owner/me/store', element: <StoreInfoEditPage /> },
              { path: '/owner/notifications', element: <OwnerNotificationsPage /> },
            ],
          },
          {
            element: <RequireRole role="admin" />,
            children: [
              { path: '/admin/stores', element: <StoreApprovalPage /> },
              { path: '/admin/stores/:storeId', element: <ApplicationDetailPage /> },
              { path: '/admin/approved-stores', element: <StoreListPage /> },
              { path: '/admin/approved-stores/new', element: <AdminStoreFormPage /> },
              { path: '/admin/approved-stores/:storeId', element: <AdminStoreDetailPage /> },
              { path: '/admin/approved-stores/:storeId/edit', element: <AdminStoreFormPage /> },
              { path: '/admin/approved-stores/:storeId/deals/new', element: <AdminDealFormPage /> },
              { path: '/admin/reports', element: <ReportsPage /> },
              { path: '/admin/reports/:dealId', element: <ReportDetailPage /> },
              { path: '/admin/settings', element: <AdminSettingsPage /> },
              { path: '/admin/report', element: <CouncilReportPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
