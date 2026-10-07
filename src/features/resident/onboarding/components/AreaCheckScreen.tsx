import { useState } from 'react';

import { BottomBar } from '@/shared/ui/BottomBar';
import { Icon } from '@/shared/ui/Icon';
import { Mascot } from '@/shared/ui/Mascot';

import { RelationRadio, type AreaRelation } from './RelationRadio';

interface AreaCheckScreenProps {
  variant: 'denied' | 'outside'; // 위치 권한 거부 / 월계1동 밖
  isRetrying: boolean;
  onContinue: () => void;
  onRetry: () => void;
}

// 동네 인증 실패 (피그마 R2-1). 고른 관계는 저장하지 않고 안내용으로만 쓴다
export function AreaCheckScreen({
  variant,
  isRetrying,
  onContinue,
  onRetry,
}: AreaCheckScreenProps) {
  const [relation, setRelation] = useState<AreaRelation>(variant === 'denied' ? 'work' : 'live');
  const isDenied = variant === 'denied';

  return (
    <div className="px-5 pt-6">
      {isDenied ? (
        <span className="flex size-16 items-center justify-center rounded-full bg-accent-tint text-accent">
          <Icon name="pin" size={28} />
        </span>
      ) : (
        <Mascot pose="map" size={100} />
      )}
      <h1 className="mt-5 text-2xl leading-snug font-bold">
        {isDenied ? '위치 확인 없이도' : '지금은 월계1동 밖에'}
        <br />
        {isDenied ? '시작할 수 있어요' : '계신 것 같아요'}
      </h1>
      <p className="mt-3 text-muted">
        {isDenied
          ? '월계1동과 어떤 관계인지 알려 주시면 그 기준으로 딜을 보여드려요.'
          : '동네냠냠은 월계1동 주민·학생·직장인을 위한 서비스예요. 해당하면 아래에서 골라 주세요.'}
      </p>
      <div className="mt-6">
        <RelationRadio value={relation} onChange={setRelation} />
      </div>
      {isDenied ? (
        <p className="mt-3 flex items-center gap-2 rounded-[12px] bg-gray p-4 text-sm text-muted">
          <Icon name="info" size={18} />
          나중에 위치를 켜면 가까운 딜부터 보여드릴 수 있어요
        </p>
      ) : (
        <p className="mt-3 flex items-center gap-2 rounded-[12px] bg-accent-tint p-4 text-sm text-accent">
          <Icon name="shield" size={18} />
          위치는 확인에만 쓰고 저장하지 않아요
        </p>
      )}
      <BottomBar>
        <button
          type="button"
          onClick={onContinue}
          className="h-[52px] w-full rounded-[12px] bg-accent font-semibold text-white"
        >
          {isDenied ? '이대로 계속하기' : '월계1동 주민으로 계속하기'}
        </button>
        {!isDenied && (
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="mt-2 w-full py-1 text-sm text-muted disabled:text-faint"
          >
            {isRetrying ? '위치 확인 중…' : '위치 다시 확인하기'}
          </button>
        )}
      </BottomBar>
    </div>
  );
}
