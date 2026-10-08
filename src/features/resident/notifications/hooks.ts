import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { updatePushConsent } from '../profile/api';
import { profileKeys } from '../profile/hooks';
import { readPushPermission, subscribePush, syncPushSubscription } from './api';

/** 브라우저 알림 권한(서버 데이터가 아니라 기기 상태)과 구독하기 */
export function usePushSubscription() {
  const queryClient = useQueryClient();
  const [permission, setPermission] = useState(readPushPermission);

  useEffect(() => {
    syncPushSubscription().catch(() => {});
  }, []);

  const mutation = useMutation({
    mutationFn: async () => {
      const result = await subscribePush();
      await updatePushConsent(result === 'granted');
      return result;
    },
    onSuccess: (result) => {
      setPermission(result);
      return queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });

  return { permission, subscribe: mutation.mutate, isSubscribing: mutation.isPending };
}
