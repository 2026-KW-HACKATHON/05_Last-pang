import { z } from 'zod';

import { fetchCurrentUserId } from '@/shared/lib/currentUser';
import { toAppError } from '@/shared/lib/errors';
import { unwrapRpc } from '@/shared/lib/rpc';
import { supabase } from '@/shared/lib/supabase';

import type { StoreInfoInput } from './schema';

const storeStatusSchema = z.enum(['pending', 'approved', 'rejected', 'suspended']);
export type StoreStatus = z.infer<typeof storeStatusSchema>;

// get_my_store RPC 결과 (사업자번호는 서버가 뒤 5자리를 가려서 보낸다)
const myStoreRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string().nullable(),
  address: z.string(),
  lat: z.number(),
  lng: z.number(),
  status: storeStatusSchema,
  reject_code: z.string().nullable(),
  reject_reason: z.string().nullable(),
  submitted_at: z.string(),
  reviewed_at: z.string().nullable(),
  approved_at: z.string().nullable(),
  suspended_at: z.string().nullable(),
  suspend_code: z.string().nullable(),
  suspend_note: z.string().nullable(),
  representative_name: z.string().nullable(),
  phone: z.string().nullable(),
  business_no_masked: z.string().nullable(),
  pending_address: z.string().nullable(),
  address_requested_at: z.string().nullable(),
  confirmed_report_count: z.number(),
  code_issued: z.boolean(),
});

export interface MyStore {
  id: string;
  name: string;
  category: string;
  description: string | null;
  address: string;
  lat: number;
  lng: number;
  status: StoreStatus;
  rejectCode: string | null;
  rejectReason: string | null;
  submittedAt: string;
  approvedAt: string | null;
  suspendedAt: string | null;
  suspendNote: string | null;
  representativeName: string | null;
  phone: string | null;
  businessNoMasked: string | null;
  pendingAddress: string | null;
  confirmedReportCount: number;
  isCodeIssued: boolean;
}

/** 내 가게. 아직 신청 안 했으면 null */
export async function fetchMyStore(): Promise<MyStore | null> {
  const { data, error } = await supabase.rpc('get_my_store');
  if (error) throw toAppError(error);
  if (!data) return null;
  const row = myStoreRowSchema.parse(data);
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    status: row.status,
    rejectCode: row.reject_code,
    rejectReason: row.reject_reason,
    submittedAt: row.submitted_at,
    approvedAt: row.approved_at,
    suspendedAt: row.suspended_at,
    suspendNote: row.suspend_note,
    representativeName: row.representative_name,
    phone: row.phone,
    businessNoMasked: row.business_no_masked,
    pendingAddress: row.pending_address,
    confirmedReportCount: row.confirmed_report_count,
    isCodeIssued: row.code_issued,
  };
}

export interface StoreApplication {
  name: string;
  category: string;
  description?: string;
  address: string;
  lat: number;
  lng: number;
  representativeName: string;
  businessNo: string; // 숫자 10자리
  phone?: string;
  licensePath?: string; // 재신청에서 비우면 이전 사진을 그대로 쓴다
  marketingAgreed: boolean;
}

/** 입점 신청 (거절된 가게면 같은 함수로 재신청) */
export async function registerStore(input: StoreApplication) {
  const { data, error } = await supabase.rpc('register_store', {
    p_name: input.name,
    p_category: input.category,
    p_address: input.address,
    p_lat: input.lat,
    p_lng: input.lng,
    p_representative_name: input.representativeName,
    p_business_no: input.businessNo,
    p_phone: input.phone,
    p_license_path: input.licensePath,
    p_description: input.description,
    p_marketing_agreed: input.marketingAgreed,
  });
  return unwrapRpc(data, error, z.object({ store_id: z.string().uuid() }));
}

/** 사업자등록증 사진 업로드 → Storage 경로. 첫 폴더가 내 id여야 RLS를 통과한다 */
export async function uploadBusinessLicense(file: File): Promise<string> {
  const userId = await fetchCurrentUserId();
  const extension = file.type === 'image/png' ? 'png' : 'jpg';
  const path = `${userId}/license-${Date.now()}.${extension}`;
  const { error } = await supabase.storage
    .from('business-licenses')
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw toAppError(error);
  return path;
}

/** 가게 코드 새로 발급. 원문은 이 응답에서 한 번만 받는다 (DB에는 해시만) */
export async function rotateStoreCode(): Promise<string> {
  const { data, error } = await supabase.rpc('rotate_store_code');
  return unwrapRpc(data, error, z.object({ code: z.string().regex(/^\d{6}$/) })).code;
}

/** 가게 이름·업종·한 줄 소개 수정 (주소는 requestAddressChange로 다시 심사) */
export async function updateStoreInfo(storeId: string, input: StoreInfoInput): Promise<void> {
  const { error } = await supabase
    .from('stores')
    .update({ name: input.name, category: input.category, description: input.description || null })
    .eq('id', storeId);
  if (error) throw toAppError(error);
}

export async function requestAddressChange(input: { address: string; lat: number; lng: number }) {
  const { data, error } = await supabase.rpc('request_store_address_change', {
    p_address: input.address,
    p_lat: input.lat,
    p_lng: input.lng,
  });
  return unwrapRpc(data, error, z.object({ store_id: z.string() }));
}

/** 운영자가 미리 등록한 가게를 내 계정에 잇기 (연결 코드 8자리) */
export async function linkStoreByCode(code: string) {
  const { data, error } = await supabase.rpc('link_store_by_code', { p_code: code });
  return unwrapRpc(data, error, z.object({ store_id: z.string() }));
}

/** 회원 탈퇴 (가게는 정지되고 기록은 남는다) */
export async function deleteMyAccount(): Promise<void> {
  const { data, error } = await supabase.rpc('delete_my_account');
  unwrapRpc(data, error, z.object({ deleted: z.boolean() }));
  await supabase.auth.signOut();
}
