import { Link } from 'react-router-dom';

import { formatPrice } from '@/shared/lib/format';

import { CategoryIcon } from '../../components/CategoryIcon';
import { EmptyCard } from '../../components/ui/EmptyCard';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { formatClock } from '../../lib/format';
import { useRedemptions } from '../../redemptions/hooks';

/** O3 "방금 사용된 쿠폰" — 오늘 사용 최신 3건 */
export function RecentRedemptions({ storeId, category }: { storeId: string; category: string }) {
  const redemptions = useRedemptions(storeId, 'today');
  const items = redemptions.data?.slice(0, 3) ?? [];
  return (
    <section>
      <SectionTitle right={<Link to="/owner/redemptions">전체 보기 ›</Link>}>
        방금 사용된 쿠폰
      </SectionTitle>
      {items.length === 0 ? (
        <EmptyCard
          icon="receipt"
          title="오늘 사용된 쿠폰 내역이 아직 없어요"
          body="손님이 픽업 시 쿠폰을 확인하면 실시간으로 업데이트 돼요."
        />
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.couponId} className="flex items-center gap-3 rounded-field bg-gray p-3">
              <CategoryIcon category={category} size={36} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold">{item.dealTitle}</p>
                <p className="text-[13px] text-muted">
                  {formatClock(item.usedAt)} ·{' '}
                  <span className="rounded bg-surface px-1.5 font-mono">{item.confirmNumber}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[15px] font-semibold">{formatPrice(item.dealPrice)}</p>
                <p className="text-xs text-accent">사용 완료</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
