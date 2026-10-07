// 주소·장소 검색 (Edge Function geo-search가 카카오 로컬 API를 대신 부른다. REST 키는 서버에만 있음)
import { z } from 'zod';

import { unwrapRpc } from './rpc';
import { supabase } from './supabase';

const geoItemSchema = z.object({
  label: z.string(),
  roadAddress: z.string().nullable(),
  jibunAddress: z.string().nullable(),
  lat: z.number(),
  lng: z.number(),
  hDong: z.string().nullable(),
  inServiceArea: z.boolean(),
});
export type GeoItem = z.infer<typeof geoItemSchema>;

export async function searchAddress(
  query: string,
  mode: 'address' | 'keyword' = 'address',
): Promise<GeoItem[]> {
  const { data, error } = await supabase.functions.invoke('geo-search', { body: { mode, query } });
  return unwrapRpc(data, error, z.object({ items: z.array(geoItemSchema) })).items;
}
