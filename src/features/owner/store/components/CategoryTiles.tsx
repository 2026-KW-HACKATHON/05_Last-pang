import { CATEGORIES } from '@/shared/constants/domain';

import { CategoryIcon } from '../../components/CategoryIcon';

interface CategoryTilesProps {
  value: string;
  onChange: (value: (typeof CATEGORIES)[number]['value']) => void;
}

/** 업종 아이콘 타일 5개 (O1 · O9 · 운영자 가게 추가) */
export function CategoryTiles({ value, onChange }: CategoryTilesProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {CATEGORIES.map((category) => {
        const isSelected = category.value === value;
        return (
          <button
            key={category.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(category.value)}
            className={`flex h-[76px] flex-col items-center justify-center gap-1 rounded-field text-sm transition-colors ${
              isSelected ? 'bg-accent font-semibold text-white' : 'bg-accent-tint text-accent'
            }`}
          >
            <span
              className={
                isSelected
                  ? '[&>span]:bg-transparent [&>span]:text-white'
                  : '[&>span]:bg-transparent'
              }
            >
              <CategoryIcon category={category.value} size={32} />
            </span>
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
