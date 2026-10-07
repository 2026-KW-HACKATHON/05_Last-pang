import { Navigate } from 'react-router-dom';

// 알림 설정은 알림함의 탭으로 합쳤다 (R17). 예전 주소로 들어와도 같은 화면으로
export function NotificationSettingsPage() {
  return <Navigate to="/notifications?tab=settings" replace />;
}
