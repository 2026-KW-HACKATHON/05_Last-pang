// 사장님·운영자 화면 공통 부품. Stitch 디자인 시스템(테두리 위주, 그림자 없음, 굵기 400/600)을 따른다.
// 주민 화면과 같이 쓰게 되면 shared/ui로 옮긴다 (그때 정윤 님과 이름 맞추기)
import { useNavigate } from 'react-router-dom';

import { cx } from '../lib/styles';
import { Icon } from './Icon';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

/* ───── 버튼 ───── */
type ButtonVariant = 'primary' | 'secondary' | 'text' | 'danger-text';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'lg' | 'sm';
  isLoading?: boolean;
  block?: boolean;
}

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-white shadow-[inset_0_0.5px_0_rgb(255_255_255/0.2),inset_0_0_0_0.5px_rgb(0_0_0/0.2)] active:bg-accent-pressed disabled:bg-accent-disabled disabled:shadow-none',
  secondary: 'border border-line-strong bg-surface text-ink active:bg-cream disabled:opacity-40',
  text: 'text-muted underline-offset-4 active:underline disabled:opacity-40',
  'danger-text': 'text-danger underline-offset-4 active:underline disabled:opacity-40',
};

export function Button({
  variant = 'primary',
  size = 'lg',
  isLoading = false,
  block = false,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const isText = variant === 'text' || variant === 'danger-text';
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cx(
        'inline-flex items-center justify-center gap-2 font-semibold transition-colors',
        !isText && 'rounded-button',
        !isText && (size === 'lg' ? 'h-[52px] px-5 text-base' : 'h-10 px-4 text-sm'),
        isText && 'h-11 px-2 text-sm',
        block && 'w-full',
        BUTTON_STYLES[variant],
        className,
      )}
      {...rest}
    >
      {isLoading && (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

/* ───── 칩 ───── */
interface ChipProps {
  isSelected?: boolean;
  onClick?: () => void;
  children: ReactNode;
  icon?: ReactNode;
  round?: boolean; // 요일처럼 동그란 칩
  disabled?: boolean;
}

export function Chip({
  isSelected = false,
  onClick,
  children,
  icon,
  round = false,
  disabled,
}: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-pill border text-sm transition-colors disabled:opacity-40',
        round ? 'size-10' : 'h-9 px-3.5',
        isSelected
          ? 'border-accent bg-accent font-semibold text-white'
          : 'border-line bg-surface text-ink',
      )}
    >
      {icon}
      {children}
    </button>
  );
}

/* ───── 세그먼트 ───── */
interface SegmentedProps<T extends string> {
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}

