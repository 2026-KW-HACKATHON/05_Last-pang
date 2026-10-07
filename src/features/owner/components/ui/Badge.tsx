import { cx } from '../../lib/styles';

import type { ReactNode } from 'react';

// accent: 대기중 · success: 승인됨/운영 중 · danger: 정지(빨강 채움) · dark: 예정 · neutral: 종료
export type BadgeTone = 'accent' | 'success' | 'danger' | 'dark' | 'neutral';

const STYLES: Record<BadgeTone, string> = {
  accent: 'bg-accent-tint text-accent',
  success: 'bg-success-tint text-success',
  danger: 'bg-danger text-white',
  dark: 'bg-ink text-white',
  neutral: 'bg-gray text-muted',
};

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  /** 앞에 작은 점 (● 승인됨) */
  withDot?: boolean;
}

export function Badge({ tone = 'neutral', children, withDot = false }: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex h-6 shrink-0 items-center gap-1 rounded-pill px-2 text-xs font-semibold',
        STYLES[tone],
      )}
    >
      {withDot && <span className="size-1.5 rounded-pill bg-current" />}
      {children}
    </span>
  );
}
