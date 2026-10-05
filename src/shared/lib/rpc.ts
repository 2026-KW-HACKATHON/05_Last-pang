// "상태를 바꾸는 RPC"의 { ok, data | error } 결과를 한 방식으로 푼다
import { z } from 'zod';

import { AppError, isErrorCode, toAppError } from './errors';

const envelopeSchema = z.object({
  ok: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  remaining_attempts: z.number().optional(),
});

export function unwrapRpc<T>(data: unknown, error: unknown, dataSchema: z.ZodType<T>): T {
  if (error) throw toAppError(error);
  const envelope = envelopeSchema.safeParse(data);
  if (!envelope.success) throw new AppError('UNKNOWN');
  if (!envelope.data.ok) {
    const code = isErrorCode(envelope.data.error) ? envelope.data.error : 'UNKNOWN';
    throw new AppError(code, envelope.data.remaining_attempts);
  }
  const body = dataSchema.safeParse(envelope.data.data);
  if (!body.success) throw new AppError('UNKNOWN');
  return body.data;
}
