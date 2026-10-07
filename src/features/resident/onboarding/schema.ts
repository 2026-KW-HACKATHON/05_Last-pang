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
