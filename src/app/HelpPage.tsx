// 공통 C8 문의하기 · C8-1 자주 묻는 질문 (사장님이면 "사장님" 분류부터)
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  FAQ_CATEGORIES,
  FAQ_ITEMS,
  SUPPORT_EMAIL,
  SUPPORT_HOURS,
  type FaqCategory,
} from '@/shared/constants/support';

import { useAuth } from './useAuth';

export function HelpPage() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [category, setCategory] = useState<FaqCategory>(role === 'owner' ? '사장님' : '전체');
  const [openId, setOpenId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  // 주민 계정의 "전체"에는 사장님 질문을 숨긴다 (피그마 C8-1 전체 탭)
  const items = FAQ_ITEMS.filter((item) =>
    category === '전체'
      ? role === 'owner' || item.category !== '사장님'
      : item.category === category,
  );

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] pb-10">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-1 bg-gray px-2">
        <button
          type="button"
          aria-label="뒤로"
          onClick={() => navigate(-1)}
          className="flex size-11 items-center justify-center text-xl"
        >
          ‹
        </button>
        <h1 className="text-lg font-semibold">문의하기</h1>
      </header>
      <div className="space-y-5 px-5 pt-6">
        <div>
          <h2 className="text-[22px] font-bold">무엇을 도와드릴까요?</h2>
          <p className="text-sm text-muted">{SUPPORT_HOURS}에 답변해 드려요</p>
        </div>
        <div className="flex items-center gap-3 rounded-card border border-line p-4">
          <div className="min-w-0 flex-1">
            <p className="font-semibold">이메일로 문의</p>
            <p className="truncate text-sm text-muted">{SUPPORT_EMAIL}</p>
          </div>
          <button
            type="button"
            onClick={() =>
              void navigator.clipboard?.writeText(SUPPORT_EMAIL).then(() => setIsCopied(true))
            }
            className="rounded-pill border border-line px-3 py-1.5 text-sm"
          >
            {isCopied ? '복사했어요' : '복사'}
          </button>
        </div>
        {isCopied && (
          <p className="rounded-field bg-gray p-3 text-[13px] text-muted">
            문의할 때 전화번호나 주소는 적지 않아도 돼요. 닉네임만 알려 주세요.
          </p>
        )}
        <h2 className="text-lg font-semibold">자주 묻는 질문</h2>
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5">
          {FAQ_CATEGORIES.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className={`h-[34px] shrink-0 rounded-pill px-3.5 text-sm ${category === value ? 'bg-accent text-white' : 'border border-line'}`}
            >
              {value}
            </button>
          ))}
        </div>
        <ul className="divide-y divide-line overflow-hidden rounded-card border border-line">
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <li key={item.id} className={isOpen ? 'bg-gray' : undefined}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full items-start gap-2 p-4 text-left"
                >
                  <span className="font-bold text-accent">Q</span>
                  <span className={`flex-1 ${isOpen ? 'font-semibold' : ''}`}>{item.question}</span>
                  <span className={isOpen ? 'text-accent' : 'text-faint'}>
                    {isOpen ? '⌃' : '⌄'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pl-10 text-sm leading-[22px] text-muted">
                    {item.answer}
                    {item.link && (
                      <Link to={item.link.to} className="mt-2 block font-semibold text-accent">
                        {item.link.label} ›
                      </Link>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
