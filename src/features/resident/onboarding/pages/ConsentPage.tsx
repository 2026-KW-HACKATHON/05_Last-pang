import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { toAppError } from '@/shared/lib/errors';
import { BottomBar } from '@/shared/ui/BottomBar';
import { Icon } from '@/shared/ui/Icon';

import { useUpdateConsents } from '../../profile/hooks';
import { AreaCheckScreen } from '../components/AreaCheckScreen';
import { CheckCircle } from '../components/CheckCircle';
import { ConsentRow } from '../components/ConsentRow';
import { OnboardingHeader } from '../components/OnboardingHeader';
import { TermsSheet } from '../components/TermsSheet';
import { CONSENT_ITEMS, type ConsentItem } from '../consentItems';
import { consentSchema, type ConsentForm } from '../schema';
import { TERMS } from '../termsText';
import { useAreaCheck } from '../useAreaCheck';

// 온보딩 1/4 서비스 이용 동의 (피그마 R2) → 위치 동의 시 동네 확인 (R2-1)
export function ConsentPage() {
  const navigate = useNavigate();
  const updateConsents = useUpdateConsents();
  const [openItem, setOpenItem] = useState<ConsentItem | null>(null);
  const goNext = useCallback(() => navigate('/onboarding/profile'), [navigate]);
  const area = useAreaCheck(goNext);
  const { control, setValue, handleSubmit, formState } = useForm<ConsentForm>({
    resolver: zodResolver(consentSchema),
    mode: 'onChange',
    defaultValues: {
      isOver14: false,
      hasTermsConsent: false,
      hasPrivacyConsent: false,
      hasLocationConsent: false,
      hasPushConsent: false,
    },
  });

  const values = useWatch({ control });
  const isAllChecked = CONSENT_ITEMS.every((item) => Boolean(values[item.name]));

  const handleAllToggle = () => {
    for (const item of CONSENT_ITEMS) setValue(item.name, !isAllChecked, { shouldValidate: true });
  };

  const handleTermsAgree = () => {
    if (openItem) setValue(openItem.name, true, { shouldValidate: true });
    setOpenItem(null);
  };

  const handleValidSubmit = (form: ConsentForm) => {
    updateConsents.mutate(form, {
      // 위치에 동의했을 때만 한 번 위치를 읽어 동네를 확인한다
      onSuccess: () => {
        if (form.hasLocationConsent) void area.check();
        else goNext();
      },
    });
  };

  if (area.phase !== 'form') {
    return (
      <main className="mx-auto min-h-dvh max-w-[480px] bg-surface">
        <OnboardingHeader step={1} isEditMode={false} editTitle="" />
        <AreaCheckScreen
          variant={area.phase}
          isRetrying={area.isChecking}
          onContinue={goNext}
          onRetry={() => void area.check()}
        />
      </main>
    );
  }

  const isBusy = updateConsents.isPending || area.isChecking;

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-surface">
      <OnboardingHeader step={1} isEditMode={false} editTitle="" />
      <form onSubmit={handleSubmit(handleValidSubmit)} className="px-5 pt-4">
        <h1 className="text-2xl leading-snug font-bold">
          서비스 이용을 위해
          <br />
          동의가 필요해요
        </h1>
        <p className="mt-2 text-sm text-muted">
          월계 1동 이웃들과 따뜻한 마감 타임딜을 나눠보세요.
        </p>

        <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-card p-4 ring-1 ring-line">
          <input
            type="checkbox"
            checked={isAllChecked}
            onChange={handleAllToggle}
            className="sr-only"
          />
          <CheckCircle isChecked={isAllChecked} />
          <span className="flex-1 text-lg font-bold">전체 동의</span>
          <span className="text-xs text-accent">필수 · 선택 포함</span>
        </label>
        <div className="mt-3 rounded-card px-4 py-1 ring-1 ring-line">
          {CONSENT_ITEMS.map((item) => (
            <ConsentRow
              key={item.name}
              label={item.label}
              description={item.description}
              isRequired={item.isRequired}
              isChecked={Boolean(values[item.name])}
              onToggle={() => setValue(item.name, !values[item.name], { shouldValidate: true })}
              onOpenTerms={() => setOpenItem(item)}
            />
          ))}
        </div>
        <p className="mt-4 flex items-center gap-2 rounded-card bg-accent-tint p-4 text-sm text-muted">
          <Icon name="shield" size={18} className="text-accent" />
          개인정보는 판매하거나 광고에 쓰지 않아요.
        </p>
        {updateConsents.isError && (
          <p className="mt-3 text-center text-sm text-danger">
            {toAppError(updateConsents.error).message}
          </p>
        )}

        <BottomBar>
          <button
            type="submit"
            disabled={!formState.isValid || isBusy}
            className="h-[52px] w-full rounded-[12px] bg-accent font-semibold text-white disabled:bg-accent-disabled"
          >
            {area.isChecking ? '위치 확인 중…' : '동의하고 계속하기 →'}
          </button>
        </BottomBar>
      </form>
      {openItem && (
        <TermsSheet
          doc={TERMS[openItem.termsKey]}
          onAgree={handleTermsAgree}
          onClose={() => setOpenItem(null)}
        />
      )}
    </main>
  );
}
