import { z } from 'zod';

const requiredCheckSchema = z.boolean().refine((isChecked) => isChecked);

export const consentSchema = z.object({
  isOver14: requiredCheckSchema,
  hasTermsConsent: requiredCheckSchema,
  hasPrivacyConsent: requiredCheckSchema,
  hasLocationConsent: z.boolean(),
  hasPushConsent: z.boolean(),
});
export type ConsentForm = z.infer<typeof consentSchema>;

export const NICKNAME_MAX_LENGTH = 12;

export const nicknameSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(1, '이름을 입력해 주세요')
    .max(NICKNAME_MAX_LENGTH, `${NICKNAME_MAX_LENGTH}자까지 쓸 수 있어요`)
    .regex(/^[가-힣a-zA-Z0-9]+$/, '특수문자는 쓸 수 없어요'),
});
export type NicknameForm = z.infer<typeof nicknameSchema>;
