import { Icon } from '@/shared/ui/Icon';

import { shareDeal } from '../share';

interface ShareButtonProps {
  title: string;
  onCopied: () => void;
}

// 공유 시트가 있으면(모바일) 시트로, 없으면 링크를 복사한다
export function ShareButton({ title, onCopied }: ShareButtonProps) {
  const handleShareClick = async () => {
    if ((await shareDeal(title)) === 'copied') onCopied();
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
