import { useNavigate } from 'react-router-dom';

import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

import { useMyStore } from '../store/hooks';
import { Button, StatusBlock } from './ui';

import type { MyStore } from '../store/api';
import type { ReactNode } from 'react';

/** 승인된 가게가 있을 때만 children을 그린다. 딜·코드·내역 화면이 storeId를 안전하게 쓰기 위한 틀 */
export function ApprovedStoreGate({ children }: { children: (store: MyStore) => ReactNode }) {
  const myStore = useMyStore();
  const navigate = useNavigate();

  if (myStore.isPending) return <LoadingState />;
  if (myStore.isError)
    return <ErrorState error={myStore.error} onRetry={() => void myStore.refetch()} />;
  if (!myStore.data) {
    return (
      <StatusBlock
        pose="map"
        title="아직 등록한 가게가 없어요"
        action={
          <Button block onClick={() => navigate('/owner/signup')}>
            가게 등록하기
          </Button>
        }
      />
    );
  }
  if (myStore.data.status !== 'approved') {
    return (
      <StatusBlock
        pose="map"
        title="가게 승인 후 이용할 수 있어요"
        action={
          <Button variant="secondary" block onClick={() => navigate('/owner')}>
            승인 상태 보기
          </Button>
        }
      />
    );
  }
  return <>{children(myStore.data)}</>;
}
