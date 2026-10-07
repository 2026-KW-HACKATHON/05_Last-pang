// 내 정보(/me)로 돌아갈 때 토스트 문구를 navigation state로 넘기는 약속
export interface MyInfoLocationState {
  toast?: string;
}

export const SAVED_TOAST = '저장했어요';

/** navigate('/me', myInfoNavigateOptions()) — 수정 화면을 기록에서 지우고 토스트를 띄운다 */
export function myInfoNavigateOptions(toast: string = SAVED_TOAST) {
  const state: MyInfoLocationState = { toast };
  return { replace: true, state };
}
