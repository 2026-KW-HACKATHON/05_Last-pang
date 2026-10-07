import { useNavigate } from 'react-router-dom';

import { Icon } from '../../components/Icon';
import { Button } from '../../components/ui/Button';

/** 즉시딜 올리기 + 반복딜 관리 (O3-1). 정지·주소 심사 중이면 즉시딜 버튼을 막는다 */
export function HomeActions({ canCreate }: { canCreate: boolean }) {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button
        disabled={!canCreate}
        onClick={() => navigate('/owner/deals/new')}
        className={canCreate ? undefined : 'bg-gray text-faint'}
      >
        <Icon name="bolt" size={18} /> 즉시딜 올리기
      </Button>
      <Button variant="secondary" onClick={() => navigate('/owner/weekly-deals/new')}>
        <Icon name="repeat" size={18} /> 반복딜 관리
      </Button>
    </div>
  );
}
