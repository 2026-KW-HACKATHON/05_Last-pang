import { useState } from 'react';

import { Icon } from '@/shared/ui/Icon';

import { copyDealLink, shareDeal } from '../share';
import { DealMoreSheet } from './DealMoreSheet';
import { DealReportSheet } from './DealReportSheet';
import { ShareButton } from './ShareButton';

import type { DealDetail } from '../types';

interface DealHeaderActionsProps {
  deal: DealDetail;
  onToast: (message: string) => void;
}

const COPIED_MESSAGE = '링크를 복사했어요';

// 딜 상세 상단 오른쪽: 공유 · 더보기(링크 복사 · 공유 · 신고)
export function DealHeaderActions({ deal, onToast }: DealHeaderActionsProps) {
  const [openSheet, setOpenSheet] = useState<'more' | 'report' | null>(null);
  const closeSheet = () => setOpenSheet(null);

  const handleCopyLink = async () => {
    closeSheet();
    await copyDealLink();
    onToast(COPIED_MESSAGE);
  };

  const handleShare = async () => {
    closeSheet();
    if ((await shareDeal(deal.title)) === 'copied') onToast(COPIED_MESSAGE);
  };

  const handleReportDone = (message: string) => {
    closeSheet();
    onToast(message);
  };

  return (
    <>
      <ShareButton title={deal.title} onCopied={() => onToast(COPIED_MESSAGE)} />
      <button
        type="button"
        onClick={() => setOpenSheet('more')}
        aria-label="더보기"
        className="-mr-2 p-2"
      >
        <Icon name="more" size={22} />
      </button>
      {openSheet === 'more' && (
        <DealMoreSheet
          onCopyLink={() => void handleCopyLink()}
          onShare={() => void handleShare()}
          onReport={() => setOpenSheet('report')}
          onClose={closeSheet}
        />
      )}
      {openSheet === 'report' && (
        <DealReportSheet
          dealId={deal.id}
          subtitle={`${deal.storeName} · ${deal.title}`}
          onDone={handleReportDone}
          onClose={closeSheet}
        />
      )}
    </>
  );
}
