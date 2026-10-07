import { CategoryIcon } from '@/features/owner/components/CategoryIcon';
import { Badge } from '@/features/owner/components/ui/Badge';

import type { ReactNode } from 'react';

interface StoreSummaryHeaderProps {
  name: string;
  category: string;
  subtitle: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  extra?: ReactNode;
}

const STATUS = {
  pending: { label: '대기중', tone: 'accent' },
  approved: { label: '운영 중', tone: 'success' },
  rejected: { label: '거절', tone: 'neutral' },
  suspended: { label: '정지', tone: 'danger' },
} as const;

/** 상세 화면 맨 위: 업종 원 아이콘 + 가게 이름 + 상태 배지 + 한 줄 */
export function StoreSummaryHeader({
  name,
  category,
  subtitle,
  status,
  extra,
}: StoreSummaryHeaderProps) {
  const badge = STATUS[status];
  return (
    <div className="flex items-center gap-3">
      <CategoryIcon category={category} size={48} />
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-2 text-lg font-bold">
          {name}
          <Badge tone={badge.tone} withDot={status !== 'suspended'}>
            {badge.label}
          </Badge>
          {extra}
        </p>
        <p className="truncate text-[13px] text-muted">{subtitle}</p>
      </div>
    </div>
  );
}
