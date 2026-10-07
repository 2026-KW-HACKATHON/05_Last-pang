import { BottomSheet } from '@/shared/ui/BottomSheet';
import { Icon } from '@/shared/ui/Icon';

// 지금은 월계1동만 서비스한다. 다른 동네는 순서대로 열린다 (피그마 R6-1 동네 선택)
const NEIGHBORHOODS = [
  { name: '월계1동', isOpen: true },
  { name: '월계2동', isOpen: false },
  { name: '월계3동', isOpen: false },
];

interface NeighborhoodSheetProps {
  onClose: () => void;
}

export function NeighborhoodSheet({ onClose }: NeighborhoodSheetProps) {
  return (
    <BottomSheet title="동네 선택" onClose={onClose}>
      <ul className="space-y-2">
        {NEIGHBORHOODS.map((town) => (
          <li key={town.name}>
            <button
              type="button"
              onClick={onClose}
              disabled={!town.isOpen}
              aria-pressed={town.isOpen}
              className={`flex w-full items-center rounded-[12px] px-4 py-3.5 text-left ring-1 ${town.isOpen ? 'bg-accent-tint ring-accent' : 'ring-line'}`}
            >
              <span className="flex-1">
                <span className={`block font-semibold ${town.isOpen ? '' : 'text-faint'}`}>
                  {town.name}
                </span>
                <span className={`text-xs ${town.isOpen ? 'text-success' : 'text-faint'}`}>
                  {town.isOpen ? '지금 서비스 중' : '준비 중이에요'}
                </span>
              </span>
              {town.isOpen && <Icon name="check" size={22} className="text-accent" />}
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex items-center gap-1.5 text-sm text-muted">
        <Icon name="info" size={16} />
        다른 동네는 순서대로 열려요
      </p>
    </BottomSheet>
  );
}
