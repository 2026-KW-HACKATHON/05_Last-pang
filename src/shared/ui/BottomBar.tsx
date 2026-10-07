import type { ReactNode } from 'react';

interface BottomBarProps {
  children: ReactNode;
}

// 화면 하단 엄지 영역에 고정되는 주요 행동 영역. 본문이 가려지지 않게 같은 높이의 빈칸을 함께 둔다
export function BottomBar({ children }: BottomBarProps) {
  return (
    <>
      <div className="h-28" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[480px] border-t border-line bg-surface px-5 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        {children}
      </div>
    </>
  );
}
