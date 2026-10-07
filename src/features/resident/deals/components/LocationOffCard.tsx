import { Icon } from '@/shared/ui/Icon';
import { Mascot } from '@/shared/ui/Mascot';

interface LocationOffCardProps {
  isRequesting: boolean;
  onRequest: () => void;
  onDismiss: () => void;
}

// 위치를 끈 상태 (피그마 R6 위치 꺼짐). 위치 없이도 월계1동 중심 기준으로 딜은 보여준다
export function LocationOffCard({ isRequesting, onRequest, onDismiss }: LocationOffCardProps) {
  return (
    <section className="flex flex-col items-center rounded-card bg-gradient-to-br from-accent-tint via-surface to-accent-tint px-5 py-8 text-center">
      <Mascot pose="map" size={120} />
      <h2 className="mt-4 text-lg font-bold">위치를 켜면 가까운 딜을 보여드려요</h2>
      <p className="mt-1 text-sm text-muted">위치는 거리 계산에만 쓰고 저장하지 않아요</p>
      <button
        type="button"
        onClick={onRequest}
        disabled={isRequesting}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-button bg-accent font-semibold text-white disabled:opacity-50"
      >
        <Icon name="send" size={18} />
        위치 허용하기
      </button>
      <button type="button" onClick={onDismiss} className="mt-3 text-sm text-muted">
        기준 위치(월계1동)로 보기 ›
      </button>
      <p className="mt-4 flex items-center gap-1 rounded-pill bg-surface px-3 py-1.5 text-xs text-muted">
        <Icon name="shield" size={14} className="text-accent" />약 100m 단위로만 계산되어 안심할 수
        있어요
      </p>
    </section>
  );
}
