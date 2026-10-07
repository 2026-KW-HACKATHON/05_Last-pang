import { Card } from '../../components/ui/Card';
import { StatTile } from '../../components/ui/StatTile';
import { toManWon } from '../../lib/format';
import { useTodayReport } from '../../report/hooks';

/** O3 "오늘 영업 실적" 회색 카드 + 흰 타일 3개 */
export function TodaySummaryCard() {
  const report = useTodayReport();
  const data = report.data;
  return (
    <Card tone="gray" className="p-3">
      <div className="mb-2 flex justify-between px-1 text-[13px]">
        <span className="font-semibold">오늘 영업 실적</span>
        <span className="text-muted">실시간 집계</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <StatTile label="오늘 사용" value={data?.usedCount ?? '–'} unit="건" />
        <StatTile
          label="예상 매출"
          value={data ? toManWon(data.estimatedRevenue) : '–'}
          unit="만"
          isAccent
        />
        <StatTile label="처음 손님" value={data?.newVisitorCount ?? '–'} unit="명" />
      </div>
    </Card>
  );
}