export function Segmented<T extends string>({ options, value, onChange }: SegmentedProps<T>) {
  return (
    <div className="flex rounded-pill border border-line bg-surface p-1" role="tablist">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          onClick={() => onChange(option.value)}
          className={cx(
            'h-9 flex-1 rounded-pill text-sm transition-colors',
            option.value === value ? 'bg-ink font-semibold text-white' : 'text-muted',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/* ───── 카드·정보 줄·배지 ───── */
export function Card({
  children,
  className,
  tinted = false,
}: {
  children: ReactNode;
  className?: string;
  tinted?: boolean;
}) {
  return (
    <section
      className={cx(
        'rounded-card border p-4',
        tinted ? 'border-transparent bg-accent-tint' : 'border-line bg-surface',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function InfoRow({
  label,
  value,
  isStrong = false,
}: {
  label: string;
  value: ReactNode;
  isStrong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-[15px]">
      <span className="shrink-0 text-muted">{label}</span>
      <span className={cx('text-right', isStrong && 'font-semibold')}>{value}</span>
    </div>
  );
}

type BadgeTone = 'accent' | 'success' | 'warning' | 'danger' | 'neutral';
const BADGE_STYLES: Record<BadgeTone, string> = {
  accent: 'bg-accent-tint text-accent',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
  neutral: 'bg-busy text-muted',
};

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={cx(
        'inline-flex h-6 items-center gap-1 rounded-pill px-2.5 text-xs font-semibold',
        BADGE_STYLES[tone],
      )}
    >
      {children}
    </span>
  );
}

/* ───── 화면 틀 ───── */
export function PageHeader({ title, right }: { title?: string; right?: ReactNode }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center bg-cream px-2">
      <button
        type="button"
        aria-label="뒤로"
        onClick={() => navigate(-1)}
        className="flex size-11 items-center justify-center rounded-pill text-ink"
      >
        <Icon name="back" />
      </button>
      <h1 className="flex-1 text-center text-[17px] font-semibold">{title}</h1>
      <div className="flex size-11 items-center justify-center">{right}</div>
    </header>
  );
}

export function PageTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 pt-6 pb-4">
      <h1 className="text-[22px] leading-8 font-semibold tracking-[-0.4px]">{children}</h1>
      {right}
    </div>
  );
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg leading-[26px] font-semibold tracking-[-0.3px]">{children}</h2>
      {right}
    </div>
  );
}

/** 화면 아래 고정 버튼 영역. 내용이 가려지지 않게 부모에 pb-28을 준다 */
export function StickyBar({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[480px] border-t border-line bg-surface p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
      {children}
    </div>
  );
}

/* ───── 입력 ───── */
interface FieldProps {
  label: string;
  hint?: ReactNode;
  error?: string;
  counter?: string;
  children: ReactNode;
}

export function Field({ label, hint, error, counter, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-[15px] font-semibold">{label}</span>
        {counter && <span className="text-[13px] text-faint">{counter}</span>}
      </div>
      {children}
      {error ? (
        <p className="text-[13px] text-danger" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="text-[13px] text-faint">{hint}</p>
      )}
    </div>
  );
}

/* ───── 수량 스테퍼 ───── */
interface StepperProps {
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
}

export function Stepper({ value, min, max, unit, onChange }: StepperProps) {
  const stepButton =
    'flex size-11 items-center justify-center rounded-pill border border-line bg-surface disabled:opacity-30';
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        aria-label="하나 빼기"
        className={stepButton}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Icon name="minus" size={20} />
      </button>
      <span className="min-w-14 text-center text-lg font-semibold tabular-nums">
        {value}
        {unit}
      </span>
      <button
        type="button"
        aria-label="하나 더하기"
        className={stepButton}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Icon name="plus" size={20} />
      </button>
    </div>
  );
}

/* ───── 마스코트 ───── */
type MascotPose = 'wave' | 'eat' | 'map' | 'heart';

export function Mascot({
  pose,
  size = 120,
  className,
}: {
  pose: MascotPose;
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={`/brand/mascot-${pose}.webp`}
      alt=""
      width={size}
      height={size}
      className={cx('mx-auto select-none', className)}
      draggable={false}
    />
  );
}

/** 마스코트 + 제목 + 설명 + 행동 (빈 화면·완료·상태 화면) */
export function StatusBlock({
  pose,
  title,
  body,
  action,
  dimmed = false,
}: {
  pose: MascotPose;
  title: string;
  body?: ReactNode;
  action?: ReactNode;
  dimmed?: boolean;
}) {
  return (
    <div className="flex flex-col items-center px-5 py-10 text-center">
      <Mascot pose={pose} className={dimmed ? 'opacity-60' : undefined} />
      <h2 className="mt-5 text-[22px] leading-[30px] font-semibold whitespace-pre-line">{title}</h2>
      {body && (
        <p className="mt-2 text-[15px] leading-[22px] whitespace-pre-line text-muted">{body}</p>
      )}
      {action && <div className="mt-6 w-full">{action}</div>}
    </div>
  );
}

/* ───── 확인 대화상자 · 바텀시트 ───── */
interface ConfirmDialogProps {
  title: string;
  body?: string;
  confirmLabel: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  isPending,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 px-8"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-[320px] rounded-card bg-surface p-5 shadow-[0_8px_32px_rgb(0_0_0/0.16)]">
        <h2 className="text-lg font-semibold">{title}</h2>
        {body && <p className="mt-2 text-[15px] text-muted">{body}</p>}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            취소
          </Button>
          <Button size="sm" isLoading={isPending} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function BottomSheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink/40"
      role="dialog"
      aria-modal="true"
    >
      <button type="button" aria-label="닫기" className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-[480px] rounded-t-[20px] bg-surface px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))] shadow-[0_-8px_32px_rgb(0_0_0/0.12)]">
        <div className="mx-auto mb-4 h-1 w-10 rounded-pill bg-line" />
        <h2 className="mb-4 text-lg font-semibold">{title}</h2>
        {children}
      </div>
    </div>
  );
}

/** 화면 아래쪽 알림 (몇 초 뒤 부모가 지운다) */
export function Toast({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-24 z-50 flex justify-center px-5" role="status">
      <div className="rounded-pill bg-ink px-4 py-3 text-sm text-white shadow-[0_8px_24px_rgb(0_0_0/0.2)]">
        {children}
      </div>
    </div>
  );
}
