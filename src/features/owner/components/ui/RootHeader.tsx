import type { ReactNode } from 'react';

interface RootHeaderProps {
  title: string;
  /** 제목 옆 회색 알약 (사장님 · 운영자) */
  roleLabel: string;
  right?: ReactNode;
  /** 사장님 홈처럼 제목 자리에 로고 */
  isLogo?: boolean;
}

/** 탭 바가 있는 첫 화면의 머리 (피그마: 흰 바탕, 제목 + 회색 역할 알약 + 오른쪽 아이콘) */
export function RootHeader({ title, roleLabel, right, isLogo = false }: RootHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between bg-surface px-5">
      <div className="flex items-center gap-2">
        <h1
          className={
            isLogo
              ? 'text-2xl font-extrabold tracking-[-0.5px] text-accent'
              : 'text-[22px] font-bold'
          }
        >
          {title}
        </h1>
        <span className="rounded-pill bg-gray px-2 py-0.5 text-xs text-muted">{roleLabel}</span>
      </div>
      {right && <div className="flex items-center gap-1">{right}</div>}
    </header>
  );
}
