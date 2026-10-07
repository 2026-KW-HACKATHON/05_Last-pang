// O9 사장님 내 정보
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { signOut } from '@/features/auth/api';

import { ApprovedStoreGate } from '../../components/ApprovedStoreGate';
import { CategoryIcon } from '../../components/CategoryIcon';
import { Icon } from '../../components/Icon';
import { OwnerShell } from '../../components/OwnerShell';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { MenuRow } from '../../components/ui/MenuRow';
import { TopBar } from '../../components/ui/TopBar';
import { StoreStatusBadge } from '../../deals/components/StoreStatusBadge';
import { categoryLabel } from '../../lib/category';
import { useDeleteMyAccount } from '../../store/hooks';
import { PushToggleRow } from '../components/PushToggleRow';

import type { MyStore } from '../../store/api';

export function OwnerMePage() {
  return (
    <ApprovedStoreGate allowSuspended>{(store) => <OwnerMe store={store} />}</ApprovedStoreGate>
  );
}

function OwnerMe({ store }: { store: MyStore }) {
  const navigate = useNavigate();
  const deleteAccount = useDeleteMyAccount();
  const [dialog, setDialog] = useState<'logout' | 'withdraw' | null>(null);

  const handleConfirm = () => {
    if (dialog === 'logout') void signOut().then(() => navigate('/login', { replace: true }));
    if (dialog === 'withdraw')
      deleteAccount.mutate(undefined, { onSuccess: () => navigate('/login', { replace: true }) });
  };

  return (
    <OwnerShell>
      <TopBar title="내 정보" backTo="/owner" />
      <div className="space-y-3 px-5 pt-4">
        <section className="flex items-center gap-3 rounded-card border border-line p-4">
          <CategoryIcon category={store.category} size={48} />
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-lg font-semibold">
              {store.name} <StoreStatusBadge status={store.status} />
            </p>
            <p className="truncate text-[13px] text-muted">
              {categoryLabel(store.category)} · {store.address}
            </p>
          </div>
        </section>
        <section className="divide-y divide-line overflow-hidden rounded-card border border-line">
          <MenuRow label="가게 정보 수정" onClick={() => navigate('/owner/me/store')} />
          <MenuRow label="딜 기록" onClick={() => navigate('/owner/deals')} />
          <MenuRow label="반복딜 관리" onClick={() => navigate('/owner/weekly-deals/new')} />
          <MenuRow label="안내문 인쇄" onClick={() => navigate('/owner/settings/print')} />
          <MenuRow label="문의하기" onClick={() => navigate('/help')} />
          <PushToggleRow />
          <MenuRow label="홈 화면에 추가하는 법" onClick={() => navigate('/install-guide')} />
        </section>
        <section className="overflow-hidden rounded-card border border-line">
          <MenuRow
            label="주민 화면으로 가기"
            onClick={() => navigate('/')}
            right={<Icon name="repeat" size={18} className="text-accent" />}
          />
        </section>
        <p className="py-3 text-center text-[13px] text-muted">
          <Link to="/terms/service">이용약관</Link> ·{' '}
          <Link to="/terms/privacy">개인정보 처리방침</Link> ·{' '}
          <button type="button" onClick={() => setDialog('logout')}>
            로그아웃
          </button>{' '}
          ·{' '}
          <button type="button" onClick={() => setDialog('withdraw')}>
            회원 탈퇴
          </button>
        </p>
      </div>
      {dialog && (
        <ConfirmDialog
          icon={dialog === 'logout' ? 'logout' : 'alert'}
          title={dialog === 'logout' ? '로그아웃할까요?' : '정말 탈퇴할까요?'}
          body={
            dialog === 'logout'
              ? '다시 로그인하면 가게 정보를 그대로 볼 수 있어요.'
              : '가게 운영이 함께 멈추고, 탈퇴하면 되돌릴 수 없어요.'
          }
          confirmLabel={dialog === 'logout' ? '로그아웃' : '탈퇴하기'}
          isDanger={dialog === 'withdraw'}
          isPending={deleteAccount.isPending}
          onConfirm={handleConfirm}
          onCancel={() => setDialog(null)}
        />
      )}
    </OwnerShell>
  );
}
