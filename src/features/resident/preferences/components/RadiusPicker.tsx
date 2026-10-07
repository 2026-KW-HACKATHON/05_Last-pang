import { DEFAULT_RADIUS_M } from '@/shared/constants/domain';
import { walkingMinutes } from '@/shared/lib/geo';

import { RADIUS_OPTIONS } from '../constants';

interface RadiusPickerProps {
  value: number;
  onChange: (radiusM: number) => void;
}

export function RadiusPicker({ value, onChange }: RadiusPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-2" role="radiogroup">
      {RADIUS_OPTIONS.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={`relative h-16 rounded-xl ${isSelected ? 'bg-accent-tint text-accent' : 'bg-gray'}`}
          >
            {option.value === DEFAULT_RADIUS_M && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-pill bg-accent px-2 text-xs text-white">
                추천
              </span>
            )}
            <span className="block">{option.label}</span>
            <span className={`text-xs ${isSelected ? '' : 'text-muted'}`}>
              {option.distanceLabel} · 도보 {walkingMinutes(option.value)}분
            </span>
          </button>
        );
      })}
    </div>
  );
}
