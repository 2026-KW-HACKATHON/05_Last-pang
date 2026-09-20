import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Screen } from "../../components/Screen";
import { MerchantHeader } from "../../components/MerchantHeader";
import { Card, Pill, BadgeSoft } from "../../components/Basics";
import { PrimaryButton } from "../../components/Button";
import { colors, radius } from "../../theme";

export default function MerchantDealCreateScreen() {
  const [tab, setTab] = useState("flash");

  return (
    <Screen>
      <MerchantHeader />

      <View style={styles.tabRow}>
        <Pressable style={[styles.tab, tab === "flash" && styles.tabActive]} onPress={() => setTab("flash")}>
          <Text style={[styles.tabText, tab === "flash" && styles.tabTextActive]}>⚡ 지금 즉시 딜 (Flash)</Text>
        </Pressable>
        <Pressable style={[styles.tab, tab === "recur" && styles.tabActive]} onPress={() => setTab("recur")}>
          <Text style={[styles.tabText, tab === "recur" && styles.tabTextActive]}>📅 요일 반복 예약딜</Text>
        </Pressable>
      </View>

      <Card style={styles.introCard}>
        <View style={{ flex: 1 }}>
          <BadgeSoft label="⚡ 30초 번개 딜 발행" />
          <Text style={styles.introTitle}>언제 한산하신가요?{"\n"}30초면 등록 완료!</Text>
          <Text style={styles.introSub}>남는 테이블과 재료를 지금 바로 걸어올 수 있는 동네 단골로 채워요</Text>
        </View>
        <Image source={require("../../../assets/mascot/cheer.png")} style={{ width: 76, height: 76 }} resizeMode="contain" />
      </Card>

      <View>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>📍 월계1동 실시간 보행 수요</Text>
          <BadgeSoft label="반경 700m 이내" />
        </View>
        <Card style={styles.demandCard}>
          <View style={styles.gauge}>
            <Text style={styles.gaugeLabel}>광운대 캠퍼스권역</Text>
            <Text style={styles.gaugeValue}>철길·공사{"\n"}우회 반영됨</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.demandLabel}>현재 비는 시간 대기 주민{"\n"}월계1동 도보 10분 이내 활성 유저</Text>
            <Text style={styles.demandValue}>23명</Text>
          </View>
        </Card>
      </View>

      <Text style={styles.notice}>철길 및 공사 가림막을 피해 실제로 걸어올 수 있는 도보권 주민에게만 똑똑하게 자동 매칭됩니다.</Text>

      <View>
        <Text style={styles.sectionTitle}>30초 간편 설정 <Text style={{ color: colors.textFaint, fontWeight: "600" }}>· 빠른 템플릿 적용중</Text></Text>
        <Text style={styles.stepLabel}>① 업종 맞춤 추천 템플릿</Text>
        <View style={styles.rowGap}>
          <Pressable style={[styles.templateTile, styles.templateActive]}><Text style={{ fontSize: 18 }}>🔥</Text><Text style={styles.templateText}>대표메뉴 할인</Text></Pressable>
          <View style={styles.templateTile}><Text style={{ fontSize: 18 }}>☕</Text><Text style={styles.templateText}>음료 증정</Text></View>
          <View style={styles.templateTile}><Text style={{ fontSize: 18 }}>🍱</Text><Text style={styles.templateText}>세트 1+1</Text></View>
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <Text style={styles.stepLabel}>② 딜 상품명 및 혜택</Text>
        <View style={styles.input}><Text style={styles.inputBig}>떡볶이 1인분 3,000원 (정가 4,500원)</Text></View>

        <Text style={styles.stepLabel}>③ 진행 시간 선택</Text>
        <View style={styles.rowGap}>
          <Pill label="1시간" />
          <Pill label="2시간 (추천)" active />
          <Pill label="3시간" />
        </View>

        <Text style={styles.stepLabel}>④ 준비 수량 (남는 재료 / 여유 테이블)</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.qtyValue}>6 개 / 팀</Text>
        </View>
        <View style={styles.sliderTrack}><View style={styles.sliderFill} /></View>
        <View style={styles.rowBetween}>
          <Text style={styles.sliderEdge}>1개 (최소)</Text>
          <Text style={styles.sliderEdge}>8개</Text>
          <Text style={styles.sliderEdge}>15개 (최대)</Text>
        </View>
        <Text style={styles.noshowNote}>🛡️ 노쇼 방지 시스템: 손님이 15분 내 매장에 미도착 시 발급 코드가 자동 취소되고 준비 수량이 실시간으로 복구됩니다.</Text>
      </View>

      <Card style={styles.matchCard}>
        <Text style={styles.matchTitle}>발행 시 예상 매칭 효과</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.matchLabel}>예상 안심 푸시 대상</Text>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.matchValue}>9명</Text>
            <Text style={styles.matchNote}>1.5배 안전 추천</Text>
          </View>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.matchLabel}>실시간 집중 타깃</Text>
          <Text style={styles.matchTarget}>광운대 공강생 & 등원 후 학부모</Text>
        </View>
        <View style={styles.previewBox}>
          <View style={styles.rowBetween}>
            <View style={styles.rowGapSm}><View style={styles.dotAccent} /><Text style={styles.previewLabel}>라스트팡 고객용 알림 미리보기</Text></View>
            <Text style={styles.previewNote}>지금 즉시 전송</Text>
          </View>
          <Text style={styles.previewBody}>"[광운분식] 사장님이 번개 딜을 켰어요! 떡볶이 3,000원 선착순 6팀 한정 (도보 7분)"</Text>
        </View>
      </Card>

      <View style={{ gap: 8 }}>
        <PrimaryButton title="⚡ 한산 딜 발행하기 (수수료 0원)" />
        <Text style={styles.footNote}>지역 소상공인 상생 프로그램으로 중개 수수료가 100% 무료입니다.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabRow: { flexDirection: "row", gap: 8 },
  tab: { flex: 1, alignItems: "center", paddingVertical: 11, borderRadius: radius.cardSm, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  tabActive: { backgroundColor: colors.accent1, borderColor: "transparent" },
  tabText: { fontSize: 13, fontWeight: "800", color: colors.textSoft },
  tabTextActive: { color: colors.white },
  introCard: { padding: 16, flexDirection: "row", gap: 12, alignItems: "center" },
  introTitle: { fontSize: 15, fontWeight: "800", lineHeight: 21, marginTop: 8 },
  introSub: { fontSize: 11.5, color: colors.textSoft, fontWeight: "600", marginTop: 6, lineHeight: 17 },
  sectionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  sectionTitle: { fontSize: 13.5, fontWeight: "800", color: colors.text },
  demandCard: { padding: 16, flexDirection: "row", alignItems: "center", gap: 14 },
  gauge: { width: 88, height: 88, borderRadius: 999, backgroundColor: colors.surface2, alignItems: "center", justifyContent: "center" },
  gaugeLabel: { fontSize: 9, color: colors.textFaint, fontWeight: "700", textAlign: "center" },
  gaugeValue: { fontSize: 10.5, fontWeight: "800", color: colors.text, marginTop: 3, textAlign: "center", lineHeight: 14 },
  demandLabel: { fontSize: 11, color: colors.textSoft, fontWeight: "700", lineHeight: 16 },
  demandValue: { fontSize: 30, fontWeight: "800", color: colors.accent1, marginTop: 4 },
  notice: { fontSize: 11.5, color: colors.textSoft, fontWeight: "600", lineHeight: 17 },
  input: { backgroundColor: colors.surface2, borderRadius: radius.input, paddingVertical: 14, paddingHorizontal: 16 },
  inputBig: { fontSize: 15, fontWeight: "800", color: colors.text },
  inputText: { fontSize: 14, fontWeight: "700", color: colors.text },
  rowGap: { flexDirection: "row", gap: 10 },
  rowGapSm: { flexDirection: "row", alignItems: "center", gap: 5 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  stepLabel: { fontSize: 12.5, fontWeight: "800", color: colors.textSoft, marginTop: 10, marginBottom: 8 },
  templateTile: { flex: 1, alignItems: "center", gap: 4, paddingVertical: 12, borderRadius: radius.cardSm, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  templateActive: { borderColor: colors.accent1, backgroundColor: colors.surface2 },
  templateText: { fontSize: 11.5, fontWeight: "700", color: colors.text },
  qtyValue: { fontSize: 19, fontWeight: "800", color: colors.text },
  sliderTrack: { height: 8, borderRadius: 999, backgroundColor: colors.surface2, marginTop: 2 },
  sliderFill: { width: "38%", height: 8, borderRadius: 999, backgroundColor: colors.accent1 },
  sliderEdge: { fontSize: 10.5, color: colors.textFaint, fontWeight: "600" },
  noshowNote: { fontSize: 11, color: colors.textSoft, fontWeight: "600", lineHeight: 17, marginTop: 4 },
  matchCard: { padding: 16, gap: 12 },
  matchTitle: { fontSize: 14.5, fontWeight: "800", color: colors.text },
  matchLabel: { fontSize: 12.5, color: colors.textSoft, fontWeight: "600" },
  matchValue: { fontSize: 17, fontWeight: "800", color: colors.text },
  matchNote: { fontSize: 10.5, color: colors.textFaint, fontWeight: "600" },
  matchTarget: { fontSize: 12.5, fontWeight: "700", color: colors.text },
  previewBox: { backgroundColor: colors.surface2, borderRadius: radius.input, padding: 12, gap: 6 },
  dotAccent: { width: 6, height: 6, borderRadius: 999, backgroundColor: colors.accent1 },
  previewLabel: { fontSize: 11, fontWeight: "700", color: colors.text },
  previewNote: { fontSize: 10.5, color: colors.textFaint, fontWeight: "600" },
  previewBody: { fontSize: 12, color: colors.textSoft, fontWeight: "600", lineHeight: 17 },
  footNote: { textAlign: "center", fontSize: 10.5, color: colors.textFaint, fontWeight: "600" },
});
