import type { Category } from '@/shared/constants/domain';

import { Icon, type IconName } from './Icon';

const CATEGORY_ICONS: Record<Category, IconName> = {
  meal: 'bowl',
  cafe: 'cup',
  bakery: 'bread',
  snack: 'skewer',
  etc: 'bag',
};

const isCategory = (value: string): value is Category => value in CATEGORY_ICONS;

/** 사진 대신 쓰는 업종 아이콘 원 (Stitch: 44px, 연분홍 원) */
export function CategoryIcon({ category, size = 44 }: { category: string; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-pill bg-accent-tint text-accent"
      style={{ width: size, height: size }}
    >
      <Icon
        name={isCategory(category) ? CATEGORY_ICONS[category] : 'bag'}
        size={Math.round(size * 0.5)}
      />
    </span>
  );
}
