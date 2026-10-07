import { BottomSheet } from '@/shared/ui/BottomSheet';
import { Icon, type IconName } from '@/shared/ui/Icon';

interface DealMoreSheetProps {
  onCopyLink: () => void;
  onShare: () => void;
  onReport: () => void;
  onClose: () => void;
}

// 딜 상세 더보기 메뉴 (피그마 R7-1 더보기 메뉴)
export function DealMoreSheet({ onCopyLink, onShare, onReport, onClose }: DealMoreSheetProps) {
  const items: { label: string; icon: IconName; onClick: () => void; isDanger?: boolean }[] = [
    { label: '링크 복사', icon: 'link', onClick: onCopyLink },
    { label: '공유하기', icon: 'share', onClick: onShare },
    { label: '이 딜 신고하기', icon: 'flag', onClick: onReport, isDanger: true },
  ];

  return (
    <BottomSheet title="더보기" onClose={onClose}>
      <ul>
        {items.map((item) => (
          <li key={item.label}>
            <button
              type="button"
              onClick={item.onClick}
              className={`flex h-14 w-full items-center gap-3 text-left ${item.isDanger ? 'text-danger' : ''}`}
            >
              <Icon name={item.icon} size={22} />
              {item.label}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onClose}
        className="mt-3 h-[52px] w-full rounded-[12px] bg-gray font-semibold"
      >
        닫기
      </button>
    </BottomSheet>
  );
}
