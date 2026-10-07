import { Field } from '@/features/owner/components/ui/Field';
import { inputClass } from '@/features/owner/lib/styles';
import { formatBusinessNo } from '@/features/owner/store/schema';

import type { AdminStoreDraft } from '../storeForm';

interface OptionalBusinessFieldsProps {
  draft: AdminStoreDraft;
  onChange: (patch: Partial<AdminStoreDraft>) => void;
}

/** 운영자 가게 추가: 대표자 · 사업자등록번호 · 매장 전화 (모두 선택) */
export function OptionalBusinessFields({ draft, onChange }: OptionalBusinessFieldsProps) {
  return (
    <>
      <Field label="대표자 (선택)">
        <input
          value={draft.representativeName}
          maxLength={20}
          onChange={(event) => onChange({ representativeName: event.target.value })}
          className={inputClass()}
        />
      </Field>
      <Field label="사업자등록번호 (선택)">
        <input
          inputMode="numeric"
          value={draft.businessNo}
          onChange={(event) => onChange({ businessNo: formatBusinessNo(event.target.value) })}
          placeholder="123-45-67890"
          className={inputClass()}
        />
      </Field>
      <Field label="매장 전화 (선택)">
        <input
          inputMode="tel"
          value={draft.phone}
          maxLength={20}
          onChange={(event) => onChange({ phone: event.target.value })}
          placeholder="02-000-0000"
          className={inputClass()}
        />
      </Field>
    </>
  );
}
