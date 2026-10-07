import { useState } from 'react';

import { Icon } from '@/features/owner/components/Icon';
import { Button } from '@/features/owner/components/ui/Button';

interface OneTimeCodeDialogProps {
  title: string;
  code: string;
  description: string;
  onClose: () => void;
}

/** 새로 만든 코드를 한 번만 보여 주는 창 (가게 코드 6자리 · 연결 코드 8자리) */
export function OneTimeCodeDialog({ title, code, description, onClose }: OneTimeCodeDialogProps) {
  const [isCopied, setIsCopied] = useState(false);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-full max-w-[340px] rounded-dialog bg-surface p-6 text-center">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-4 rounded-field bg-gray py-4 font-mono text-3xl font-bold tracking-[6px]">
          {code}
        </p>
        <p className="mt-3 flex items-start gap-1 text-left text-[13px] text-danger">
          <Icon name="alert" size={14} className="mt-0.5 shrink-0" /> 이 창을 닫으면 다시 볼 수
          없어요. {description}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() => void navigator.clipboard?.writeText(code).then(() => setIsCopied(true))}
          >
            {isCopied ? '복사했어요' : '복사'}
          </Button>
          <Button size="md" onClick={onClose}>
            적어두었어요
          </Button>
        </div>
      </div>
    </div>
  );
}
