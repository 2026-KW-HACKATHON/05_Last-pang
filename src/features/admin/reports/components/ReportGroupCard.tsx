import { useNavigate } from 'react-router-dom';

import { Badge } from '@/features/owner/components/ui/Badge';
import { formatClock } from '@/features/owner/lib/format';
import { reportReasonLabel } from '@/shared/constants/policy';

import type { ReportGroup } from '../api';

/** A3 신고 카드 (딜 단위로 묶음). 자동 중지된 딜이 맨 위 */
export function ReportGroupCard({ group }: { group: ReportGroup }) {
  const navigate = useNavigate();
  const reasons = Object.entries(group.reason_counts)
    .map(([reason, count]) => `${reportReasonLabel(reason)} ${count}`)
    .join(' · ');
  const resultLabel =
    group.result === 'confirmed' ? '확정' : group.result === 'dismissed' ? '기각' : null;
  return (
    <button
      type="button"
      onClick={() => navigate(`/admin/reports/${group.deal_id}`)}
      className="w-full rounded-card border border-line bg-surface p-4 text-left"
    >
      <span className="flex items-center justify-between">
        <Badge tone="accent">
          {group.is_paused
            ? `자동 중지 · 신고 ${group.report_count}건`
            : `신고 ${group.report_count}건`}
        </Badge>
        <span className="text-[13px] text-muted">
          {resultLabel ?? formatClock(group.latest_at)}
        </span>
      </span>
      <span className="mt-2 block text-[17px] font-semibold">{group.deal_title}</span>
      <span className="block text-[13px] text-muted">{group.store_name}</span>
      <span className="mt-3 block rounded-field bg-gray px-3 py-2 text-[13px] text-muted">
        {reasons}
      </span>
    </button>
  );
}
