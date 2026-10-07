// O5 요일 반복딜 — 규칙을 저장하면 고른 요일마다 밤 12시 5분에 그날 딜이 자동으로 생긴다 (6-5 cron)
import { useState } from 'react';

import { AppError } from '@/shared/lib/errors';

import { ApprovedStoreGate } from '../../components/ApprovedStoreGate';
import { Button } from '../../components/ui/Button';
import { NoticeBox } from '../../components/ui/NoticeBox';
import { ProfileButton } from '../../components/ui/ProfileButton';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { StickyBar } from '../../components/ui/StickyBar';
import { Toast } from '../../components/ui/Toast';
import { TopBar } from '../../components/ui/TopBar';
import { useToast } from '../../lib/useToast';
import { RuleRow } from '../components/RuleRow';
import { WeeklyRuleFields } from '../components/WeeklyRuleFields';
import { EMPTY_WEEKLY_DRAFT, type WeeklyDraft } from '../weeklyDraft';
import { useCreateDealRule, useDealRules, useSetDealRuleActive } from '../hooks';
import { weeklyDealSchema } from '../schema';

import type { MyStore } from '../../store/api';

export function WeeklyDealFormPage() {
  return <ApprovedStoreGate>{(store) => <WeeklyDealForm store={store} />}</ApprovedStoreGate>;
}

function WeeklyDealForm({ store }: { store: MyStore }) {
  const rules = useDealRules(store.id);
  const createRule = useCreateDealRule(store.id);
  const setActive = useSetDealRuleActive(store.id);
  const { toastMessage, showToast } = useToast();
  const [draft, setDraft] = useState<WeeklyDraft>(EMPTY_WEEKLY_DRAFT);
  const parsed = weeklyDealSchema.safeParse(draft);

  const handleSave = () => {
    if (!parsed.success) return;
    createRule.mutate(parsed.data, {
      onSuccess: () => {
        setDraft(EMPTY_WEEKLY_DRAFT);
        showToast('반복딜을 저장했어요');
      },
    });
  };

  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-28">
      <TopBar title="요일 반복딜" right={<ProfileButton to="/owner/me" />} />
      <div className="space-y-7 px-5 pt-4">
        <NoticeBox tone="tint">고른 요일마다 밤 12시 5분에 그날 딜이 자동으로 생겨요</NoticeBox>
        {(rules.data ?? []).length > 0 && (
          <section>
            <SectionTitle>내 반복딜</SectionTitle>
            <div className="space-y-2">
              {(rules.data ?? []).map((rule) => (
                <RuleRow
                  key={rule.id}
                  rule={rule}
                  isUpdating={setActive.isPending && setActive.variables?.ruleId === rule.id}
                  onToggle={(isActive) => setActive.mutate({ ruleId: rule.id, isActive })}
                />
              ))}
            </div>
          </section>
        )}
        <section className="space-y-5 border-t border-line pt-7">
          <h2 className="text-lg font-semibold">새 반복딜</h2>
          <WeeklyRuleFields draft={draft} onChange={setDraft} />
          {createRule.error instanceof AppError && (
            <NoticeBox tone="danger">{createRule.error.message}</NoticeBox>
          )}
        </section>
      </div>
      <StickyBar>
        <Button
          block
          disabled={!parsed.success}
          isLoading={createRule.isPending}
          onClick={handleSave}
        >
          반복딜 저장
        </Button>
      </StickyBar>
      {toastMessage && <Toast>{toastMessage}</Toast>}
    </div>
  );
}
