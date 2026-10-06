import { z } from 'zod';

export const STORE_CATEGORIES = ['meal', 'cafe', 'bakery', 'snack', 'etc'] as const;

export const storeSignupSchema = z.object({
  name: z.string().trim().min(1, '가게 이름을 입력해 주세요').max(30, '30자까지 쓸 수 있어요'),
  category: z.enum(STORE_CATEGORIES),
  address: z.string().trim().min(1, '주소를 입력해 주세요'),
});
export type StoreSignupInput = z.infer<typeof storeSignupSchema>;

export const storeInfoSchema = storeSignupSchema.pick({ name: true, category: true });
export type StoreInfoInput = z.infer<typeof storeInfoSchema>;
