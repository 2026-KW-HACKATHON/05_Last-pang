import { Icon } from '@/shared/ui/Icon';
import type { GeoItem } from '@/shared/lib/geoSearch';

interface PlaceResultListProps {
  items: GeoItem[];
  onPick: (item: GeoItem) => void;
}

// 주소 검색 결과 (피그마 R4-1 주소 검색 결과)
export function PlaceResultList({ items, onPick }: PlaceResultListProps) {
  if (items.length === 0) {
    return <p className="px-5 py-8 text-center text-sm text-muted">찾는 곳이 없어요</p>;
  }
  return (
    <ul className="divide-y divide-line px-5">
      {items.map((item) => (
        <li key={`${item.label}-${item.lat}-${item.lng}`}>
          <button
            type="button"
            onClick={() => onPick(item)}
            className="flex w-full items-center gap-3 py-3.5 text-left"
          >
            <Icon name="pin" size={20} className="shrink-0 text-muted" />
            <span className="min-w-0 flex-1">
              <span className="block truncate">{item.label}</span>
              <span className="block truncate text-sm text-faint">
                {item.roadAddress ?? item.jibunAddress ?? ''}
              </span>
            </span>
            <span
              className={`shrink-0 rounded-md px-2 py-0.5 text-xs ${item.inServiceArea ? 'bg-success-tint text-success' : 'bg-gray text-muted'}`}
            >
              {item.inServiceArea ? '월계1동' : '월계1동 밖'}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
