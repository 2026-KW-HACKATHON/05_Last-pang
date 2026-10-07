import { useState } from 'react';

import { Icon } from '@/features/owner/components/Icon';
import { Field } from '@/features/owner/components/ui/Field';
import { inputClass } from '@/features/owner/lib/styles';
import { AddressSearchSheet } from '@/features/owner/store/components/AddressSearchSheet';

import { distanceFromCenter } from '../../lib';
import { CoordinateFields } from './CoordinateFields';

interface AdminAddressFieldProps {
  address: string;
  lat: number;
  lng: number;
  onChange: (patch: { address?: string; lat?: number; lng?: number }) => void;
}

/** 운영자 가게 주소: 검색(서비스 지역 밖도 허용) 또는 주소·좌표 직접 입력 */
export function AdminAddressField({ address, lat, lng, onChange }: AdminAddressFieldProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [isManual, setIsManual] = useState(false);
  return (
    <>
      <Field label="주소" hint={lat ? distanceFromCenter(lat, lng) : undefined}>
        <button
          type="button"
          onClick={() => setIsSearching(true)}
          className={`${inputClass()} flex items-center justify-between text-left`}
        >
          <span className={address ? '' : 'text-faint'}>{address || '주소 검색하기'}</span>
          <Icon name="search" size={18} className="text-muted" />
        </button>
        {isManual && (
          <input
            value={address}
            onChange={(event) => onChange({ address: event.target.value })}
            placeholder="주소 직접 입력"
            className={`${inputClass()} mt-2`}
          />
        )}
        <button
          type="button"
          className="mt-1 text-[13px] text-muted underline"
          onClick={() => setIsManual((value) => !value)}
        >
          {isManual ? '좌표 입력 닫기' : '검색이 안 되면 주소·좌표 직접 입력'}
        </button>
      </Field>
      {isManual && <CoordinateFields lat={lat} lng={lng} onChange={onChange} />}
      {isSearching && (
        <AddressSearchSheet
          allowOutside
          onClose={() => setIsSearching(false)}
          onSelect={(item) => {
            onChange({ address: item.roadAddress ?? item.label, lat: item.lat, lng: item.lng });
            setIsSearching(false);
          }}
        />
      )}
    </>
  );
}
