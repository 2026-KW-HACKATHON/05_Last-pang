import { cx } from '../../lib/styles';

import type { ButtonHTMLAttributes } from 'react';

// 피그마 최종: 크림슨 채움(주요) · 회색 채움(보조) · 흰 바탕 테두리(위험·되돌리기) · 글자 버튼
type ButtonVariant =
  'primary' | 'secondary' | 'outline' | 'danger-outline' | 'text' | 'danger-text';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'lg' | 'md' | 'sm';
  isLoading?: boolean;
  block?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white active:bg-accent-pressed disabled:bg-accent-disabled',
  secondary: 'bg-gray text-ink active:bg-line disabled:text-faint',
  outline: 'border border-accent bg-surface text-accent active:bg-accent-tint disabled:opacity-40',
  'danger-outline': 'border border-line bg-surface text-danger active:bg-gray disabled:opacity-40',
  text: 'text-muted underline-offset-4 active:underline disabled:opacity-40',
  'danger-text': 'text-danger underline-offset-4 active:underline disabled:opacity-40',
};

const SIZE_STYLES = {
  lg: 'h-[52px] px-5 text-base',
  md: 'h-11 px-4 text-[15px]',
  sm: 'h-9 px-3 text-sm',
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
        'inline-flex items-center justify-center gap-1.5 font-semibold transition-colors disabled:cursor-not-allowed',
        isText ? 'h-11 px-2 text-sm' : cx('rounded-button', SIZE_STYLES[size]),
        block && 'w-full',
        VARIANT_STYLES[variant],
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
