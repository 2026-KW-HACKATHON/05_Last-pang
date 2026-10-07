import { toAppError } from '@/shared/lib/errors';

import { Icon } from './Icon';

interface ErrorStateProps {
  error: unknown;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ error, description, onRetry }: ErrorStateProps) {
  // 기술 메시지(SQL·스택) 대신 ERROR_MESSAGES의 한국어 문구만 보여준다
  const appError = toAppError(error);
  const isNetworkError = appError.code === 'NETWORK_ERROR';

  return (
    <div className="flex flex-col items-center px-8 py-12 text-center" role="alert">
      <div className="flex size-20 items-center justify-center rounded-full bg-surface text-faint ring-1 ring-line">
        <Icon name={isNetworkError ? 'wifiOff' : 'info'} size={36} />
      </div>
      <p className="mt-5 text-lg font-bold">{appError.message}</p>
      {description && <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 flex items-center gap-1.5 rounded-pill bg-surface px-5 py-2.5 font-semibold shadow-sm ring-1 ring-line"
        >
          <Icon name="refresh" size={18} className="text-accent" />
          다시 시도
        </button>
      )}
    </div>
  );
}
