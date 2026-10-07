import { Link } from 'react-router-dom';

import { POLICY } from '@/shared/constants/policy';
import { walkingMinutes } from '@/shared/lib/geo';
import { Icon } from '@/shared/ui/Icon';

import { RADIUS_OPTIONS } from '../../preferences/constants';

interface HomeHeaderProps {
  radiusM: number;
  onNeighborhoodClick: () => void;
  onRadiusClick: () => void;
}

// 동네 선택 · 걸을 거리 칩(보기 설정 열기) · 내 정보 (피그마 R6 기본)
export function HomeHeader({ radiusM, onNeighborhoodClick, onRadiusClick }: HomeHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 bg-gray px-5">
      <button
        type="button"
        onClick={onNeighborhoodClick}
        className="flex items-center gap-1 text-lg font-bold"
      >
        <Icon name="pin" size={22} className="text-accent" />
        {POLICY.neighborhoodName}
        <Icon name="chevronDown" size={16} />
      </button>
      <button
        type="button"
        onClick={onRadiusClick}
        className="ml-auto flex items-center gap-1 rounded-pill bg-surface px-3 py-1.5 text-sm font-semibold"
      >
        <Icon name="walk" size={16} className="text-accent" />
        도보{' '}
        {RADIUS_OPTIONS.find((option) => option.value === radiusM)?.walkMin ??
          walkingMinutes(radiusM)}
        분
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
