import { z } from 'zod';

import { MAX_RADIUS_M, MIN_RADIUS_M } from '@/shared/constants/domain';
import { categorySchema } from '@/shared/lib/domainSchema';

export const preferencesFormSchema = z.object({
  categories: z.array(categorySchema).min(1, '좋아하는 가게를 1개 이상 골라 주세요'),
  radiusM: z.number().min(MIN_RADIUS_M).max(MAX_RADIUS_M),
  baseLat: z.number().nullable(),
  baseLng: z.number().nullable(),
});
export type PreferencesForm = z.infer<typeof preferencesFormSchema>;
