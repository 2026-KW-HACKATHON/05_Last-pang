import { CATEGORIES, type Category } from '@/shared/constants/domain';
import { Icon } from '@/shared/ui/Icon';

interface CategoryPickerProps {
  selected: Category[];
  onToggle: (category: Category) => void;
}

// 좋아하는 가게 (여러 개 선택, 1개 이상)
export function CategoryPicker({ selected, onToggle }: CategoryPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {CATEGORIES.map((category) => {
        const isSelected = selected.includes(category.value);
        return (
          <button
            key={category.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onToggle(category.value)}
            className={`relative flex h-[60px] flex-col items-center justify-center gap-1 rounded-[12px] text-sm ${isSelected ? 'bg-accent-tint text-accent ring-1 ring-accent' : 'bg-gray text-muted'}`}
          >
            {isSelected && (
              <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-accent text-white ring-2 ring-surface">
                <Icon name="check" size={12} strokeWidth={3} />
              </span>
            )}
            <Icon name={category.value} size={22} />
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
