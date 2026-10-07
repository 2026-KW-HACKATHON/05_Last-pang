// O9 가게 정보 수정 · 주소 변경 확인 — 주소를 바꾸면 운영자가 다시 확인한다
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppError } from '@/shared/lib/errors';
import type { GeoItem } from '@/shared/lib/geoSearch';

import { ApprovedStoreGate } from '../../components/ApprovedStoreGate';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Field } from '../../components/ui/Field';
import { NoticeBox } from '../../components/ui/NoticeBox';
import { StickyBar } from '../../components/ui/StickyBar';
import { TopBar } from '../../components/ui/TopBar';
import { inputClass } from '../../lib/styles';
import { AddressSearchSheet } from '../../store/components/AddressSearchSheet';
import { CategoryTiles } from '../../store/components/CategoryTiles';
import { useRequestAddressChange, useUpdateStoreInfo } from '../../store/hooks';
import { storeInfoSchema } from '../../store/schema';

import type { MyStore } from '../../store/api';

export function StoreInfoEditPage() {
  return <ApprovedStoreGate>{(store) => <StoreInfoEdit store={store} />}</ApprovedStoreGate>;
}

function StoreInfoEdit({ store }: { store: MyStore }) {
  const navigate = useNavigate();
  const updateInfo = useUpdateStoreInfo(store.id);
  const changeAddress = useRequestAddressChange();
  const [name, setName] = useState(store.name);
  const [category, setCategory] = useState(store.category);
  const [newAddress, setNewAddress] = useState<GeoItem | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const parsed = storeInfoSchema.safeParse({
    name,
    category,
    description: store.description ?? undefined,
  });
  const error = updateInfo.error ?? changeAddress.error;

  const save = async () => {
    if (!parsed.success) return;
    await updateInfo.mutateAsync(parsed.data);
    if (newAddress) {
      await changeAddress.mutateAsync({
        address: newAddress.roadAddress ?? newAddress.label,
        lat: newAddress.lat,
        lng: newAddress.lng,
      });
    }
    navigate('/owner/me');
  };
  const handleSave = () =>
    newAddress ? setIsConfirming(true) : void save().catch(() => undefined);

  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-28">
      <TopBar title="가게 정보 수정" />
      <div className="space-y-6 px-5 pt-5">
        <Field label="가게 이름" aside={`${name.length}/30`}>
          <input
            value={name}
            maxLength={30}
            onChange={(event) => setName(event.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field label="업종">
          <CategoryTiles value={category} onChange={setCategory} />
        </Field>
        <Field label="도로명 주소" aside="바꾸면 다시 심사해요">
          <button
            type="button"
            onClick={() => setIsSearching(true)}
            className={`${inputClass()} flex items-center justify-between text-left`}
          >
            <span className="truncate">
              {newAddress?.roadAddress ?? store.pendingAddress ?? store.address}
            </span>
            <Icon name="edit" size={18} className="text-muted" />
          </button>
        </Field>
        <NoticeBox tone="tint">
          주소를 바꾸면 운영자가 다시 확인해요. 확인 전까지 새 딜을 올릴 수 없어요.
        </NoticeBox>
        {error instanceof AppError && <NoticeBox tone="danger">{error.message}</NoticeBox>}
      </div>
      <StickyBar>
        <Button
          block
          disabled={!parsed.success}
          isLoading={updateInfo.isPending || changeAddress.isPending}
          onClick={handleSave}
        >
          저장하기
        </Button>
      </StickyBar>
      {isSearching && (
        <AddressSearchSheet
          onClose={() => setIsSearching(false)}
          onSelect={(item) => {
            setNewAddress(item);
            setIsSearching(false);
          }}
        />
      )}
      {isConfirming && (
        <ConfirmDialog
          icon="store"
          title="주소를 바꾸고 다시 심사받을까요?"
          body={'심사가 끝날 때까지 새 딜을 올릴 수 없어요.\n진행 중인 딜은 그대로 진행돼요.'}
          confirmLabel="심사받기"
          isPending={updateInfo.isPending || changeAddress.isPending}
          onConfirm={() => void save().catch(() => setIsConfirming(false))}
          onCancel={() => setIsConfirming(false)}
        />
      )}
    </div>
  );
}
