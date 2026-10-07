import { useState } from 'react';

import { MenuRow } from '../../components/ui/MenuRow';
import { Toggle } from '../../components/ui/Toggle';

const readPermission = () =>
  typeof Notification === 'undefined' ? 'unsupported' : Notification.permission;

/**
 * 알림 받기 — 지금은 브라우저 권한만 묻는다.
 * 실제 구독 저장(push_subscriptions)은 공동 PWA 작업(6-1 웹 푸시)의 savePushSubscription을 붙인다
 */
export function PushToggleRow() {
  const [permission, setPermission] = useState(readPermission);
  const isOn = permission === 'granted';
  const handleChange = async (next: boolean) => {
    if (!next || permission === 'unsupported') return; // 끄기는 브라우저 설정에서만 가능
    setPermission(await Notification.requestPermission());
  };
  return (
    <MenuRow
      label={permission === 'denied' ? '알림 받기 (브라우저에서 막힘)' : '알림 받기'}
      right={
        <Toggle
          checked={isOn}
          disabled={permission === 'unsupported' || permission === 'denied'}
          onChange={(next) => void handleChange(next)}
          label="알림 받기"
        />
      }
    />
  );
}
