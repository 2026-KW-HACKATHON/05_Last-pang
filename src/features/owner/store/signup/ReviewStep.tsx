import { AppError } from '@/shared/lib/errors';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { InfoRow } from '../../components/ui/InfoRow';
import { NoticeBox } from '../../components/ui/NoticeBox';
import { StickyBar } from '../../components/ui/StickyBar';
import { categoryLabel } from '../../lib/category';
import { onlyDigits } from '../schema';
import { StepProgress } from './StepProgress';
import { fullAddress, type StoreDraft } from './storeDraft';

interface ReviewStepProps {
  draft: StoreDraft;
  isPending: boolean;
  error: unknown;
  onSubmit: () => void;
  onBack: () => void;
}

/** O1-3 가게 등록 3/3 확인·제출 (실패해도 입력값은 그대로) */
export function ReviewStep({ draft, isPending, error, onSubmit, onBack }: ReviewStepProps) {
  const digits = onlyDigits(draft.businessNo);
  const isNetwork = error instanceof AppError && ['NETWORK_ERROR', 'UNKNOWN'].includes(error.code);
  return (
    <>
      <div className="space-y-5 px-5 pt-5">
        <StepProgress step={3} label="마지막 확인" />
        <h2 className="text-[22px] font-bold">이대로 신청할까요?</h2>
        <Card tone="gray">
          <InfoRow label="가게 이름" value={draft.name} />
          <InfoRow label="업종" value={categoryLabel(draft.category)} />
          <InfoRow label="주소" value={fullAddress(draft)} />
          <InfoRow label="대표자" value={draft.representativeName} />
          <InfoRow
            label="사업자등록번호"
            value={`${digits.slice(0, 3)}-${digits.slice(3, 5)}-*****`}
          />
          <InfoRow label="사업자등록증" value="첨부됨" />
        </Card>
        {error instanceof AppError && !isNetwork && (
          <NoticeBox tone="danger" title="신청하지 못했어요">
            {error.code === 'DUPLICATE_BUSINESS_NO'
              ? '이미 같은 사업자등록번호로 신청한 가게가 있어요. 운영자에게 문의해 주세요.'
              : error.message}
          </NoticeBox>
        )}
        {isNetwork && <NoticeBox tone="danger">잠시 후 다시 시도해 주세요</NoticeBox>}
        <NoticeBox icon="clock">
          보통 하루 안에 심사가 끝나요. 결과는 이 화면과 앱 알림으로 알려드려요.
        </NoticeBox>
      </div>
      <StickyBar>
        <Button block isLoading={isPending} onClick={onSubmit}>
          {error ? '다시 신청하기' : '입점 신청하기'}
        </Button>
        <Button variant="text" block onClick={onBack} disabled={isPending}>
          이전 단계로
        </Button>
      </StickyBar>
    </>
  );
}
