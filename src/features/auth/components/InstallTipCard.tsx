import { Link } from 'react-router-dom';

import { Icon } from '@/shared/ui/Icon';

// R1 "빠르고 편리한 시작 팁" — 홈 화면에 추가하는 법(R16)으로
export function InstallTipCard() {
  return (
    <Link
      to="/install-guide"
      className="mt-4 flex items-start gap-3 rounded-card bg-accent-tint p-4 text-left shadow-sm"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-accent">
        <Icon name="share" size={18} />
      </span>
      <span>
        <span className="flex items-center gap-2 text-sm font-semibold text-accent">
          빠르고 편리한 시작 팁
          <span className="rounded-pill bg-surface px-2 py-0.5 text-[11px]">추천</span>
        </span>
        <span className="mt-1 block text-[13px] leading-5 text-ink">
          홈 화면에 추가하면 앱처럼 실시간 딜 알림을 놓치지 않아요 (공유 버튼 &gt; 홈 화면에 추가)
        </span>
      </span>
    </Link>
  );
}
