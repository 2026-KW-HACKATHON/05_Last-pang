import { z } from 'zod';

import { MAX_NAME_LENGTH } from './constants';

// DB check 값과 같다 (20261007120000_timetable_and_notification_settings)
export const scheduleColorSchema = z.enum([
  'crimson',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'gray',
]);
export const scheduleKindSchema = z.enum([
  'class',
  'work',
  'parttime',
  'exercise',
  'academy',
  'etc',
]);

export const scheduleRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  days: z.array(z.number()),
  start_time: z.string(),
  end_time: z.string(),
  kind: scheduleKindSchema.nullable(),
  color: scheduleColorSchema,
});

// get_my_free_times: [{ day, from, to }]
export const freeTimesSchema = z.array(
  z.object({ day: z.string(), from: z.string(), to: z.string() }),
);

// 시트 저장 전 검사 (DB check와 같은 규칙)
export const scheduleDraftSchema = z
  .object({
    name: z.string().trim().min(1, '일정 이름을 적어 주세요').max(MAX_NAME_LENGTH),
    days: z.array(z.number()).min(1, '반복 요일을 골라 주세요'),
    startMin: z.number(),
    endMin: z.number(),
  })
  .refine((draft) => draft.endMin > draft.startMin, '끝 시각은 시작보다 늦어야 해요');
