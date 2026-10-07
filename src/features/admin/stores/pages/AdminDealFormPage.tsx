// 운영자가 대신 즉시딜 올리기 (사장님 계정이 없는 시연용 가게). 사장님 O4와 같은 입력·규칙
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { InstantDealFields } from '@/features/owner/deals/components/InstantDealFields';
import { EMPTY_DEAL_DRAFT, type DealDraft } from '@/features/owner/deals/dealDraft';
import { dealFormSchema } from '@/features/owner/deals/schema';
import { Button } from '@/features/owner/components/ui/Button';
import { NoticeBox } from '@/features/owner/components/ui/NoticeBox';
import { StickyBar } from '@/features/owner/components/ui/StickyBar';
import { TopBar } from '@/features/owner/components/ui/TopBar';
import { AppError } from '@/shared/lib/errors';

import { useAdminStore, useCreateDealForStore } from '../hooks';

export function AdminDealFormPage() {
  const { storeId = '' } = useParams();
  const navigate = useNavigate();
  const store = useAdminStore(storeId);
  const createDeal = useCreateDealForStore(storeId);
  const [draft, setDraft] = useState<DealDraft>(EMPTY_DEAL_DRAFT);
  const parsed = dealFormSchema.safeParse(draft);
  const error = createDeal.error instanceof AppError ? createDeal.error : null;

  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-28">
      <TopBar title="즉시딜 대신 올리기" />
      <div className="space-y-7 px-5 pt-5">
        <NoticeBox tone="tint" title={store.data?.name ?? '가게'}>
          사장님 동의를 받은 내용만 올려 주세요. 하루 3개, 같은 시간대 1개 규칙은 사장님과 같아요.
        </NoticeBox>
        <InstantDealFields
          draft={draft}
          onChange={setDraft}
          timeError={error?.code === 'TIME_OVERLAP' ? error.message : undefined}
        />
        {error && error.code !== 'TIME_OVERLAP' && (
          <NoticeBox tone="danger">{error.message}</NoticeBox>
        )}
      </div>
      <StickyBar>
        <Button
          block
          disabled={!parsed.success}
          isLoading={createDeal.isPending}
          onClick={() =>
            parsed.success &&
            createDeal.mutate(parsed.data, {
              onSuccess: () => navigate(`/admin/approved-stores/${storeId}`, { replace: true }),
            })
          }
        >
          딜 올리기
        </Button>
      </StickyBar>
    </div>
  );
}
