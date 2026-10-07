export type PushPermission = NotificationPermission | 'unsupported';

/** 받은 알림 한 건 (R17 받은 알림 카드) */
export interface ResidentNotification {
  id: number;
  chipLabel: string; // "[할인] …" 머리말 또는 kind로 정한 작은 분류
  storeName: string | null;
  title: string;
  link: string;
  isRead: boolean;
  createdAt: string;
  deal: {
    startsAt: string;
    endsAt: string;
    remainingQty: number;
    totalQty: number;
    status: string;
  } | null;
}

/** 알림 설정 (notification_settings). 시각은 "HH:MM" */
export interface NotificationSettings {
  dealAlerts: boolean;
  startAlerts: boolean;
  notices: boolean;
  useLocation: boolean;
  quietEnabled: boolean;
  quietStart: string;
  quietEnd: string;
}
