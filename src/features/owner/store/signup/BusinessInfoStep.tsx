import { Icon } from '../../components/Icon';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { StickyBar } from '../../components/ui/StickyBar';
import { inputClass } from '../../lib/styles';
import { businessInfoSchema, formatBusinessNo, onlyDigits } from '../schema';
import { LicenseUploader } from './LicenseUploader';
import { StepProgress } from './StepProgress';

import type { StoreDraft } from './storeDraft';

interface BusinessInfoStepProps {
  draft: StoreDraft;
  onChange: (draft: StoreDraft) => void;
  onNext: () => void;
  /** 재신청: 이미 올린 등록증이 있으면 새로 안 올려도 된다 */
  hasExistingLicense: boolean;
}

/** O1-2 가게 등록 2/3 사업자 정보 */
export function BusinessInfoStep({
  draft,
  onChange,
  onNext,
  hasExistingLicense,
}: BusinessInfoStepProps) {
  const parsed = businessInfoSchema.safeParse(draft);
  const digits = onlyDigits(draft.businessNo);
  const businessNoError =
    digits.length > 0 && digits.length < 10 ? '숫자 10자리를 입력해 주세요' : undefined;
  const hasLicense = Boolean(draft.licenseFile) || hasExistingLicense;
  return (
    <>
      <div className="space-y-6 px-5 pt-5">
        <StepProgress step={2} label="사업자 정보 입력중" />
        <div>
          <h2 className="text-[22px] leading-8 font-bold">
            사업자 정보를
            <br />
            알려주세요
          </h2>
          <p className="mt-1 text-sm text-muted">운영자만 확인하고 주민에게는 보이지 않아요</p>
        </div>
        <Field label="대표자 이름">
          <input
            value={draft.representativeName}
            maxLength={20}
            onChange={(event) => onChange({ ...draft, representativeName: event.target.value })}
            placeholder="김우주"
            className={inputClass()}
          />
        </Field>
        <Field
          label="사업자등록번호"
          error={businessNoError}
          aside={
            digits.length === 10 ? (
              <span className="flex items-center gap-0.5 text-success">
                <Icon name="check" size={14} /> 형식 확인
              </span>
            ) : undefined
          }
        >
          <input
            inputMode="numeric"
            value={draft.businessNo}
            onChange={(event) =>
              onChange({ ...draft, businessNo: formatBusinessNo(event.target.value) })
            }
            placeholder="123-45-67890"
            className={inputClass(Boolean(businessNoError))}
          />
        </Field>
        <Field label="매장 전화번호 (선택)">
          <input
            inputMode="tel"
            value={draft.phone}
            maxLength={20}
            onChange={(event) => onChange({ ...draft, phone: event.target.value })}
            placeholder="02-000-0000"
            className={inputClass()}
          />
        </Field>
        <Field label="사업자등록증 사진" aside="운영자 확인용">
          <LicenseUploader
            file={draft.licenseFile}
            hasExisting={hasExistingLicense}
            onChange={(licenseFile) => onChange({ ...draft, licenseFile })}
          />
        </Field>
      </div>
      <StickyBar>
        <Button block disabled={!parsed.success || !hasLicense} onClick={onNext}>
          다음
        </Button>
      </StickyBar>
    </>
  );
}
