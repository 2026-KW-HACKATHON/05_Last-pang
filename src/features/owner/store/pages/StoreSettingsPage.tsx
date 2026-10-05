// O6 가게 코드 — 서버는 해시만 저장하므로 원문은 발급 직후 이 화면에서 한 번만 보인다
import { useState } from 'react';

import { AppError } from '@/shared/lib/errors';

import { ApprovedStoreGate } from '../../components/ApprovedStoreGate';
import { Icon } from '../../components/Icon';
import { OwnerShell } from '../../components/OwnerTabBar';
import { Button, Card, ConfirmDialog, InfoRow, PageTitle } from '../../components/ui';
import { useRotateStoreCode } from '../hooks';

export function StoreSettingsPage() {
  return (
    <OwnerShell>
      <PageTitle>가게 코드</PageTitle>
      <ApprovedStoreGate>{() => <StoreCodeSection />}</ApprovedStoreGate>
    </OwnerShell>
  );
}

function StoreCodeSection() {
  const rotateCode = useRotateStoreCode();
  const [isConfirming, setIsConfirming] = useState(false);
  const [issuedCode, setIssuedCode] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleIssue = () =>
    rotateCode.mutate(undefined, {
      onSuccess: (code) => {
        setIssuedCode(code);
        setIsConfirming(false);
        setIsCopied(false);
      },
      onError: () => setIsConfirming(false),
    });

  const handleCopy = async () => {
    if (!issuedCode) return;
    try {
      await navigator.clipboard.writeText(issuedCode);
      setIsCopied(true);
    } catch {
      setIsCopied(false); // 복사가 막힌 브라우저면 눈으로 적으면 된다
    }
  };

  if (issuedCode) {
    return (
      <div className="space-y-4 px-5">
        <Card className="py-8 text-center">
          <p className="text-[15px] font-semibold text-accent">새 가게 코드</p>
          <p
            className="mt-4 font-mono text-5xl font-semibold tracking-[0.25em] tabular-nums"
            aria-label={`가게 코드 ${issuedCode.split('').join(' ')}`}
          >
            {issuedCode}
          </p>
          <p className="mt-4 text-[13px] text-danger">이 화면을 나가면 다시 볼 수 없어요</p>
        </Card>
        <div className="grid grid-cols-[1fr_2fr] gap-2">
          <Button variant="secondary" onClick={() => void handleCopy()}>
            <Icon name="copy" size={18} />
            {isCopied ? '복사됨' : '복사'}
          </Button>
          <Button onClick={() => setIssuedCode(null)}>적어 두었어요</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-5">
      <div className="flex flex-col items-center pt-4 text-center">
        <span className="flex size-20 items-center justify-center rounded-pill bg-accent-tint text-accent">
          <Icon name="key" size={36} />
        </span>
        <h2 className="mt-5 text-xl leading-7 font-semibold">
          손님이 쿠폰을 쓸 때
          <br />이 코드를 알려주세요
        </h2>
      </div>

      <Card>
        <InfoRow label="보안" value="코드는 암호화해서 저장해요" />
        <InfoRow label="새로 발급하면" value="이전 코드는 바로 못 써요" />
      </Card>

      <Card tinted>
        <p className="flex items-start gap-2 text-[13px] leading-[18px]">
          <Icon name="info" size={18} className="shrink-0 text-accent" />
          코드는 발급할 때 한 번만 보여드려요. 카운터에 적어 두세요.
        </p>
      </Card>

      {rotateCode.error instanceof AppError && (
        <p className="text-[13px] text-danger" role="alert">
          {rotateCode.error.message}
        </p>
      )}

      <Button block onClick={() => setIsConfirming(true)}>
        새 코드 발급
      </Button>

      {isConfirming && (
        <ConfirmDialog
          title="새 코드를 발급할까요?"
          body="이전 코드는 바로 쓸 수 없게 돼요"
          confirmLabel="발급하기"
          isPending={rotateCode.isPending}
          onConfirm={handleIssue}
          onCancel={() => setIsConfirming(false)}
        />
      )}
    </div>
  );
}
