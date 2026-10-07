interface KakaoButtonProps {
  label: string;
  isPending?: boolean;
  onClick: () => void;
}

// 카카오 로그인 버튼 (카카오 디자인 가이드: 노란 배경 #FEE500 + 말풍선 + 검은 글자)
export function KakaoButton({ label, isPending = false, onClick }: KakaoButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] bg-kakao text-[16px] font-semibold text-black/85 disabled:opacity-60"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 3.5c-5 0-9 3.1-9 7 0 2.5 1.7 4.7 4.2 6l-1 3.6c-.1.3.3.6.6.4l4.2-2.8h1c5 0 9-3.1 9-7s-4-7.2-9-7.2z"
        />
      </svg>
      {isPending ? '카카오로 이동 중…' : label}
    </button>
  );
}
