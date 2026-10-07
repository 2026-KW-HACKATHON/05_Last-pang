import { Icon, type IconName } from '@/shared/ui/Icon';

interface IconConfirmDialogProps {
  icon: IconName;
  title: string;
  description: string;
  confirmLabel: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// 공용 ConfirmDialog 모양에 위쪽 분홍 아이콘을 더한 확인 팝업 (R12-1 로그아웃, R14 탈퇴)
export function IconConfirmDialog({
  icon,
  title,
  description,
  confirmLabel,
  isPending = false,
  onConfirm,
  onCancel,
}: IconConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-6" role="alertdialog">
      <div className="absolute inset-0 bg-ink/40" aria-hidden="true" />
      <div className="relative w-full max-w-[342px] rounded-card bg-surface p-6 text-center">
        <span className="mx-auto flex size-13 items-center justify-center rounded-full bg-accent-tint text-accent">
          <Icon name={icon} size={24} />
        </span>
        <h2 className="mt-4 text-lg font-bold">{title}</h2>
        <p className="mt-2 text-sm whitespace-pre-line text-muted">{description}</p>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 rounded-button bg-gray font-semibold text-ink"
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
    </div>
  );
}
