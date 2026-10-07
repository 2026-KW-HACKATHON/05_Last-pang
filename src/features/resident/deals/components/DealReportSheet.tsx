import { useState } from 'react';

import { POLICY, REPORT_REASONS, type ReportReason } from '@/shared/constants/policy';
import { toAppError } from '@/shared/lib/errors';
import { BottomSheet } from '@/shared/ui/BottomSheet';
import { Icon } from '@/shared/ui/Icon';

import { useReportDeal } from '../hooks';

const DETAIL_MAX = 150;

interface DealReportSheetProps {
  dealId: string;
  subtitle: string; // "가게 · 딜 제목"
  onDone: (message: string) => void;
  onClose: () => void;
}

// 신고 사유 선택 (피그마 R7-1 신고 사유 선택). 신고한 사람은 사장님께 알리지 않는다
export function DealReportSheet({ dealId, subtitle, onDone, onClose }: DealReportSheetProps) {
  const [reason, setReason] = useState<ReportReason>(REPORT_REASONS[0].value);
  const [detail, setDetail] = useState('');
  const report = useReportDeal(dealId);
  const error = report.isError ? toAppError(report.error) : null;

  const handleSubmit = () => {
    report.mutate(
      { reason, detail },
      {
        onSuccess: () => onDone('신고를 접수했어요. 운영자가 확인할게요'),
        onError: (cause) => {
          const appError = toAppError(cause);
          if (appError.code === 'ALREADY_REPORTED') onDone(appError.message);
        },
      },
    );
  };

  return (
    <BottomSheet title="어떤 문제가 있나요?" onClose={onClose}>
      {/* 작은 화면에서 키보드가 올라와도 버튼까지 닿도록 시트 안에서 스크롤 */}
      <div className="max-h-[75dvh] overflow-y-auto">
        <p className="-mt-3 mb-3 truncate text-sm text-faint">{subtitle}</p>
        <div role="radiogroup" aria-label="신고 사유">
          {REPORT_REASONS.map((option) => {
            const isSelected = option.value === reason;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setReason(option.value)}
                className="flex h-11 w-full items-center gap-3 text-left"
              >
                <span
                  className={`size-5 shrink-0 rounded-full ${isSelected ? 'border-[6px] border-accent' : 'border border-line'}`}
                />
                {option.label}
              </button>
            );
          })}
        </div>
        <textarea
          value={detail}
          onChange={(event) => setDetail(event.target.value.slice(0, DETAIL_MAX))}
          placeholder="자세한 내용을 적어 주세요 (선택)"
          rows={3}
          className="mt-3 w-full resize-none rounded-[12px] p-4 text-sm ring-1 ring-line outline-none placeholder:text-faint focus:ring-accent"
        />
        <p className="mt-1 text-right text-xs text-faint">
          {detail.length}/{DETAIL_MAX}
        </p>
        <p className="mt-3 flex gap-2 rounded-[12px] bg-gray p-4 text-xs leading-relaxed text-muted">
          <Icon name="info" size={16} className="mt-px shrink-0" />
          <span>
            신고가 {POLICY.reportAutoPause}건 모이면 딜이 잠시 멈추고 운영자가 확인해요.
            <br />
            신고한 사람은 사장님께 알리지 않아요.
          </span>
        </p>
        {error && error.code !== 'ALREADY_REPORTED' && (
          <p className="mt-3 text-center text-sm text-danger">{error.message}</p>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={report.isPending}
          className="mt-4 h-[52px] w-full rounded-[12px] bg-accent font-semibold text-white disabled:bg-accent-disabled"
        >
          {report.isPending ? '신고하는 중...' : '신고하기'}
        </button>
      </div>
    </BottomSheet>
  );
}
