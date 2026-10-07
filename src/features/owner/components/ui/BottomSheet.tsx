import { Icon } from '../Icon';

import type { ReactNode } from 'react';

interface BottomSheetProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}

/** 아래에서 올라오는 시트: 손잡이 + 제목 + 오른쪽 위 ✕ (피그마 A1 거절 사유·A2 정지 사유) */
export function BottomSheet({ title, subtitle, onClose, children }: BottomSheetProps) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink/50"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button type="button" aria-label="닫기" className="absolute inset-0" onClick={onClose} />
      <div className="relative max-h-[90dvh] w-full max-w-[480px] overflow-y-auto rounded-t-dialog bg-surface px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))]">
        <div className="mx-auto mb-4 h-1 w-10 rounded-pill bg-line" />
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          </div>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex size-9 shrink-0 items-center justify-center rounded-pill bg-gray"
          >
            <Icon name="x" size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
