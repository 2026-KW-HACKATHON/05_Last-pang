// 딜 링크 복사·공유. ?src=push 같은 기록용 값은 빼고 내보낸다
const toShareUrl = () => window.location.href.split('?')[0];

export async function copyDealLink(): Promise<void> {
  await navigator.clipboard.writeText(toShareUrl());
}

/** 공유 시트가 있으면(모바일) 시트로, 없으면 링크를 복사한다. 복사했으면 'copied' */
export async function shareDeal(title: string): Promise<'shared' | 'copied'> {
  if (navigator.share) {
    await navigator.share({ title, url: toShareUrl() }).catch(() => undefined); // 시트를 닫아도 오류가 난다
    return 'shared';
  }
  await copyDealLink();
  return 'copied';
}
