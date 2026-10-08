import { Link } from 'react-router-dom';

import { Icon } from '@/shared/ui/Icon';

import { useMyPreferences } from '../hooks';

// 기준 위치가 없으면 딜 알림 대상(가게까지 걸을 거리)에서 빠진다 → 정할 때까지 계속 보여 준다
export function BaseLocationPrompt({ className = '' }: { className?: string }) {
  const preferences = useMyPreferences();
  if (!preferences.data || preferences.data.baseLat != null) return null;

  return (
    <Link
      to="/me/location"
      className={`flex items-center gap-3 rounded-card bg-accent-tint p-4 ring-1 ring-accent/20 ${className}`}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-accent">
        <Icon name="pin" size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold text-accent">기준 위치를 정해 주세요</span>
        <span className="mt-0.5 block text-[13px] leading-5 text-ink">
          정해야 근처 딜 알림을 받을 수 있어요
        </span>
      </span>
      <span className="shrink-0 rounded-pill bg-accent px-3 py-1.5 text-[13px] font-semibold text-white">
        정하기
      </span>
    </Link>
  );
}
