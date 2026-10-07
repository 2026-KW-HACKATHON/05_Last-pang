import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Icon } from '@/shared/ui/Icon';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Toast } from '@/shared/ui/Toast';

import { signOutLocally } from '../api';
import { IconConfirmDialog } from '../components/IconConfirmDialog';
import { WithdrawDone } from '../components/WithdrawDone';
import { WithdrawNotice } from '../components/WithdrawNotice';
import { useDeleteMyAccount } from '../hooks';

// 회원 탈퇴 (피그마 R14): 안내 확인 → 마지막 확인 → 탈퇴 완료
export function WithdrawPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteAccount = useDeleteMyAccount();
  const [isChecked, setIsChecked] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleToastClose = useCallback(() => setErrorMessage(null), []);

  const handleConfirm = () => {
    deleteAccount.mutate(undefined, {
      onSuccess: () => {
        setIsConfirmOpen(false);
        setIsDone(true);
      },
      onError: () => {
        setIsConfirmOpen(false);
        setErrorMessage('탈퇴하지 못했어요. 잠시 후 다시 시도해 주세요');
      },
    });
  };

  // 세션을 먼저 지우면 로그인 가드가 바로 /login으로 보내 완료 화면이 안 보이므로 여기서 지운다
  const handleHome = async () => {
    await signOutLocally();
    queryClient.clear();
    navigate('/login', { replace: true });
  };

  if (isDone) return <WithdrawDone onHome={() => void handleHome()} />;

  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col bg-surface">
      <PageHeader title="회원 탈퇴" hasBack />
      <div className="flex-1 px-5 pt-6">
        <h2 className="text-2xl leading-snug font-bold">
          탈퇴하기 전에
          <br />
          확인해 주세요
        </h2>
        <WithdrawNotice />
      </div>
      <label className="mx-5 my-5 flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(event) => setIsChecked(event.target.checked)}
          className="peer sr-only"
        />
        <span
          className={`flex size-6 items-center justify-center rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-accent ${isChecked ? 'bg-accent text-white' : 'ring-1 ring-line'}`}
        >
          {isChecked && <Icon name="check" size={16} strokeWidth={2.5} />}
        </span>
        위 내용을 모두 확인했어요
      </label>
      <div className="sticky bottom-0 border-t border-line bg-surface px-5 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <button
          type="button"
          disabled={!isChecked}
          onClick={() => setIsConfirmOpen(true)}
          className="h-[52px] w-full rounded-[12px] bg-accent font-semibold text-white disabled:bg-accent-disabled"
        >
          탈퇴하기
        </button>
        <button
          type="button"
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/me'))}
          className="mt-2 w-full py-2 text-sm text-muted"
        >
          더 써 볼게요
        </button>
      </div>
      {isConfirmOpen && (
        <IconConfirmDialog
          icon="trash"
          title="정말 탈퇴할까요?"
          description="탈퇴하면 되돌릴 수 없어요."
          confirmLabel="탈퇴하기"
          isPending={deleteAccount.isPending}
          onConfirm={handleConfirm}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
      {errorMessage && <Toast message={errorMessage} onClose={handleToastClose} />}
    </main>
  );
}
