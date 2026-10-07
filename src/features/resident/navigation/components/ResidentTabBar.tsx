import { NavLink } from 'react-router-dom';

import { Icon, type IconName } from '@/shared/ui/Icon';

const TABS: { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: '홈', icon: 'home' },
  { to: '/notifications', label: '알림함', icon: 'bell' },
  { to: '/coupons', label: '내 쿠폰', icon: 'ticket' },
  { to: '/me', label: '내 정보', icon: 'user' },
];

// 주민 하단 탭 (화면 명세 0.5). 가입·코드 입력 같은 흐름 화면에서는 넣지 않는다
export function ResidentTabBar() {
  return (
    <>
      <div className="h-20" aria-hidden="true" />
      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto grid max-w-[480px] grid-cols-4 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `relative flex h-16 flex-col items-center justify-center gap-1 text-xs ${isActive ? 'text-accent' : 'text-muted'}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute top-0 h-[3px] w-7 rounded-b bg-accent" />}
                <Icon name={tab.icon} size={24} />
                {tab.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
