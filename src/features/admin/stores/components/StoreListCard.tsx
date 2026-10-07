import { useNavigate } from 'react-router-dom';

import { CategoryIcon } from '@/features/owner/components/CategoryIcon';
import { Icon } from '@/features/owner/components/Icon';
import { Badge } from '@/features/owner/components/ui/Badge';
import { categoryLabel } from '@/features/owner/lib/category';
import { POLICY } from '@/shared/constants/policy';

import { shortAddress } from '../../lib';

import type { AdminStoreRow } from '../api';

/** A2 가맹점 카드: 이름 · 상태 · 통계 3칸 (이번 달 딜 · 쿠폰 사용 · 신고 확정) */
export function StoreListCard({ store }: { store: AdminStoreRow }) {
  const navigate = useNavigate();
  const isSuspended = store.status === 'suspended';
  const stats = [
    { label: '이번 달 딜', value: store.deals_this_month },
    { label: '쿠폰 사용', value: store.coupons_used_this_month },
    {
      label: '신고 확정',
      value: store.confirmed_report_count,
      isDanger: store.confirmed_report_count >= POLICY.confirmedReportsSuspend,
    },
  ];
  return (
    <button
      type="button"
      onClick={() => navigate(`/admin/approved-stores/${store.id}`)}
      className="w-full rounded-card border border-line bg-surface p-4 text-left"
    >
      <span className="flex items-center gap-3">
        <CategoryIcon category={store.category} />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2 text-[17px] font-semibold">
            {store.name}
            <Badge tone={isSuspended ? 'danger' : 'success'} withDot={!isSuspended}>
              {isSuspended ? '정지' : '운영 중'}
            </Badge>
            {store.created_by_admin && (
              <Badge>{store.has_owner ? '운영자 등록' : '운영자 관리'}</Badge>
            )}
          </span>
          <span className="block text-[13px] text-muted">
            {categoryLabel(store.category)} · {shortAddress(store.address)}
          </span>
        </span>
        <Icon name="chevron" size={18} className="text-faint" />
      </span>
      <span className="mt-3 grid grid-cols-3 rounded-field bg-gray py-2.5 text-center">
        {stats.map((stat) => (
          <span key={stat.label}>
            <span className="block text-xs text-muted">{stat.label}</span>
            <span className={`block text-lg font-bold ${stat.isDanger ? 'text-danger' : ''}`}>
              {stat.value}
            </span>
          </span>
        ))}
      </span>
    </button>
  );
}
