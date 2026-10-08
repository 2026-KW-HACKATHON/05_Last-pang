import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ROOT_KEYS } from '@/shared/constants/queryKeys';

import {
  createSchedule,
  deleteSchedule,
  fetchFreeTimes,
  fetchMySchedules,
  updateSchedule,
} from './api';

export const scheduleKeys = {
  all: ROOT_KEYS.schedules,
  list: () => [...ROOT_KEYS.schedules, 'list'] as const,
  freeTimes: () => [...ROOT_KEYS.schedules, 'freeTimes'] as const,
};

export function useMySchedules() {
  return useQuery({ queryKey: scheduleKeys.list(), queryFn: fetchMySchedules });
}

export function useFreeTimes() {
  return useQuery({ queryKey: scheduleKeys.freeTimes(), queryFn: fetchFreeTimes });
}

// 일정이 바뀌면 비는 시간(같은 schedules 키 아래)도 다시 읽는다
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
