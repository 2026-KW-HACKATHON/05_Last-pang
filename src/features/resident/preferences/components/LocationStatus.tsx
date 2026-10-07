import { Icon } from '@/shared/ui/Icon';

interface LocationStatusProps {
  name: string;
  isInside: boolean;
}

// 약도 아래: 고른 곳 이름과 월계1동 안/밖 안내 (피그마 R4-1)
export function LocationStatus({ name, isInside }: LocationStatusProps) {
  return (
    <div className="px-5 pt-5">
      <div className="flex items-start gap-3">
        <Icon name="pin" size={22} className={isInside ? 'text-accent' : 'text-muted'} />
        <div>
          <p className="font-bold">{name} 근처</p>
          <p className={`text-sm ${isInside ? 'text-muted' : 'text-danger'}`}>
            {isInside ? '월계1동 안이에요' : '월계1동 밖이에요'}
          </p>
        </div>
      </div>
      {isInside ? (
        <p className="mt-4 flex items-center gap-2 rounded-[12px] bg-accent-tint p-3.5 text-sm text-accent">
          <Icon name="shield" size={18} />
          정확한 주소 대신 약 100m 범위로만 저장해요
        </p>
      ) : (
        <div className="mt-4 flex gap-2 rounded-[12px] bg-accent-tint p-3.5 ring-1 ring-danger">
          <Icon name="alertCircle" size={20} className="shrink-0 text-danger" />
          <div className="text-sm">
            <p className="font-semibold text-danger">월계1동 안에서만 고를 수 있어요</p>
            <p className="mt-0.5">핀을 월계1동 안으로 옮겨 주세요.</p>
          </div>
        </div>
      )}
    </div>
  );
}
