// DB check 제약과 같은 값만 통과시키는 zod 스키마. 값의 기준은 constants/domain.ts
import { z } from 'zod';

import { CATEGORIES, TIME_SLOTS, type Category, type TimeSlot } from '@/shared/constants/domain';

export const categorySchema = z.custom<Category>((value) =>
  CATEGORIES.some((category) => category.value === value),
);

export const timeSlotSchema = z.custom<TimeSlot>((value) =>
  TIME_SLOTS.some((slot) => slot.value === value),
);
