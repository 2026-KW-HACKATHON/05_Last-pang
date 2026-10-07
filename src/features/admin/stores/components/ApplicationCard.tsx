import { useNavigate } from 'react-router-dom';

import { CategoryIcon } from '@/features/owner/components/CategoryIcon';
import { Icon } from '@/features/owner/components/Icon';
import { Badge } from '@/features/owner/components/ui/Badge';
import { Button } from '@/features/owner/components/ui/Button';
import { InfoRow } from '@/features/owner/components/ui/InfoRow';
import { categoryLabel } from '@/features/owner/lib/category';
import { formatMonthDayTime } from '@/features/owner/lib/format';

import { distanceFromCenter } from '../../lib';

import type { Application } from '../api';

interface ApplicationCardProps {
  item: Application;
  onApprove?: () => void;
  onReject?: () => void;
  isBusy: boolean;
}

/** A1 입점 신청 카드 (기본 카드 229:5 기준). 주소 변경 요청이면 "주소 변경" 태그 */
export function ApplicationCard({ item, onApprove, onReject, isBusy }: ApplicationCardProps) {
  const navigate = useNavigate();
  return (
    <article className="rounded-card border border-line bg-surface p-4">
      <button
        type="button"
        className="flex w-full items-start gap-3 text-left"
        onClick={() => navigate(`/admin/stores/${item.id}`)}
      >
        <CategoryIcon category={item.category} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[17px] font-semibold">{item.name}</span>
          <span className="block text-[13px] text-muted">
            {item.description ?? categoryLabel(item.category)}
          </span>
        </span>
        <Badge tone="accent">
          {item.is_address_change ? '주소 변경' : categoryLabel(item.category)}
        </Badge>
      </button>
      <div className="mt-3 rounded-field bg-gray px-3 py-1.5">
        <InfoRow
          label={item.is_address_change ? '새 주소' : '주소'}
          value={item.pending_address ?? item.address}
        />
        <InfoRow label="신청자" value={item.owner_nickname ?? '–'} />
        <InfoRow
          label="신청 시각"
          value={formatMonthDayTime(
            item.is_address_change ? (item.reviewed_at ?? item.submitted_at) : item.submitted_at,
          )}
          isStrong
        />
        <InfoRow
          label="위치"
          value={
            <span className="inline-flex items-center gap-1">
              <Icon name="pin" size={14} className="text-accent" />{' '}
              {distanceFromCenter(item.lat, item.lng)}
            </span>
          }
        />
        {item.status === 'rejected' && item.reject_reason && (
          <InfoRow label="거절 사유" value={item.reject_reason} />
        )}
      </div>
      {onApprove && onReject && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button variant="secondary" size="md" disabled={isBusy} onClick={onReject}>
            거절
          </Button>
          <Button size="md" disabled={isBusy} onClick={onApprove}>
            승인
          </Button>
        </div>
      )}
    </article>
  );
}
