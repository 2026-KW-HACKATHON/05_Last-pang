// 사장님·운영자 api가 supabase를 올바른 인자로 부르고 결과를 바르게 푸는지 확인 (supabase는 가짜로 대체)
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppError } from '@/shared/lib/errors';

const rpc = vi.fn();
const insert = vi.fn();
const single = vi.fn();
vi.mock('@/shared/lib/supabase', () => ({
  supabase: {
    rpc: (...args: unknown[]) => rpc(...args),
    from: () => ({
      insert: (row: unknown) => {
        insert(row);
        return {
          select: () => ({ single }),
          then: (resolve: (v: unknown) => void) => resolve({ error: null }),
        };
      },
    }),
  },
}));

const { registerStore, rotateStoreCode } = await import('./store/api');
const { approveStore } = await import('../admin/stores/api');
const { createDeal, fetchPushTargetEstimate } = await import('./deals/api');
const { fetchStoreReport } = await import('./report/api');

beforeEach(() => {
  rpc.mockReset();
  insert.mockReset();
  single.mockReset();
});

describe('registerStore', () => {
  const input = {
    name: '우우즈 베이커리',
    category: 'bakery' as const,
    address: '광운로 12',
    lat: 37.62,
    lng: 127.06,
  };

  it('RPC 인자 이름을 p_ 접두사로 보내고 store_id를 돌려준다', async () => {
    const storeId = '11111111-1111-4111-8111-111111111111';
    rpc.mockResolvedValue({ data: { ok: true, data: { store_id: storeId } }, error: null });
    await expect(registerStore(input)).resolves.toEqual({ store_id: storeId });
    expect(rpc).toHaveBeenCalledWith('register_store', {
      p_name: '우우즈 베이커리',
      p_category: 'bakery',
      p_address: '광운로 12',
      p_lat: 37.62,
      p_lng: 127.06,
    });
  });

  it('이미 등록했으면 ALREADY_REGISTERED AppError', async () => {
    rpc.mockResolvedValue({ data: { ok: false, error: 'ALREADY_REGISTERED' }, error: null });
    await expect(registerStore(input)).rejects.toMatchObject({
      code: 'ALREADY_REGISTERED',
      message: '이미 등록한 가게가 있어요',
    });
  });
});

describe('rotateStoreCode', () => {
  it('6자리 코드만 받는다', async () => {
    rpc.mockResolvedValue({ data: { ok: true, data: { code: '048213' } }, error: null });
    await expect(rotateStoreCode()).resolves.toBe('048213');
  });

  it('형식이 이상하면 UNKNOWN', async () => {
    rpc.mockResolvedValue({ data: { ok: true, data: { code: '12ab' } }, error: null });
    await expect(rotateStoreCode()).rejects.toBeInstanceOf(AppError);
  });

  it('승인 전이면 STORE_NOT_APPROVED', async () => {
    rpc.mockResolvedValue({ data: { ok: false, error: 'STORE_NOT_APPROVED' }, error: null });
    await expect(rotateStoreCode()).rejects.toMatchObject({ code: 'STORE_NOT_APPROVED' });
  });
});

describe('approveStore', () => {
  it('승인할 때는 거절 사유를 보내지 않는다', async () => {
    rpc.mockResolvedValue({ data: { ok: true, data: { status: 'approved' } }, error: null });
    await approveStore({ storeId: 's1', isApproved: true, rejectReason: '   ' });
    expect(rpc).toHaveBeenCalledWith('approve_store', { p_store_id: 's1', p_approve: true });
  });

  it('거절 사유는 앞뒤 공백을 지워 보낸다', async () => {
    rpc.mockResolvedValue({ data: { ok: true, data: { status: 'rejected' } }, error: null });
    await expect(
      approveStore({
        storeId: 's1',
        isApproved: false,
        rejectReason: ' 주소가 월계1동이 아니에요 ',
      }),
    ).resolves.toEqual({ status: 'rejected' });
    expect(rpc).toHaveBeenCalledWith('approve_store', {
      p_store_id: 's1',
      p_approve: false,
      p_reject_reason: '주소가 월계1동이 아니에요',
    });
  });

  it('운영자가 아니면 FORBIDDEN', async () => {
    rpc.mockResolvedValue({ data: null, error: { code: '42501' } });
    await expect(approveStore({ storeId: 's1', isApproved: true })).rejects.toMatchObject({
      code: 'FORBIDDEN',
    });
  });
});

describe('createDeal', () => {
  const deal = {
    title: '소금빵 2+1',
    originalPrice: 10500,
    dealPrice: 7000,
    totalQty: 10,
    durationMin: 120,
    couponTtlMin: 15 as const,
  };

  it('지금부터 durationMin 뒤를 ends_at으로 넣는다', async () => {
    single.mockResolvedValue({ data: { id: 'd1' }, error: null });
    const now = new Date('2026-10-05T05:00:00.000Z');
    await expect(createDeal('s1', deal, now)).resolves.toBe('d1');
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        store_id: 's1',
        type: 'instant',
        total_qty: 10,
        coupon_ttl_min: 15,
        starts_at: '2026-10-05T05:00:00.000Z',
        ends_at: '2026-10-05T07:00:00.000Z',
      }),
    );
  });

  it('승인 안 된 가게(RLS 거부)는 FORBIDDEN', async () => {
    single.mockResolvedValue({ data: null, error: { code: '42501' } });
    await expect(createDeal('s1', deal)).rejects.toMatchObject({ code: 'FORBIDDEN' });
  });
});

describe('fetchPushTargetEstimate', () => {
  it('숫자를 그대로 돌려준다', async () => {
    rpc.mockResolvedValue({ data: 84, error: null });
    await expect(fetchPushTargetEstimate(new Date('2026-10-05T05:00:00Z'))).resolves.toBe(84);
    expect(rpc).toHaveBeenCalledWith('estimate_push_targets', {
      p_starts_at: '2026-10-05T05:00:00.000Z',
    });
  });
});

describe('fetchStoreReport', () => {
  it('24시간을 빈 시간은 0으로 채우고 신규 방문 비율을 계산한다', async () => {
    rpc.mockResolvedValue({
      data: {
        used_count: 5,
        estimated_revenue: 35000,
        visitor_count: 4,
        new_visitor_count: 1,
        by_hour: { '14': 3, '15': 2 },
      },
      error: null,
    });
    const report = await fetchStoreReport('2026-10-01', '2026-10-05');
    expect(report.byHour).toHaveLength(24);
    expect(report.byHour[14]).toEqual({ hour: 14, count: 3 });
    expect(report.byHour[0]).toEqual({ hour: 0, count: 0 });
    expect(report.newVisitorRate).toBe(0.25);
  });

  it('방문자가 0명이면 비율은 0', async () => {
    rpc.mockResolvedValue({
      data: {
        used_count: 0,
        estimated_revenue: 0,
        visitor_count: 0,
        new_visitor_count: 0,
        by_hour: {},
      },
      error: null,
    });
    await expect(fetchStoreReport('a', 'b')).resolves.toMatchObject({ newVisitorRate: 0 });
  });

  it('응답 모양이 이상하면 UNKNOWN', async () => {
    rpc.mockResolvedValue({ data: { used_count: '5' }, error: null });
    await expect(fetchStoreReport('a', 'b')).rejects.toMatchObject({ code: 'UNKNOWN' });
  });
});
