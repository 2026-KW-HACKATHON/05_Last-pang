import { POLICY } from '@/shared/constants/policy';

import type { AdminStoreDetail } from '../api';

/** A2 가게 상세 통계 카드 3개 */
export function StoreStatsRow({ store }: { store: AdminStoreDetail }) {
  const stats = [
    { label: '이번 달 딜', value: `${store.deals_this_month}건` },
    { label: '쿠폰 사용', value: `${store.coupons_used_this_month}건` },
    {
      label: '신고 확정',
      value: `${store.confirmed_report_count}/${POLICY.confirmedReportsSuspend}`,
      isAccent: true,
    },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-field border border-line py-3 text-center">
          <p className="text-xs text-muted">{stat.label}</p>
          <p className={`mt-1 text-lg font-bold ${stat.isAccent ? 'text-accent' : ''}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
