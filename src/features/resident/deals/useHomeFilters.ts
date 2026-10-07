import { useSearchParams } from 'react-router-dom';

import { CATEGORIES, type Category } from '@/shared/constants/domain';

import type { DealSort } from './types';

const toCategory = (value: string | null) =>
  CATEGORIES.find((category) => category.value === value)?.value ?? null;
const toSort = (value: string | null): DealSort =>
  value === 'ending' || value === 'discount' ? value : 'distance';

/** 업종·정렬은 쿼리스트링에 둔다: 상세에 갔다 돌아와도 그대로 (컨벤션 7장) */
export function useHomeFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const setCategory = (next: Category | null) => {
    setSearchParams((prev) => {
      if (next) prev.set('category', next);
      else prev.delete('category');
      return prev;
    });
  };

  const setSort = (next: DealSort) => {
    setSearchParams((prev) => {
      prev.set('sort', next);
      return prev;
    });
  };

  return {
    category: toCategory(searchParams.get('category')),
    sort: toSort(searchParams.get('sort')),
    setCategory,
    setSort,
  };
}
