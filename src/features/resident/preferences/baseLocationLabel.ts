// 기준 위치 이름(예: "월계동 광운로")은 DB에 없어서 이 기기에만 기억한다. 없으면 "설정한 위치"로 보여준다
const STORAGE_KEY = 'dnnn.baseLocationLabel';

export function readBaseLocationLabel(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveBaseLocationLabel(label: string): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, label);
  } catch {
    // 저장소를 못 쓰면 이름만 빠진다
  }
}
