import { createPortal } from 'react-dom';

import { Icon } from './Icon';

import type { ReactNode } from 'react';

interface BottomSheetProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

// 화면 아래에서 올라오는 시트. 바깥 어두운 곳을 누르면 닫힌다
export function BottomSheet({ title, onClose, children }: BottomSheetProps) {
  // 상단 바(sticky z-20) 안에서 열려도 화면 맨 위에 뜨도록 body로 옮겨 그린다
  return createPortal(
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40"
      />
      <section className="absolute inset-x-0 bottom-0 mx-auto max-w-[480px] rounded-t-3xl bg-surface px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))]">
        <div className="mx-auto mb-4 h-1 w-10 rounded-pill bg-line" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="닫기">
            <Icon name="close" size={24} />
          </button>
        </div>
        {children}
      </section>
    </div>,
    document.body,
  );
}
