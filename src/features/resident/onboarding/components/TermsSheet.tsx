import { BottomSheet } from '@/shared/ui/BottomSheet';
import { Icon } from '@/shared/ui/Icon';

import type { TermsDoc } from '../termsText';

interface TermsSheetProps {
  doc: TermsDoc;
  onAgree: () => void;
  onClose: () => void;
}

// 약관 상세 시트 (피그마 R2 약관 상세): 본문을 읽고 "확인 및 약관 동의"로 그 항목을 체크한다
export function TermsSheet({ doc, onAgree, onClose }: TermsSheetProps) {
  return (
    <BottomSheet title={doc.title} onClose={onClose}>
      <p className="flex items-center gap-1.5 rounded-[12px] px-3 py-2 text-sm ring-1 ring-line">
        <Icon name="checkCircle" size={16} className="text-accent" />
        월계 1동 골목상권과 상생하는 <span className="text-accent">착한 타임딜</span> 약속이에요
      </p>
      <div className="mt-3 max-h-[50dvh] overflow-y-auto rounded-[12px] p-4 ring-1 ring-line">
        {doc.articles.map((article) => (
          <section key={article.heading} className="mb-4 last:mb-0">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
              {article.heading}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">{article.body}</p>
          </section>
        ))}
      </div>
      <button
        type="button"
        onClick={onAgree}
        className="mt-4 flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] bg-accent font-semibold text-white"
      >
        <Icon name="checkCircle" size={18} />
        확인 및 약관 동의
      </button>
    </BottomSheet>
  );
}
