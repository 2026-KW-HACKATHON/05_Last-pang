export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

/** 입력칸 공통 모양 (Stitch: 흰 바탕, 1px 테두리, 52px, 포커스 시 크림슨 1.5px + 옅은 그림자) */
export const inputClass = (hasError = false) =>
  cx(
    'h-[52px] w-full rounded-field border bg-surface px-4 text-base outline-none placeholder:text-faint',
    'focus:border-[1.5px] focus:shadow-[0_4px_12px_rgb(0_0_0/0.08)]',
    hasError ? 'border-danger focus:border-danger' : 'border-line focus:border-accent',
  );
