import { z } from 'zod';

import { STORE_CATEGORIES } from '@/features/owner/store/schema';

/** 운영자 가게 추가·수정 입력 (사업자 정보는 선택: 시연용 가게는 없을 수 있다) */
export const adminStoreSchema = z.object({
  name: z.string().trim().min(1, '가게 이름을 입력해 주세요').max(30),
  category: z.enum(STORE_CATEGORIES),
  description: z.string().trim().max(40).optional(),
  address: z.string().trim().min(1, '주소를 넣어 주세요').max(100),
  lat: z.number().min(33).max(39),
  lng: z.number().min(124).max(132),
  representativeName: z.string().trim().max(20).optional(),
  businessNo: z
    .string()
    .transform((value) => value.replace(/\D/g, ''))
    .pipe(z.string().regex(/^(\d{10})?$/, '숫자 10자리를 입력해 주세요'))
    .optional(),
  phone: z.string().trim().max(20).optional(),
});
export type AdminStoreDraft = z.input<typeof adminStoreSchema>;

export const EMPTY_ADMIN_STORE: AdminStoreDraft = {
  name: '',
  category: 'meal',
  description: '',
  address: '',
  lat: 0,
  lng: 0,
  representativeName: '',
  businessNo: '',
  phone: '',
};
