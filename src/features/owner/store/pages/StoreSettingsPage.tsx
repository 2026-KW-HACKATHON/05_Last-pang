// O6 가게 코드 — 미발급 · 발급됨 · 발급 확인 팝업 · 발급 완료(한 번만 보임)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ApprovedStoreGate } from '../../components/ApprovedStoreGate';
import { Icon } from '../../components/Icon';
import { OwnerShell } from '../../components/OwnerShell';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { IconButton } from '../../components/ui/IconButton';
import { NoticeBox } from '../../components/ui/NoticeBox';
import { ProfileButton } from '../../components/ui/ProfileButton';
import { RootHeader } from '../../components/ui/RootHeader';
import { CodeIssuedInfo } from '../components/CodeIssuedInfo';
import { CodeNotIssued } from '../components/CodeNotIssued';
import { NewCodeView } from '../components/NewCodeView';
import { useRotateStoreCode } from '../hooks';

import type { MyStore } from '../api';

export function StoreSettingsPage() {
  return <ApprovedStoreGate>{(store) => <StoreCode store={store} />}</ApprovedStoreGate>;
}

function StoreCode({ store }: { store: MyStore }) {
  const navigate = useNavigate();
  const rotate = useRotateStoreCode();
  const [isConfirming, setIsConfirming] = useState(false);
  const [newCode, setNewCode] = useState<string | null>(null);

  const handleIssue = () =>
    rotate.mutate(undefined, {
      onSuccess: (code) => setNewCode(code),
      onSettled: () => setIsConfirming(false),
    });

  return (
    <OwnerShell>
      <RootHeader
        title="가게 고유 코드 발급"
        roleLabel="사장님"
        right={
          <>
            <IconButton icon="bell" label="알림" onClick={() => navigate('/owner/notifications')} />
            <ProfileButton to="/owner/me" />
          </>
        }
      />
      <div className="space-y-4 px-5 pt-3">
        {newCode ? (
          <NewCodeView code={newCode} onDone={() => setNewCode(null)} />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">가게 코드</h2>
              {!store.isCodeIssued && (
                <Badge tone="accent" withDot>
                  코드 발급 필요
                </Badge>
              )}
            </div>
            {store.isCodeIssued ? <CodeIssuedInfo /> : <CodeNotIssued />}
            {!store.isCodeIssued && (
              <NoticeBox icon="shield">
                가게 코드는 안전하게 암호화 관리되며 언제든 재발급이 가능합니다.
              </NoticeBox>
            )}
            <Button
              block
              isLoading={rotate.isPending}
              onClick={() => (store.isCodeIssued ? setIsConfirming(true) : handleIssue())}
            >
              {store.isCodeIssued ? '새 코드 발급' : '첫 코드 발급'}
            </Button>
            <p className="flex items-center justify-center gap-1 text-xs text-muted">
              <Icon name="refresh" size={12} />
              {store.isCodeIssued
                ? '새 코드를 발급하면 기존 코드는 즉시 사용할 수 없게 돼요.'
                : '발급 즉시 화면에 1회 노출됩니다'}
            </p>
          </>
        )}
      </div>
      {isConfirming && (
        <ConfirmDialog
          icon="refresh"
          title="새 코드를 발급할까요?"
          body="이전 코드는 바로 쓸 수 없게 돼요. 새로 발급받은 6자리 숫자를 카운터에 다시 적어 두셔야 해요."
          confirmLabel="발급하기"
          isPending={rotate.isPending}
          onConfirm={handleIssue}
          onCancel={() => setIsConfirming(false)}
        />
      )}
    </OwnerShell>
  );
}
