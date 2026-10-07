import { Badge } from '../../components/ui/Badge';

import type { StoreStatus } from '../../store/api';

const LABELS: Record<StoreStatus, { text: string; tone: 'accent' | 'success' | 'danger' }> = {
  pending: { text: '승인 대기 중', tone: 'accent' },
  approved: { text: '승인됨', tone: 'success' },
  rejected: { text: '승인 거절', tone: 'danger' },
  suspended: { text: '이용 정지', tone: 'danger' },
};

export function StoreStatusBadge({ status }: { status: StoreStatus }) {
  const label = LABELS[status];
  return (
    <Badge tone={label.tone} withDot={status !== 'suspended'}>
      {label.text}
    </Badge>
  );
}
