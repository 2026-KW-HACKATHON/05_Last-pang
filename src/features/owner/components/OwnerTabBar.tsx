import { Link, useLocation } from 'react-router-dom';

import { Icon, type IconName } from './Icon';

const TABS: ReadonlyArray<{
  to: string;
  label: string;
  icon: IconName;
  match: (path: string) => boolean;
}> = [
  // 딜 기록(/owner/deals)은 홈 아래 화면이라 홈 탭이 켜진다 (피그마 O11)
  {
    to: '/owner',
    label: '홈',
    icon: 'home',
    match: (path) => path === '/owner' || path === '/owner/deals',
  },
  {
    to: '/owner/redemptions',
    label: '사용 내역',
    icon: 'receipt',
    match: (path) => path === '/owner/redemptions',
  },
  {
    to: '/owner/report',
    label: '리포트',
    icon: 'chart',
    match: (path) => path === '/owner/report',
  },
  {
    to: '/owner/settings',
    label: '가게 코드',
    icon: 'qr',
    match: (path) => path === '/owner/settings',
  },
];

/** 사장님 탭 바 (피그마 컴포넌트 "사장님 탭 바": 72px, 켜진 탭은 크림슨 + 위 막대, 내 정보에서는 켜진 탭 없음) */
export function OwnerTabBar() {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label="사장님 메뉴"
      className="fixed inset-x-0 bottom-0 z-20 mx-auto grid max-w-[480px] grid-cols-4 border-t border-line bg-surface px-2 pt-2 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-2px_12px_rgb(0_0_0/0.04)]"
    >
      {TABS.map((tab) => {
        const isActive = tab.match(pathname);
        return (
          <Link
            key={tab.to}
            to={tab.to}
            aria-current={isActive ? 'page' : undefined}
            className={`relative flex h-[52px] flex-col items-center justify-center gap-1 text-[13px] ${isActive ? 'font-semibold text-accent' : 'text-muted'}`}
          >
            {isActive && <span className="absolute -top-2 h-[3px] w-7 rounded-pill bg-accent" />}
            <Icon name={tab.icon} size={24} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
