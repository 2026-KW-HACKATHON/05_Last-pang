import { CATEGORIES } from '@/shared/constants/domain';

/** 'bakery' → '베이커리' (모르는 값은 기타) */
export function categoryLabel(value: string): string {
  return CATEGORIES.find((category) => category.value === value)?.label ?? '기타';
}
