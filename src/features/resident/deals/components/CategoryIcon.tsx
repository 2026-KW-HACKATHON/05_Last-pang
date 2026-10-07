import type { Category } from '@/shared/constants/domain';
import { Icon } from '@/shared/ui/Icon';

interface CategoryIconProps {
  category: Category;
  isMuted?: boolean;
}

// 딜 카드 왼쪽의 업종 그림 칸
export function CategoryIcon({ category, isMuted = false }: CategoryIconProps) {
  return (
    <span
      className={`flex size-12 shrink-0 items-center justify-center rounded-field ${isMuted ? 'bg-surface text-faint ring-1 ring-line' : 'bg-accent-tint text-accent'}`}
    >
      <Icon name={category} size={26} />
    </span>
  );
}
