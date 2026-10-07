import { toAppError } from '@/shared/lib/errors';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { PageHeader } from '@/shared/ui/PageHeader';

import { AlertPreviewList } from '../components/AlertPreviewList';
import { AlertToggleRow } from '../components/AlertToggleRow';
import { LeadTimeSegment } from '../components/LeadTimeSegment';
import { useAlertPreview, useAlertSettings, useUpdateAlertSettings } from '../hooks';
import { dowOf, leadLabel, todaySeoul } from '../time';

// 방해 금지는 앱 정책 22:00~08:00 (notification_settings 기본값)
const NOTES = [
  '알림 두 개가 1시간 안으로 가까우면 한 번으로 합쳐요',
  '밤 10시~아침 8시에는 보내지 않아요',
  '알림을 누르면 그 시간에 갈 수 있는 딜만 보여요',
];

// R13-5 딜 알림 시간: 슬롯 켜고 끄기 + 이번 주 미리 보기
export function AlertTimesPage() {
  const settings = useAlertSettings();
  const preview = useAlertPreview();
  const updateSettings = useUpdateAlertSettings();
  const todayDow = dowOf(todaySeoul());

  if (settings.isPending) return <LoadingState />;
  if (settings.isError) {
    return <ErrorState error={settings.error} onRetry={() => void settings.refetch()} />;
  }

  const { morning, lunch, dinner, leadMin } = settings.data;

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-surface pb-10">
      <PageHeader title="딜 알림 시간" hasBack />
      <div className="px-4 pt-4">
        <h1 className="text-xl leading-snug font-bold">시간표를 보고 하루 3번까지 알려드려요</h1>

        <section className="mt-4 divide-y divide-line rounded-card ring-1 ring-line">
          <AlertToggleRow
            title="아침 · 첫 외출 전"
            description={`그날 첫 일정 ${leadLabel(leadMin)} 전`}
            checked={morning}
            onChange={(checked) => updateSettings.mutate({ morning: checked })}
          />
          <AlertToggleRow
            title="점심"
            description="11:30쯤 · 일정 중이면 끝난 뒤"
            checked={lunch}
            onChange={(checked) => updateSettings.mutate({ lunch: checked })}
          />
          <AlertToggleRow
            title="저녁"
            description="17:30쯤 · 일정 중이면 끝난 뒤"
            checked={dinner}
            onChange={(checked) => updateSettings.mutate({ dinner: checked })}
          />
        </section>
        {updateSettings.isError && (
          <p className="mt-2 text-sm text-danger" role="alert">
            {toAppError(updateSettings.error).message}
          </p>
        )}

        <h2 className="mt-6 mb-2 font-bold">첫 외출 얼마 전에 알릴까요?</h2>
        <LeadTimeSegment
          value={leadMin}
          disabled={!morning}
          onChange={(value) => updateSettings.mutate({ leadMin: value })}
        />

        <section className="mt-4 rounded-card px-4 py-4 ring-1 ring-line">
          <h2 className="mb-2 font-bold">이번 주 알림 미리 보기</h2>
          {preview.isPending ? (
            <div className="h-48 animate-pulse rounded-[12px] bg-gray" />
          ) : preview.isError ? (
            <ErrorState error={preview.error} onRetry={() => void preview.refetch()} />
          ) : (
            <AlertPreviewList items={preview.data} todayDow={todayDow} />
          )}
        </section>

        <ul className="mt-4 space-y-1 rounded-card bg-gray px-4 py-3 text-xs text-muted">
          {NOTES.map((note) => (
            <li key={note}>· {note}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
