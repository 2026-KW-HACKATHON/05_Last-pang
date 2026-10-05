import { toAppError } from '@/shared/lib/errors';

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  // 기술 메시지(SQL·스택) 대신 ERROR_MESSAGES의 한국어 문구만 보여준다
  const message = toAppError(error).message;

  return (
    <div className="p-8 text-center" role="alert">
      <p className="mb-4 text-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-pill bg-accent px-5 py-2 text-white"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
