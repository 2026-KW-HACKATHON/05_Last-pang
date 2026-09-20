import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Screen } from "../../components/Screen";
import { MerchantHeader } from "../../components/MerchantHeader";
import { Card, BadgeDeal, ProgressBar } from "../../components/Basics";
import { PrimaryButton } from "../../components/Button";
import { colors, radius } from "../../theme";

function StatMini({ val, lbl, sub }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statVal}>{val}</Text>
      <Text style={styles.statLbl}>{lbl}</Text>
      <Text style={styles.statSub}>{sub}</Text>
    </View>
  );
}

function LinkRow({ icon, title, meta }) {
  return (
    <View style={styles.linkRow}>
      <View style={styles.linkIcon}><Text style={{ fontSize: 14 }}>{icon}</Text></View>
      <Text style={styles.linkTitle}>{title}</Text>
      {meta ? <Text style={styles.linkMeta}>{meta}</Text> : null}
      <Text style={styles.arrow}>›</Text>
    </View>
  );
}

export default function MerchantHomeScreen({ navigation }) {
  return (
    <Screen>
      <MerchantHeader />

      <View style={styles.statusRow}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>오후 2:30 화요일 · 한산 주의보</Text>
      </View>

      <View style={styles.greetCard}>
        <Image source={require("../../../assets/mascot/phone.png")} style={{ width: 56, height: 56 }} resizeMode="contain" />
        <View style={{ flex: 1 }}>
          <Text style={styles.greetTitle}>광운분식 박성호 사장님,{"\n"}오늘도 든든한 하루 되세요!</Text>
          <Text style={styles.greetSub}>지금은 평소 손님이 뜸한 한산 시간대예요.</Text>
        </View>
      </View>

      <View style={styles.rowBetween}>
        <View style={styles.tagRow}>
          <Text style={{ fontSize: 12 }}>📡</Text>
          <Text style={styles.tagText}>실시간 동네 감지</Text>
        </View>
        <Text style={styles.tagMuted}>안심 익명 집계</Text>
      </View>

      <Card style={styles.flashCard}>
        <Text style={styles.flashTitle}>손님이 뜸하신가요?{"\n"}2시간 즉시 딜로 자리 채우기!</Text>
        <Text style={styles.flashSub}>주변 골목 배회 주민들에게 지금 즉시 알림이 발송됩니다.</Text>
        <Text style={styles.tip}>📍 현재 월계1동 반경 700m 내 자유시간 주민 <Text style={{ color: colors.accent1, fontWeight: "800" }}>28명</Text></Text>
        <PrimaryButton title="⚡ '지금 2시간 즉시 딜' 바로 켜기" onPress={() => navigation.navigate("MerchantDealCreate")} />
        <Text style={styles.flashFoot}>중개 수수료 0원! 우리 동네 따뜻한 단골 만들기 캠페인</Text>
      </Card>

      <View>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>🔥 실시간 진행 중인 딜</Text>
          <BadgeDeal label="종료까지 45분" />
        </View>
        <Card style={styles.dealCard}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.dealName}>떡볶이 1인분 + 바삭 튀김 세트</Text>
              <Text style={styles.dealMeta}>정가 5,000원 · 40% 한산할인</Text>
            </View>
            <Text style={styles.dealPrice}>3,000원</Text>
          </View>
          <ProgressBar percent={60} />
          <View style={styles.rowBetween}>
            <Text style={styles.progressLabel}>판매 현황 (60%)</Text>
            <Text style={styles.progressLabel}>남은 수량 4 / 10개</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.progressNote}>6개 예약 및 소진 완료</Text>
            <Text style={styles.progressNote}>최대 10개 한정</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.proofRow}>
            <Text style={{ fontSize: 13 }}>💬</Text>
            <Text style={styles.proofText}>인덕대 인근 주민 1명이 코드를 발급했어요 <Text style={{ color: colors.textFaint }}>(도보 5분 거리, 1분 전)</Text></Text>
          </View>
        </Card>
      </View>

      <View>
        <Text style={styles.sectionTitle}>🏆 오늘의 한산 극복 성과</Text>
        <View style={styles.statsRow}>
          <StatMini val="7건" lbl="한산시간 방문" sub="+4건 회복" />
          <StatMini val="4건" lbl="철길횡단·신규" sub="골목 첫 방문" />
          <StatMini val="2.8만원" lbl="회복된 매출" sub="순수 추가수익" />
        </View>
      </View>

      <Card style={{ paddingHorizontal: 16 }}>
        <LinkRow icon="🔢" title="손님 방문 코드 검증기 열기" />
        <View style={styles.divider} />
        <LinkRow icon="🗓️" title="정기 한산딜 시간표 설정" />
        <View style={styles.divider} />
        <LinkRow icon="❤️" title="우리 매장 단골 관리함" meta="34명" />
      </Card>

      <Text style={styles.footTip}>📍 광운대 인근 대학생 공강 시간표(14:00~16:00)와 맞물려 유입 반응이 가장 높습니다.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 999, backgroundColor: colors.accent2 },
  statusText: { fontSize: 12, color: colors.textSoft, fontWeight: "700" },
  tagRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  tagText: { fontSize: 12, fontWeight: "800", color: colors.text },
  tagMuted: { fontSize: 12, fontWeight: "600", color: colors.textFaint },
  progressNote: { fontSize: 10.5, color: colors.textFaint, fontWeight: "500" },
  proofRow: { flexDirection: "row", alignItems: "flex-start", gap: 6 },
  proofText: { flex: 1, fontSize: 11.5, color: colors.textSoft, fontWeight: "600", lineHeight: 16 },
  greetCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#FFF3EA", borderWidth: 1, borderColor: colors.border, borderRadius: radius.card, padding: 16 },
  greetTitle: { fontSize: 13.5, fontWeight: "800", color: colors.text, lineHeight: 19 },
  greetSub: { fontSize: 11, color: colors.textSoft, fontWeight: "600", marginTop: 3 },
  flashCard: { padding: 16, gap: 10 },
  flashTitle: { fontSize: 14.5, fontWeight: "800", lineHeight: 20 },
  flashSub: { fontSize: 11.5, color: colors.textSoft, fontWeight: "600", lineHeight: 17 },
  tip: { fontSize: 11, color: colors.textSoft, fontWeight: "600" },
  flashFoot: { textAlign: "center", fontSize: 10.5, color: colors.textFaint, fontWeight: "600" },
  sectionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  sectionTitle: { fontSize: 13.5, fontWeight: "800", color: colors.text },
  dealCard: { padding: 14, gap: 10 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dealName: { fontSize: 13.5, fontWeight: "800" },
  dealMeta: { fontSize: 11.5, color: colors.textSoft, fontWeight: "600", marginTop: 2 },
  dealPrice: { fontSize: 17, fontWeight: "800", color: colors.accent1 },
  progressLabel: { fontSize: 10.5, color: colors.textFaint, fontWeight: "700" },
  statsRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  stat: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.cardSm, paddingVertical: 12, alignItems: "center", gap: 3 },
  statVal: { fontSize: 17, fontWeight: "900", color: colors.text },
  statLbl: { fontSize: 10.5, color: colors.textSoft, fontWeight: "700" },
  statSub: { fontSize: 9.5, color: colors.accent1, fontWeight: "800" },
  linkRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 13 },
  linkIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.surface2, alignItems: "center", justifyContent: "center" },
  linkTitle: { flex: 1, fontSize: 13, fontWeight: "800", color: colors.text },
  linkMeta: { fontSize: 11, color: colors.textFaint, fontWeight: "700" },
  arrow: { color: colors.textFaint, fontSize: 14 },
  divider: { height: 1, backgroundColor: colors.border },
  footTip: { fontSize: 11, color: colors.textSoft, fontWeight: "600", lineHeight: 17 },
});
