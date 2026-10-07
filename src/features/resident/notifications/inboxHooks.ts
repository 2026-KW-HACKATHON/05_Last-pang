import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { ROOT_KEYS } from '@/shared/constants/queryKeys';

import {
  fetchResidentNotifications,
  markResidentNotificationsRead,
  subscribeNewNotifications,
} from './inboxApi';

import type { ResidentNotification } from './types';

export const residentNotificationKeys = {
  list: [...ROOT_KEYS.notifications, 'resident'] as const,
  settings: [...ROOT_KEYS.notifications, 'settings'] as const,
};

/** 받은 알림 목록. 새 알림이 들어오면 실시간으로 다시 읽는다 */
export function useResidentNotifications() {
  const queryClient = useQueryClient();

  useEffect(
    () =>
      subscribeNewNotifications(() => {
        void queryClient.invalidateQueries({ queryKey: residentNotificationKeys.list });
      }),
    [queryClient],
  );

  return useQuery({
    queryKey: residentNotificationKeys.list,
    queryFn: fetchResidentNotifications,
  });
}

/** 읽음 처리 (ids 없으면 모두). 목록의 빨간 점은 먼저 지운다 */
export function useMarkResidentNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markResidentNotificationsRead,
    onMutate: (ids?: number[]) => {
      queryClient.setQueryData<ResidentNotification[]>(residentNotificationKeys.list, (prev) =>
        prev?.map((item) => (!ids || ids.includes(item.id) ? { ...item, isRead: true } : item)),
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: residentNotificationKeys.list }),
  });
}
