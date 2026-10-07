import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ROOT_KEYS } from '@/shared/constants/queryKeys';

import {
  createSchedule,
  deleteSchedule,
  fetchAlertPreview,
  fetchAlertSettings,
  fetchMySchedules,
  updateAlertSettings,
  updateSchedule,
} from './api';

import type { AlertSettings } from './types';

export const scheduleKeys = {
  all: ROOT_KEYS.schedules,
  list: () => [...ROOT_KEYS.schedules, 'list'] as const,
  preview: () => [...ROOT_KEYS.schedules, 'alertPreview'] as const,
  alertSettings: () => [...ROOT_KEYS.preferences, 'alerts'] as const,
};

export function useMySchedules() {
  return useQuery({ queryKey: scheduleKeys.list(), queryFn: fetchMySchedules });
}

export function useAlertPreview() {
  return useQuery({ queryKey: scheduleKeys.preview(), queryFn: fetchAlertPreview });
}

export function useAlertSettings() {
  return useQuery({ queryKey: scheduleKeys.alertSettings(), queryFn: fetchAlertSettings });
}

// 일정이 바뀌면 알림 미리보기(같은 schedules 키 아래)도 다시 읽는다
function useInvalidateSchedules() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
}

export function useCreateSchedule() {
  const invalidate = useInvalidateSchedules();
  return useMutation({ mutationFn: createSchedule, onSuccess: invalidate });
}

export function useUpdateSchedule() {
  const invalidate = useInvalidateSchedules();
  return useMutation({ mutationFn: updateSchedule, onSuccess: invalidate });
}

export function useDeleteSchedule() {
  const invalidate = useInvalidateSchedules();
  return useMutation({ mutationFn: deleteSchedule, onSuccess: invalidate });
}

/** 토글은 바로 바뀐 것처럼 보이고, 실패하면 되돌린다 */
export function useUpdateAlertSettings() {
  const queryClient = useQueryClient();
  const key = scheduleKeys.alertSettings();
  return useMutation({
    mutationFn: updateAlertSettings,
    onMutate: async (changes: Partial<AlertSettings>) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<AlertSettings>(key);
      if (previous) queryClient.setQueryData<AlertSettings>(key, { ...previous, ...changes });
      return { previous };
    },
    onError: (_error, _changes, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: key }),
        queryClient.invalidateQueries({ queryKey: scheduleKeys.preview() }),
      ]),
  });
}
