import { useRegisterSW } from 'virtual:pwa-register/react';

import { Icon } from '@/shared/ui/Icon';

// C7 새 버전 안내: 새 서비스 워커가 기다리면 띄우고, "새로고침"을 눌러야 바꾼다 (sw.ts SKIP_WAITING)
export function UpdateBanner() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();
  if (!needRefresh) return null;
  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-24 z-40 mx-auto flex w-[calc(100%-40px)] max-w-[440px] items-center gap-3 rounded-card bg-surface p-4 shadow-lg ring-1 ring-line"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent">
        <Icon name="download" size={20} />
      </span>
      <span className="flex-1">
        <span className="block font-semibold">업데이트가 준비됐어요</span>
        <span className="text-xs text-muted">새로고침하면 바로 적용돼요</span>
      </span>
      <button
        type="button"
        onClick={() => void updateServiceWorker(true)}
        className="h-10 rounded-[12px] bg-accent px-4 text-sm font-semibold text-white"
      >
        새로고침
      </button>
    </div>
  );
}
