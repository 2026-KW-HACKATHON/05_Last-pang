// ===== 라스트팡 디자인 토큰 (Figma/HTML 목업과 동일한 값) =====

export const colors = {
  bg: "#FCF9F8",
  surface: "#FFFFFF",
  surface2: "#FBF3EC",
  border: "#F0E2D6",
  text: "#3A2A1E",
  textSoft: "#8B6F5C",
  textFaint: "#B9A48F",
  accent1: "#E8492A",
  accent2: "#F5941F",
  success: "#3E9B5C",
  successBg: "#E9F6EC",
  danger: "#E24C4C",
  dangerBg: "#FCEAEA",
  white: "#FFF8F2",
};

export const gradient = [colors.accent1, colors.accent2]; // 135deg 그라데이션 (start, end)

export const radius = {
  card: 18,
  cardSm: 14,
  pill: 999,
  input: 12,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const shadow = {
  card: {
    shadowColor: "#3A2A1C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  button: {
    shadowColor: colors.accent1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 5,
  },
};

export const fonts = {
  // Jua(둥근 헤드라인)와 Noto Sans KR(본문)를 프로젝트에 로드해서 쓰세요.
  // expo-font로 로드 후 이 키들을 FontFamily로 교체하면 됩니다.
  display: "Jua_400Regular",
  body: "System",
};
