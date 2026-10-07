import { COUPON_TTL_OPTIONS, DAYS } from '@/shared/constants/domain';

import { Chip } from '../../components/ui/Chip';
import { Field } from '../../components/ui/Field';
import { Stepper } from '../../components/ui/Stepper';
import { WEEK_ORDER } from '../../lib/format';
import { inputClass } from '../../lib/styles';
import { PriceFields } from './PriceFields';
import { TimeInput } from './TimeInput';

import type { WeeklyDraft } from '../weeklyDraft';

const TITLE_MAX = 40;

/** 요일 반복딜 입력 칸 (O5 새 반복딜 · O5-1 수정 공통) */
export function WeeklyRuleFields({
  draft,
  onChange,
}: {
  draft: WeeklyDraft;
  onChange: (draft: WeeklyDraft) => void;
}) {
  const set = <K extends keyof WeeklyDraft>(key: K, value: WeeklyDraft[K]) =>
    onChange({ ...draft, [key]: value });
  const toggleDay = (day: number) =>
    set(
      'repeatDays',
      draft.repeatDays.includes(day)
        ? draft.repeatDays.filter((value) => value !== day)
        : [...draft.repeatDays, day],
    );
  const dealPriceError =
    draft.originalPrice > 0 && draft.dealPrice > 0 && draft.dealPrice >= draft.originalPrice
      ? '할인가는 정상가보다 낮아야 해요'
      : undefined;
  return (
    <div className="space-y-7">
      <Field label="혜택 이름" aside={`${draft.title.length}/${TITLE_MAX}`}>
        <input
          value={draft.title}
          maxLength={TITLE_MAX}
          onChange={(event) => set('title', event.target.value)}
          placeholder="예: 평일 오후 김밥 할인"
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
        label="반복 요일"
        error={draft.repeatDays.length === 0 ? '요일을 하나 이상 골라 주세요' : undefined}
      >
        <div className="flex justify-between">
          {WEEK_ORDER.map((day) => (
            <Chip
              key={day}
              round
              isSelected={draft.repeatDays.includes(day)}
              onClick={() => toggleDay(day)}
            >
              {DAYS[day]}
            </Chip>
          ))}
        </div>
      </Field>
      <Field
        label="시간"
        aside="30분 단위"
        error={draft.endTime <= draft.startTime ? '종료 시각이 시작보다 늦어야 해요' : undefined}
      >
        <div className="grid grid-cols-2 gap-3">
          <TimeInput
            label="시작"
            value={draft.startTime}
            onChange={(value) => set('startTime', value)}
          />
          <TimeInput label="끝" value={draft.endTime} onChange={(value) => set('endTime', value)} />
        </div>
      </Field>
      <Field label="수량" aside="최대 100개">
        <Stepper
          value={draft.qty}
          min={1}
          max={100}
          unit="개"
          onChange={(value) => set('qty', value)}
        />
      </Field>
      <Field label="쿠폰 유효시간">
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
    </div>
  );
}
