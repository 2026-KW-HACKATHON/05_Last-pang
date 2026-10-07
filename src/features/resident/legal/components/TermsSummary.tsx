import { Icon } from '@/shared/ui/Icon';

interface TermsSummaryProps {
  rows: { label: string; value: string }[];
  note?: string;
}

// 개인정보 처리방침 요약 표와 분홍 안내 (R15)
export function TermsSummary({ rows, note }: TermsSummaryProps) {
  return (
    <>
      <dl className="mt-4 space-y-4 rounded-card p-4 text-sm ring-1 ring-line">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4">
            <dt className="text-muted">{row.label}</dt>
            <dd className="text-right font-semibold">{row.value}</dd>
          </div>
        ))}
      </dl>
      {note && (
        <p className="mt-4 flex gap-2 rounded-card bg-accent-tint p-4 text-sm text-accent">
          <Icon name="shield" size={18} className="mt-px" />
          {note}
        </p>
      )}
    </>
  );
}
