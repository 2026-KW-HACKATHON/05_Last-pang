// O5-1 반복딜 수정·삭제 — 바꾼 내용은 내일 만들어지는 딜부터 적용된다
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AppError } from '@/shared/lib/errors';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

import { Icon } from '../../components/Icon';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { NoticeBox } from '../../components/ui/NoticeBox';
import { StatusBlock } from '../../components/ui/StatusBlock';
import { StickyBar } from '../../components/ui/StickyBar';
import { Toggle } from '../../components/ui/Toggle';
import { TopBar } from '../../components/ui/TopBar';
import { WeeklyRuleFields } from '../components/WeeklyRuleFields';
import { useDealRule, useDeleteDealRule, useUpdateDealRule } from '../hooks';
import { weeklyDealSchema } from '../schema';

import type { WeeklyDraft } from '../weeklyDraft';
import type { DealRule } from '../api';

export function WeeklyDealEditPage() {
  const { ruleId = '' } = useParams();
  const rule = useDealRule(ruleId);
  if (rule.isPending) return <LoadingState />;
  if (rule.isError) return <ErrorState error={rule.error} onRetry={() => void rule.refetch()} />;
  if (!rule.data) return <StatusBlock pose="map" title="반복딜을 찾을 수 없어요" />;
  return <WeeklyDealEdit rule={rule.data} />;
}

function toDraft(rule: DealRule): WeeklyDraft {
  const ttl = [10, 15, 20, 30].includes(rule.couponTtlMin)
    ? (rule.couponTtlMin as WeeklyDraft['couponTtlMin'])
    : 15;
  return { ...rule, couponTtlMin: ttl };
}

function WeeklyDealEdit({ rule }: { rule: DealRule }) {
  const navigate = useNavigate();
  const updateRule = useUpdateDealRule(rule.id);
  const deleteRule = useDeleteDealRule();
  const [draft, setDraft] = useState<WeeklyDraft>(() => toDraft(rule));
  const [isActive, setIsActive] = useState(rule.isActive);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const parsed = weeklyDealSchema.safeParse(draft);
  const error = updateRule.error ?? deleteRule.error;

  const handleSave = () =>
    parsed.success &&
    updateRule.mutate(
      { ...parsed.data, isActive },
      { onSuccess: () => navigate('/owner/weekly-deals/new') },
    );
  const handleDelete = () =>
    deleteRule.mutate(rule.id, {
      onSuccess: () => navigate('/owner/weekly-deals/new', { replace: true }),
    });

  return (
    <div className="mx-auto min-h-dvh max-w-[480px] pb-28">
      <TopBar title="반복딜 수정" />
      <div className="space-y-7 px-5 pt-5">
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-semibold">이 반복딜 켜기</span>
          <Toggle checked={isActive} onChange={setIsActive} label="이 반복딜 켜기" />
        </div>
        <WeeklyRuleFields draft={draft} onChange={setDraft} />
        <NoticeBox>바꾼 내용은 내일 만들어지는 딜부터 적용돼요</NoticeBox>
        {error instanceof AppError && <NoticeBox tone="danger">{error.message}</NoticeBox>}
      </div>
      <StickyBar>
        <div className="grid grid-cols-[1fr_2fr] gap-2">
          <Button variant="danger-outline" onClick={() => setIsConfirmingDelete(true)}>
            <Icon name="trash" size={18} /> 삭제
          </Button>
          <Button disabled={!parsed.success} isLoading={updateRule.isPending} onClick={handleSave}>
            저장하기
          </Button>
        </div>
      </StickyBar>
      {isConfirmingDelete && (
        <ConfirmDialog
          icon="trash"
          title="반복딜을 삭제할까요?"
          body={'오늘 이미 만들어진 딜은 그대로 진행돼요.\n내일부터 새 딜이 만들어지지 않아요.'}
          confirmLabel="삭제하기"
          isPending={deleteRule.isPending}
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmingDelete(false)}
        />
      )}
    </div>
  );
}
