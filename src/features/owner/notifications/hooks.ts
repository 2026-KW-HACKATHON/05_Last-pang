import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ROOT_KEYS } from '@/shared/constants/queryKeys';

import { fetchOwnerNotifications, markNotificationsRead } from './api';

export const ownerNotificationKeys = { list: [...ROOT_KEYS.notifications, 'owner'] as const };

export function useOwnerNotifications() {
  return useQuery({
    queryKey: ownerNotificationKeys.list,
    queryFn: fetchOwnerNotifications,
    refetchInterval: 60_000,
  });
}

/** 홈 종 아이콘의 빨간 점 */
export function useHasUnreadOwnerNotification(): boolean {
  const query = useOwnerNotifications();
  return Boolean(query.data?.some((item) => !item.isRead));
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationsRead,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ROOT_KEYS.notifications }),
  });
}
