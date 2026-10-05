import { NavLink } from 'react-router-dom';

import { Icon, type IconName } from './Icon';

import type { ReactNode } from 'react';

const TABS: ReadonlyArray<{ to: string; label: string; icon: IconName }> = [
  { to: '/owner', label: '홈', icon: 'home' },
  { to: '/owner/redemptions', label: '사용 내역', icon: 'receipt' },
  { to: '/owner/report', label: '리포트', icon: 'chart' },
  { to: '/owner/settings', label: '가게 코드', icon: 'key' },
];

export function OwnerTabBar() {
  return (
    <nav
      aria-label="사장님 메뉴"
      className="fixed inset-x-0 bottom-0 z-20 mx-auto grid max-w-[480px] grid-cols-4 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]"
    >
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end
          className={({ isActive }) =>
            `flex h-16 flex-col items-center justify-center gap-1 text-xs ${isActive ? 'font-semibold text-accent' : 'text-faint'}`
          }
        >
          <Icon name={tab.icon} size={22} />
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}

/** 탭 바가 있는 사장님 화면의 틀 (아래 탭 바만큼 여백) */
export function OwnerShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-24">
      {children}
      <OwnerTabBar />
    </div>
  );
}
