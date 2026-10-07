import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { toAppError } from '@/shared/lib/errors';
import { blurCoordinate } from '@/shared/lib/geo';
import { BottomBar } from '@/shared/ui/BottomBar';
import { Icon } from '@/shared/ui/Icon';
import type { GeoItem } from '@/shared/lib/geoSearch';

import { isInWolgye1, readCurrentPosition } from '../../onboarding/currentPosition';
import { saveBaseLocationLabel } from '../baseLocationLabel';
import { usePlaceSearch, useUpdatePreferences } from '../hooks';
import { LocationStatus } from './LocationStatus';
import { PlaceResultList } from './PlaceResultList';
import { SchematicMap } from './SchematicMap';

export interface PickedPlace {
  lat: number;
  lng: number;
  name: string;
  isInside: boolean;
}

// 기준 위치 고르기: 검색 → 결과 선택, 또는 현재 위치 버튼 → 약 100m로 흐려서 저장 (피그마 R4-1)
export function BaseLocationEditor({ initial }: { initial: PickedPlace }) {
  const navigate = useNavigate();
  const updatePreferences = useUpdatePreferences();
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState(initial);
  const [isLocating, setIsLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);
  const search = usePlaceSearch(query);

  const handlePick = (item: GeoItem) => {
    setPicked({ lat: item.lat, lng: item.lng, name: item.label, isInside: item.inServiceArea });
    setQuery('');
  };

  const handleLocate = async () => {
    setIsLocating(true);
    setLocateError(null);
    try {
      const position = await readCurrentPosition();
      setPicked({ ...position, name: '지금 위치', isInside: isInWolgye1(position) });
      setQuery('');
    } catch {
      setLocateError('위치를 확인하지 못했어요. 브라우저에서 위치 권한을 허용해 주세요.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleSave = () => {
    const changes = { baseLat: blurCoordinate(picked.lat), baseLng: blurCoordinate(picked.lng) };
    updatePreferences.mutate(changes, {
      onSuccess: () => {
        saveBaseLocationLabel(picked.name);
        navigate(-1);
      },
    });
  };

  const isShowingResults = query.length > 0 && !search.isError;

  return (
    <>
      <form
        className="px-5 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          setQuery(input.trim());
        }}
      >
        <label className="flex h-12 items-center gap-2 rounded-[12px] px-4 ring-1 ring-line focus-within:ring-accent">
          <Icon name="search" size={20} className="text-faint" />
          <input
            type="search"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="주소나 장소 이름으로 찾기"
            enterKeyHint="search"
            className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-faint"
          />
        </label>
        {search.isError && (
          <p className="mt-2 text-sm text-danger">
            지금은 검색을 쓸 수 없어요. 지도 오른쪽 아래 버튼으로 현재 위치를 써 주세요.
          </p>
        )}
      </form>

      {isShowingResults ? (
        <>
          {search.isPending ? (
            <p className="px-5 py-8 text-center text-sm text-muted">찾는 중…</p>
          ) : (
            <PlaceResultList items={search.data} onPick={handlePick} />
          )}
          <p className="mx-5 flex items-center gap-2 border-t border-line py-3 text-sm text-muted">
            <Icon name="crosshair" size={16} />
            지금 있는 곳을 쓰려면 지도 오른쪽 아래 버튼을 눌러 주세요
          </p>
        </>
      ) : (
        <>
          <SchematicMap isLocating={isLocating} onLocate={() => void handleLocate()} />
          {locateError && <p className="px-5 pt-3 text-sm text-danger">{locateError}</p>}
          <LocationStatus name={picked.name} isInside={picked.isInside} />
        </>
      )}

      {updatePreferences.isError && (
        <p className="px-5 pt-3 text-sm text-danger">
          {toAppError(updatePreferences.error).message}
        </p>
      )}
      <BottomBar>
        <button
          type="button"
          onClick={handleSave}
          disabled={!picked.isInside || isShowingResults || updatePreferences.isPending}
          className="h-[52px] w-full rounded-[12px] bg-accent font-semibold text-white disabled:bg-gray disabled:text-faint"
        >
          이 위치로 설정
        </button>
      </BottomBar>
    </>
  );
}
