import { Icon } from '@/shared/ui/Icon';

interface BaseLocationCardProps {
  label: string | null; // null이면 월계1동 중심 기준
  onChange: () => void;
}

// 자주 있는 곳: 기준 위치 화면(R4-1)에서 약 100m 단위로 흐려서 저장한다 (실시간 위치는 저장하지 않음)
export function BaseLocationCard({ label, onChange }: BaseLocationCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-card bg-gray p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-accent">
        <Icon name="crosshair" size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">자주 있는 곳을 기준으로</p>
        <p className="mt-0.5 flex items-center gap-1 text-sm text-success">
          <Icon name="checkCircle" size={14} />
          <span className="truncate">{label ?? '월계1동'} 기준으로 설정됐어요</span>
        </p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className="shrink-0 rounded-pill bg-surface px-3.5 py-1.5 text-sm ring-1 ring-line"
      >
        변경
      </button>
    </div>
  );
}
