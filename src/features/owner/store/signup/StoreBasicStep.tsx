import { useState } from 'react';

import { POLICY } from '@/shared/constants/policy';

import { Icon } from '../../components/Icon';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { NoticeBox } from '../../components/ui/NoticeBox';
import { StickyBar } from '../../components/ui/StickyBar';
import { inputClass } from '../../lib/styles';
import { AddressSearchSheet } from '../components/AddressSearchSheet';
import { CategoryTiles } from '../components/CategoryTiles';
import { storeBasicSchema } from '../schema';
import { StepProgress } from './StepProgress';

import type { StoreDraft } from './storeDraft';

interface StoreBasicStepProps {
  draft: StoreDraft;
  onChange: (draft: StoreDraft) => void;
  onNext: () => void;
  onLinkCode: () => void;
}

/** O1 가게 등록 1/3 기본정보 */
export function StoreBasicStep({ draft, onChange, onNext, onLinkCode }: StoreBasicStepProps) {
  const [isSearching, setIsSearching] = useState(false);
  const isValid = storeBasicSchema.safeParse(draft).success;
  const hasAddress = draft.address.length > 0;
  return (
    <>
      <div className="space-y-6 px-5 pt-5">
        <StepProgress step={1} label="기본정보 입력중" />
        <div>
          <span className="inline-flex items-center gap-1 rounded-pill bg-accent-tint px-3 py-1 text-xs font-semibold text-accent">
            <Icon name="store" size={14} /> 파트너 사장님 전용
          </span>
          <h2 className="mt-3 text-[22px] leading-8 font-bold">
            우리 가게를
            <br />
            동네에 알려주세요
          </h2>
          <p className="mt-1 text-sm text-muted">운영자 확인 후 딜을 올릴 수 있어요</p>
        </div>
        <Field label="가게 이름" aside={`${draft.name.length}/30`}>
          <input
            value={draft.name}
            maxLength={30}
            onChange={(event) => onChange({ ...draft, name: event.target.value })}
            placeholder="예: 우우즈 베이커리"
            className={inputClass()}
          />
        </Field>
        <Field label="업종 카테고리" aside={<span className="text-accent">1개 선택</span>}>
          <CategoryTiles
            value={draft.category}
            onChange={(category) => onChange({ ...draft, category })}
          />
        </Field>
        <Field
          label="도로명 주소"
          aside={hasAddress ? <span className="text-accent">● 주소 검색완료</span> : undefined}
        >
          <button
            type="button"
            onClick={() => setIsSearching(true)}
            className={`${inputClass()} flex items-center justify-between text-left`}
          >
            <span className={hasAddress ? '' : 'text-faint'}>
              {draft.address || '주소 검색하기'}
            </span>
            <Icon name={hasAddress ? 'edit' : 'search'} size={18} className="text-muted" />
          </button>
          {hasAddress && (
            <input
              value={draft.addressDetail}
              maxLength={30}
              onChange={(event) => onChange({ ...draft, addressDetail: event.target.value })}
              placeholder="상세 주소 (예: 1층)"
              className={`${inputClass()} mt-2`}
            />
          )}
        </Field>
        {hasAddress && (
          <div className="flex items-center gap-3 rounded-card bg-accent-tint p-4">
            <span className="flex size-9 items-center justify-center rounded-pill bg-accent text-white">
              <Icon name="checkCircle" size={20} />
            </span>
            <div>
              <p className="font-semibold">위치가 등록됐어요</p>
              <p className="text-[13px] text-muted">
                {POLICY.neighborhoodName} · 도로명 주소 기준 좌표
              </p>
            </div>
          </div>
        )}
        <NoticeBox icon="bulb">
          등록된 매장 위치를 기반으로 <b>{POLICY.neighborhoodName} 동네 주민들</b>에게 마감 타임딜
          푸시가 우선 발송됩니다.
        </NoticeBox>
        <button
          type="button"
          onClick={onLinkCode}
          className="w-full text-center text-sm text-muted underline"
        >
          운영자에게 받은 가게 연결 코드가 있어요
        </button>
      </div>
      <StickyBar>
        <Button block disabled={!isValid} onClick={onNext}>
          다음
        </Button>
      </StickyBar>
      {isSearching && (
        <AddressSearchSheet
          onClose={() => setIsSearching(false)}
          onSelect={(item) => {
            onChange({
              ...draft,
              address: item.roadAddress ?? item.label,
              lat: item.lat,
              lng: item.lng,
            });
            setIsSearching(false);
          }}
        />
      )}
    </>
  );
}
