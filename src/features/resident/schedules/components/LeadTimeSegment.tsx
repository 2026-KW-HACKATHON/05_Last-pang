import { LEAD_OPTIONS } from '../constants';

import type { LeadMin } from '../types';

interface LeadTimeSegmentProps {
  value: LeadMin;
  disabled?: boolean;
  onChange: (leadMin: LeadMin) => void;
}

// 첫 외출 얼마 전에 알릴지 15분/30분/1시간
export function LeadTimeSegment({ value, disabled = false, onChange }: LeadTimeSegmentProps) {
  return (
    <div
      className="grid grid-cols-3 gap-1 rounded-[12px] bg-gray p-1"
      role="radiogroup"
      aria-label="첫 외출 얼마 전에 알릴까요?"
    >
      {LEAD_OPTIONS.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`h-10 rounded-[10px] text-sm disabled:opacity-50 ${
              isSelected ? 'bg-surface font-bold text-accent shadow-sm' : 'text-muted'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
