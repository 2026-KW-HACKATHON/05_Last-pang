// O4 즉시딜 올리기 — 30초 안에 지금부터 N시간 딜을 연다
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { COUPON_TTL_OPTIONS } from '@/shared/constants/domain';
import { AppError } from '@/shared/lib/errors';

import { ApprovedStoreGate } from '../../components/ApprovedStoreGate';
import { Icon } from '../../components/Icon';
import {
  Button,
  Card,
  Chip,
  Field,
  PageHeader,
  StatusBlock,
  StickyBar,
  Stepper,
} from '../../components/ui';
import { inputClass } from '../../lib/styles';
import { formatClock } from '../../lib/format';
import { DealPreviewCard } from '../components/DealPreviewCard';
import { PriceFields } from '../components/PriceFields';
import { useCreateDeal, usePushTargetEstimate } from '../hooks';
import { dealFormSchema } from '../schema';

import type { MyStore } from '../../store/api';

const TITLE_MAX = 40;
const TEMPLATES = ['마감 전 할인', '1+1', '오늘만 타임세일'] as const;
const DURATIONS = [
  { minutes: 60, label: '1시간' },
  { minutes: 120, label: '2시간' },
  { minutes: 180, label: '3시간' },
] as const;

export function DealFormPage() {
  return <ApprovedStoreGate>{(store) => <DealForm store={store} />}</ApprovedStoreGate>;
}

function DealForm({ store }: { store: MyStore }) {
  const navigate = useNavigate();
  const createDeal = useCreateDeal(store.id);
  const estimate = usePushTargetEstimate();

  const [title, setTitle] = useState('');
  const [originalPrice, setOriginalPrice] = useState(0);
  const [dealPrice, setDealPrice] = useState(0);
  const [durationMin, setDurationMin] = useState(120);
  const [totalQty, setTotalQty] = useState(10);
  const [couponTtlMin, setCouponTtlMin] = useState<(typeof COUPON_TTL_OPTIONS)[number]>(15);

  const input = { title, originalPrice, dealPrice, totalQty, durationMin, couponTtlMin };
  const parsed = dealFormSchema.safeParse(input);
  // 할인가 오류는 두 칸을 다 채운 뒤에만 보여 준다 (입력 중에 빨간 글씨가 먼저 뜨지 않게)
  const dealPriceError =
    originalPrice > 0 && dealPrice > 0 && dealPrice >= originalPrice
      ? '할인가는 정상가보다 낮아야 해요'
      : undefined;

  const now = new Date();
  const endsAt = new Date(now.getTime() + durationMin * 60_000);

  if (createDeal.isSuccess) {
    return (
      <div className="mx-auto min-h-dvh max-w-[480px]">
        <StatusBlock
          pose="heart"
          title="딜을 올렸어요!"
          body={
            estimate.data
              ? `근처 주민 ${estimate.data}명에게 알림이 가요`
              : '근처 주민 화면에 바로 보여요'
          }
          action={
            <Button block onClick={() => navigate('/owner', { replace: true })}>
              홈에서 현황 보기
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-28">
      <PageHeader title="즉시딜 올리기" />
      <div className="space-y-7 px-5 pt-2">
        <Field label="빠른 시작">
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((template) => (
              <Chip
                key={template}
                isSelected={title === template}
                onClick={() => setTitle(template)}
              >
                {template}
              </Chip>
            ))}
          </div>
        </Field>

        <Field label="혜택 이름" counter={`${title.length}/${TITLE_MAX}`}>
          <input
            value={title}
            maxLength={TITLE_MAX}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="예: 소금빵 2+1 타임세일"
            className={inputClass()}
          />
        </Field>

        <PriceFields
          originalPrice={originalPrice}
          dealPrice={dealPrice}
          onOriginalChange={setOriginalPrice}
          onDealChange={setDealPrice}
          dealPriceError={dealPriceError}
        />

        <Field
          label="진행 시간"
          hint={`오늘 ${formatClock(now.toISOString())} ~ ${formatClock(endsAt.toISOString())} (지금 바로 시작)`}
        >
          <div className="flex gap-2">
            {DURATIONS.map((duration) => (
              <Chip
                key={duration.minutes}
                isSelected={durationMin === duration.minutes}
                onClick={() => setDurationMin(duration.minutes)}
              >
                {duration.label}
              </Chip>
            ))}
          </div>
        </Field>

        <Field label="수량" hint="최대 100개">
          <Stepper value={totalQty} min={1} max={100} unit="개" onChange={setTotalQty} />
        </Field>

        <Field label="쿠폰 유효시간" hint="손님이 쿠폰을 받고 가게에 오기까지의 시간">
          <div className="flex gap-2">
            {COUPON_TTL_OPTIONS.map((minutes) => (
              <Chip
                key={minutes}
                isSelected={couponTtlMin === minutes}
                onClick={() => setCouponTtlMin(minutes)}
              >
                {minutes}분
              </Chip>
            ))}
          </div>
        </Field>

        <Card tinted>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-pill bg-surface text-accent">
              <Icon name="bell" size={20} />
            </span>
            <p className="text-[15px]">
              <span className="text-2xl font-semibold text-accent tabular-nums">
                {estimate.data ?? 0}명
              </span>
              <br />
              근처 주민에게 알림이 가요
            </p>
          </div>
          <p className="mt-3 text-[13px] text-muted">
            알림은 한 사람에게 하루 3번까지, 밤 9시~아침 7시는 보내지 않아요
          </p>
        </Card>

        <div className="space-y-2">
          <p className="text-[13px] text-muted">주민에게 이렇게 보여요</p>
          <DealPreviewCard
            storeName={store.name}
            category={store.category}
            title={title}
            originalPrice={originalPrice}
            dealPrice={dealPrice}
            totalQty={totalQty}
            endsAtLabel={formatClock(endsAt.toISOString())}
          />
        </div>

        {createDeal.error instanceof AppError && (
          <p className="text-[13px] text-danger" role="alert">
            {createDeal.error.message}
          </p>
        )}
      </div>

      <StickyBar>
        <Button
          block
          disabled={!parsed.success}
          isLoading={createDeal.isPending}
          onClick={() => parsed.success && createDeal.mutate(parsed.data)}
        >
          딜 올리기
        </Button>
      </StickyBar>
    </div>
  );
}
