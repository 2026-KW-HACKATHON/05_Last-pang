import { COUPON_TTL_OPTIONS } from '@/shared/constants/domain';

import { Chip } from '../../components/ui/Chip';
import { Field } from '../../components/ui/Field';
import { Stepper } from '../../components/ui/Stepper';
import { formatClock } from '../../lib/format';
import { inputClass } from '../../lib/styles';
import { PriceFields } from './PriceFields';

import type { DealDraft } from '../dealDraft';

const TITLE_MAX = 40;
const TEMPLATES = ['마감 전 할인', '1+1', '오늘만 타임세일'] as const;
const DURATIONS = [60, 120, 180] as const;

interface InstantDealFieldsProps {
  draft: DealDraft;
  onChange: (draft: DealDraft) => void;
  /** 진행 시간 아래 빨간 글씨 (TIME_OVERLAP) */
  timeError?: string;
  disabled?: boolean;
}

/** 즉시딜 입력 칸 묶음 (O4 · 운영자 대신 올리기 공통) */
export function InstantDealFields({
  draft,
  onChange,
  timeError,
  disabled = false,
}: InstantDealFieldsProps) {
  const set = <K extends keyof DealDraft>(key: K, value: DealDraft[K]) =>
    onChange({ ...draft, [key]: value });
  const now = new Date();
  const endsAt = new Date(now.getTime() + draft.durationMin * 60_000);
  const dealPriceError =
    draft.originalPrice > 0 && draft.dealPrice > 0 && draft.dealPrice >= draft.originalPrice
      ? '할인가는 정상가보다 낮아야 해요'
      : undefined;
  return (
    <fieldset disabled={disabled} className="space-y-7 disabled:opacity-60">
      <Field label="빠른 시작">
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((template) => (
            <Chip
              key={template}
              isSelected={draft.title === template}
              onClick={() => set('title', template)}
            >
              {template}
            </Chip>
          ))}
        </div>
      </Field>
      <Field label="혜택 이름" aside={`${draft.title.length}/${TITLE_MAX}`}>
        <input
          value={draft.title}
          maxLength={TITLE_MAX}
          onChange={(event) => set('title', event.target.value)}
          placeholder="예: 소금빵 2+1 타임세일"
          className={inputClass()}
        />
      </Field>
      <PriceFields
        originalPrice={draft.originalPrice}
        dealPrice={draft.dealPrice}
        onOriginalChange={(value) => set('originalPrice', value)}
        onDealChange={(value) => set('dealPrice', value)}
        dealPriceError={dealPriceError}
      />
      <Field
        label="진행 시간"
        error={timeError}
        hint={`오늘 ${formatClock(now.toISOString())} ~ ${formatClock(endsAt.toISOString())} · 지금 바로 시작`}
      >
        <div className="flex gap-2">
          {DURATIONS.map((minutes) => (
            <Chip
              key={minutes}
              isSelected={draft.durationMin === minutes}
              onClick={() => set('durationMin', minutes)}
            >
              {minutes / 60}시간
            </Chip>
          ))}
        </div>
      </Field>
      <Field label="수량" aside="최대 100개">
        <Stepper
          value={draft.totalQty}
          min={1}
          max={100}
          unit="개"
          onChange={(value) => set('totalQty', value)}
        />
      </Field>
      <Field label="쿠폰 유효시간" hint="손님이 쿠폰을 받고 가게에 오기까지의 시간">
        <div className="flex gap-2">
          {COUPON_TTL_OPTIONS.map((minutes) => (
            <Chip
              key={minutes}
              isSelected={draft.couponTtlMin === minutes}
              onClick={() => set('couponTtlMin', minutes)}
            >
              {minutes}분
            </Chip>
          ))}
        </div>
      </Field>
    </fieldset>
  );
}
