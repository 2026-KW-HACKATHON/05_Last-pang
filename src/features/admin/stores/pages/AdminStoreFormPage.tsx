// 운영자 가게 직접 추가·수정 (A2 "+ 가게 추가"). 사장님 계정 없이 바로 운영 중 상태로 만든다
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/features/owner/components/ui/Button';
import { Field } from '@/features/owner/components/ui/Field';
import { NoticeBox } from '@/features/owner/components/ui/NoticeBox';
import { StickyBar } from '@/features/owner/components/ui/StickyBar';
import { TopBar } from '@/features/owner/components/ui/TopBar';
import { inputClass } from '@/features/owner/lib/styles';
import { CategoryTiles } from '@/features/owner/store/components/CategoryTiles';
import { formatBusinessNo } from '@/features/owner/store/schema';
import { AppError } from '@/shared/lib/errors';
import { LoadingState } from '@/shared/ui/LoadingState';

import { AdminAddressField } from '../components/AdminAddressField';
import { OptionalBusinessFields } from '../components/OptionalBusinessFields';
import { useAdminStore, useCreateAdminStore, useUpdateAdminStore } from '../hooks';
import { adminStoreSchema, EMPTY_ADMIN_STORE, type AdminStoreDraft } from '../storeForm';

import type { AdminStoreDetail } from '../api';

export function AdminStoreFormPage() {
  const { storeId } = useParams();
  const store = useAdminStore(storeId ?? '');
  if (storeId && store.isPending) return <LoadingState />;
  return <AdminStoreForm initial={store.data ?? null} />;
}

function draftOf(store: AdminStoreDetail | null): AdminStoreDraft {
  if (!store) return EMPTY_ADMIN_STORE;
  return {
    name: store.name,
    category:
      (['meal', 'cafe', 'bakery', 'snack', 'etc'] as const).find(
        (value) => value === store.category,
      ) ?? 'etc',
    description: store.description ?? '',
    address: store.address,
    lat: store.lat,
    lng: store.lng,
    representativeName: store.representative_name ?? '',
    businessNo: store.business_no ? formatBusinessNo(store.business_no) : '',
    phone: store.phone ?? '',
  };
}

function AdminStoreForm({ initial }: { initial: AdminStoreDetail | null }) {
  const navigate = useNavigate();
  const create = useCreateAdminStore();
  const update = useUpdateAdminStore(initial?.id ?? '');
  const [draft, setDraft] = useState<AdminStoreDraft>(() => draftOf(initial));
  const parsed = adminStoreSchema.safeParse(draft);
  const mutation = initial ? update : create;
  const set = <K extends keyof AdminStoreDraft>(key: K, value: AdminStoreDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!parsed.success) return;
    mutation.mutate(parsed.data, {
      onSuccess: (saved) =>
        navigate(
          `/admin/approved-stores/${saved.store_id}${saved.out_of_area ? '?outOfArea=1' : ''}`,
          { replace: true },
        ),
    });
  };

  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-28">
      <TopBar title={initial ? '가게 정보 수정' : '가게 직접 추가'} />
      <div className="space-y-6 px-5 pt-5">
        {!initial && (
          <NoticeBox tone="tint">
            사장님께 미리 동의를 받은 가게만 추가해 주세요. 추가하면 바로 운영 중이 되고 주민 화면에
            보여요.
          </NoticeBox>
        )}
        <Field label="가게 이름" aside={`${draft.name.length}/30`}>
          <input
            value={draft.name}
            maxLength={30}
            onChange={(event) => set('name', event.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="업종">
          <CategoryTiles value={draft.category} onChange={(value) => set('category', value)} />
        </Field>
        <Field label="한 줄 소개 (선택)" aside={`${draft.description?.length ?? 0}/40`}>
          <input
            value={draft.description}
            maxLength={40}
            onChange={(event) => set('description', event.target.value)}
            placeholder="예: 김밥 · 분식"
            className={inputClass()}
          />
        </Field>
        <AdminAddressField
          address={draft.address}
          lat={draft.lat}
          lng={draft.lng}
          onChange={(patch) => setDraft((prev) => ({ ...prev, ...patch }))}
        />
        <OptionalBusinessFields
          draft={draft}
          onChange={(patch) => setDraft((prev) => ({ ...prev, ...patch }))}
        />
        {mutation.error instanceof AppError && (
          <NoticeBox tone="danger">{mutation.error.message}</NoticeBox>
        )}
      </div>
      <StickyBar>
        <Button
          block
          disabled={!parsed.success}
          isLoading={mutation.isPending}
          onClick={handleSubmit}
        >
          {initial ? '저장하기' : '추가하기'}
        </Button>
      </StickyBar>
    </div>
  );
}
