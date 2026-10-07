import { useCallback, useState } from 'react';

import { BottomBar } from '@/shared/ui/BottomBar';
import { Icon } from '@/shared/ui/Icon';
import { Toast } from '@/shared/ui/Toast';

interface PushUnsupportedViewProps {
  onFinish: () => void;
}

// 알림을 지원하지 않는 브라우저 (R5-1 · 카카오톡 인앱 브라우저 등)
export function PushUnsupportedView({ onFinish }: PushUnsupportedViewProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const handleToastClose = useCallback(() => setToastMessage(null), []);

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(window.location.origin)
      .then(() => setToastMessage('링크를 복사했어요'))
      .catch(() => setToastMessage('복사하지 못했어요. 주소창의 링크를 길게 눌러 주세요'));
  };

  return (
    <div className="px-5 pt-8 text-center">
      <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-gray text-muted">
        <Icon name="bellOff" size={36} />
      </span>
      <h1 className="mt-5 text-2xl leading-snug font-bold">
        이 브라우저에서는
        <br />
        알림을 받을 수 없어요
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Chrome이나 Safari(홈 화면에 추가)에서 열면
        <br />
        알림을 받을 수 있어요.
      </p>
      <p className="mt-6 flex gap-2 rounded-card bg-gray p-4 text-left text-xs leading-relaxed text-muted">
        <Icon name="info" size={16} className="shrink-0" />
        <span>
          카카오톡 안에서 열었다면 오른쪽 아래 메뉴에서
          <br />
          ‘다른 브라우저로 열기’를 눌러 주세요.
        </span>
      </p>
      <BottomBar>
        <button
          type="button"
          onClick={onFinish}
          className="h-[52px] w-full rounded-[12px] bg-accent font-semibold text-white"
        >
          이대로 시작하기
        </button>
        <button
          type="button"
          onClick={handleCopyClick}
          className="mt-2 h-10 w-full rounded-[12px] bg-gray text-sm text-muted"
        >
          링크 복사하기
        </button>
      </BottomBar>
      {toastMessage && <Toast message={toastMessage} onClose={handleToastClose} />}
    </div>
  );
}
