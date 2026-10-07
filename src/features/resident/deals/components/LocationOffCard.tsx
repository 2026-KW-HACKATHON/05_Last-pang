import { POLICY } from '@/shared/constants/policy';
import { Icon } from '@/shared/ui/Icon';
import { Mascot } from '@/shared/ui/Mascot';

interface LocationOffCardProps {
  isRequesting: boolean;
  onRequest: () => void;
  onUseBase: () => void;
}

// 위치를 끈 상태 (피그마 R6 위치 꺼짐). 기준 위치로 보기를 누르면 목록을 기준 위치 기준으로 보여준다
export function LocationOffCard({ isRequesting, onRequest, onUseBase }: LocationOffCardProps) {
  return (
    <section className="flex flex-col items-center rounded-card bg-gradient-to-br from-accent-tint via-surface to-accent-tint px-5 py-8 text-center">
      <div className="relative">
        <span className="flex size-32 items-center justify-center rounded-full bg-surface shadow-sm">
          <Mascot pose="map" size={104} />
        </span>
        <span className="absolute right-1 bottom-1 flex size-7 items-center justify-center rounded-full bg-accent text-white ring-2 ring-surface">
          <Icon name="pin" size={15} />
          <span className="absolute h-0.5 w-4 rotate-45 rounded-pill bg-white" />
        </span>
      </div>
      <h2 className="mt-5 text-lg font-bold">위치를 켜면 가까운 딜을 보여드려요</h2>
      <p className="mt-1 text-sm text-muted">위치는 거리 계산에만 쓰고 저장하지 않아요</p>
      <button
        type="button"
        onClick={onRequest}
        disabled={isRequesting}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-accent font-semibold text-white disabled:bg-accent-disabled"
      >
        <Icon name="send" size={18} />
        위치 허용하기
      </button>
      <button type="button" onClick={onUseBase} className="mt-3 text-sm text-muted">
        기준 위치({POLICY.neighborhoodName})로 보기 ›
      </button>
      <p className="mt-4 flex items-center gap-1 rounded-pill bg-surface px-3 py-1.5 text-xs text-muted">
        <Icon name="shield" size={14} className="text-accent" />약 100m 단위로만 계산되어 안심할 수
        있어요
      </p>
    </section>
  );
}
