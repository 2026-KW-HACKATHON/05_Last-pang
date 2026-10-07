import { Icon, type IconName } from '../Icon';
import { Button } from './Button';

import type { ReactNode } from 'react';

interface ConfirmDialogProps {
  title: string;
  body?: ReactNode;
  icon?: IconName;
  confirmLabel: string;
  isPending?: boolean;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** 가운데 확인 팝업: 연분홍 원 아이콘 + 제목 + 본문 + 취소/확정 (피그마 A3 확정 확인·O3 종료 팝업) */
export function ConfirmDialog({
  title,
  body,
  icon = 'alert',
  confirmLabel,
  isPending,
  isDanger,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-ink/50 px-6 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-full max-w-[340px] rounded-dialog bg-surface p-6 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-pill bg-accent-tint text-accent">
          <Icon name={icon} size={26} />
        </span>
        <h2 className="mt-4 text-lg font-bold">{title}</h2>
        {body && (
          <div className="mt-2 text-sm leading-[22px] whitespace-pre-line text-muted">{body}</div>
        )}
        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button variant="secondary" size="md" onClick={onCancel} disabled={isPending}>
            취소
          </Button>
          <Button
            size="md"
            isLoading={isPending}
            onClick={onConfirm}
            className={isDanger ? 'bg-danger active:bg-danger' : undefined}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
