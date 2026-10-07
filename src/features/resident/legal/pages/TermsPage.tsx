import { Navigate, useParams } from 'react-router-dom';

import { PageHeader } from '@/shared/ui/PageHeader';

import { TermsSummary } from '../components/TermsSummary';
import { TERMS_CONTENT, isTermsKind } from '../termsContent';

// 약관 보기 (피그마 R15). 로그인 없이 열 수 있다
export function TermsPage() {
  const { kind } = useParams();
  if (!isTermsKind(kind)) return <Navigate to="/terms/service" replace />;
  const doc = TERMS_CONTENT[kind];

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-surface">
      <PageHeader title={doc.title} hasBack />
      <article className="px-5 pt-5 pb-10">
        <p className="text-xs text-faint">시행일 {doc.effectiveDate}</p>
        {doc.summary && <TermsSummary rows={doc.summary} note={doc.note} />}
        {doc.sections.map((section) => (
          <section key={section.heading} className="mt-6">
            <h2 className="font-bold">{section.heading}</h2>
            <div className="mt-1.5 text-sm leading-relaxed text-muted">
              {section.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </section>
        ))}
      </article>
    </main>
  );
}
