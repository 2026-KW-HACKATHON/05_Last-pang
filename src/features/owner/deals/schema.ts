import { z } from 'zod';

const couponTtlSchema = z.union([z.literal(10), z.literal(15), z.literal(20), z.literal(30)]);

export const dealBaseSchema = z.object({
  title: z.string().trim().min(1, '딜 이름을 입력해 주세요').max(40, '40자까지 쓸 수 있어요'),
  originalPrice: z.number().int().positive('정가를 입력해 주세요'),
  dealPrice: z.number().int().positive('할인가를 입력해 주세요'),
  totalQty: z.number().int().min(1).max(100, '최대 100개까지예요'),
  durationMin: z.union([z.literal(60), z.literal(120), z.literal(180)]), // 1·2·3시간 (서버도 같은 값만 받음)
  couponTtlMin: couponTtlSchema,
});

export const dealFormSchema = dealBaseSchema.refine(
  (value) => value.dealPrice < value.originalPrice,
  {
    message: '할인가는 정상가보다 낮아야 해요',
    path: ['dealPrice'],
  },
);
export type DealFormInput = z.infer<typeof dealFormSchema>;

const hhmm = z.string().regex(/^\d{2}:\d{2}$/); // <input type="time"> 값

export const weeklyDealSchema = z
  .object({
    title: z.string().trim().min(1, '딜 이름을 입력해 주세요').max(40),
    originalPrice: z.number().int().positive(),
    dealPrice: z.number().int().positive(),
    repeatDays: z.array(z.number().int().min(0).max(6)).min(1, '요일을 하나 이상 골라 주세요'),
    startTime: hhmm,
    endTime: hhmm,
    qty: z.number().int().min(1).max(100),
    couponTtlMin: couponTtlSchema,
  })
  .refine((value) => value.dealPrice < value.originalPrice, {
    message: '할인가는 정상가보다 낮아야 해요',
    path: ['dealPrice'],
  })
  .refine((value) => value.endTime > value.startTime, {
    message: '종료 시각이 시작보다 늦어야 해요',
    path: ['endTime'],
  });
export type WeeklyDealInput = z.infer<typeof weeklyDealSchema>;

/** 정상가·할인가로 화면에 보여 줄 할인율(%)과 아끼는 금액 */
export function calcDiscount(originalPrice: number, dealPrice: number) {
  if (originalPrice <= 0 || dealPrice >= originalPrice) return { percent: 0, saved: 0 };
  const saved = originalPrice - dealPrice;
  return { percent: Math.round((saved / originalPrice) * 100), saved };
}
