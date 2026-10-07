import { Icon } from '@/features/owner/components/Icon';
import { InfoRow } from '@/features/owner/components/ui/InfoRow';
import { formatMonthDay } from '@/features/owner/lib/format';

import { distanceFromCenter, formatBusinessNumber } from '../../lib';

import type { AdminStoreDetail } from '../api';

/** A2 가게 상세 회색 정보 박스 */
export function StoreInfoBox({ store }: { store: AdminStoreDetail }) {
  return (
    <div className="rounded-card bg-gray px-4 py-2">
      <InfoRow label="주소" value={store.address} />
      <InfoRow label="대표자" value={store.representative_name ?? '–'} />
      <InfoRow label="사업자등록번호" value={formatBusinessNumber(store.business_no)} />
      <InfoRow
        label="사장님 계정"
        value={store.owner_nickname ?? (store.owner_id ? '연결됨' : '없음 (운영자 관리)')}
      />
      <InfoRow
        label="승인일"
        value={store.approved_at ? formatMonthDay(store.approved_at.slice(0, 10)) : '–'}
      />
      <InfoRow
        label="위치"
        value={
          <span className="inline-flex items-center gap-1">
            <Icon name="pin" size={14} className="text-accent" />
            {distanceFromCenter(store.lat, store.lng)}
          </span>
        }
      />
    </div>
  );
}
