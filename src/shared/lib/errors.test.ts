// CI에서 도는 순수 로직 테스트
import { z } from 'zod';
import { describe, expect, it } from 'vitest';

import { AppError } from './errors';
import { unwrapRpc } from './rpc';

const schema = z.object({ coupon_id: z.string() });

describe('unwrapRpc', () => {
  it('ok면 data를 돌려준다', () => {
    expect(unwrapRpc({ ok: true, data: { coupon_id: 'a' } }, null, schema)).toEqual({
      coupon_id: 'a',
    });
  });
  it('실패면 같은 코드의 AppError를 던진다', () => {
    expect(() => unwrapRpc({ ok: false, error: 'SOLD_OUT' }, null, schema)).toThrow(AppError);
  });
  it('WRONG_CODE의 남은 기회를 담는다', () => {
    try {
      unwrapRpc({ ok: false, error: 'WRONG_CODE', remaining_attempts: 3 }, null, schema);
    } catch (error) {
      expect(error instanceof AppError && error.remainingAttempts).toBe(3);
    }
  });
  it('오류와 함께 온 data를 detail로 담는다', () => {
    try {
      unwrapRpc(
        { ok: false, error: 'TOO_MANY_ATTEMPTS', data: { locked_until: 'x' } },
        null,
        schema,
      );
    } catch (error) {
      expect(error instanceof AppError && error.detail).toEqual({ locked_until: 'x' });
    }
  });
  it('모르는 코드는 UNKNOWN', () => {
    expect(() => unwrapRpc({ ok: false, error: 'HELLO' }, null, schema)).toThrow('문제가 생겼어요');
  });
});
