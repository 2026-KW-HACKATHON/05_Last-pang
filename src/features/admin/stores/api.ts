// 운영자: 입점 심사(A1·A1-1) · 가맹점 관리(A2) · 가게 직접 추가·삭제와 대신 딜 올리기(시연용)
// 사업자 정보·사장님 닉네임이 담기므로 모두 운영자 전용 RPC로 읽는다 (RPC 안에서 is_admin 확인)
import { z } from 'zod';

import { toAppError } from '@/shared/lib/errors';
import { unwrapRpc } from '@/shared/lib/rpc';
import { supabase } from '@/shared/lib/supabase';

/* ───── A1 입점 심사 ───── */
export type ApplicationTab = 'pending' | 'approved' | 'rejected';

const applicationSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string().nullable(),
  address: z.string(),
  lat: z.number(),
  lng: z.number(),
  status: z.string(),
  submitted_at: z.string(),
  reviewed_at: z.string().nullable(),
  reject_code: z.string().nullable(),
  reject_reason: z.string().nullable(),
  pending_address: z.string().nullable(),
  is_address_change: z.boolean(),
  owner_nickname: z.string().nullable(),
});
export type Application = z.infer<typeof applicationSchema>;

const applicationListSchema = z.object({
  items: z.array(applicationSchema),
  counts: z.object({
    pending: z.number(),
    approved: z.number(),
    rejected: z.number(),
    reviewed_today: z.number(),
    avg_review_min: z.number().nullable(),
  }),
});
export type ApplicationList = z.infer<typeof applicationListSchema>;

export async function fetchApplications(tab: ApplicationTab): Promise<ApplicationList> {
  const { data, error } = await supabase.rpc('admin_list_applications', { p_status: tab });
  return unwrapRpc(data, error, applicationListSchema);
}

export async function approveStore(input: {
  storeId: string;
  isApproved: boolean;
  rejectCode?: string;
  rejectReason?: string;
}) {
  const { data, error } = await supabase.rpc('approve_store', {
    p_store_id: input.storeId,
    p_approve: input.isApproved,
    p_reject_code: input.rejectCode,
    p_reject_reason: input.rejectReason?.trim() || undefined,
  });
  // 응답에 가게 코드는 없다 (합의 2-4). 사장님이 직접 발급
  return unwrapRpc(data, error, z.object({ status: z.enum(['approved', 'rejected']) }));
}

export async function approveStoreAddress(input: { storeId: string; isApproved: boolean }) {
  const { data, error } = await supabase.rpc('approve_store_address', {
    p_store_id: input.storeId,
    p_approve: input.isApproved,
  });
  return unwrapRpc(data, error, z.object({ approved: z.boolean() }));
}

/** 사업자등록증 사진 (비공개 버킷 → 5분짜리 서명 주소) */
export async function fetchLicenseUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('business-licenses')
    .createSignedUrl(path, 300);
  if (error) throw toAppError(error);
  return data.signedUrl;
}

/* ───── 가게 상세 (A1-1 · A2 상세 공용) ───── */
const storeDetailSchema = z.object({
  id: z.string(),
  owner_id: z.string().nullable(),
  name: z.string(),
  category: z.string(),
  description: z.string().nullable(),
  address: z.string(),
  lat: z.number(),
  lng: z.number(),
  status: z.enum(['pending', 'approved', 'rejected', 'suspended']),
  representative_name: z.string().nullable(),
  business_no: z.string().nullable(),
  phone: z.string().nullable(),
  license_path: z.string().nullable(),
  submitted_at: z.string(),
  approved_at: z.string().nullable(),
  suspended_at: z.string().nullable(),
  suspend_code: z.string().nullable(),
  suspend_note: z.string().nullable(),
  pending_address: z.string().nullable(),
  created_by_admin: z.boolean(),
  owner_nickname: z.string().nullable(),
  code_issued: z.boolean(),
  link_code_active: z.boolean(),
  deals_this_month: z.number(),
  coupons_used_this_month: z.number(),
  confirmed_report_count: z.number(),
  recent_reports: z.array(
    z.object({
      deal_id: z.string(),
      reason: z.string(),
      status: z.string(),
      created_at: z.string(),
    }),
  ),
});
export type AdminStoreDetail = z.infer<typeof storeDetailSchema>;

