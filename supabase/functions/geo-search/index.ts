// 주소·장소 검색 (O1-4 가게 주소 검색, R4-1 기준 위치, 운영자 가게 추가)
// 카카오 REST 키는 서버 비밀값(KAKAO_REST_API_KEY)이라 브라우저에 두지 않고 이 함수가 대신 부른다
// 요청: { mode: 'address' | 'keyword', query: string } 또는 { mode: 'coord', lat, lng }
// 응답: { ok: true, data: { items: GeoItem[] } } | { ok: false, error }
import { corsHeaders, json } from '../_shared/cors.ts';

const SERVICE_DONG = '월계1동';
const KAKAO = 'https://dapi.kakao.com/v2/local';

type GeoItem = {
  label: string; // 결과 첫 줄 (도로명 주소 또는 장소 이름)
  roadAddress: string | null;
  jibunAddress: string | null;
  lat: number;
  lng: number;
  hDong: string | null; // 행정동 이름 (예: 월계1동)
  inServiceArea: boolean;
};

async function kakao(path: string, params: Record<string, string>) {
  const key = Deno.env.get('KAKAO_REST_API_KEY');
  if (!key) throw new Error('KAKAO_REST_API_KEY missing');
  const url = `${KAKAO}${path}?${new URLSearchParams(params)}`;
  const response = await fetch(url, { headers: { Authorization: `KakaoAK ${key}` } });
  if (!response.ok) throw new Error(`kakao ${response.status}`);
  return response.json();
}

async function hDongOf(lat: number, lng: number): Promise<string | null> {
  const body = await kakao('/geo/coord2regioncode.json', { x: String(lng), y: String(lat) });
  const h = (body.documents ?? []).find((d: { region_type: string }) => d.region_type === 'H');
  return h?.region_3depth_name ?? null;
}

async function searchAddress(query: string): Promise<GeoItem[]> {
  const body = await kakao('/search/address.json', { query, size: '10' });
  return (body.documents ?? []).map((d: Record<string, any>) => {
    const hDong: string | null = d.address?.region_3depth_h_name || null;
    const road: string | null = d.road_address?.address_name ?? null;
    return {
      label: road ?? d.address_name,
      roadAddress: road,
      jibunAddress: d.address?.address_name ?? null,
      lat: Number(d.y),
      lng: Number(d.x),
      hDong,
      inServiceArea: hDong === SERVICE_DONG,
    };
  });
}

async function searchKeyword(query: string): Promise<GeoItem[]> {
  const body = await kakao('/search/keyword.json', {
    query,
    size: '10',
    x: '127.058',
    y: '37.6206',
    sort: 'distance',
  });
  const docs: Record<string, any>[] = body.documents ?? [];
  return Promise.all(
    docs.slice(0, 8).map(async (d) => {
      const lat = Number(d.y);
      const lng = Number(d.x);
      const hDong = await hDongOf(lat, lng);
      return {
        label: d.place_name,
        roadAddress: d.road_address_name || null,
        jibunAddress: d.address_name || null,
        lat,
        lng,
        hDong,
        inServiceArea: hDong === SERVICE_DONG,
      };
    }),
  );
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const body = await request.json();
    const mode = body?.mode ?? 'address';
    if (mode === 'coord') {
      const lat = Number(body.lat);
      const lng = Number(body.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng))
        return json({ ok: false, error: 'INVALID_INPUT' });
      const hDong = await hDongOf(lat, lng);
      return json({
        ok: true,
        data: {
          items: [
            {
              label: hDong ?? '',
              roadAddress: null,
              jibunAddress: null,
              lat,
              lng,
              hDong,
              inServiceArea: hDong === SERVICE_DONG,
            },
          ],
        },
      });
    }
    const query = String(body?.query ?? '').trim();
    if (query.length < 2 || query.length > 60) return json({ ok: false, error: 'INVALID_INPUT' });
    const items = mode === 'keyword' ? await searchKeyword(query) : await searchAddress(query);
    return json({ ok: true, data: { items } });
  } catch (error) {
    console.error(error); // 검색어는 남기지 않는다
    return json({ ok: false, error: 'UNKNOWN' }, 502);
  }
});
