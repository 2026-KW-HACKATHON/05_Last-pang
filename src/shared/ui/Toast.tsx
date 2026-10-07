import { useEffect } from 'react';

import { Icon } from './Icon';

const TOAST_DURATION_MS = 3000;

interface ToastProps {
  message: string;
  onClose: () => void;
}

// 화면 아래쪽에 잠깐 떴다가 사라지는 안내. 띄울지 말지는 부모의 useState가 정한다
export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timerId = window.setTimeout(onClose, TOAST_DURATION_MS);
    return () => window.clearTimeout(timerId);
  }, [message, onClose]);

  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-36 z-[60] mx-auto flex w-[calc(100%-40px)] max-w-[440px] items-center gap-3 rounded-pill bg-surface px-5 py-3 shadow-lg ring-1 ring-line"
    >
      <span className="flex size-6 items-center justify-center rounded-full bg-success text-white">
        <Icon name="check" size={16} strokeWidth={2.5} />
      </span>
      <p className="flex-1 text-sm text-muted">{message}</p>
      <button type="button" onClick={onClose} aria-label="닫기" className="text-faint">
        <Icon name="close" size={18} />
      </button>
    </div>
  );
}
