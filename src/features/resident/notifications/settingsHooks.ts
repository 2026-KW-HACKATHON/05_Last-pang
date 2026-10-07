import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { residentNotificationKeys } from './inboxHooks';
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  fetchNotificationSettings,
  saveNotificationSettings,
} from './settingsApi';

import type { NotificationSettings } from './types';

export function useNotificationSettings() {
  return useQuery({
    queryKey: residentNotificationKeys.settings,
    queryFn: fetchNotificationSettings,
  });
}

/** 바꾼 항목만 넘기면 화면에 먼저 반영하고, 저장에 실패하면 되돌린다 */
export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();
  const key = residentNotificationKeys.settings;

  return useMutation({
    mutationFn: (next: NotificationSettings) => saveNotificationSettings(next),
    onMutate: async (next) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<NotificationSettings>(key);
      queryClient.setQueryData(key, next);
      return { previous };
    },
    onError: (_error, _next, context) => {
      queryClient.setQueryData(key, context?.previous ?? DEFAULT_NOTIFICATION_SETTINGS);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}
