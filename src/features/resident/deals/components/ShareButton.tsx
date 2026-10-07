import { Icon } from '@/shared/ui/Icon';

interface ShareButtonProps {
  title: string;
  onCopied: () => void;
}

// 공유 시트가 있으면(모바일) 시트로, 없으면 링크를 복사한다
export function ShareButton({ title, onCopied }: ShareButtonProps) {
  const handleShareClick = async () => {
    const url = window.location.href.split('?')[0]; // ?src=push 같은 기록용 값은 빼고 공유
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => undefined); // 사용자가 시트를 닫아도 오류가 난다
      return;
    }
    await navigator.clipboard.writeText(url);
    onCopied();
  };

  return (
    <button
      type="button"
      onClick={() => void handleShareClick()}
      aria-label="공유하기"
      className="p-2"
    >
      <Icon name="share" size={22} />
    </button>
  );
}
