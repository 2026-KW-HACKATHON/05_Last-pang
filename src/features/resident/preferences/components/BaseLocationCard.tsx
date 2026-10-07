import { Icon } from '@/shared/ui/Icon';

interface BaseLocationCardProps {
  isSet: boolean; // false면 월계1동 중심 기준
  canUseCurrent: boolean;
  onUseCurrent: () => void;
}

// 자주 있는 곳: 지금 위치를 약 100m 단위로 흐려서 저장한다 (실시간 위치는 저장하지 않음)
export function BaseLocationCard({ isSet, canUseCurrent, onUseCurrent }: BaseLocationCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-card p-4 ring-1 ring-line">
      <span className="flex size-10 items-center justify-center rounded-full bg-accent-tint text-accent">
        <Icon name="pin" size={20} />
      </span>
      <div className="flex-1">
        <p className="font-semibold">자주 있는 곳</p>
        <p className="mt-0.5 flex items-center gap-1 text-sm text-success">
          <Icon name="check" size={14} />
          {isSet ? '지금 위치 근처로 설정됐어요' : '월계1동 기준이에요'}
        </p>
      </div>
      <button
        type="button"
        onClick={onUseCurrent}
        disabled={!canUseCurrent}
        className="shrink-0 rounded-lg bg-accent-tint px-3 py-1.5 text-sm text-accent disabled:text-faint"
      >
        {isSet ? '다시 설정' : '지금 위치로'}
      </button>
    </div>
  );
}
