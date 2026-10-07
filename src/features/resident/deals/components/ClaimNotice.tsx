import { Icon, type IconName } from '@/shared/ui/Icon';

interface ClaimNoticeProps {
  icon: IconName;
  title: string;
  description?: string;
}

// 하단 버튼 위의 연분홍 안내 (피그마 R7-1 시작 전 · 오늘 사용 한도 도달)
export function ClaimNotice({ icon, title, description }: ClaimNoticeProps) {
  return (
    <div className="mb-3 flex gap-2 rounded-[12px] bg-accent-tint px-4 py-3 text-sm">
      <Icon name={icon} size={18} className="mt-px shrink-0 text-accent" />
      <div>
        <p className={description ? 'font-semibold text-accent' : 'text-accent'}>{title}</p>
        {description && <p className="mt-0.5 text-muted">{description}</p>}
      </div>
    </div>
  );
}
