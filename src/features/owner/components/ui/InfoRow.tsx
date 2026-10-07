import { cx } from '../../lib/styles';

import type { ReactNode } from 'react';

interface InfoRowProps {
  label: string;
  value: ReactNode;
  isStrong?: boolean;
}

/** 회색 정보 박스 안 "라벨 ··· 값" 한 줄 */
export function InfoRow({ label, value, isStrong = false }: InfoRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
      <span className="shrink-0 text-muted">{label}</span>
      <span className={cx('min-w-0 text-right break-all', isStrong && 'font-semibold')}>
        {value}
      </span>
    </div>
  );
}
