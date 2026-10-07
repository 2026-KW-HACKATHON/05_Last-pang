import { Field } from '@/features/owner/components/ui/Field';
import { inputClass } from '@/features/owner/lib/styles';

interface CoordinateFieldsProps {
  lat: number;
  lng: number;
  onChange: (value: { lat: number; lng: number }) => void;
}

/** 주소 검색이 안 될 때(카카오 키 없음 등) 지도 앱에서 확인한 좌표를 직접 넣는다 */
export function CoordinateFields({ lat, lng, onChange }: CoordinateFieldsProps) {
  const toNumber = (text: string) => Number.parseFloat(text) || 0;
  return (
    <Field
      label="좌표 직접 입력"
      hint="네이버·카카오 지도에서 가게를 길게 눌러 나오는 위도, 경도를 넣어 주세요"
    >
      <div className="grid grid-cols-2 gap-2">
        <input
          inputMode="decimal"
          aria-label="위도"
          value={lat || ''}
          onChange={(event) => onChange({ lat: toNumber(event.target.value), lng })}
          placeholder="위도 37.62…"
          className={inputClass()}
        />
        <input
          inputMode="decimal"
          aria-label="경도"
          value={lng || ''}
          onChange={(event) => onChange({ lat, lng: toNumber(event.target.value) })}
          placeholder="경도 127.05…"
          className={inputClass()}
        />
      </div>
    </Field>
  );
}
