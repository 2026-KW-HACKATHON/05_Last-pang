import { Icon } from '@/features/owner/components/Icon';
import { Button } from '@/features/owner/components/ui/Button';
import { formatMonthDay } from '@/features/owner/lib/format';
import { Mascot } from '@/shared/ui/Mascot';

import type { CouncilReport } from '../api';

const CARD = 'rounded-card bg-surface ring-1 ring-line';

/** A5-1 불러오는 중: 지표 5칸 · 큰 카드 2개 뼈대 + 안내 */
export function CouncilLoading() {
  return (
    <div aria-busy className="space-y-5">
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className={`${CARD} h-[132px] p-6`}>
            <div className="h-3.5 w-28 animate-pulse rounded bg-busy" />
            <div className="mt-4 h-7 w-20 animate-pulse rounded bg-busy" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[601fr_739fr] gap-5">
        <div className={`${CARD} h-[300px]`} />
        <div className={`${CARD} h-[300px]`} />
      </div>
      <p className="flex flex-col items-center gap-2 pt-2 text-xs text-muted">
        <span className="size-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        집계를 불러오고 있어요
      </p>
    </div>
  );
}

/** A5-1 불러오기 실패 */
export function CouncilError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={`${CARD} flex flex-col items-center py-20 text-center`}>
      <span className="flex size-[72px] items-center justify-center rounded-pill bg-busy text-muted">
        <Icon name="wifiOff" size={30} />
      </span>
      <p className="mt-5 text-lg font-bold">리포트를 불러오지 못했어요</p>
      <p className="mt-2 text-sm text-muted">인터넷 연결을 확인하고 다시 시도해 주세요.</p>
      <div className="mt-6 w-40">
        <Button size="md" block onClick={onRetry}>
          <Icon name="refresh" size={16} /> 다시 시도
        </Button>
      </div>
    </div>
  );
}

/** A5-1 데이터가 쌓이는 중 (운영 2주 미만). 발표·점검용으로 지금까지 집계를 열어 볼 수 있다 */
export function CouncilWarmingUp({
  report,
  onShowAnyway,
}: {
  report: CouncilReport;
  onShowAnyway: () => void;
}) {
  const stats = [
    { label: '지금까지 딜', value: `${report.totals.deals}건` },
    { label: '쿠폰 사용', value: `${report.totals.used}건` },
    { label: '참여 가게', value: `${report.totals.stores}곳` },
  ];
  return (
    <div className={`${CARD} flex flex-col items-center py-16 text-center`}>
      <Mascot pose="rice" size={136} />
      <p className="mt-5 text-lg font-bold">데이터가 쌓이는 중이에요</p>
      <p className="mt-3 text-sm leading-6 text-muted">
        믿을 만한 통계를 보여드리려면 2주 이상 운영 기록이 필요해요.
        {report.ready_from && (
          <>
            <br />
            {formatMonthDay(report.ready_from)}부터 리포트를 볼 수 있어요.
          </>
        )}
      </p>
      <div className="mt-7 flex gap-10">
        {stats.map((stat) => (
          <p key={stat.label} className="text-xs text-faint">
            {stat.label}
            <b className="mt-1 block text-xl text-ink">{stat.value}</b>
          </p>
        ))}
      </div>
      <button
        type="button"
        onClick={onShowAnyway}
        className="mt-6 text-xs text-faint underline underline-offset-4"
      >
        그래도 지금까지 집계 보기
      </button>
    </div>
  );
}
