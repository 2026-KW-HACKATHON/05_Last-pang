import { z } from 'zod';

import { MAX_RADIUS_M, MIN_RADIUS_M } from '@/shared/constants/domain';
import { categorySchema } from '@/shared/lib/domainSchema';

// 기준 위치는 R4-1 화면에서 따로 저장하므로 이 폼에는 없다
export const preferencesFormSchema = z.object({
  categories: z.array(categorySchema).min(1, '1개 이상 골라 주세요'),
  radiusM: z.number().min(MIN_RADIUS_M).max(MAX_RADIUS_M),
});
export type PreferencesForm = z.infer<typeof preferencesFormSchema>;
