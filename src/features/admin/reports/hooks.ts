import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ROOT_KEYS } from '@/shared/constants/queryKeys';

import { fetchReportDetail, fetchReportGroups, resolveReports, type ReportTab } from './api';

export const reportKeys = {
  groups: (tab: ReportTab) => [...ROOT_KEYS.admin, 'reports', tab] as const,
  detail: (dealId: string) => [...ROOT_KEYS.admin, 'report', dealId] as const,
};

export function useReportGroups(tab: ReportTab) {
  return useQuery({
    queryKey: reportKeys.groups(tab),
    queryFn: () => fetchReportGroups(tab),
    refetchInterval: 30_000,
  });
}

export function useReportDetail(dealId: string) {
  return useQuery({
    queryKey: reportKeys.detail(dealId),
    queryFn: () => fetchReportDetail(dealId),
    enabled: Boolean(dealId),
  });
}

export function useResolveReports() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resolveReports,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ROOT_KEYS.admin });
      void queryClient.invalidateQueries({ queryKey: ROOT_KEYS.deals });
    },
  });
}
