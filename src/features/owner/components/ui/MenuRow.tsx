import { Icon } from '../Icon';

import type { ReactNode } from 'react';

interface MenuRowProps {
  label: string;
  onClick?: () => void;
  right?: ReactNode;
  isDanger?: boolean;
}

/** 목록 메뉴 한 줄 (라벨 ··· >) */
export function MenuRow({ label, onClick, right, isDanger = false }: MenuRowProps) {
  const content = (
    <>
      <span className={isDanger ? 'text-danger' : undefined}>{label}</span>
      {right ?? <Icon name="chevron" size={18} className="text-faint" />}
    </>
  );
  if (!onClick)
    return <div className="flex h-14 items-center justify-between px-4 text-[15px]">{content}</div>;
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-14 w-full items-center justify-between px-4 text-left text-[15px] active:bg-gray"
    >
      {content}
    </button>
  );
}
