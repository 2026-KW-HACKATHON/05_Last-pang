import { Link } from 'react-router-dom';

import { Icon, type IconName } from '@/shared/ui/Icon';

import type { ReactNode } from 'react';

interface MenuRowProps {
  to: string;
  label: string;
  badge?: ReactNode;
  icon?: IconName; // 기본은 오른쪽 화살표
}

export function MenuRow({ to, label, badge, icon }: MenuRowProps) {
  return (
    <Link to={to} className="flex h-14 items-center gap-2 px-4">
      <span>{label}</span>
      {badge}
      {icon ? (
        <Icon name={icon} size={20} className="ml-auto text-accent" />
      ) : (
        <Icon name="chevronRight" size={16} className="ml-auto text-faint" />
      )}
    </Link>
  );
}
