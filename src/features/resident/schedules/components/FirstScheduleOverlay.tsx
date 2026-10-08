import { Mascot } from '@/shared/ui/Mascot';

interface FirstScheduleOverlayProps {
  onAdd: () => void;
  onLater: () => void;
}

// R13-4 처음 들어온 빈 시간표 위 안내 카드
export function FirstScheduleOverlay({ onAdd, onLater }: FirstScheduleOverlayProps) {
  return (
    <div className="absolute inset-x-8 top-36 z-20 rounded-card bg-surface px-5 pt-5 pb-4 text-center shadow-xl ring-1 ring-line">
      <Mascot pose="rice" size={88} className="mx-auto" />
      <h2 className="mt-3 text-lg font-bold">매주 반복되는 일정을 넣어 주세요</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        수업·출근 사이 비는 시간을 알면
        <br />그 시간에 쓸 수 있는 딜만 골라 알려드려요
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="mt-5 h-12 w-full rounded-[12px] bg-accent font-semibold text-white"
      >
        첫 일정 추가하기
      </button>
      <button type="button" onClick={onLater} className="mt-3 text-sm text-faint">
        나중에 할게요
      </button>
    </div>
  );
}
