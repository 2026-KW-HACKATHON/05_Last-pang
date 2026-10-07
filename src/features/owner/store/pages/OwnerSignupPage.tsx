// O0 사장님 약관 동의 → O1 기본정보 → O1-2 사업자 정보 → O1-3 확인·제출 (거절된 가게는 같은 화면으로 재신청)
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { LoadingState } from '@/shared/ui/LoadingState';

import { ProfileButton } from '../../components/ui/ProfileButton';
import { TopBar } from '../../components/ui/TopBar';
import { useMyStore, useRegisterStore, useUploadBusinessLicense } from '../hooks';
import { formatBusinessNo, onlyDigits } from '../schema';
import { BusinessInfoStep } from '../signup/BusinessInfoStep';
import { LinkCodeSheet } from '../signup/LinkCodeSheet';
import { OwnerTermsStep } from '../signup/OwnerTermsStep';
import { ReviewStep } from '../signup/ReviewStep';
import { StoreBasicStep } from '../signup/StoreBasicStep';
import { EMPTY_STORE_DRAFT, fullAddress, type StoreDraft } from '../signup/storeDraft';

import type { OwnerTermKey } from '../signup/ownerTerms';
import type { MyStore } from '../api';

type Step = 'terms' | 'basic' | 'business' | 'review';

export function OwnerSignupPage() {
  const myStore = useMyStore();
  if (myStore.isPending) return <LoadingState />;
  // 이미 신청한 가게가 있으면(거절 제외) 홈의 상태 화면으로
  if (myStore.data && myStore.data.status !== 'rejected') return <Navigate to="/owner" replace />;
  return <OwnerSignup rejected={myStore.data ?? null} />;
}

/** 거절된 가게의 값을 채워 재신청을 쉽게 한다 */
function draftFrom(store: MyStore | null): StoreDraft {
  if (!store) return EMPTY_STORE_DRAFT;
  const [address, ...detail] = store.address.split(', ');
  return {
    ...EMPTY_STORE_DRAFT,
    name: store.name,
    category:
      (['meal', 'cafe', 'bakery', 'snack', 'etc'] as const).find(
        (value) => value === store.category,
      ) ?? 'etc',
    address: address ?? store.address,
    addressDetail: detail.join(', '),
    lat: store.lat,
    lng: store.lng,
    representativeName: store.representativeName ?? '',
    phone: store.phone ?? '',
  };
}

function OwnerSignup({ rejected }: { rejected: MyStore | null }) {
  const navigate = useNavigate();
  const register = useRegisterStore();
  const upload = useUploadBusinessLicense();
  const [step, setStep] = useState<Step>(rejected ? 'basic' : 'terms');
  const [terms, setTerms] = useState<Record<OwnerTermKey, boolean>>({
    service: false,
    privacy: false,
    policy: false,
    marketing: false,
  });
  const [draft, setDraft] = useState<StoreDraft>(() => draftFrom(rejected));
  const [isLinking, setIsLinking] = useState(false);

  const handleSubmit = async () => {
    try {
      const licensePath = draft.licenseFile ? await upload.mutateAsync(draft.licenseFile) : null;
      if (licensePath) setDraft((prev) => ({ ...prev, licensePath, licenseFile: null }));
      await register.mutateAsync({
        name: draft.name.trim(),
        category: draft.category,
        address: fullAddress(draft),
        lat: draft.lat,
        lng: draft.lng,
        representativeName: draft.representativeName.trim(),
        businessNo: onlyDigits(draft.businessNo),
        phone: draft.phone.trim() || undefined,
        licensePath: licensePath ?? draft.licensePath ?? undefined,
        marketingAgreed: terms.marketing,
      });
      navigate('/owner', { replace: true });
    } catch {
      // 오류는 ReviewStep이 register.error / upload.error로 보여 준다. 입력값은 그대로 둔다
    }
  };

  const goBack = () => {
    if (step === 'review') setStep('business');
    else if (step === 'business') setStep('basic');
    else if (step === 'basic' && !rejected) setStep('terms');
    else navigate(-1);
  };

  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-36">
      <TopBar title="가게 등록하기" onBack={goBack} right={<ProfileButton to="/me" />} />
      {step === 'terms' && (
        <OwnerTermsStep agreed={terms} onChange={setTerms} onNext={() => setStep('basic')} />
      )}
      {step === 'basic' && (
        <StoreBasicStep
          draft={draft}
          onChange={setDraft}
          onNext={() => setStep('business')}
          onLinkCode={() => setIsLinking(true)}
        />
      )}
      {step === 'business' && (
        <BusinessInfoStep
          draft={{ ...draft, businessNo: formatBusinessNo(draft.businessNo) }}
          onChange={setDraft}
          onNext={() => setStep('review')}
          hasExistingLicense={Boolean(rejected) || Boolean(draft.licensePath)}
        />
      )}
      {step === 'review' && (
        <ReviewStep
          draft={draft}
          isPending={upload.isPending || register.isPending}
          error={register.error ?? upload.error}
          onSubmit={() => void handleSubmit()}
          onBack={() => setStep('business')}
        />
      )}
      {isLinking && (
        <LinkCodeSheet
          onClose={() => setIsLinking(false)}
          onLinked={() => navigate('/owner', { replace: true })}
        />
      )}
    </div>
  );
}
