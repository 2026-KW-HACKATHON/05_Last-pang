import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useNow } from '@/shared/hooks/useNow';

import { Icon } from '../../components/Icon';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const AUTO_CLOSE_MS = 10 * 60_000; // 코드를 오래 띄워 두지 않도록 10분 뒤 자동으로 닫는다

interface NewCodeViewProps {
  code: string;
  onDone: () => void;
}

/** O6 발급 완료 — 새 코드는 이 화면에서만 한 번 보인다 */
export function NewCodeView({ code, onDone }: NewCodeViewProps) {
  const navigate = useNavigate();
  const now = useNow(1000);
  const [shownAt] = useState(() => Date.now());
  const [isCopied, setIsCopied] = useState(false);
  const leftMs = Math.max(0, AUTO_CLOSE_MS - (now - shownAt));

  useEffect(() => {
    if (leftMs === 0) onDone();
  }, [leftMs, onDone]);

  const handleCopy = () => {
    void navigator.clipboard?.writeText(code).then(() => setIsCopied(true));
  };

  const minutes = String(Math.floor(leftMs / 60_000)).padStart(2, '0');
  const seconds = String(Math.floor((leftMs % 60_000) / 1000)).padStart(2, '0');
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-lg font-semibold">
          가게 인증 코드 <span className="size-2 rounded-pill bg-accent" />
        </h2>
        <span className="rounded-pill bg-gray px-2.5 py-1 text-xs text-muted">1회성 보안 노출</span>
      </div>
      <Card className="text-center">
        <span className="rounded-pill bg-accent-tint px-3 py-1 text-xs font-semibold text-accent">
          새로 발급된 가게 코드
        </span>
        <div
          className="mt-4 flex justify-center gap-1.5"
          aria-label={`가게 코드 ${code.split('').join(' ')}`}
        >
          {code.split('').map((digit, index) => (
            // 자리 순서가 곧 의미라 index를 키로 쓴다 (컨벤션 7장 예외)
            <span
              key={index}
              className="flex h-14 w-11 items-center justify-center rounded-field bg-gray text-3xl font-bold tabular-nums"
            >
              {digit}
            </span>
          ))}
        </div>
        <p className="mt-4 inline-flex items-center gap-1 rounded-pill bg-danger/10 px-3 py-1.5 text-[13px] font-semibold text-danger">
          <Icon name="alert" size={14} /> 이 화면을 나가면 코드를 다시 볼 수 없어요!
        </p>
        <p className="mt-2 text-[13px] text-muted">
          보안을 위해 서버에 암호화되어 저장되므로, 지금 카운터 메모지나 포스기에 꼭 적어두세요.
        </p>
        <p className="mt-3 inline-flex items-center gap-1 rounded-pill bg-gray px-3 py-1 text-xs text-muted">
          <Icon name="lock" size={12} /> 보안 타이머: {minutes}분 {seconds}초 후 자동 닫힘
        </p>
      </Card>
      <div className="grid grid-cols-[1fr_1.4fr] gap-2">
        <Button variant="secondary" onClick={handleCopy}>
          <Icon name="copy" size={18} /> {isCopied ? '복사했어요' : '코드 복사'}
        </Button>
        <Button onClick={onDone}>적어두었어요(완료)</Button>
      </div>
      <Card tone="gray">
        <p className="text-sm font-semibold">코드 사용 방법 안내</p>
        <p className="mt-1 text-[13px] text-muted">
          손님이 동네냠냠 앱에서 쿠폰을 쓸 때 위 6자리 번호를 카운터에 말씀해주시거나 직접 입력할
          거예요.
        </p>
      </Card>
      <Button variant="outline" block onClick={() => navigate('/owner/settings/print')}>
        <Icon name="printer" size={18} /> 카운터 부착용 안내문 출력
      </Button>
    </div>
  );
}
