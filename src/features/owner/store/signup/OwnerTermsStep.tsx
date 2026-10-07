import { Icon } from '../../components/Icon';
import { Button } from '../../components/ui/Button';
import { NoticeBox } from '../../components/ui/NoticeBox';
import { StickyBar } from '../../components/ui/StickyBar';
import { OWNER_TERMS, type OwnerTermKey } from './ownerTerms';

interface OwnerTermsStepProps {
  agreed: Record<OwnerTermKey, boolean>;
  onChange: (agreed: Record<OwnerTermKey, boolean>) => void;
  onNext: () => void;
}

function CheckCircle({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex size-6 shrink-0 items-center justify-center rounded-pill ${checked ? 'bg-accent text-white' : 'border border-line text-transparent'}`}
    >
      <Icon name="check" size={14} />
    </span>
  );
}

/** O0 사장님 약관 동의 */
export function OwnerTermsStep({ agreed, onChange, onNext }: OwnerTermsStepProps) {
  const isAllAgreed = OWNER_TERMS.every((term) => agreed[term.key]);
  const isRequiredAgreed = OWNER_TERMS.filter((term) => term.isRequired).every(
    (term) => agreed[term.key],
  );
  const toggleAll = () =>
    onChange({
      service: !isAllAgreed,
      privacy: !isAllAgreed,
      policy: !isAllAgreed,
      marketing: !isAllAgreed,
    });
  return (
    <>
      <div className="space-y-5 px-5 pt-5">
        <span className="inline-flex items-center gap-1 rounded-pill bg-accent-tint px-3 py-1 text-xs font-semibold text-accent">
          <Icon name="store" size={14} /> 사장님 가입
        </span>
        <div>
          <h2 className="text-[22px] leading-8 font-bold">
            우리 가게를 등록하려면
            <br />
            동의가 필요해요
          </h2>
          <p className="mt-1 text-sm text-muted">가게 정보는 운영자 심사와 딜 노출에만 써요</p>
        </div>
        <button
          type="button"
          onClick={toggleAll}
          className={`flex w-full items-center gap-3 rounded-card p-4 text-left ${isRequiredAgreed ? 'border border-accent/30' : 'bg-gray'}`}
        >
          <CheckCircle checked={isAllAgreed} />
          <span className="flex-1 font-semibold">전체 동의</span>
          <span className="text-xs text-accent">필수 · 선택 포함</span>
        </button>
        <ul className="space-y-1">
          {OWNER_TERMS.map((term) => (
            <li key={term.key} className="flex items-center gap-3 py-2">
              <button
                type="button"
                className="flex flex-1 items-center gap-3 text-left text-[15px]"
                onClick={() => onChange({ ...agreed, [term.key]: !agreed[term.key] })}
              >
                <CheckCircle checked={agreed[term.key]} />
                <span>
                  <span className={term.isRequired ? 'text-accent' : 'text-muted'}>
                    [{term.isRequired ? '필수' : '선택'}]
                  </span>{' '}
                  {term.label}
                </span>
              </button>
              {term.to && (
                <a
                  href={term.to}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${term.label} 보기`}
                  className="text-faint"
                >
                  <Icon name="chevron" size={18} />
                </a>
              )}
            </li>
          ))}
        </ul>
        {isRequiredAgreed && (
          <NoticeBox tone="tint" icon="shield">
            주민의 이름·연락처는 사장님께 보이지 않아요
          </NoticeBox>
        )}
      </div>
      <StickyBar>
        <Button block disabled={!isRequiredAgreed} onClick={onNext}>
          <Icon name="arrowRight" size={18} /> 동의하고 계속하기
        </Button>
      </StickyBar>
    </>
  );
}
