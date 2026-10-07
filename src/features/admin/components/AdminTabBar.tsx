import { Link, useLocation } from 'react-router-dom';

import { Icon, type IconName } from '@/features/owner/components/Icon';

const TABS: ReadonlyArray<{ to: string; label: string; icon: IconName }> = [
  { to: '/admin/stores', label: '입점 승인', icon: 'checkCircle' },
  { to: '/admin/approved-stores', label: '가맹점 목록', icon: 'store' },
  { to: '/admin/reports', label: '신고·이슈', icon: 'alert' },
  { to: '/admin/settings', label: '운영 설정', icon: 'sliders' },
];

/** 운영자 탭 바 (피그마 A1~A4 하단 4탭) */
export function AdminTabBar() {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label="운영자 메뉴"
      className="fixed inset-x-0 bottom-0 z-20 mx-auto grid max-w-[480px] grid-cols-4 border-t border-line bg-surface px-2 pt-2 pb-[max(12px,env(safe-area-inset-bottom))]"
    >
      {TABS.map((tab) => {
        const isActive = pathname === tab.to;
        return (
          <Link
            key={tab.to}
            to={tab.to}
            aria-current={isActive ? 'page' : undefined}
            className={`relative flex h-[52px] flex-col items-center justify-center gap-1 text-xs ${isActive ? 'font-semibold text-accent' : 'text-muted'}`}
          >
            {isActive && <span className="absolute -top-2 h-[3px] w-7 rounded-pill bg-accent" />}
            <Icon name={tab.icon} size={22} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
