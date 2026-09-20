import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Screen } from "../../components/Screen";
import { MerchantHeader } from "../../components/MerchantHeader";
import { Card, Pill, BadgeSoft, BadgeDeal, ProgressBar } from "../../components/Basics";
import { PrimaryButton } from "../../components/Button";
import { colors } from "../../theme";

export default function MerchantReportScreen() {
  return (
    <Screen>
      <MerchantHeader />

      <View style={styles.rowBetween}>
        <Text style={styles.periodText}>월계1동 골목상생 정밀분석 · 2025년 5월 2주차</Text>
        <Pill label="기간 변경 ˅" />
      </View>

      <View style={styles.greetCard}>
        <Image source={require("../../../assets/mascot/cheer.png")} style={{ width: 52, height: 52 }} resizeMode="contain" />
        <View style={{ flex: 1 }}>
          <Text style={styles.greetTitle}>주간 회복 대성공!</Text>
          <Text style={styles.greetSub}>사장님, 이번 주 한산했던 오후 2~5시가 북적였어요!</Text>
          <Text style={styles.greetStat}>38명 방문 · +24% ↑</Text>
          <Text style={styles.greetMeta}>광운분식 월계점 매장 기준 · 지난주 대비 +8팀 더 착석</Text>
        </View>
      </View>

      <View>
        <Text style={styles.sectionTitle}>📊 월계1동 골목 핵심 성과 <Text style={{ color: colors.textFaint, fontWeight: "600" }}>· 지표 F-30·L-01·F-29</Text></Text>

        <Card style={{ padding: 14, marginBottom: 8 }}>
          <Text style={styles.metricTag}>지표① F-30 · 신규 발견률</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.metricBig}>68%</Text>
            <Text style={styles.metricNote}>매장 최초 인지 고객</Text>
          </View>
          <ProgressBar percent={68} />
          <Text style={styles.insightText}>💡 성과 요약: 방문 손님 10명 중 7명은 우리 가게를 처음 알게 된 손님이에요! 월계로 대로변까지 소문이 닿았어요.</Text>
        </Card>

        <Card style={{ padding: 14, marginBottom: 8 }}>
          <Text style={styles.metricTag}>지표② L-01·L-02 · 철길·하천 횡단 유도</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.metricBig}>14건 성공</Text>
            <Text style={styles.metricNote}>단절 장벽 극복</Text>
          </View>
          <View style={styles.funnelRow}>
            <BadgeSoft label="월계역 건너편 · 1호선 서측" />
            <Text>→</Text>
            <BadgeSoft label="굴다리 통과 14팀" />
            <Text>→</Text>
            <BadgeDeal label="광운분식 본점" />
          </View>
          <Text style={styles.insightText}>🌉 동네 연결: 평소 공사와 1호선 철길로 단절되었던 월계역 건너편 주민이 지도 안내를 보고 직접 굴다리를 건너 찾아왔어요!</Text>
        </Card>

        <Card style={{ padding: 14 }}>
          <Text style={styles.metricTag}>지표③ F-29 · 한산시간 회복률</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.metricBig}>+42%</Text>
            <Text style={styles.metricNote}>공실 제로 달성 · 오후 2~5시 기준</Text>
          </View>
          <View style={styles.beforeAfterRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.baLabel}>이전 평균 착석</Text>
              <Text style={styles.baValue}>2.0 테이블</Text>
              <Text style={styles.baNote}>유휴 시간 손실</Text>
            </View>
            <Text style={{ color: colors.textFaint }}>→</Text>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={styles.baLabel}>회복 후 착석</Text>
              <Text style={[styles.baValue, { color: colors.accent1 }]}>평균 6.8 테이블</Text>
              <Text style={styles.baNoteAccent}>회전율 3.4배</Text>
            </View>
          </View>
          <Text style={styles.insightText}>✨ 시간대 가치: 기존 오후 2~5시 텅 빈 2테이블 회복으로 평균 6.8테이블 회전. 알짜 매출 시간대로 전환되었습니다.</Text>
        </Card>
      </View>

      <View>
        <Text style={styles.sectionTitle}>정밀 고객 분석 · 방문 고객 구성비 <Text style={{ color: colors.textFaint, fontWeight: "600" }}>· 총 38명</Text></Text>
        <Card style={styles.donutCard}>
          <View style={styles.donutRing}>
            <View style={styles.donutInner}>
              <Text style={styles.donutValue}>65%</Text>
              <Text style={styles.donutLabel}>신규 비중</Text>
            </View>
          </View>
          <View style={{ gap: 8 }}>
            <View style={styles.legendRow}><View style={[styles.dot, { backgroundColor: colors.accent1 }]} /><Text style={styles.legendText}>신규 고객 25명 (65%)</Text></View>
            <View style={styles.legendRow}><View style={[styles.dot, { backgroundColor: colors.text }]} /><Text style={styles.legendText}>단골 재방문 13명 (35%)</Text></View>
          </View>
        </Card>
        <Text style={styles.insightText}>월계 상권 분석: 이번 주엔 광운대 공강 학생 16명과 월계1동 동네 주민 22명이 이 골목을 채웠어요!</Text>
      </View>

      <Card style={styles.tipCard}>
        <Image source={require("../../../assets/mascot/wave.png")} style={{ width: 40, height: 40 }} resizeMode="contain" />
        <View style={{ flex: 1 }}>
          <Text style={styles.tipTag}>F-31 골목 AI 어드바이저</Text>
          <Text style={styles.tipTitle}>냠냠이의 맞춤 골목 코칭</Text>
          <Text style={styles.tipText}>
            화요일 오후 3시는 광운대 공강 학생 유입 골든타임! 다음 주 화요일에도 꼭{" "}
            <Text style={{ color: colors.text, fontWeight: "800" }}>오후 2시 40분에 즉시 딜</Text>을 열어보세요. 착석률을 극대화할 수 있습니다.
          </Text>
        </View>
      </Card>

      <Card style={{ padding: 14 }}>
        <View style={styles.rowBetween}>
          <Text style={styles.metricTag}>지표 F-23 · 투명 정산</Text>
          <Text style={styles.feeTag}>수수료 0%</Text>
        </View>
        <Text style={styles.settleHeadline}>상생 플랫폼 수수료 0원 정산</Text>
        <View style={styles.rowBetween}><Text style={styles.settleLabel}>타 배달/중개 플랫폼 예상 수수료</Text><Text style={styles.settleValue}>약 42,000원</Text></View>
        <View style={[styles.rowBetween, { marginTop: 8 }]}><Text style={styles.settleLabelBold}>라스트팡 사장님 공제액</Text><Text style={styles.settleValueAccent}>0원</Text></View>
        <Text style={styles.settleNote}>라스트팡은 사장님의 매출을 전액 그대로 정산해 드립니다.</Text>
      </Card>

      <Card style={{ padding: 14 }}>
        <Text style={styles.reviewTitle}>⭐ 실제 방문 손님의 따뜻한 한마디</Text>
        <Text style={styles.reviewBody}>"역 건너편에서 딜 보고 왔는데 떡볶이 국물이 진짜 진하고 맛있어요! 화요일 공강 때마다 올게요 사장님!"</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.reviewMeta}>광운대 컴공 23학번 박*우 님</Text>
          <Text style={styles.reviewMeta}>화요일 15:20 인증 완료</Text>
        </View>
      </Card>

      <PrimaryButton title="📅 다음 주 한산딜 미리 예약하기" />
      <View style={styles.rowBetween}>
        <Text style={styles.footLink}>♥ 단골 주민 13명 관리</Text>
        <Text style={styles.footLink}>🏆 성과 카드 자랑하기</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  periodText: { fontSize: 13, fontWeight: "800", color: colors.text },
  greetCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#FFF3EA", borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 16 },
  greetTitle: { fontSize: 13, fontWeight: "800" },
  greetSub: { fontSize: 11.5, color: colors.textSoft, fontWeight: "600", marginTop: 2, lineHeight: 16 },
  greetStat: { fontSize: 12, fontWeight: "800", color: colors.accent1, marginTop: 4 },
  greetMeta: { fontSize: 10.5, color: colors.textFaint, fontWeight: "600", marginTop: 4 },
  sectionTitle: { fontSize: 13.5, fontWeight: "800", color: colors.text, marginBottom: 8 },
  metricTag: { fontSize: 11, color: colors.textFaint, fontWeight: "700", marginBottom: 4 },
  metricBig: { fontSize: 22, fontWeight: "800", color: colors.accent1 },
  metricRow: { flexDirection: "row", gap: 8 },
  metricCard: { flex: 1, padding: 12, gap: 4 },
  metricLabel: { fontSize: 10.5, color: colors.textFaint, fontWeight: "700" },
  metricValue: { fontSize: 19, fontWeight: "800", color: colors.accent1 },
  metricNote: { fontSize: 9.5, color: colors.textFaint, fontWeight: "700" },
  insightText: { fontSize: 11.5, color: colors.textSoft, fontWeight: "600", lineHeight: 17, marginTop: 8 },
  beforeAfterRow: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 8 },
  baLabel: { fontSize: 10.5, color: colors.textFaint, fontWeight: "700" },
  baValue: { fontSize: 15, fontWeight: "800", color: colors.text, marginTop: 2 },
  baNote: { fontSize: 9.5, color: colors.textFaint, fontWeight: "600" },
  baNoteAccent: { fontSize: 9.5, color: colors.accent1, fontWeight: "700" },
  funnelTitle: { fontSize: 12, fontWeight: "800", marginBottom: 6 },
  funnelRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 6 },
  donutCard: { padding: 16, flexDirection: "row", alignItems: "center", gap: 14 },
  donutRing: { width: 88, height: 88, borderRadius: 999, backgroundColor: colors.accent1, alignItems: "center", justifyContent: "center" },
  donutInner: { width: 66, height: 66, borderRadius: 999, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  donutValue: { fontSize: 15, fontWeight: "800", color: colors.accent1 },
  donutLabel: { fontSize: 8.5, color: colors.textFaint, fontWeight: "700" },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 999 },
  legendText: { fontSize: 11.5, fontWeight: "700" },
  tipCard: { flexDirection: "row", gap: 12, padding: 14, alignItems: "flex-start" },
  tipTag: { fontSize: 10.5, color: colors.textFaint, fontWeight: "700" },
  tipTitle: { fontSize: 15, fontWeight: "800", color: colors.text, marginTop: 2, marginBottom: 4 },
  tipText: { fontSize: 12, color: colors.textSoft, fontWeight: "600", lineHeight: 18 },
  feeTag: { fontSize: 11, color: colors.accent1, fontWeight: "800" },
  settleHeadline: { fontSize: 15, fontWeight: "800", color: colors.text, marginBottom: 8 },
  settleLabel: { fontSize: 12.5, fontWeight: "700", color: colors.textSoft },
  settleValue: { fontSize: 12.5, fontWeight: "700" },
  settleLabelBold: { fontSize: 12.5, fontWeight: "800" },
  settleValueAccent: { fontSize: 12.5, fontWeight: "800", color: colors.accent1 },
  settleNote: { fontSize: 10.5, color: colors.textFaint, fontWeight: "600", marginTop: 6 },
  reviewTitle: { fontSize: 11.5, fontWeight: "800", marginBottom: 6 },
  reviewBody: { fontSize: 12, color: colors.textSoft, fontWeight: "600", lineHeight: 18 },
  reviewMeta: { fontSize: 10, color: colors.textFaint, fontWeight: "600", marginTop: 6 },
  footLink: { fontSize: 11, color: colors.textFaint, fontWeight: "700" },
});
