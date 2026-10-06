import { z } from 'zod';

import { fetchCurrentUserId } from '@/shared/lib/currentUser';
import { toAppError } from '@/shared/lib/errors';
import { unwrapRpc } from '@/shared/lib/rpc';
import { supabase } from '@/shared/lib/supabase';

import type { StoreInfoInput, StoreSignupInput } from './schema';

export interface MyStore {
  id: string;
  name: string;
  category: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason: string | null;
  createdAt: string;
}

const storeStatusSchema = z.enum(['pending', 'approved', 'rejected']);

/** 내 가게. 아직 신청 안 했으면 null */
export async function fetchMyStore(): Promise<MyStore | null> {
  const userId = await fetchCurrentUserId();
  const { data, error } = await supabase
    .from('stores')
    .select('id, name, category, address, status, reject_reason, created_at')
    .eq('owner_id', userId) // 운영자 계정이어도 본인 가게만
    .maybeSingle();
  if (error) throw toAppError(error);
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    category: data.category,
    address: data.address,
    status: storeStatusSchema.parse(data.status),
    rejectReason: data.reject_reason,
    createdAt: data.created_at,
  };
}

export async function registerStore(input: StoreSignupInput & { lat: number; lng: number }) {
  const { data, error } = await supabase.rpc('register_store', {
    p_name: input.name,
    p_category: input.category,
    p_address: input.address,
    p_lat: input.lat,
    p_lng: input.lng,
  });
  return unwrapRpc(data, error, z.object({ store_id: z.string().uuid() }));
}

/** 가게 코드 새로 발급. 원문은 이 응답에서 한 번만 받는다 (DB에는 해시만) */
export async function rotateStoreCode(): Promise<string> {
  const { data, error } = await supabase.rpc('rotate_store_code');
  return unwrapRpc(data, error, z.object({ code: z.string().regex(/^\d{6}$/) })).code;
}

/**
 * 가게 이름·업종 수정. 주소는 바꾸지 않는다:
 * DB가 주소 글자만 바꾸게 허용하고 좌표(lat/lng)와 재심사는 없어서, 바꾸면 거리 계산이 옛 위치로 남는다
 */
export async function updateStoreInfo(storeId: string, input: StoreInfoInput): Promise<void> {
  const { error } = await supabase
    .from('stores')
    .update({ name: input.name, category: input.category })
    .eq('id', storeId);
  if (error) throw toAppError(error);
}
