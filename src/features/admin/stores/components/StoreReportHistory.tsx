import { formatRelativeDay } from '@/features/owner/lib/format';
import { reportReasonLabel } from '@/shared/constants/policy';

import type { AdminStoreDetail } from '../api';

const RESULT = {
  confirmed: { label: '확정', className: 'text-danger' },
  dismissed: { label: '기각', className: 'text-success' },
  pending: { label: '확인 대기', className: 'text-muted' },
} as const;

/** A2 최근 신고 / 신고 확정 이력 */
export function StoreReportHistory({ store }: { store: AdminStoreDetail }) {
  const reports = store.recent_reports;
  return (
    <section>
      <h2 className="mb-2 text-base font-semibold">
        {store.status === 'suspended' ? '신고 확정 이력' : '최근 신고'}
      </h2>
      {reports.length === 0 ? (
        <p className="rounded-field border border-line p-3 text-sm text-muted">신고가 없어요</p>
      ) : (
        <ul className="space-y-2">
          {reports.map((report) => {
            const result = RESULT[report.status as keyof typeof RESULT] ?? RESULT.pending;
            return (
              <li
                key={`${report.deal_id}-${report.created_at}`}
                className="flex justify-between rounded-field border border-line p-3 text-sm"
              >
                <span>
                  {formatRelativeDay(report.created_at)} · {reportReasonLabel(report.reason)}
                </span>
                <span className={result.className}>{result.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
