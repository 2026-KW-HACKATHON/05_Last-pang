import { toAppError } from '@/shared/lib/errors';
import { Icon } from '@/shared/ui/Icon';

interface HomeErrorStateProps {
  error: unknown;
  onRetry: () => void;
}

// 목록을 못 불러왔을 때 (피그마 R6 에러)
export function HomeErrorState({ error, onRetry }: HomeErrorStateProps) {
  const appError = toAppError(error);
  const isNetworkError = appError.code === 'NETWORK_ERROR' || !navigator.onLine;

  return (
    <div className="flex flex-col items-center px-8 pt-12 text-center" role="alert">
      <div className="relative flex size-20 items-center justify-center rounded-full bg-surface text-faint shadow-sm ring-1 ring-line">
        <Icon name="wifiOff" size={36} />
        <span className="absolute -right-1 bottom-1 flex size-6 items-center justify-center rounded-full bg-accent-tint text-sm font-bold text-accent">
          !
        </span>
      </div>
      <p className="mt-5 text-lg font-bold">
        {isNetworkError ? '인터넷 연결을 확인해 주세요' : appError.message}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        월계동 맛집들의 반짝 타임딜을 불러오지 못했어요.
        <br />
        네트워크 상태 확인 후 다시 시도해 주세요.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 flex items-center gap-1.5 rounded-pill bg-surface px-5 py-2.5 font-semibold shadow-sm ring-1 ring-line"
      >
        <Icon name="refresh" size={18} className="text-accent" />
        다시 시도
      </button>
      <div className="mt-10 flex w-full gap-3 rounded-card bg-surface p-4 text-left shadow-[0_2px_8px_rgba(0,0,0,0.06)] ring-1 ring-line">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-white">
          <Icon name="bulb" size={18} />
        </span>
        <div className="text-sm">
          <p className="font-semibold">와이파이나 데이터가 켜져 있나요?</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            지하철이나 엘리베이터 이동 중일 때는 잠시 후 연결이 복구될 수 있어요.
          </p>
        </div>
      </div>
    </div>
  );
}
