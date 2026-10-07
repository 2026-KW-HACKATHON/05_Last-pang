import { useState } from 'react';

import { POLICY } from '@/shared/constants/policy';
import { AppError } from '@/shared/lib/errors';
import { searchAddress, type GeoItem } from '@/shared/lib/geoSearch';

import { Icon } from '../../components/Icon';
import { NoticeBox } from '../../components/ui/NoticeBox';
import { inputClass } from '../../lib/styles';

interface AddressSearchSheetProps {
  onSelect: (item: GeoItem) => void;
  onClose: () => void;
  /** 운영자는 서비스 지역 밖 주소도 고를 수 있다 */
  allowOutside?: boolean;
}

/** O1-4 주소 검색 (전체 화면). 행정동이 월계1동인 주소만 고를 수 있다 */
export function AddressSearchSheet({
  onSelect,
  onClose,
  allowOutside = false,
}: AddressSearchSheetProps) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<GeoItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (query.trim().length < 2) return;
    setIsLoading(true);
    setError(null);
    try {
      setItems(await searchAddress(query.trim()));
    } catch (caught) {
      setError(caught instanceof AppError ? caught.message : '주소를 찾지 못했어요');
    } finally {
      setIsLoading(false);
    }
  };
  const hasOutside =
    items?.some((item) => !item.inServiceArea) && !items.some((item) => item.inServiceArea);

  return (
    <div
      className="fixed inset-0 z-40 mx-auto flex max-w-[480px] flex-col bg-surface"
      role="dialog"
      aria-modal="true"
      aria-label="주소 검색"
    >
      <header className="flex h-14 items-center justify-between px-5">
        <h2 className="text-lg font-semibold">주소 검색</h2>
        <button type="button" aria-label="닫기" onClick={onClose}>
          <Icon name="x" />
        </button>
      </header>
      <form
        className="relative px-5"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSearch();
        }}
      >
        <Icon
          name="search"
          size={20}
          className="absolute top-1/2 left-9 -translate-y-1/2 text-accent"
        />
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="도로명이나 건물 번호"
          className={`${inputClass()} border-accent pl-11`}
          enterKeyHint="search"
        />
      </form>
      <div className="flex-1 space-y-2 overflow-y-auto px-5 pt-4 pb-8">
        {isLoading && <p className="text-center text-sm text-muted">찾는 중…</p>}
        {error && <NoticeBox tone="danger">{error}</NoticeBox>}
        {items?.length === 0 && (
          <div className="py-10 text-center">
            <Icon name="search" size={32} className="mx-auto text-faint" />
            <p className="mt-3 font-semibold">검색 결과가 없어요</p>
            <p className="text-sm text-muted">도로명이나 건물 번호를 다시 확인해 주세요</p>
          </div>
        )}
        {items?.map((item) => {
          const isSelectable = item.inServiceArea || allowOutside;
          return (
            <button
              key={`${item.label}-${item.lat}`}
              type="button"
              disabled={!isSelectable}
              onClick={() => onSelect(item)}
              className="flex w-full gap-3 rounded-field border border-line p-3 text-left disabled:opacity-60"
            >
              <Icon
                name="pin"
                size={20}
                className={item.inServiceArea ? 'text-accent' : 'text-faint'}
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate font-semibold">{item.roadAddress ?? item.label}</span>
                  <span
                    className={`shrink-0 rounded-pill px-2 py-0.5 text-xs ${item.inServiceArea ? 'bg-success-tint text-success' : 'bg-gray text-muted'}`}
                  >
                    {item.inServiceArea ? POLICY.neighborhoodName : '서비스 지역 밖'}
                  </span>
                </span>
                {item.jibunAddress && (
                  <span className="mt-0.5 block text-[13px] text-muted">
                    <span className="mr-1 rounded bg-gray px-1">지번</span>
                    {item.jibunAddress}
                  </span>
                )}
              </span>
            </button>
          );
        })}
        {hasOutside && !allowOutside && (
          <NoticeBox
            tone="danger"
            icon="pin"
            title={`지금은 ${POLICY.neighborhoodName} 가게만 등록할 수 있어요`}
          >
            다른 동네는 순서대로 열릴 예정이에요.
          </NoticeBox>
        )}
        {!items && !isLoading && (
          <NoticeBox title="도로명과 건물 번호로 찾으면 정확해요">예) 광운로 12</NoticeBox>
        )}
      </div>
    </div>
  );
}
