// O1 가게 등록 — 지도 SDK 없이 "가게 안에서 현재 위치"로 좌표를 받는다 (운영자가 승인할 때 확인)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CATEGORIES, type Category } from '@/shared/constants/domain';
import { AppError } from '@/shared/lib/errors';

import { Icon } from '../../components/Icon';
import { Button, Card, Chip, Field, PageHeader, StickyBar } from '../../components/ui';
import { inputClass } from '../../lib/styles';
import { useRegisterStore } from '../hooks';
import { storeSignupSchema } from '../schema';

type LocationState =
  | { status: 'idle' }
  | { status: 'locating' }
  | { status: 'located'; lat: number; lng: number; accuracy: number }
  | { status: 'denied' };

const NAME_MAX = 30;

export function OwnerSignupPage() {
  const navigate = useNavigate();
  const registerStore = useRegisterStore();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<LocationState>({ status: 'idle' });

  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocation({ status: 'denied' });
      return;
    }
    setLocation({ status: 'locating' });
    navigator.geolocation.getCurrentPosition(
      (position) =>
        setLocation({
          status: 'located',
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
        }),
      () => setLocation({ status: 'denied' }),
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 },
    );
  };

  const parsed = storeSignupSchema.safeParse({ name, category, address });
  const canSubmit = parsed.success && location.status === 'located' && !registerStore.isPending;

  const handleSubmit = () => {
    if (!parsed.success || location.status !== 'located') return;
    registerStore.mutate(
      { ...parsed.data, lat: location.lat, lng: location.lng },
      { onSuccess: () => navigate('/owner', { replace: true }) },
    );
  };

  const submitError = registerStore.error instanceof AppError ? registerStore.error.message : null;

  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-28">
      <PageHeader title="가게 등록" />
      <div className="space-y-7 px-5 pt-2">
        <div>
          <h2 className="text-2xl leading-8 font-semibold tracking-[-0.5px]">
            우리 가게를
            <br />
            동네에 알려주세요
          </h2>
          <p className="mt-2 text-[15px] text-muted">운영자 확인 후 딜을 올릴 수 있어요</p>
        </div>

        <Field label="가게 이름" counter={`${name.length}/${NAME_MAX}`}>
          <input
            value={name}
            maxLength={NAME_MAX}
            onChange={(event) => setName(event.target.value)}
            placeholder="예: 우우즈 베이커리"
            className={inputClass()}
          />
        </Field>

        <Field label="업종">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((item) => (
              <Chip
                key={item.value}
                isSelected={category === item.value}
                onClick={() => setCategory(item.value)}
                icon={category === item.value ? <Icon name="check" size={16} /> : undefined}
              >
                {item.label}
              </Chip>
            ))}
          </div>
        </Field>

        <Field label="주소">
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="예: 서울 노원구 광운로 12, 1층"
            className={inputClass()}
          />
        </Field>

        <Field
          label="가게 위치"
          error={location.status === 'denied' ? '위치 권한을 허용해야 등록할 수 있어요' : undefined}
        >
          {location.status === 'located' ? (
            <Card className="border-success/30 bg-success/5">
              <div className="flex items-start gap-3">
                <span className="flex size-10 items-center justify-center rounded-pill bg-success/15 text-success">
                  <Icon name="check" size={20} />
                </span>
                <div className="flex-1">
                  <p className="font-semibold">위치가 등록됐어요</p>
                  <p className="mt-0.5 text-[13px] text-muted">정확도 약 {location.accuracy}m</p>
                </div>
                <Button variant="text" onClick={requestLocation}>
                  다시 등록
                </Button>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-accent-tint text-accent">
                  <Icon name="pin" size={20} />
                </span>
                <div className="flex-1">
                  <p className="font-semibold">지금 가게에 있나요?</p>
                  <p className="mt-1 text-[13px] leading-[18px] text-muted">
                    가게 안에서 현재 위치로 등록하면 주민에게 걸어서 몇 분인지 정확히 보여줘요
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                block
                className="mt-3"
                isLoading={location.status === 'locating'}
                onClick={requestLocation}
              >
                <Icon name="pin" size={18} />
                현재 위치로 등록
              </Button>
            </Card>
          )}
        </Field>

        {submitError && (
          <p className="text-[13px] text-danger" role="alert">
            {submitError}
          </p>
        )}
      </div>

      <StickyBar>
        <Button
          block
          disabled={!canSubmit}
          isLoading={registerStore.isPending}
          onClick={handleSubmit}
        >
          등록 신청하기
        </Button>
      </StickyBar>
    </div>
  );
}
