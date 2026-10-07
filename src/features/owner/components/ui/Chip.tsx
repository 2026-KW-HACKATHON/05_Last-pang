import { cx } from '../../lib/styles';
import { Icon } from '../Icon';

import type { ReactNode } from 'react';

interface ChipProps {
  isSelected?: boolean;
  onClick?: () => void;
  children: ReactNode;
  /** solid: 선택 시 크림슨 채움(딜 폼) · soft: 선택 시 연분홍 + 체크(사유 고르기) */
  tone?: 'solid' | 'soft';
  round?: boolean; // 요일처럼 동그란 칩
  disabled?: boolean;
}

export function Chip({
  isSelected = false,
  onClick,
  children,
  tone = 'solid',
  round = false,
  disabled,
}: ChipProps) {
  const selectedStyle =
    tone === 'solid'
      ? 'bg-accent font-semibold text-white'
      : 'bg-accent-tint font-semibold text-accent';
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        'inline-flex shrink-0 items-center justify-center gap-1 rounded-pill text-sm transition-colors disabled:opacity-40',
        round ? 'size-10' : 'h-9 px-3.5',
        isSelected ? selectedStyle : 'bg-gray text-ink',
      )}
    >
      {isSelected && tone === 'soft' && <Icon name="checkCircle" size={16} />}
      {children}
    </button>
  );
}
