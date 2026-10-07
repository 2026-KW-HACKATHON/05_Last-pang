import { z } from 'zod';

export const STORE_CATEGORIES = ['meal', 'cafe', 'bakery', 'snack', 'etc'] as const;

/** O1 1단계 기본정보 */
export const storeBasicSchema = z.object({
  name: z.string().trim().min(1, '가게 이름을 입력해 주세요').max(30, '30자까지 쓸 수 있어요'),
  category: z.enum(STORE_CATEGORIES),
  address: z.string().trim().min(1, '주소를 검색해 주세요').max(100),
  lat: z.number(),
  lng: z.number(),
});
export type StoreBasicInput = z.infer<typeof storeBasicSchema>;

/** 하이픈을 뺀 숫자만 */
export const onlyDigits = (value: string) => value.replace(/\D/g, '');

/** 1234567890 → 123-45-67890 (입력하면서 자동으로) */
export function formatBusinessNo(value: string): string {
  const digits = onlyDigits(value).slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

/** O1-2 2단계 사업자 정보 */
export const businessInfoSchema = z.object({
  representativeName: z.string().trim().min(1, '대표자 이름을 입력해 주세요').max(20),
  businessNo: z
    .string()
    .transform(onlyDigits)
    .pipe(z.string().regex(/^\d{10}$/, '숫자 10자리를 입력해 주세요')),
  phone: z.string().trim().max(20).optional(),
});
export type BusinessInfoInput = z.infer<typeof businessInfoSchema>;

export const LICENSE_MAX_BYTES = 10 * 1024 * 1024;
export const LICENSE_TYPES = ['image/jpeg', 'image/png'] as const;

export function checkLicenseFile(file: File): string | null {
  if (!(LICENSE_TYPES as readonly string[]).includes(file.type))
    return 'JPG·PNG 사진만 올릴 수 있어요';
  if (file.size > LICENSE_MAX_BYTES) return '10MB 이하 사진만 올릴 수 있어요';
  return null;
}

/** O9 가게 정보 수정 */
export const storeInfoSchema = z.object({
  name: storeBasicSchema.shape.name,
  category: storeBasicSchema.shape.category,
  description: z.string().trim().max(40, '40자까지 쓸 수 있어요').optional(),
});
export type StoreInfoInput = z.infer<typeof storeInfoSchema>;
