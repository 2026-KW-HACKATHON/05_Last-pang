import { useState } from 'react';

import { Icon } from '../../components/Icon';
import { checkLicenseFile } from '../schema';

interface LicenseUploaderProps {
  file: File | null;
  hasExisting: boolean;
  onChange: (file: File | null) => void;
}

const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)}MB`;

/** 사업자등록증 사진 고르기 (JPG·PNG, 10MB 이하). 실제 업로드는 신청할 때 한 번 */
export function LicenseUploader({ file, hasExisting, onChange }: LicenseUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const handlePick = (picked: File | undefined) => {
    if (!picked) return;
    const problem = checkLicenseFile(picked);
    setError(problem);
    if (!problem) onChange(picked);
  };
  if (file || hasExisting) {
    return (
      <div className="flex items-center gap-3 rounded-field border border-line p-3">
        <span className="flex size-10 items-center justify-center rounded-field bg-gray text-muted">
          <Icon name="image" size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px]">
            {file?.name ?? '이전에 올린 사업자등록증'}
          </span>
          <span className="block text-xs text-muted">
            {file
              ? `${formatSize(file.size)} · 올리기 준비 완료`
              : '바꾸려면 ✕ 후 다시 올려 주세요'}
          </span>
        </span>
        {file && (
          <button
            type="button"
            aria-label="사진 지우기"
            onClick={() => onChange(null)}
            className="text-faint"
          >
            <Icon name="x" size={18} />
          </button>
        )}
      </div>
    );
  }
  return (
    <div>
      <label className="flex h-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-field border-2 border-dashed border-line text-muted">
        <Icon name="camera" size={24} />
        <span className="text-sm font-semibold text-ink">사진 올리기</span>
        <span className="text-xs">JPG·PNG, 10MB 이하</span>
        <input
          type="file"
          accept="image/jpeg,image/png"
          className="sr-only"
          onChange={(event) => handlePick(event.target.files?.[0])}
        />
      </label>
      {error && <p className="mt-1 text-[13px] text-danger">ⓘ {error}</p>}
    </div>
  );
}
