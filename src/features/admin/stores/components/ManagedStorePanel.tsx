import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Badge } from '@/features/owner/components/ui/Badge';
import { MenuRow } from '@/features/owner/components/ui/MenuRow';
import { AppError } from '@/shared/lib/errors';

import { useIssueLinkCode, useRotateStoreCodeForStore } from '../hooks';
import { OneTimeCodeDialog } from './OneTimeCodeDialog';
import { PushTestPanel } from './PushTestPanel';
import { StoreDealsList } from './StoreDealsList';

import type { AdminStoreDetail } from '../api';

/** 사장님 계정이 없는 가게(운영자 등록)를 운영자가 대신 운영: 가게 코드 · 즉시딜 · 사장님 연결 */
export function ManagedStorePanel({ store }: { store: AdminStoreDetail }) {
  const navigate = useNavigate();
  const rotate = useRotateStoreCodeForStore();
  const issueLink = useIssueLinkCode();
  const [shown, setShown] = useState<{ title: string; code: string; description: string } | null>(
    null,
  );
  const isActive = store.status === 'approved';
  const error = rotate.error ?? issueLink.error;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">운영자가 대신 운영</h2>
        <Badge tone={store.code_issued ? 'success' : 'accent'} withDot>
          {store.code_issued ? '가게 코드 발급됨' : '가게 코드 필요'}
        </Badge>
      </div>
      <div className="divide-y divide-line overflow-hidden rounded-card border border-line">
        <MenuRow
          label={store.code_issued ? '가게 코드 새로 발급' : '가게 코드 발급 (딜 올리기 전 필수)'}
          onClick={
            isActive
              ? () =>
                  rotate.mutate(store.id, {
                    onSuccess: (code) =>
                      setShown({
                        title: '새 가게 코드',
                        code,
                        description: '가게 카운터에 적어 두도록 사장님께 전해 주세요.',
                      }),
                  })
              : undefined
          }
        />
        <MenuRow
          label="즉시딜 대신 올리기"
          onClick={
            isActive && store.code_issued
              ? () => navigate(`/admin/approved-stores/${store.id}/deals/new`)
              : undefined
          }
        />
        <MenuRow
          label={
            store.link_code_active ? '사장님 연결 코드 다시 만들기' : '사장님 계정 연결 코드 만들기'
          }
          onClick={() =>
            issueLink.mutate(store.id, {
              onSuccess: (code) =>
                setShown({
                  title: '사장님 연결 코드',
                  code,
                  description:
                    '사장님이 카카오로 로그인한 뒤 가게 등록 화면에서 입력하면 이 가게가 사장님 계정으로 넘어가요.',
                }),
            })
          }
        />
      </div>
      {error instanceof AppError && <p className="text-[13px] text-danger">{error.message}</p>}
      {isActive && <PushTestPanel storeId={store.id} />}
      <StoreDealsList storeId={store.id} />
      {shown && <OneTimeCodeDialog {...shown} onClose={() => setShown(null)} />}
    </section>
  );
}
