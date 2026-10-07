import { Link } from 'react-router-dom';

import { Icon } from '@/shared/ui/Icon';

import type { ReactNode } from 'react';

interface MenuRowProps {
  to: string;
  label: string;
  badge?: ReactNode;
}

export function MenuRow({ to, label, badge }: MenuRowProps) {
  return (
    <Link to={to} className="flex h-14 items-center gap-2 px-4">
      <span>{label}</span>
      {badge}
      <Icon name="chevronRight" size={16} className="ml-auto text-faint" />
    </Link>
  );
}
