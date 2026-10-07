import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ROOT_KEYS } from '@/shared/constants/queryKeys';

import {
  fetchCouncilReport,
  generateSummary,
  saveSummaryDraft,
  setSummaryStatus,
  updateSummary,
} from './api';

const councilKey = (month: string) => [...ROOT_KEYS.admin, 'council', month] as const;

export function useCouncilReport(month: string) {
  return useQuery({ queryKey: councilKey(month), queryFn: () => fetchCouncilReport(month) });
}

function useCouncilMutation<TInput, TResult>(mutationFn: (input: TInput) => Promise<TResult>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: [...ROOT_KEYS.admin, 'council'] }),
  });
}

export const useGenerateSummary = () => useCouncilMutation(generateSummary);
export const useSaveSummaryDraft = () => useCouncilMutation(saveSummaryDraft);
export const useUpdateSummary = () => useCouncilMutation(updateSummary);
export const useSetSummaryStatus = () => useCouncilMutation(setSummaryStatus);
