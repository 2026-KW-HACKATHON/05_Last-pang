import { KIND_CHIPS } from '../constants';

import type { ScheduleColor, ScheduleKind } from '../types';

interface KindChipsProps {
  selected: ScheduleKind | null;
  onSelect: (kind: ScheduleKind, label: string, color: ScheduleColor) => void;
}

// 이름 입력 아래 빠른 선택: 수업/출근/알바/운동/학원
export function KindChips({ selected, onSelect }: KindChipsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {KIND_CHIPS.map((chip) => {
        const isSelected = chip.kind === selected;
        return (
          <button
            key={chip.kind}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(chip.kind, chip.label, chip.color)}
            className={`rounded-pill px-3 py-1.5 text-sm ${
              isSelected ? 'bg-accent font-semibold text-white' : 'bg-gray text-muted'
            }`}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
