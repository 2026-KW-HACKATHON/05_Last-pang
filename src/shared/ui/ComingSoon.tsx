// 3-4 app-shell이 만드는 빈 페이지가 쓰는 임시 화면. 각 기능 브랜치가 페이지 내용을 채우면 사라진다
interface ComingSoonProps {
  title: string;
}

export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <main className="p-8 text-center">
      <h1 className="text-lg font-bold">{title}</h1>
      <p className="mt-2 text-muted">준비 중이에요</p>
    </main>
  );
}
