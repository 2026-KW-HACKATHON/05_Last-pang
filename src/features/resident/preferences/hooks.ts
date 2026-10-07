import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ROOT_KEYS } from '@/shared/constants/queryKeys';

import { fetchMyPreferences, searchPlaces, updatePreferences } from './api';

export const preferencesKeys = {
  all: ROOT_KEYS.preferences,
  me: () => [...ROOT_KEYS.preferences, 'me'] as const,
};

export function useMyPreferences() {
  return useQuery({ queryKey: preferencesKeys.me(), queryFn: fetchMyPreferences });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePreferences,
    // 반경이 바뀌면 추천 목록도 달라진다
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: preferencesKeys.all }),
        queryClient.invalidateQueries({ queryKey: ROOT_KEYS.deals }),
      ]),
  });
}

/** 기준 위치 검색. 빈 검색어면 부르지 않는다 */
export function usePlaceSearch(query: string) {
  return useQuery({
    queryKey: [...ROOT_KEYS.preferences, 'place-search', query] as const,
    queryFn: () => searchPlaces(query),
    enabled: query.length > 0,
    retry: false,
    staleTime: 5 * 60_000,
  });
}
