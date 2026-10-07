import { formatPrice } from '@/shared/lib/format';

import { Badge } from '../../components/ui/Badge';
import { Field } from '../../components/ui/Field';
import { inputClass } from '../../lib/styles';
import { calcDiscount } from '../schema';

/** 입력칸 문자열 → 숫자 (쉼표·글자 제거). 비면 0 */
const toNumber = (text: string) => Number(text.replace(/[^\d]/g, '')) || 0;
const withComma = (value: number) => (value ? value.toLocaleString('ko-KR') : '');

interface PriceFieldsProps {
  originalPrice: number;
  dealPrice: number;
  onOriginalChange: (value: number) => void;
  onDealChange: (value: number) => void;
  dealPriceError?: string;
}

/** 정상가·할인가 두 칸과 자동 할인율 칩 (O4·O5 공통) */
export function PriceFields({
  originalPrice,
  dealPrice,
  onOriginalChange,
  onDealChange,
  dealPriceError,
}: PriceFieldsProps) {
  const discount = calcDiscount(originalPrice, dealPrice);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="정상가">
          <PriceInput value={originalPrice} onChange={onOriginalChange} />
        </Field>
        <Field label="할인가">
          <PriceInput
            value={dealPrice}
            onChange={onDealChange}
            hasError={Boolean(dealPriceError)}
            highlight
          />
        </Field>
      </div>
      {dealPriceError ? (
        <p className="text-[13px] text-danger" role="alert">
          {dealPriceError}
        </p>
      ) : (
        discount.percent > 0 && (
          <Badge tone="accent">
            {discount.percent}% 할인 · {formatPrice(discount.saved)} 아껴요
          </Badge>
        )
      )}
    </div>
  );
}

function PriceInput({
  value,
  onChange,
  hasError = false,
  highlight = false,
}: {
  value: number;
  onChange: (value: number) => void;
  hasError?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="relative">
      <input
        inputMode="numeric"
        value={withComma(value)}
        onChange={(event) => onChange(Math.min(toNumber(event.target.value), 10_000_000))}
        placeholder="0"
        className={`${inputClass(hasError)} pr-9 text-right font-semibold ${highlight && !hasError && value ? 'border-accent' : ''}`}
      />
      <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted">
        원
      </span>
    </div>
  );
}
