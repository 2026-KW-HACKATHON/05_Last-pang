import { useState } from 'react';

import { Icon } from '@/shared/ui/Icon';

import type { Platform } from '../platform';

interface InAppBrowserNoticeProps {
  appName: string;
  platform: Platform;
}

// 카카오톡 등 앱 안에서 열렸을 때만: 여기서는 홈 화면 추가가 안 되니 브라우저로 옮기게 한다
export function InAppBrowserNotice({ appName, platform }: InAppBrowserNoticeProps) {
  const [isCopied, setIsCopied] = useState(false);
  const browser = platform === 'ios' ? 'Safari' : 'Chrome';
  const menu = platform === 'ios' ? '⋯ → Safari로 열기' : '⋮ → 다른 브라우저로 열기';

  const handleCopy = () => {
    void navigator.clipboard?.writeText(window.location.origin).then(() => setIsCopied(true));
  };

  return (
    <section className="rounded-card bg-accent-tint p-4">
      <p className="flex items-center gap-1.5 text-[15px] font-bold text-accent">
        <Icon name="alertCircle" size={18} />
        지금은 {appName} 안이에요
      </p>
      <p className="mt-1 text-[13px] leading-5 text-ink">
        여기서는 추가가 안 돼요. <b>{menu}</b>로 {browser}에서 열어 주세요.
      </p>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-3 flex h-9 items-center gap-1.5 rounded-pill bg-surface px-3 text-[13px] font-semibold text-accent ring-1 ring-accent/30"
      >
        <Icon name={isCopied ? 'check' : 'copy'} size={14} />
        {isCopied ? '복사했어요 · 브라우저에 붙여 넣기' : '주소 복사하기'}
      </button>
    </section>
  );
}
