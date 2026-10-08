import { useEffect, useRef, useState } from 'react';

import { Icon } from '@/features/owner/components/Icon';
import { Badge } from '@/features/owner/components/ui/Badge';
import { Button } from '@/features/owner/components/ui/Button';
import { AppError } from '@/shared/lib/errors';

import {
  useGenerateSummary,
  useSaveSummaryDraft,
  useSetSummaryStatus,
  useUpdateSummary,
} from '../hooks';
import { templateSummary } from '../reportText';
import { SummaryExportButtons } from './SummaryExportButtons';

import type { CouncilReport } from '../api';

/** A5 이번 달 요약 — AI 초안 → 문장 고치기 → 검수 완료 → 내려받기·발송 (검수 전에는 내보내기 금지) */
export function SummaryCard({ report }: { report: CouncilReport }) {
  const summary = report.summary;
  const text = summary?.edited_text ?? summary?.ai_text ?? '';
  const isReviewed = summary?.status === 'reviewed' || summary?.status === 'sent';
  const generate = useGenerateSummary();
  const saveDraft = useSaveSummaryDraft();
  const update = useUpdateSummary();
  const setStatus = useSetSummaryStatus();
  const [editing, setEditing] = useState<string | null>(null);
  // AI 초안 실패는 기본 문장으로 대신하므로 보여 주지 않는다
  const error = [saveDraft.error, update.error, setStatus.error].find(
    (item) => item instanceof AppError,
  );

  const handleGenerate = () =>
    generate.mutate(report.month, {
      onError: () => saveDraft.mutate({ month: report.month, text: templateSummary(report) }),
    });
  // 그 달 요약이 없으면 처음 열 때 한 번 초안을 만든다 (AI 실패 시 기본 문장). 검수는 사람이 한다
  const requested = useRef<string | null>(null);
  useEffect(() => {
    if (summary || requested.current === report.month) return;
    requested.current = report.month;
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 달이 바뀔 때만 다시 부른다
  }, [report.month, summary]);
  const isDrafting = !summary && (generate.isPending || saveDraft.isPending);

  return (
    <section className="rounded-card bg-surface px-6 pt-[23px] pb-5 ring-1 ring-line">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-[8px] bg-accent-tint text-accent">
            <Icon name="bolt" size={15} />
          </span>
          <h2 className="text-[17px] font-bold">이번 달 요약</h2>
          {summary && (
            <Badge tone={isReviewed ? 'success' : 'accent'} withDot>
              {summary.status === 'sent' ? '발송 완료' : isReviewed ? '검수 완료' : '검수 전'}
            </Badge>
          )}
          <span className="text-xs text-faint">
            {summary?.source === 'ai'
              ? 'AI가 집계 통계만 보고 쓴 문장이에요'
              : '집계 숫자로 만든 기본 문장이에요'}
          </span>
        </div>
        <div className="flex gap-2">
          {!summary && !isDrafting && (
            <Button size="sm" onClick={handleGenerate}>
              요약 다시 만들기
            </Button>
          )}
          {summary && !isReviewed && editing === null && (
            <>
              <Button variant="secondary" size="md" onClick={() => setEditing(text)}>
                <Icon name="edit" size={14} /> 문장 고치기
              </Button>
              <Button
                size="md"
                isLoading={setStatus.isPending}
                onClick={() => setStatus.mutate({ month: report.month, status: 'reviewed' })}
              >
                <Icon name="check" size={14} /> 검수 완료로 표시
              </Button>
            </>
          )}
          {isReviewed && (
            <SummaryExportButtons
              report={report}
              text={text}
              onSent={() => setStatus.mutate({ month: report.month, status: 'sent' })}
            />
          )}
        </div>
      </div>
      {editing !== null ? (
        <div className="mt-4 space-y-2">
          <textarea
            value={editing}
            maxLength={1000}
            rows={4}
            onChange={(event) => setEditing(event.target.value)}
            className="w-full rounded-field border border-line p-4 text-[15px] leading-7 outline-none focus:border-accent"
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setEditing(null)}>
              취소
            </Button>
            <Button
              size="sm"
              isLoading={update.isPending}
              onClick={() =>
                update.mutate(
                  { month: report.month, text: editing },
                  { onSuccess: () => setEditing(null) },
                )
              }
            >
              저장
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-4 min-h-[76px] rounded-field bg-busy px-4 py-4 text-sm leading-7">
          {isDrafting ? (
            <span className="text-muted">집계 숫자로 요약 문장을 만들고 있어요…</span>
          ) : (
            text
          )}
        </p>
      )}
      {!isReviewed && (
        <p className="mt-3 flex items-center gap-1 text-[13px] text-muted">
          <Icon name="lock" size={14} /> 검수 완료 전에는 내려받기와 외부 발송을 할 수 없어요.
        </p>
      )}
      {error instanceof AppError && <p className="mt-2 text-[13px] text-danger">{error.message}</p>}
    </section>
  );
}
