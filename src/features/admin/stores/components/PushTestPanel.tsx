// 알림 시험 준비 상태: 발송 설정 체크 + 이 가게에 지금 딜을 올리면 몇 명에게 가는지 단계별 인원
import { Link } from 'react-router-dom';

import { usePushFunnel, usePushReadiness } from '../hooks';

import type { PushFunnel, PushReadiness } from '../pushApi';

const CHECKS: Array<{ key: keyof PushReadiness; label: string }> = [
  { key: 'cron_job', label: '1분마다 대상 고르기 (cron)' },
  { key: 'pg_net', label: '발송 함수 호출 (pg_net)' },
  { key: 'vault_project_url', label: 'Vault · project_url' },
  { key: 'vault_push_secret', label: 'Vault · push_cron_secret' },
];

const STEPS: Array<{ key: keyof PushFunnel; label: string }> = [
  { key: 'residents', label: '주민 전체' },
  { key: 'push_agreed', label: '알림 동의' },
  { key: 'alerts_on', label: '딜 알림 켬' },
  { key: 'in_range', label: '걸어갈 거리 안' },
  { key: 'category_ok', label: '좋아하는 업종' },
  { key: 'free_ok', label: '비는 시간 30분 이상 겹침 (1시간 딜)' },
  { key: 'inbox_targets', label: '방해 금지·하루 한도 통과 → 알림함' },
  { key: 'push_targets', label: '기기 등록 → 푸시' },
];

export function PushTestPanel({ storeId }: { storeId: string }) {
  const readiness = usePushReadiness();
  const funnel = usePushFunnel(storeId);
  const r = readiness.data;
  return (
    <div className="space-y-3 rounded-card border border-line p-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold">알림 시험</p>
        <Link to="/notifications/settings" className="text-[13px] text-accent underline">
          이 기기 알림 켜기
        </Link>
      </div>
      {r && (
        <ul className="space-y-1 text-[13px]">
          {CHECKS.map((check) => (
            <li key={check.key} className="flex justify-between">
              <span className="text-muted">{check.label}</span>
              <span className={r[check.key] ? 'text-success' : 'text-danger'}>
                {r[check.key] ? '준비됨' : '없음'}
              </span>
            </li>
          ))}
          <li className="flex justify-between">
            <span className="text-muted">알림 받을 기기 (전체)</span>
            <span>{r.subscriptions}대</span>
          </li>
          {r.quiet_now && (
            <li className="text-danger">지금은 방해 금지 시간이라 주민에게는 보내지 않아요</li>
          )}
        </ul>
      )}
      {funnel.data && (
        <div className="rounded-field bg-gray p-3">
          <p className="mb-2 text-[13px] text-muted">이 가게에 지금 딜을 올리면</p>
          <ol className="space-y-1 text-[13px]">
            {STEPS.map((step, index) => (
              <li key={step.key} className="flex justify-between">
                <span>
                  {index + 1}. {step.label}
                </span>
                <span className="font-semibold">{funnel.data[step.key]}명</span>
              </li>
            ))}
          </ol>
        </div>
      )}
      <p className="text-xs leading-5 text-faint">
        주민 계정이 없으면 딜의 &quot;내 기기로 시험&quot;을 쓰세요. 운영자 본인 기기로만 보내요.
        같은 주민에게 같은 가게 알림은 하루 1번이에요.
      </p>
    </div>
  );
}
