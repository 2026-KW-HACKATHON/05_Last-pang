import type { ReactNode } from 'react';

interface SectionTitleProps {
  children: ReactNode;
  count?: number;
  right?: ReactNode;
}

/** 섹션 제목 + 연분홍 개수 배지 + 오른쪽 보조 글자 (피그마 "진행 중인 딜 1 · 월계 1동 동네 알림 노출 중") */
export function SectionTitle({ children, count, right }: SectionTitleProps) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        {children}
        {count !== undefined && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-pill bg-accent-tint px-1.5 text-xs text-accent">
            {count}
          </span>
        )}
      </h2>
      {right && <div className="text-[13px] text-muted">{right}</div>}
    </div>
  );
}
