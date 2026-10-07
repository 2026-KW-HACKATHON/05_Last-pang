import { useState } from 'react';

import { Icon } from '@/features/owner/components/Icon';

/** A1-1 사업자등록증 크게 보기 (어두운 전체 화면, 두 손가락 확대는 브라우저 기본, 90° 돌리기) */
export function LicenseViewer({ url, onClose }: { url: string; onClose: () => void }) {
  const [rotation, setRotation] = useState(0);
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-ink text-white"
      role="dialog"
      aria-modal="true"
      aria-label="사업자등록증 크게 보기"
    >
      <header className="flex h-14 items-center justify-between px-5">
        <span className="text-sm">사업자등록증</span>
        <button type="button" aria-label="닫기" onClick={onClose}>
          <Icon name="x" />
        </button>
      </header>
      <div className="flex flex-1 items-center justify-center overflow-auto p-4">
        <img
          src={url}
          alt="사업자등록증"
          className="max-h-full max-w-full transition-transform"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </div>
      <footer className="flex justify-center gap-8 pb-[max(20px,env(safe-area-inset-bottom))] text-sm">
        <span className="flex items-center gap-1 text-white/70">
          <Icon name="search" size={16} /> 두 손가락으로 확대
        </span>
        <button
          type="button"
          className="flex items-center gap-1"
          onClick={() => setRotation((value) => (value + 90) % 360)}
        >
          <Icon name="rotate" size={16} /> 돌리기
        </button>
      </footer>
    </div>
  );
}
