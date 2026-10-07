import { Icon } from '@/shared/ui/Icon';

interface PushToggleRowProps {
  isOn: boolean;
  isBlocked: boolean;
  isPending: boolean;
  onToggle: () => void;
  onHelp: () => void;
}

// 알림 받기 스위치. 브라우저에서 막혀 있으면 아래에 빨간 안내 줄 (R12-1)
export function PushToggleRow({
  isOn,
  isBlocked,
  isPending,
  onToggle,
  onHelp,
}: PushToggleRowProps) {
  return (
    <div className="flex min-h-14 items-center gap-3 px-4 py-2">
      <div className="flex-1">
        <span>알림 받기</span>
        {isBlocked && (
          <button
            type="button"
            onClick={onHelp}
            className="mt-0.5 flex items-center gap-1 text-left text-xs text-danger"
          >
            <Icon name="bellOff" size={14} />
            브라우저에서 알림이 막혀 있어요 · <span className="underline">해결 방법</span>
          </button>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-label="알림 받기"
        onClick={onToggle}
        disabled={isPending}
        className={`flex h-7 w-12 shrink-0 items-center rounded-pill p-0.5 transition-colors ${isOn ? 'bg-accent' : isBlocked ? 'bg-gray ring-1 ring-line' : 'bg-line'}`}
      >
        <span
          className={`size-6 rounded-full bg-surface shadow transition-transform ${isOn ? 'translate-x-5' : ''}`}
        />
      </button>
    </div>
  );
}
