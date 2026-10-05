// 에러 코드와 한국어 문구 (컨벤션 9장 표와 1:1)
export type ErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'DEAL_NOT_ACTIVE'
  | 'SOLD_OUT'
  | 'ALREADY_CLAIMED'
  | 'COUPON_NOT_USABLE'
  | 'WRONG_CODE'
  | 'TOO_MANY_ATTEMPTS'
  | 'STORE_NOT_APPROVED'
  | 'ALREADY_REGISTERED'
  | 'INVALID_INPUT'
  | 'NETWORK_ERROR'
  | 'UNKNOWN';

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  UNAUTHENTICATED: '다시 로그인해 주세요',
  FORBIDDEN: '이 기능을 사용할 권한이 없어요',
  DEAL_NOT_ACTIVE: '이미 종료된 딜이에요',
  SOLD_OUT: '아쉽지만 모두 소진됐어요',
  ALREADY_CLAIMED: '이미 받은 쿠폰이 있어요',
  COUPON_NOT_USABLE: '사용할 수 없는 쿠폰이에요',
  WRONG_CODE: '가게 코드가 맞지 않아요',
  TOO_MANY_ATTEMPTS: '잠시 후 다시 시도해 주세요 (10분)',
  STORE_NOT_APPROVED: '가게 승인 후 이용할 수 있어요',
  ALREADY_REGISTERED: '이미 등록한 가게가 있어요',
  INVALID_INPUT: '입력값을 확인해 주세요',
  NETWORK_ERROR: '인터넷 연결을 확인해 주세요',
  UNKNOWN: '문제가 생겼어요. 잠시 후 다시 시도해 주세요',
};

export function isErrorCode(value: unknown): value is ErrorCode {
  return typeof value === 'string' && value in ERROR_MESSAGES;
}

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly remainingAttempts?: number;

  constructor(code: ErrorCode, remainingAttempts?: number) {
    super(ERROR_MESSAGES[code]);
    this.code = code;
    this.remainingAttempts = remainingAttempts;
  }
}

function readErrorCode(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const { code } = error;
    return typeof code === 'string' ? code : undefined;
  }
  return undefined;
}

/** supabase 오류나 알 수 없는 오류를 AppError로 바꾼다. 기술 메시지는 화면에 보내지 않는다 */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof TypeError) return new AppError('NETWORK_ERROR'); // fetch 실패
  const code = readErrorCode(error);
  if (code === 'PGRST301') return new AppError('UNAUTHENTICATED'); // JWT 만료·없음 (버전에 따라 다름, 9장)
  if (code === '42501') return new AppError('FORBIDDEN'); // PostgreSQL 권한 없음 (RLS 거부 포함)
  return new AppError('UNKNOWN');
}