export async function fetchAdminStore(storeId: string): Promise<AdminStoreDetail> {
  const { data, error } = await supabase.rpc('admin_get_store', { p_store_id: storeId });
  return unwrapRpc(data, error, storeDetailSchema);
}

/* ───── A2 가맹점 목록 ───── */
export type StoreFilter = 'all' | 'active' | 'suspended';

const storeRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string().nullable(),
  address: z.string(),
  status: z.enum(['approved', 'suspended']),
  created_by_admin: z.boolean(),
  has_owner: z.boolean(),
  deals_this_month: z.number(),
  coupons_used_this_month: z.number(),
  confirmed_report_count: z.number(),
});
export type AdminStoreRow = z.infer<typeof storeRowSchema>;

const storeListSchema = z.object({
  counts: z.object({ all: z.number(), active: z.number(), suspended: z.number() }),
  items: z.array(storeRowSchema),
});

export async function fetchAdminStores(filter: StoreFilter, query: string) {
  const { data, error } = await supabase.rpc('admin_list_stores', {
    p_filter: filter,
    p_query: query.trim() || undefined,
  });
  return unwrapRpc(data, error, storeListSchema);
}

export async function suspendStore(input: { storeId: string; code: string; note?: string }) {
  const { data, error } = await supabase.rpc('admin_suspend_store', {
    p_store_id: input.storeId,
    p_code: input.code,
    p_note: input.note?.trim() || undefined,
  });
  return unwrapRpc(data, error, z.object({ status: z.string() }));
}

export async function unsuspendStore(storeId: string) {
  const { data, error } = await supabase.rpc('admin_unsuspend_store', { p_store_id: storeId });
  return unwrapRpc(data, error, z.object({ status: z.string() }));
}

/* ───── 가게 직접 추가·수정·삭제 ───── */
export interface AdminStoreInput {
  name: string;
  category: string;
  description?: string;
  address: string;
  lat: number;
  lng: number;
  representativeName?: string;
  businessNo?: string;
  phone?: string;
}

const savedStoreSchema = z.object({ store_id: z.string(), out_of_area: z.boolean() });

const storeParams = (input: AdminStoreInput) => ({
  p_name: input.name.trim(),
  p_category: input.category,
  p_address: input.address.trim(),
  p_lat: input.lat,
  p_lng: input.lng,
  p_description: input.description?.trim() || undefined,
  p_representative_name: input.representativeName?.trim() || undefined,
  p_business_no: input.businessNo?.replace(/\D/g, '') || undefined,
  p_phone: input.phone?.trim() || undefined,
});

export async function createAdminStore(input: AdminStoreInput) {
  const { data, error } = await supabase.rpc('admin_create_store', storeParams(input));
  return unwrapRpc(data, error, savedStoreSchema);
}

export async function updateAdminStore(storeId: string, input: AdminStoreInput) {
  const { data, error } = await supabase.rpc('admin_update_store', {
    p_store_id: storeId,
    ...storeParams(input),
  });
  return unwrapRpc(data, error, savedStoreSchema);
}

/** 완전 삭제 (딜·쿠폰·신고 기록이 함께 지워진다) */
export async function deleteAdminStore(storeId: string) {
  const { data, error } = await supabase.rpc('admin_delete_store', { p_store_id: storeId });
  return unwrapRpc(data, error, z.object({ store_id: z.string() }));
}

/** 가게 코드 대신 발급 (새 코드는 이 응답에서만 보인다) */
export async function rotateStoreCodeForStore(storeId: string): Promise<string> {
  const { data, error } = await supabase.rpc('admin_rotate_store_code', { p_store_id: storeId });
  return unwrapRpc(data, error, z.object({ code: z.string().regex(/^\d{6}$/) })).code;
}

/** 사장님 계정 연결 코드 (8자리, 일회용) */
export async function issueLinkCode(storeId: string): Promise<string> {
  const { data, error } = await supabase.rpc('admin_issue_link_code', { p_store_id: storeId });
  return unwrapRpc(data, error, z.object({ code: z.string() })).code;
}
