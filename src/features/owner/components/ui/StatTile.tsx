import { cx } from '../../lib/styles';

interface StatTileProps {
  label: string;
  value: string | number;
  unit?: string;
  isAccent?: boolean;
  isDanger?: boolean;
}

/** 흰 타일 숫자 (오늘 사용 4건 · 이번 달 딜 12) */
export function StatTile({
  label,
  value,
  unit,
  isAccent = false,
  isDanger = false,
}: StatTileProps) {
  return (
    <div className="flex flex-col items-center rounded-field bg-surface px-2 py-3">
      <span className="text-[13px] text-muted">{label}</span>
      <span
        className={cx(
          'mt-1 text-xl font-bold tabular-nums',
          isAccent && 'text-accent',
          isDanger && 'text-danger',
        )}
      >
        {value}
        {unit && <span className="ml-0.5 text-xs font-semibold">{unit}</span>}
      </span>
    </div>
  );
}
