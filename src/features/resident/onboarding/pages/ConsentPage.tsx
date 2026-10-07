import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { toAppError } from '@/shared/lib/errors';
import { BottomBar } from '@/shared/ui/BottomBar';
import { Icon } from '@/shared/ui/Icon';

import { useUpdateConsents } from '../../profile/hooks';
import { CheckCircle } from '../components/CheckCircle';
import { ConsentRow } from '../components/ConsentRow';
import { OnboardingHeader } from '../components/OnboardingHeader';
import { consentSchema, type ConsentForm } from '../schema';

const ITEMS: {
  name: keyof ConsentForm;
  label: string;
  description?: string;
  isRequired: boolean;
}[] = [
  { name: 'isOver14', label: '만 14세 이상이에요', isRequired: true },
  { name: 'hasTermsConsent', label: '서비스 이용약관', isRequired: true },
  {
    name: 'hasPrivacyConsent',
    label: '개인정보 수집·이용',
    description: '닉네임, 카카오 회원 번호',
    isRequired: true,
  },
  {
    name: 'hasLocationConsent',
    label: '위치 기반 서비스 이용',
    description: '현재 위치는 거리 계산에만 쓰고 저장하지 않아요',
    isRequired: false,
  },
  { name: 'hasPushConsent', label: '실시간 딜 알림 받기', isRequired: false },
];

// 온보딩 1/4 서비스 이용 동의 (피그마 R2)
export function ConsentPage() {
  const navigate = useNavigate();
  const updateConsents = useUpdateConsents();
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
  const isAllChecked = ITEMS.every((item) => Boolean(values[item.name]));

  const handleAllToggle = () => {
    for (const item of ITEMS) setValue(item.name, !isAllChecked, { shouldValidate: true });
  };

  const handleValidSubmit = (form: ConsentForm) => {
    updateConsents.mutate(form, { onSuccess: () => navigate('/onboarding/profile') });
  };

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-surface">
      <OnboardingHeader step={1} isEditMode={false} editTitle="" />
      <form onSubmit={handleSubmit(handleValidSubmit)} className="px-5 pt-4">
        <h1 className="text-2xl leading-snug font-bold">
          서비스 이용을 위해
          <br />
          동의가 필요해요
        </h1>
        <p className="mt-2 text-sm text-muted">월계1동 이웃들과 따뜻한 마감 타임딜을 나눠보세요.</p>

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
          {ITEMS.map((item) => (
            <ConsentRow
              key={item.name}
              label={item.label}
              description={item.description}
              isRequired={item.isRequired}
              isChecked={Boolean(values[item.name])}
              onToggle={() => setValue(item.name, !values[item.name], { shouldValidate: true })}
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
            disabled={!formState.isValid || updateConsents.isPending}
            className="h-14 w-full rounded-card bg-accent font-semibold text-white disabled:bg-accent-tint disabled:text-faint"
          >
            동의하고 계속하기
          </button>
        </BottomBar>
      </form>
    </main>
  );
}
