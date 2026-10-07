import { cx } from '../../lib/styles';
import { Icon, type IconName } from '../Icon';

import type { ReactNode } from 'react';

interface NoticeBoxProps {
  children: ReactNode;
  title?: string;
  icon?: IconName;
  /** gray: 일반 안내 · tint: 강조 안내 · danger: 오류·정지 */
  tone?: 'gray' | 'tint' | 'danger';
  className?: string;
}

const TONES = {
  gray: 'bg-gray text-muted',
  tint: 'bg-accent-tint text-ink',
  danger: 'border border-accent/20 bg-accent-tint text-danger',
};

export function NoticeBox({
  children,
  title,
  icon = 'info',
  tone = 'gray',
  className,
}: NoticeBoxProps) {
  return (
    <div
      className={cx(
        'flex gap-2.5 rounded-field p-3.5 text-[13px] leading-5',
        TONES[tone],
        className,
      )}
      role={tone === 'danger' ? 'alert' : undefined}
    >
      <Icon
        name={icon}
        size={18}
        className={cx(
          'mt-px shrink-0',
          tone !== 'gray' && 'text-accent',
          tone === 'danger' && 'text-danger',
        )}
      />
      <div className="min-w-0">
        {title && <p className="mb-0.5 text-sm font-semibold">{title}</p>}
        <div className={tone === 'danger' ? 'text-ink' : undefined}>{children}</div>
      </div>
    </div>
  );
}
