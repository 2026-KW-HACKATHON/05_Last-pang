const SUGGESTIONS = ['석계역빵순이', '월계동러너', '우이천라떼파'] as const;

interface NicknameSuggestionsProps {
  onPick: (nickname: string) => void;
}

// 고민될 때 누르면 바로 채워지는 추천 닉네임 (피그마 R3 미입력)
export function NicknameSuggestions({ onPick }: NicknameSuggestionsProps) {
  return (
    <div className="mt-8">
      <p className="text-sm text-muted">고민될 땐 이런 닉네임 어때요?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {SUGGESTIONS.map((nickname) => (
          <button
            key={nickname}
            type="button"
            onClick={() => onPick(nickname)}
            className="rounded-pill bg-gray px-3 py-1.5 text-sm"
          >
            {nickname}
          </button>
        ))}
      </div>
    </div>
  );
}
