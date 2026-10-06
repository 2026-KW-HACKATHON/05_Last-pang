import { z } from 'zod';

import { toAppError } from '@/shared/lib/errors';
import { unwrapRpc } from '@/shared/lib/rpc';
import { supabase } from '@/shared/lib/supabase';

export type StoreStatus = 'pending' | 'approved' | 'rejected';

export interface StoreApplication {
  id: string;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  createdAt: string;
  rejectReason: string | null;
  ownerNickname: string | null;
}

const applicationSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  address: z.string(),
  lat: z.number(),
  lng: z.number(),
  created_at: z.string(),
  reject_reason: z.string().nullable(),
  profiles: z.object({ nickname: z.string().nullable() }).nullable(),
});

/** 운영자만: 상태별 가게 신청 (운영자는 RLS상 모든 가게·프로필을 읽는다) */
export async function fetchStoresByStatus(status: StoreStatus): Promise<StoreApplication[]> {
  const { data, error } = await supabase
    .from('stores')
    .select('id, name, category, address, lat, lng, created_at, reject_reason, profiles(nickname)')
    .eq('status', status)
    .order('created_at', { ascending: status === 'pending' });
  if (error) throw toAppError(error);
  return data.map((row) => {
    const store = applicationSchema.parse(row);
    return {
      id: store.id,
      name: store.name,
      category: store.category,
      address: store.address,
      lat: store.lat,
      lng: store.lng,
      createdAt: store.created_at,
      rejectReason: store.reject_reason,
      ownerNickname: store.profiles?.nickname ?? null,
    };
  });
}

/** 탭 숫자용: 상태별 가게 수 (행은 받지 않고 개수만) */
export async function fetchStoreCounts(): Promise<Record<StoreStatus, number>> {
  const statuses: StoreStatus[] = ['pending', 'approved', 'rejected'];
  const results = await Promise.all(
    statuses.map((status) =>
      supabase.from('stores').select('id', { count: 'exact', head: true }).eq('status', status),
    ),
  );
  const counts = { pending: 0, approved: 0, rejected: 0 };
  results.forEach((result, index) => {
    if (result.error) throw toAppError(result.error);
    counts[statuses[index] as StoreStatus] = result.count ?? 0;
  });
  return counts;
}

export async function approveStore(input: {
  storeId: string;
  isApproved: boolean;
  rejectReason?: string;
}) {
  const reason = input.rejectReason?.trim();
  const { data, error } = await supabase.rpc('approve_store', {
    p_store_id: input.storeId,
    p_approve: input.isApproved,
    ...(reason ? { p_reject_reason: reason } : {}),
  });
  // 응답에 가게 코드는 없다 (합의 2-4). 사장님이 4-8에서 직접 발급
  return unwrapRpc(data, error, z.object({ status: z.enum(['approved', 'rejected']) }));
}
