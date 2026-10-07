import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ROOT_KEYS } from '@/shared/constants/queryKeys';

import { fetchMyProfile, updateConsents, updateNickname } from './api';

export const profileKeys = {
  all: ROOT_KEYS.profile,
  me: () => [...ROOT_KEYS.profile, 'me'] as const,
};

export function useMyProfile() {
  return useQuery({ queryKey: profileKeys.me(), queryFn: fetchMyProfile });
}

export function useUpdateNickname() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNickname,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: profileKeys.all }),
  });
}

export function useUpdateConsents() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateConsents,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: profileKeys.all }),
  });
}
