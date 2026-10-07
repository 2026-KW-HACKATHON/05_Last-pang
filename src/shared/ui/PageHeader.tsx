import { useNavigate } from 'react-router-dom';

import { Icon } from './Icon';

import type { ReactNode } from 'react';

interface PageHeaderProps {
  title?: string;
  hasBack?: boolean;
  right?: ReactNode;
}

// 모바일 상단 바: 뒤로가기 · 제목 · 오른쪽 행동. 하단 탭이 있는 화면은 hasBack 없이 큰 제목만
export function PageHeader({ title, hasBack = false, right }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    // 공유 링크로 바로 들어와 이전 기록이 없으면 홈으로 보낸다
    if (window.history.length > 1) navigate(-1);
    else navigate('/', { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 bg-cream px-4">
      {hasBack && (
        <button
          type="button"
          onClick={handleBackClick}
          aria-label="뒤로 가기"
          className="-ml-2 p-2"
        >
          <Icon name="back" size={24} />
        </button>
      )}
      {title && <h1 className={`flex-1 font-bold ${hasBack ? 'text-lg' : 'text-xl'}`}>{title}</h1>}
      {right && <div className="ml-auto flex items-center gap-2">{right}</div>}
    </header>
  );
}
