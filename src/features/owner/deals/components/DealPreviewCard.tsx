import { formatPrice } from '@/shared/lib/format';

import { CategoryIcon } from '../../components/CategoryIcon';
import { Badge } from '../../components/ui/Badge';
import { categoryLabel } from '../../lib/category';

interface DealPreviewCardProps {
  storeName: string;
  category: string;
  title: string;
  originalPrice: number;
  dealPrice: number;
  totalQty: number;
  endsAtLabel: string;
}

/** 주민 홈의 딜 카드와 같은 모양의 미리보기 (주민 쪽 DealCard가 생기면 그걸로 바꾼다) */
export function DealPreviewCard({
  storeName,
  category,
  title,
  originalPrice,
  dealPrice,
  totalQty,
  endsAtLabel,
}: DealPreviewCardProps) {
  return (
    <div className="flex gap-3 rounded-card border border-line bg-surface p-4">
      <CategoryIcon category={category} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Badge tone="accent">{categoryLabel(category)}</Badge>
          <span className="text-[13px] text-muted">도보 4분 · 260m</span>
        </div>
        <p className="mt-1.5 text-[17px] font-semibold">{storeName}</p>
        <p className="truncate text-sm text-muted">{title || '혜택 이름'}</p>
        <p className="mt-1">
          <span className="text-lg font-semibold text-accent">{formatPrice(dealPrice)}</span>
          {originalPrice > 0 && (
            <span className="ml-2 text-sm text-faint line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-pill bg-accent-tint">
          <div className="h-full w-0 rounded-pill bg-accent" />
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-muted">
          <span>
            남은 쿠폰 {totalQty}/{totalQty}
          </span>
          <span>{endsAtLabel}까지</span>
        </div>
      </div>
    </div>
  );
}
