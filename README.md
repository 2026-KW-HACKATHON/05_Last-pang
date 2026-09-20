# 라스트팡 (LastPang) — Expo 앱 프로젝트

광운대 인융대 해커톤 "라스트팡" 앱의 React Native(Expo) 프로젝트입니다.
디자인 캔버스(주민앱 7화면 + 사장님앱 5화면)와 팀원이 Figma/Stitch로 만든 화면 내용을 기준으로
실제로 작동하는 코드로 옮겼습니다.

## 실행 방법 (VS Code)

```bash
# 1. 패키지 설치
npm install

# 2. 개발 서버 실행
npx expo start
```

터미널에 QR 코드가 뜨면:
- 휴대폰에 **Expo Go** 앱 설치 → QR 스캔 → 바로 내 폰에서 앱 실행
- 코드를 저장하면 폰 화면이 자동으로 갱신됩니다 (핫 리로드)

시뮬레이터로 보고 싶다면:
```bash
npx expo start --ios      # Mac + Xcode 필요
npx expo start --android  # Android Studio 필요
npx expo start --web      # 브라우저로 바로 확인
```

## 폴더 구조

```
App.js                        앱 진입점
src/
  theme/index.js              색상·간격·라운드·그림자 디자인 토큰
  components/                 공용 컴포넌트 (버튼, 카드, 헤더 등)
  navigation/
    RootNavigator.js          전체 화면 흐름 (주민앱 ↔ 사장님앱)
    ResidentTabs.js           주민앱 하단 탭 (홈 / 마이페이지)
    MerchantTabs.js           사장님앱 하단 탭 (홈/딜등록/코드검증/성과리포트)
  screens/
    resident/                 주민앱 7화면
    merchant/                 사장님앱 5화면
assets/mascot/                동네냠냠 마스코트 이미지
.github/workflows/
  ci.yml                      PR/푸시 시 자동 린트 검사
  eas-build.yml                main 머지 시 자동 빌드 (선택, 아래 참고)
eas.json                      EAS 빌드 설정
```

## 화면 흐름

**주민앱**: RoleSelect → Onboarding → Login(전화인증) → Setup(선호설정) →
Home(홈 탭) → DealDetail → CodeReceived / MyPage(탭)

**사장님앱**: RoleSelect → MerchantOnboarding(매장등록/승인대기) →
MerchantHome / MerchantDealCreate / MerchantVerify / MerchantReport (4개 탭)

첫 화면(RoleSelect)은 데모/발표용으로 넣은 화면이라, 실제 서비스에서는
로그인 성공 시 사용자 타입(주민/사장님)에 따라 자동 분기하도록 바꾸면 됩니다.

## 실제 배포하기

### 데모 (해커톤 발표용, 가장 빠름)
`npx expo start` → Expo Go 앱으로 QR 스캔. 설치 없이 바로 실기기 데모 가능합니다.

### 진짜 설치파일 만들기 (EAS Build)
1. https://expo.dev 계정 생성
2. `npm install -g eas-cli` → `eas login`
3. `eas build --platform android --profile preview` 실행하면 실제 .apk 파일이 나옵니다
4. GitHub Actions로 자동화하려면 `.github/workflows/eas-build.yml` 참고 (Expo 토큰을
   GitHub repo Settings → Secrets → `EXPO_TOKEN`으로 등록해야 함)

## 다음에 할 일 (TODO)

- 실제 백엔드 연동 (전화번호 인증, 딜 등록/조회, 코드 발급/검증 API)
- 지도 SDK 연동 (현재는 시각적 목업 상태)
- 실시간 푸시 알림 (Expo Notifications)
- 폰트: 현재 시스템 폰트 사용 중 — Jua/Noto Sans KR을 `expo-font`로 로드하면
  디자인 목업과 완전히 동일한 타이포그래피가 됩니다
