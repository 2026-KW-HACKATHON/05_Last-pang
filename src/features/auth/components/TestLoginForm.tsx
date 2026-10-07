// 데모 계정(이메일·비밀번호) 로그인. 컨벤션 10장: 개발 빌드(npm run dev)에서만 로그인 화면에 붙는다
import { useState, type FormEvent } from 'react';

import { toAppError } from '@/shared/lib/errors';

import { signInWithTestAccount } from '../api';

export function TestLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsPending(true);
    setError(null);
    try {
      await signInWithTestAccount(email.trim(), password);
      // 성공하면 AuthProvider가 세션을 받고 LoginPage가 첫 화면으로 보낸다
    } catch (caught) {
      setError(toAppError(caught).message);
      setIsPending(false);
    }
  };

  const inputClass =
    'h-12 w-full rounded-[12px] border border-line bg-white px-4 text-[15px] outline-none focus:border-accent';

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="mt-8 space-y-2 text-left">
      <p className="text-sm font-semibold text-muted">테스트 계정 로그인 (점검용)</p>
      <input
        type="email"
        autoComplete="username"
        placeholder="이메일"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className={inputClass}
      />
      <input
        type="password"
        autoComplete="current-password"
        placeholder="비밀번호"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className={inputClass}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      <button
        type="submit"
        disabled={isPending || !email || !password}
        className="h-12 w-full rounded-[12px] border border-line font-semibold disabled:opacity-40"
      >
        {isPending ? '로그인 중…' : '테스트 계정으로 로그인'}
      </button>
    </form>
  );
}
