import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { ROOT_KEYS } from '@/shared/constants/queryKeys';

import { fetchRedemptions, subscribeRedemptionChanges, type RedemptionRange } from './api';

export const redemptionKeys = {
  list: (storeId: string, range: RedemptionRange) =>
    [...ROOT_KEYS.redemptions, storeId, range] as const,
};

export function useRedemptions(storeId: string, range: RedemptionRange = 'today') {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: redemptionKeys.list(storeId, range),
    queryFn: () => fetchRedemptions(storeId, range),
    enabled: Boolean(storeId),
  });

  useEffect(() => {
    if (!storeId) return undefined;
    return subscribeRedemptionChanges(storeId, () => {
      // 사용 내역이 바뀌면 오늘 요약(리포트)도 같이 새로
      void queryClient.invalidateQueries({ queryKey: ROOT_KEYS.redemptions });
      void queryClient.invalidateQueries({ queryKey: ROOT_KEYS.report });
      void queryClient.invalidateQueries({ queryKey: ROOT_KEYS.deals });
    });
  }, [storeId, queryClient]);

  return query;
}
