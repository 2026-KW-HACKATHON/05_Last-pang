// A2 가맹점 목록 + 운영자가 가게를 직접 추가 (발표 시연용으로 미리 동의 받은 가게)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Icon } from '@/features/owner/components/Icon';
import { Button } from '@/features/owner/components/ui/Button';
import { EmptyCard } from '@/features/owner/components/ui/EmptyCard';
import { Segmented } from '@/features/owner/components/ui/Segmented';
import { inputClass } from '@/features/owner/lib/styles';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

import { AdminShell } from '../../components/AdminShell';
import { StoreListCard } from '../components/StoreListCard';
import { useAdminStores } from '../hooks';

import type { StoreFilter } from '../api';

export function StoreListPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<StoreFilter>('all');
  const [query, setQuery] = useState('');
  const stores = useAdminStores(filter, query);
  const counts = stores.data?.counts;

  return (
    <AdminShell title="가맹점 목록">
      <div className="space-y-4 px-5 pt-2">
        <div className="flex gap-2">
          <label className="relative flex-1">
            <Icon
              name="search"
              size={20}
              className="absolute top-1/2 left-4 -translate-y-1/2 text-faint"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="가게 이름으로 찾기"
              className={`${inputClass()} pl-11`}
            />
          </label>
          <Button className="shrink-0" onClick={() => navigate('/admin/approved-stores/new')}>
            <Icon name="plus" size={18} /> 가게 추가
          </Button>
        </div>
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: '전체', count: counts?.all },
            { value: 'active', label: '운영 중', count: counts?.active },
            { value: 'suspended', label: '정지', count: counts?.suspended },
          ]}
        />
        {stores.isPending && <LoadingState />}
        {stores.isError && (
          <ErrorState error={stores.error} onRetry={() => void stores.refetch()} />
        )}
        {stores.data?.items.length === 0 && (
          <EmptyCard
            icon="store"
            title={query ? '찾는 가게가 없어요' : '아직 가맹점이 없어요'}
            body="사장님 신청을 승인하거나, 동의 받은 가게를 직접 추가해 보세요."
            action={
              <Button size="md" onClick={() => navigate('/admin/approved-stores/new')}>
                <Icon name="plus" size={16} /> 가게 직접 추가
              </Button>
            }
          />
        )}
        {stores.data?.items.map((store) => (
          <StoreListCard key={store.id} store={store} />
        ))}
      </div>
    </AdminShell>
  );
}
