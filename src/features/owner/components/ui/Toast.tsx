import { Icon } from '../Icon';

import type { ReactNode } from 'react';

/** 화면 아래쪽 흰 알약 알림 (피그마 A1 승인 완료). 몇 초 뒤 부모가 지운다 */
export function Toast({
  children,
  tone = 'success',
}: {
  children: ReactNode;
  tone?: 'success' | 'error';
}) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-28 z-50 flex justify-center px-5"
      role="status"
    >
      <div className="flex items-center gap-2 rounded-pill bg-surface px-4 py-3 text-sm text-ink shadow-[0_8px_24px_rgb(0_0_0/0.16)]">
        <span
          className={`flex size-5 items-center justify-center rounded-pill text-white ${tone === 'success' ? 'bg-accent' : 'bg-ink'}`}
        >
          <Icon name={tone === 'success' ? 'check' : 'alert'} size={14} />
        </span>
        {children}
      </div>
    </div>
  );
}
