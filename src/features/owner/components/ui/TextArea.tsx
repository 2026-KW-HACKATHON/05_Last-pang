interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  maxLength: number;
  label: string;
}

/** "추가 안내 내용 (선택) 0/150" 입력 */
export function TextArea({ value, onChange, placeholder, maxLength, label }: TextAreaProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[13px] text-muted">
        <span>{label}</span>
        <span>
          {value.length}/{maxLength}
        </span>
      </div>
      <textarea
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none rounded-field border border-line bg-surface p-3.5 text-[15px] outline-none placeholder:text-faint focus:border-accent"
      />
    </div>
  );
}
