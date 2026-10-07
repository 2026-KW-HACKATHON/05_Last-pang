import { useNavigate } from 'react-router-dom';

import { Icon } from '../Icon';

import type { ReactNode } from 'react';

interface TopBarProps {
  title: string;
  right?: ReactNode;
  /** 뒤로 버튼을 숨길 때 (완료 화면) */
  hideBack?: boolean;
  /** 뒤로 대신 갈 곳. 없으면 브라우저 뒤로 */
  backTo?: string;
  /** 단계 화면처럼 뒤로를 직접 처리할 때 */
  onBack?: () => void;
}

/** 하위 화면 상단 바: 회색 면 56px, 왼쪽 < + 제목 (피그마 최종) */
export function TopBar({ title, right, hideBack = false, backTo, onBack }: TopBarProps) {
  const navigate = useNavigate();
  const handleBack = () => {
    if (onBack) onBack();
    else if (backTo) navigate(backTo);
    else navigate(-1);
  };
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-1 bg-gray px-2">
      {!hideBack && (
        <button
          type="button"
          aria-label="뒤로"
          onClick={handleBack}
          className="flex size-11 items-center justify-center rounded-pill text-ink"
        >
          <Icon name="back" />
        </button>
      )}
      <h1 className={`flex-1 truncate text-lg font-semibold ${hideBack ? 'pl-3' : ''}`}>{title}</h1>
      {right && <div className="flex items-center gap-1 pr-2">{right}</div>}
    </header>
  );
}
