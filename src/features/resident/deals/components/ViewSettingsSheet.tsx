import { useState } from 'react';

import { DEFAULT_RADIUS_M } from '@/shared/constants/domain';
import { walkingMinutes } from '@/shared/lib/geo';
import { BottomSheet } from '@/shared/ui/BottomSheet';

import { RADIUS_OPTIONS } from '../../preferences/constants';

import type { DealSort } from '../types';

const SORT_OPTIONS: { value: DealSort; label: string }[] = [
  { value: 'distance', label: '가까운 순' },
  { value: 'ending', label: '마감 임박 순' },
  { value: 'discount', label: '할인 많은 순' },
];

interface ViewSettingsSheetProps {
  radiusM: number;
  sort: DealSort;
  onApply: (radiusM: number, sort: DealSort) => void;
  onClose: () => void;
}

// 홈 보기 설정 (피그마 R6-1): 걸어갈 거리 3단계 + 정렬
export function ViewSettingsSheet({ radiusM, sort, onApply, onClose }: ViewSettingsSheetProps) {
  const [draftRadiusM, setDraftRadiusM] = useState(radiusM);
  const [draftSort, setDraftSort] = useState(sort);

  const handleResetClick = () => {
    setDraftRadiusM(DEFAULT_RADIUS_M);
    setDraftSort('distance');
  };

  return (
    <BottomSheet title="보기 설정" onClose={onClose}>
      <p className="mb-2 text-sm font-semibold">걸어갈 수 있는 거리</p>
      <div className="space-y-2" role="radiogroup">
        {RADIUS_OPTIONS.map((option) => {
          const isSelected = option.value === draftRadiusM;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setDraftRadiusM(option.value)}
              className={`flex h-13 w-full items-center gap-3 rounded-xl px-4 ring-1 ${isSelected ? 'bg-accent-soft ring-accent' : 'ring-line'}`}
            >
              <span
                className={`size-5 rounded-full ${isSelected ? 'border-[6px] border-accent' : 'border border-line'}`}
              />
              <span className="flex-1 text-left">{option.label}</span>
              <span className="text-sm text-muted">
                {option.distanceLabel} · 도보 {walkingMinutes(option.value)}분
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-5 mb-2 text-sm font-semibold">정렬</p>
      <div className="flex flex-wrap gap-2">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={option.value === draftSort}
            onClick={() => setDraftSort(option.value)}
            className={`rounded-pill px-4 py-2 text-sm ${option.value === draftSort ? 'bg-accent text-white' : 'ring-1 ring-line'}`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-[1fr_2fr] gap-2">
        <button type="button" onClick={handleResetClick} className="h-13 rounded-xl bg-cream">
          초기화
        </button>
        <button
          type="button"
          onClick={() => onApply(draftRadiusM, draftSort)}
          className="h-13 rounded-xl bg-accent font-semibold text-white"
        >
          적용하기
        </button>
      </div>
    </BottomSheet>
  );
}
