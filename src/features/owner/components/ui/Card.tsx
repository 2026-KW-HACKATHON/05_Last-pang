import { cx } from '../../lib/styles';

import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  /** gray: 정보 박스(회색 면) · tint: 연분홍 강조 · plain: 흰 카드 + 옅은 테두리 */
  tone?: 'plain' | 'gray' | 'tint';
  as?: 'section' | 'div' | 'article';
}

const TONES = {
  plain: 'border border-line bg-surface',
  gray: 'bg-gray',
  tint: 'bg-accent-tint',
};

export function Card({ children, className, tone = 'plain', as: Tag = 'section' }: CardProps) {
  return <Tag className={cx('rounded-card p-4', TONES[tone], className)}>{children}</Tag>;
}
