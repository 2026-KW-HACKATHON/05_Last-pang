import { formatKstTime, toKstDateString } from '@/shared/lib/time';
import { Icon } from '@/shared/ui/Icon';

import type { DealDetail } from '../types';

interface DealInfoRowsProps {
  deal: DealDetail;
  isEnded: boolean;
}

const toDayLabel = (iso: string) => {
  const date = toKstDateString(new Date(iso));
  if (date === toKstDateString(new Date())) return '오늘';
  const [, month, day] = date.split('-');
  return `${Number(month)}월 ${Number(day)}일`;
};

// 진행 시간 · 쿠폰 유효시간 · 가게 주소
export function DealInfoRows({ deal, isEnded }: DealInfoRowsProps) {
  const timeRange = `${formatKstTime(deal.startsAt)} ~ ${formatKstTime(deal.endsAt)}`;

  return (
    <dl className="mt-6 space-y-5 text-sm">
      <div className="flex items-center justify-between">
        <dt className="text-muted">진행 시간</dt>
        <dd className={`font-semibold ${isEnded ? 'text-faint line-through' : 'text-base'}`}>
          {toDayLabel(deal.startsAt)} {timeRange}
        </dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-muted">쿠폰 유효시간</dt>
        <dd className="flex items-center gap-1 font-bold text-accent">
          <Icon name="clock" size={16} />
          받은 뒤 {deal.couponTtlMin}분
        </dd>
      </div>
      <div className="flex items-start justify-between gap-4">
        <dt className="shrink-0 text-muted">가게 주소</dt>
        <dd className="text-right">{deal.address}</dd>
      </div>
    </dl>
  );
}
