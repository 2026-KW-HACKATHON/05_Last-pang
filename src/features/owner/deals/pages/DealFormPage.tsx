// O4 즉시딜 올리기 · O4-1 하루 3개 한도 · 같은 시간대 중복 · 등록 완료
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { POLICY } from '@/shared/constants/policy';
import { useNow } from '@/shared/hooks/useNow';
import { AppError } from '@/shared/lib/errors';

import { ApprovedStoreGate } from '../../components/ApprovedStoreGate';
import { Button } from '../../components/ui/Button';
import { NoticeBox } from '../../components/ui/NoticeBox';
import { ProfileButton } from '../../components/ui/ProfileButton';
import { StickyBar } from '../../components/ui/StickyBar';
import { TopBar } from '../../components/ui/TopBar';
import { formatClock, formatTimeRange } from '../../lib/format';
import { DealCreatedView } from '../components/DealCreatedView';
import { DealPreviewCard } from '../components/DealPreviewCard';
import { InstantDealFields } from '../components/InstantDealFields';
import { EMPTY_DEAL_DRAFT, type DealDraft } from '../dealDraft';
import { PushEstimateCard } from '../components/PushEstimateCard';
import { useCreateInstantDeal, usePushTargetEstimate, useTodayDealQuota } from '../hooks';
import { dealBaseSchema, dealFormSchema } from '../schema';

import type { MyStore } from '../../store/api';

export function DealFormPage() {
  return <ApprovedStoreGate>{(store) => <DealForm store={store} />}</ApprovedStoreGate>;
}

function overlapMessage(error: unknown): string | undefined {
  if (!(error instanceof AppError) || error.code !== 'TIME_OVERLAP') return undefined;
  const { starts_at: startsAt, ends_at: endsAt } = error.detail ?? {};
  if (typeof startsAt !== 'string' || typeof endsAt !== 'string') return error.message;
  return `${formatTimeRange(startsAt, endsAt).replace(' ~ ', '~')}에 이미 진행 중인 딜이 있어요`;
}

function repostOf(state: unknown): Partial<DealDraft> {
  const parsed = dealBaseSchema
    .pick({ title: true, originalPrice: true, dealPrice: true, totalQty: true })
    .safeParse(state);
  return parsed.success ? parsed.data : {};
}

function DealForm({ store }: { store: MyStore }) {
  const createDeal = useCreateInstantDeal();
  const quota = useTodayDealQuota();
  const now = useNow(60_000);
  const location = useLocation();
  // O12 "같은 딜 다시 올리기"에서 넘어오면 이름·가격·수량을 채워 둔다
  const [draft, setDraft] = useState<DealDraft>(() => ({
    ...EMPTY_DEAL_DRAFT,
    ...repostOf(location.state),
  }));

  const estimate = usePushTargetEstimate(draft.durationMin);
  const parsed = dealFormSchema.safeParse(draft);
  const isLimitReached =
    (quota.data && quota.data.used >= quota.data.limit) ||
    (createDeal.error instanceof AppError && createDeal.error.code === 'DAILY_LIMIT_REACHED');
  const timeError = overlapMessage(createDeal.error);
  const otherError =
    createDeal.error instanceof AppError &&
    !['DAILY_LIMIT_REACHED', 'TIME_OVERLAP'].includes(createDeal.error.code)
      ? createDeal.error.message
      : undefined;

  const handleDraftChange = (next: DealDraft) => {
    if (timeError) createDeal.reset(); // 시간을 바꾸면 겹침 표시를 지운다
    setDraft(next);
  };

  if (createDeal.data) return <DealCreatedView created={createDeal.data} draft={draft} />;

  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-28">
      <TopBar title="즉시딜 올리기" right={<ProfileButton to="/owner/me" />} />
      <div className="space-y-7 px-5 pt-5">
        {isLimitReached && (
          <NoticeBox tone="danger" title={`오늘은 딜을 ${POLICY.ownerDailyDeals}개 모두 올렸어요`}>
            딜은 하루 {POLICY.ownerDailyDeals}개까지 올릴 수 있어요. 내일 다시 올려 주세요.
          </NoticeBox>
        )}
        <InstantDealFields
          draft={draft}
          onChange={handleDraftChange}
          timeError={timeError}
          disabled={isLimitReached}
        />
        {!isLimitReached && <PushEstimateCard count={estimate.data} />}
        {!isLimitReached && (
          <div className="space-y-2">
            <p className="text-[13px] text-muted">주민에게 이렇게 보여요</p>
            <DealPreviewCard
              storeName={store.name}
              category={store.category}
              title={draft.title}
              originalPrice={draft.originalPrice}
              dealPrice={draft.dealPrice}
              totalQty={draft.totalQty}
              endsAtLabel={formatClock(new Date(now + draft.durationMin * 60_000).toISOString())}
            />
          </div>
        )}
        {otherError && <NoticeBox tone="danger">{otherError}</NoticeBox>}
      </div>
      <StickyBar>
        {isLimitReached ? (
          <Button block disabled className="bg-gray text-faint">
            오늘 등록 한도를 채웠어요
          </Button>
        ) : (
          <Button
            block
            disabled={!parsed.success || Boolean(timeError)}
            isLoading={createDeal.isPending}
            onClick={() => parsed.success && createDeal.mutate(parsed.data)}
          >
            딜 올리기
          </Button>
        )}
      </StickyBar>
    </div>
  );
}
