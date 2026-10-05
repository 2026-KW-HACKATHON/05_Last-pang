// O5 요일 반복딜 — 규칙을 저장하면 고른 요일마다 딜이 자동으로 생긴다 (6-5 cron)
import { useState } from 'react';

import { COUPON_TTL_OPTIONS, DAYS } from '@/shared/constants/domain';
import { AppError } from '@/shared/lib/errors';
import { formatPrice } from '@/shared/lib/format';

import { ApprovedStoreGate } from '../../components/ApprovedStoreGate';
import { Icon } from '../../components/Icon';
import {
  Button,
  Card,
  Chip,
  Field,
  PageHeader,
  SectionTitle,
  StickyBar,
  Stepper,
  Toast,
} from '../../components/ui';
import { inputClass } from '../../lib/styles';
import { formatRepeatDays, WEEK_ORDER } from '../../lib/format';
import { PriceFields } from '../components/PriceFields';
import { useCreateDealRule, useDealRules, useSetDealRuleActive } from '../hooks';
import { weeklyDealSchema } from '../schema';

import type { DealRule } from '../api';
import type { MyStore } from '../../store/api';

const TITLE_MAX = 40;
export function WeeklyDealFormPage() {
  return <ApprovedStoreGate>{(store) => <WeeklyDealForm store={store} />}</ApprovedStoreGate>;
}

function WeeklyDealForm({ store }: { store: MyStore }) {
  const rules = useDealRules(store.id);
  const createRule = useCreateDealRule(store.id);
  const setActive = useSetDealRuleActive(store.id);

  const [title, setTitle] = useState('');
  const [originalPrice, setOriginalPrice] = useState(0);
  const [dealPrice, setDealPrice] = useState(0);
  const [repeatDays, setRepeatDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [startTime, setStartTime] = useState('15:00');
  const [endTime, setEndTime] = useState('17:00');
  const [qty, setQty] = useState(5);
  const [couponTtlMin, setCouponTtlMin] = useState<(typeof COUPON_TTL_OPTIONS)[number]>(15);
  const [toast, setToast] = useState<string | null>(null);

  const parsed = weeklyDealSchema.safeParse({
    title,
    originalPrice,
    dealPrice,
    repeatDays,
    startTime,
    endTime,
    qty,
    couponTtlMin,
  });
  const dealPriceError =
    originalPrice > 0 && dealPrice > 0 && dealPrice >= originalPrice
      ? '할인가는 정상가보다 낮아야 해요'
      : undefined;
  const timeError = endTime <= startTime ? '종료 시각이 시작보다 늦어야 해요' : undefined;

  const toggleDay = (day: number) =>
    setRepeatDays((prev) =>
      prev.includes(day) ? prev.filter((value) => value !== day) : [...prev, day],
    );

  const handleSave = () => {
    if (!parsed.success) return;
    createRule.mutate(parsed.data, {
      onSuccess: () => {
        setTitle('');
        setOriginalPrice(0);
        setDealPrice(0);
        setToast('반복딜을 저장했어요');
        window.setTimeout(() => setToast(null), 2500);
      },
    });
  };

  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-28">
      <PageHeader title="요일 반복딜" />
      <div className="space-y-7 px-5 pt-2">
        <Card tinted>
          <p className="flex items-start gap-2 text-[13px] leading-[18px]">
            <Icon name="info" size={18} className="shrink-0 text-accent" />
            고른 요일마다 밤 12시 5분에 그날 딜이 자동으로 생겨요
          </p>
        </Card>

        {(rules.data ?? []).length > 0 && (
          <section>
            <SectionTitle>내 반복딜</SectionTitle>
            <div className="space-y-2">
              {(rules.data ?? []).map((rule) => (
                <RuleRow
                  key={rule.id}
                  rule={rule}
                  isUpdating={setActive.isPending && setActive.variables?.ruleId === rule.id}
                  onToggle={(isActive) => setActive.mutate({ ruleId: rule.id, isActive })}
                />
              ))}
            </div>
          </section>
        )}

        <section className="space-y-7 border-t border-line pt-7">
          <h2 className="text-lg font-semibold">새 반복딜</h2>

          <Field label="혜택 이름" counter={`${title.length}/${TITLE_MAX}`}>
            <input
              value={title}
              maxLength={TITLE_MAX}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="예: 평일 오후 김밥 할인"
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
            label="반복 요일"
            error={repeatDays.length === 0 ? '요일을 하나 이상 골라 주세요' : undefined}
          >
            <div className="flex justify-between">
              {WEEK_ORDER.map((day) => (
                <Chip
                  key={day}
                  round
                  isSelected={repeatDays.includes(day)}
                  onClick={() => toggleDay(day)}
                >
                  {DAYS[day]}
                </Chip>
              ))}
            </div>
          </Field>

          <Field label="시간" error={timeError}>
            <div className="grid grid-cols-2 gap-3">
              <TimeInput label="시작" value={startTime} onChange={setStartTime} />
              <TimeInput label="끝" value={endTime} onChange={setEndTime} />
            </div>
          </Field>

          <Field label="수량" hint="최대 100개">
            <Stepper value={qty} min={1} max={100} unit="개" onChange={setQty} />
          </Field>

          <Field label="쿠폰 유효시간">
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

          {createRule.error instanceof AppError && (
            <p className="text-[13px] text-danger" role="alert">
              {createRule.error.message}
            </p>
          )}
        </section>
      </div>

      <StickyBar>
        <Button
          block
          disabled={!parsed.success}
          isLoading={createRule.isPending}
          onClick={handleSave}
        >
          반복딜 저장
        </Button>
      </StickyBar>
      {toast && <Toast>{toast}</Toast>}
    </div>
  );
}

function TimeInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative block">
      <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[13px] text-muted">
        {label}
      </span>
      <input
        type="time"
        step={1800}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass()} pl-12 text-right font-semibold tabular-nums`}
      />
    </label>
  );
}

function RuleRow({
  rule,
  isUpdating,
  onToggle,
}: {
  rule: DealRule;
  isUpdating: boolean;
  onToggle: (isActive: boolean) => void;
}) {
  return (
    <Card className={rule.isActive ? undefined : 'opacity-60'}>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{rule.title}</p>
          <p className="mt-0.5 text-[13px] text-muted">
            {formatRepeatDays(rule.repeatDays)} · {rule.startTime}~{rule.endTime}
          </p>
          <p className="text-[13px] text-muted">
            {formatPrice(rule.dealPrice)} · {rule.qty}개
          </p>
        </div>
        <Switch
          checked={rule.isActive}
          disabled={isUpdating}
          label={`${rule.title} 켜기`}
          onChange={onToggle}
        />
      </div>
    </Card>
  );
}

function Switch({
  checked,
  disabled,
  label,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-pill transition-colors disabled:opacity-50 ${checked ? 'bg-accent' : 'bg-line'}`}
    >
      <span
        className={`absolute top-0.5 left-0 size-6 rounded-pill bg-surface shadow transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
      />
    </button>
  );
}
