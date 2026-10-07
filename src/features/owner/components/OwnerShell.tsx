import { OwnerTabBar } from './OwnerTabBar';

import type { ReactNode } from 'react';

/** 탭 바가 있는 사장님 화면의 틀 (아래 탭 바만큼 여백) */
export function OwnerShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-28">
      {children}
      <OwnerTabBar />
    </div>
  );
}
