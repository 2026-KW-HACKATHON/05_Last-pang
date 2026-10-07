import { Link } from 'react-router-dom';

import { walkingMinutes } from '@/shared/lib/geo';
import { Icon } from '@/shared/ui/Icon';

interface HomeHeaderProps {
  radiusM: number;
  onRadiusClick: () => void;
}

// 지역 표시 · 걸을 거리 칩(보기 설정 열기) · 내 정보
export function HomeHeader({ radiusM, onRadiusClick }: HomeHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 bg-cream px-5">
      <span className="flex items-center gap-1 text-lg font-bold">
        <Icon name="pin" size={22} className="text-accent" />
        월계1동
      </span>
      <button
        type="button"
        onClick={onRadiusClick}
        className="ml-auto flex items-center gap-1 rounded-pill bg-surface px-3 py-1.5 text-sm font-semibold"
      >
        <Icon name="walk" size={16} className="text-accent" />
        도보 {walkingMinutes(radiusM)}분
        <Icon name="chevronDown" size={14} />
      </button>
      <Link
        to="/me"
        aria-label="내 정보"
        className="flex size-9 items-center justify-center rounded-full bg-surface"
      >
        <Icon name="user" size={20} />
      </Link>
    </header>
  );
}
