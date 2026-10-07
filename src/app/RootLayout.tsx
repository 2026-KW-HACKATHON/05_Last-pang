import { Outlet } from 'react-router-dom';

import { OfflineBanner } from './components/OfflineBanner';
import { UpdateBanner } from './components/UpdateBanner';

// 모든 화면 위에 공통 안내(C7 오프라인 띠·새 버전 안내)를 얹는다
export function RootLayout() {
  return (
    <>
      <Outlet />
      <OfflineBanner />
      <UpdateBanner />
    </>
  );
}
