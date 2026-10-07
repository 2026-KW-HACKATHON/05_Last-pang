import { NoticeBox } from '../../components/ui/NoticeBox';
import { formatMonthDay } from '../../lib/format';

import type { MyStore } from '../../store/api';

/** O3-1 가게 이용 정지 · 주소 재심사 중 안내 */
export function StoreNotices({ store }: { store: MyStore }) {
  if (store.status === 'suspended') {
    return (
      <NoticeBox tone="danger" icon="ban" title="가게 이용이 정지됐어요">
        {store.suspendedAt && `${formatMonthDay(store.suspendedAt.slice(0, 10))}부터 `}새 딜을 올릴
        수 없어요. 진행 중이던 딜은 모두 멈췄어요. {store.suspendNote && `(${store.suspendNote})`}
      </NoticeBox>
    );
  }
  if (store.pendingAddress) {
    return (
      <NoticeBox tone="tint" title="새 주소를 확인하고 있어요">
        운영자가 확인하기 전까지 새 딜을 올릴 수 없어요. 진행 중인 딜은 그대로 진행돼요.
      </NoticeBox>
    );
  }
  return null;
}
