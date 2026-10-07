import { CATEGORIES, type Category } from '@/shared/constants/domain';

interface CategoryChipsProps {
  selected: Category | null; // null = 전체
  onSelect: (category: Category | null) => void;
}

// 업종 필터 (가로 스크롤, 하나만 선택)
export function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  const chips = [{ value: null, label: '전체' }, ...CATEGORIES];

  return (
    <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
      {chips.map((chip) => {
        const isSelected = chip.value === selected;
        return (
          <button
            key={chip.value ?? 'all'}
            type="button"
            onClick={() => onSelect(chip.value)}
            aria-pressed={isSelected}
            className={`shrink-0 rounded-pill px-4 py-2 text-sm font-semibold ${isSelected ? 'bg-accent text-white' : 'bg-surface text-sub ring-1 ring-line'}`}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
