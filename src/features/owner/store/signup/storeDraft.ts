import type { Category } from '@/shared/constants/domain';

/** 가게 등록 3단계 동안 들고 다니는 입력값 (뒤로 가도 지워지지 않게 페이지가 가진다) */
export interface StoreDraft {
  name: string;
  category: Category;
  address: string; // 검색으로 고른 도로명 주소
  addressDetail: string; // 1층 같은 상세 주소
  lat: number;
  lng: number;
  representativeName: string;
  businessNo: string; // 화면 표시용 123-45-67890
  phone: string;
  licenseFile: File | null;
  licensePath: string | null; // 이미 올린 사진 (재신청이면 비워 두면 기존 사진 유지)
}

export const EMPTY_STORE_DRAFT: StoreDraft = {
  name: '',
  category: 'meal',
  address: '',
  addressDetail: '',
  lat: 0,
  lng: 0,
  representativeName: '',
  businessNo: '',
  phone: '',
  licenseFile: null,
  licensePath: null,
};

/** 서버에 보낼 전체 주소: "서울 노원구 광운로 12, 1층" */
export const fullAddress = (draft: StoreDraft) =>
  draft.addressDetail.trim() ? `${draft.address}, ${draft.addressDetail.trim()}` : draft.address;
