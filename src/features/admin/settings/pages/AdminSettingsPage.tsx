// A4 운영 설정 — 정책 수치 보기 (바꾸려면 마이그레이션 app_policy와 shared/constants/policy.ts를 같이 고친다)
import { useNavigate } from 'react-router-dom';

import { signOut } from '@/features/auth/api';
import { Icon } from '@/features/owner/components/Icon';
import { InfoRow } from '@/features/owner/components/ui/InfoRow';
import { MenuRow } from '@/features/owner/components/ui/MenuRow';
import { NoticeBox } from '@/features/owner/components/ui/NoticeBox';
import { POLICY } from '@/shared/constants/policy';

import { AdminShell } from '../../components/AdminShell';

import type { ReactNode } from 'react';

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-base font-semibold">{title}</h2>
      <div className="rounded-card border border-line px-4 py-2">{children}</div>
    </section>
  );
}

export function AdminSettingsPage() {
  const navigate = useNavigate();
  return (
    <AdminShell title="운영 설정">
      <div className="space-y-5 px-5 pt-2">
        <Group title="서비스 지역">
          <InfoRow label="운영 동네" value={POLICY.neighborhoodName} />
          <InfoRow
            label="입점 가능 범위"
            value={`${POLICY.neighborhoodName} 중심 반경 ${POLICY.storeRadiusM / 1000}km`}
          />
        </Group>
        <Group title="알림">
          <InfoRow label="주민당 하루 알림" value={`${POLICY.residentDailyPush}건`} />
          <InfoRow label="같은 가게 알림" value={`하루 ${POLICY.sameStoreDailyPush}건`} />
          <InfoRow label="방해 금지 시간" value={`${POLICY.quietStart} ~ ${POLICY.quietEnd}`} />
        </Group>
        <Group title="쿠폰·딜">
          <InfoRow label="주민 하루 쿠폰 사용" value={`${POLICY.residentDailyRedeem}회`} />
          <InfoRow label="사장님 하루 딜 등록" value={`${POLICY.ownerDailyDeals}개`} />
          <InfoRow label="신고 자동 중지" value={`${POLICY.reportAutoPause}건`} />
          <InfoRow label="가게 이용 정지" value={`신고 확정 ${POLICY.confirmedReportsSuspend}회`} />
        </Group>
        <NoticeBox>
          수치를 바꾸려면 개발팀에 요청해 주세요. 바뀐 값은 다음 날부터 적용돼요.
        </NoticeBox>
        <div className="overflow-hidden rounded-card border border-line">
          <MenuRow
            label="자치회 리포트"
            onClick={() => navigate('/admin/report')}
            right={
              <span className="flex items-center gap-1 text-[13px] text-muted">
                PC에서 크게 보기 <Icon name="chevron" size={16} />
              </span>
            }
          />
        </div>
        <div className="overflow-hidden rounded-card border border-line">
          <MenuRow
            label="운영자 계정"
            right={<span className="text-[13px] text-muted">카카오 로그인</span>}
          />
          <button
            type="button"
            onClick={() => void signOut().then(() => navigate('/login', { replace: true }))}
            className="flex h-14 w-full items-center justify-between border-t border-line px-4 text-[15px] text-danger"
          >
            로그아웃 <Icon name="logout" size={18} />
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
