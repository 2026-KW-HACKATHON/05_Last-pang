import { Icon } from '@/features/owner/components/Icon';
import { Button } from '@/features/owner/components/ui/Button';

import { toCsv } from '../reportText';

import type { CouncilReport } from '../api';

interface SummaryExportButtonsProps {
  report: CouncilReport;
  text: string;
  onSent: () => void;
}

/** 검수 완료 뒤에만 보이는 내보내기: PDF(인쇄) · 표(CSV) · 자치회에 보내기(메일) */
export function SummaryExportButtons({ report, text, onSent }: SummaryExportButtonsProps) {
  const title = `월계1동 상권 리포트 ${report.month.slice(0, 7)}`;
  const handleDownloadCsv = () => {
    const url = URL.createObjectURL(new Blob([toCsv(report)], { type: 'text/csv' }));
    const link = Object.assign(document.createElement('a'), {
      href: url,
      download: `월계1동-상권리포트-${report.month.slice(0, 7)}.csv`,
    });
    link.click();
    URL.revokeObjectURL(url);
  };
  const handleSend = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text)}`;
    onSent();
  };

  return (
    <>
      <Button variant="secondary" size="md" onClick={() => window.print()}>
        <Icon name="download" size={14} /> PDF 내려받기
      </Button>
      <Button variant="secondary" size="md" onClick={handleDownloadCsv}>
        <Icon name="receipt" size={14} /> 표 내려받기
      </Button>
      <Button size="md" onClick={handleSend}>
        <Icon name="mail" size={14} /> 자치회에 보내기
      </Button>
    </>
  );
}
