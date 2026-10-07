import { Icon } from '@/shared/ui/Icon';

// 지도 SDK 없이 그리는 약도: 회색 블록 위 가운데 핀과 약 100m 점선 원 (피그마 R4-1)
const BLOCKS = [
  'left-[2%] top-[2%] h-[10%] w-[15%]',
  'left-[33%] top-[3%] h-[12%] w-[36%]',
  'left-[77%] top-[3%] h-[15%] w-[18%]',
  'left-[4%] top-[25%] h-[15%] w-[23%]',
  'left-[38%] top-[30%] h-[12%] w-[28%]',
  'left-[78%] top-[27%] h-[28%] w-[16%]',
  'left-[3%] top-[55%] h-[17%] w-[25%]',
  'left-[36%] top-[57%] h-[15%] w-[30%]',
] as const;

interface SchematicMapProps {
  isLocating: boolean;
  onLocate: () => void;
}

export function SchematicMap({ isLocating, onLocate }: SchematicMapProps) {
  return (
    <div className="relative h-[400px] overflow-hidden bg-surface">
      {/* 길(흰 선) 사이의 옅은 구획 */}
      <div className="absolute inset-0 grid grid-cols-[3fr_4fr_3fr] grid-rows-4 gap-3">
        {Array.from({ length: 12 }, (_, index) => (
          <div key={index} className="bg-gray" />
        ))}
      </div>
      {BLOCKS.map((position) => (
        <div key={position} className={`absolute rounded-md bg-line ${position}`} />
      ))}
      <div className="absolute top-1/2 left-1/2 size-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-accent bg-accent/15" />
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full text-accent">
        <svg width="34" height="42" viewBox="0 0 24 30" aria-label="선택한 위치">
          <path d="M12 29s-10-9-10-17a10 10 0 0120 0c0 8-10 17-10 17z" fill="currentColor" />
          <circle cx="12" cy="12" r="4" fill="white" />
        </svg>
      </span>
      <button
        type="button"
        onClick={onLocate}
        disabled={isLocating}
        aria-label="현재 위치 쓰기"
        className="absolute right-3 bottom-3 flex size-10 items-center justify-center rounded-full bg-surface shadow-md disabled:text-faint"
      >
        <Icon name="crosshair" size={20} className={isLocating ? 'animate-pulse' : ''} />
      </button>
    </div>
  );
}
