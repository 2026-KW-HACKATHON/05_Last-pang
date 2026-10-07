import { z } from 'zod';

// notifications + stores(name) + deals(...) 조인 결과
export const notificationRowSchema = z.object({
  id: z.number(),
  kind: z.string(),
  title: z.string(),
  link: z.string().nullable(),
  deal_id: z.string().nullable(),
  read_at: z.string().nullable(),
  created_at: z.string(),
  stores: z.object({ name: z.string() }).nullable(),
  deals: z
    .object({
      title: z.string(),
      starts_at: z.string(),
      ends_at: z.string(),
      remaining_qty: z.number(),
      total_qty: z.number(),
      status: z.string(),
    })
    .nullable(),
});

export type NotificationRow = z.infer<typeof notificationRowSchema>;

export const notificationSettingsRowSchema = z.object({
  deal_alerts: z.boolean(),
  start_alerts: z.boolean(),
  notices: z.boolean(),
  use_location: z.boolean(),
  quiet_enabled: z.boolean(),
  quiet_start: z.string(),
  quiet_end: z.string(),
});

export const markReadResultSchema = z.object({ updated: z.number() });
