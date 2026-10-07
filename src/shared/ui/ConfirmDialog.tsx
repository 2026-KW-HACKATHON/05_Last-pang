import { createPortal } from 'react-dom';

interface ConfirmDialogProps {
  title: string;
  description?: string;
  confirmLabel: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// 되돌리기 어려운 행동(로그아웃·삭제) 전에 거치는 확인 팝업. 취소/확인 2버튼
export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // 상단 바(sticky z-20) 안에서 열려도 화면 맨 위에 뜨도록 body로 옮겨 그린다
  return createPortal(
    <div className="fixed inset-0 z-40 flex items-center justify-center px-6" role="alertdialog">
      <div className="absolute inset-0 bg-ink/40" aria-hidden="true" />
      <div className="relative w-full max-w-[342px] rounded-card bg-surface p-6 text-center">
        <h2 className="text-lg font-bold">{title}</h2>
        {description && <p className="mt-2 text-sm text-muted">{description}</p>}
        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 rounded-button bg-gray font-semibold text-muted"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="h-12 rounded-button bg-accent font-semibold text-white disabled:opacity-50"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
