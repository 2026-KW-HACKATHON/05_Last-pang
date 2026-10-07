import { useState } from 'react';

import { Icon } from '@/features/owner/components/Icon';
import { Button } from '@/features/owner/components/ui/Button';

import { useLicenseUrl } from '../hooks';
import { LicenseViewer } from './LicenseViewer';

interface LicenseCardProps {
  path: string | null;
  /** 사진이 화면에 다 뜨면 true (그 전에는 승인 버튼을 막는다) */
  onLoadedChange: (isLoaded: boolean) => void;
}

/** A1-1 사업자등록증 썸네일 · 사진을 불러오지 못함 */
export function LicenseCard({ path, onLoadedChange }: LicenseCardProps) {
  const license = useLicenseUrl(path);
  const [hasImageError, setHasImageError] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  if (!path) {
    return (
      <p className="rounded-field bg-gray p-4 text-sm text-muted">
        사업자등록증 사진 없이 신청한 가게예요 (운영자 직접 등록 또는 예전 신청).
      </p>
    );
  }
  if (license.isError || hasImageError) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-card border border-line p-6 text-center">
        <Icon name="image" size={28} className="text-faint" />
        <p className="font-semibold">사진을 불러오지 못했어요</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setHasImageError(false);
            void license.refetch();
          }}
        >
          <Icon name="refresh" size={14} /> 다시 시도
        </Button>
      </div>
    );
  }
  return (
    <>
      <button
        type="button"
        onClick={() => license.data && setIsViewing(true)}
        className="flex w-full items-center gap-3 rounded-card border border-line p-3 text-left"
      >
        <span className="h-20 w-16 shrink-0 overflow-hidden rounded-field bg-gray">
          {license.data && (
            <img
              src={license.data}
              alt="사업자등록증 미리보기"
              className="size-full object-cover"
              onLoad={() => onLoadedChange(true)}
              onError={() => {
                setHasImageError(true);
                onLoadedChange(false);
              }}
            />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold">사업자등록증</span>
          <span className="mt-1 flex items-start gap-1 text-[13px] text-muted">
            <Icon name="check" size={14} className="mt-0.5 shrink-0 text-success" /> 등록번호와
            대표자 이름이 맞는지 확인해 주세요
          </span>
        </span>
      </button>
      {isViewing && license.data && (
        <LicenseViewer url={license.data} onClose={() => setIsViewing(false)} />
      )}
    </>
  );
}
