import { COLOR_ORDER, COLOR_STYLES } from '../constants';

import type { ScheduleColor } from '../types';

interface ColorSwatchesProps {
  value: ScheduleColor;
  onChange: (color: ScheduleColor) => void;
}

const COLOR_NAMES: Record<ScheduleColor, string> = {
  crimson: '분홍',
  orange: '주황',
  yellow: '노랑',
  green: '초록',
  blue: '파랑',
  purple: '보라',
  gray: '회색',
};

// 블록 색 고르기 (R13-3)
export function ColorSwatches({ value, onChange }: ColorSwatchesProps) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="색">
      {COLOR_ORDER.map((color) => {
        const isSelected = color === value;
        return (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={COLOR_NAMES[color]}
            onClick={() => onChange(color)}
            className={`size-8 rounded-[8px] ${COLOR_STYLES[color].block} ${
              isSelected ? 'ring-2 ring-accent ring-offset-1' : ''
            }`}
          />
        );
      })}
    </div>
  );
}
