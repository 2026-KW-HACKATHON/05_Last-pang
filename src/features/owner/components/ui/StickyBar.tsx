import type { ReactNode } from 'react';

/** 화면 아래 고정 버튼 영역 (흰 바탕 + 위 구분선). 내용이 가려지지 않게 부모에 pb-28을 준다 */
export function StickyBar({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[480px] border-t border-line bg-surface px-5 pt-3 pb-[max(16px,env(safe-area-inset-bottom))]">
      {children}
    </div>
  );
}
