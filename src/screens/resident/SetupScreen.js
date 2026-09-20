import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Screen } from "../../components/Screen";
import { Card, Pill, BadgeSoft } from "../../components/Basics";
import { PrimaryButton } from "../../components/Button";
import { colors, radius } from "../../theme";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const TIMES = ["점심 12–14시", "오후 14–17시", "저녁 18–20시"];
const CATS = [
  { key: "cafe", label: "카페", emoji: "☕️" },
  { key: "snack", label: "분식", emoji: "🍢" },
  { key: "korean", label: "한식", emoji: "🍚" },
  { key: "bakery", label: "베이커리", emoji: "🥐" },
  { key: "etc", label: "기타", emoji: "🧺" },
];

export default function SetupScreen({ navigation }) {
  const [activeDays, setActiveDays] = useState(["월", "화", "목"]);
  const [activeTimes, setActiveTimes] = useState(["점심 12–14시", "저녁 18–20시"]);
  const [activeCats, setActiveCats] = useState(["cafe", "korean"]);
  const [radiusM, setRadiusM] = useState(800);

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  return (
    <Screen>
      <View style={styles.headerRow}>
        <Text style={styles.step}>2 / 3</Text>
        <Text style={styles.skip}>건너뛰기</Text>
      </View>

      <View style={styles.progressRow}>
        <View style={[styles.progressSeg, { backgroundColor: colors.textFaint, opacity: 0.3 }]} />
        <View style={[styles.progressSeg, { backgroundColor: colors.accent1 }]} />
        <View style={[styles.progressSeg, { backgroundColor: colors.border }]} />
      </View>

      <Text style={styles.title}>언제, 뭘 좋아하는지{"\n"}알려주세요</Text>
      <Text style={styles.sub}>설정한 시간에 딱 맞는 특가만 알림 드려요</Text>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>✏️ 비어있는 시간</Text>
        <View style={styles.dayRow}>
          {DAYS.map((d) => (
            <Pressable key={d} onPress={() => toggle(activeDays, setActiveDays, d)}
              style={[styles.dayPill, activeDays.includes(d) && styles.dayPillActive]}>
              <Text style={[styles.dayText, activeDays.includes(d) && styles.dayTextActive]}>{d}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.wrapRow}>
          {TIMES.map((t) => (
            <Pressable key={t} onPress={() => toggle(activeTimes, setActiveTimes, t)}>
              <Pill label={t} active={activeTimes.includes(t)} />
            </Pressable>
          ))}
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>🍽️ 관심 카테고리 <Text style={styles.hint}>(1개 이상)</Text></Text>
        <View style={styles.catGrid}>
          {CATS.map((c) => {
            const active = activeCats.includes(c.key);
            return (
              <Pressable key={c.key} onPress={() => toggle(activeCats, setActiveCats, c.key)}
                style={[styles.catTile, active && styles.catTileActive]}>
                <Text style={{ fontSize: 22 }}>{c.emoji}</Text>
                <Text style={styles.catLabel}>{c.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>📍 우리 동네 반경</Text>
          <BadgeSoft label={`반경 ${radiusM}m`} />
        </View>
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: "38%" }]} />
          <View style={[styles.sliderThumb, { left: "38%" }]} />
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.sliderEdge}>200m</Text>
          <Text style={styles.sliderEdge}>2km</Text>
        </View>
        <View style={styles.previewBox}>
          <Text style={styles.previewText}>지금 이 반경 안에 활성 딜 12개가 있어요</Text>
        </View>
      </Card>

      <PrimaryButton title="다음" onPress={() => navigation.reset({ index: 0, routes: [{ name: "ResidentTabs" }] })} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", paddingTop: 8 },
  step: { fontSize: 14, fontWeight: "800", color: colors.textFaint },
  skip: { fontSize: 13, fontWeight: "700", color: colors.textFaint },
  progressRow: { flexDirection: "row", gap: 6, marginTop: 10 },
  progressSeg: { height: 5, borderRadius: 999, flex: 1 },
  title: { fontSize: 21, fontWeight: "800", color: colors.text, marginTop: 8 },
  sub: { fontSize: 13, color: colors.textSoft, fontWeight: "500", marginBottom: 4 },
  card: { padding: 16, gap: 12 },
  cardTitle: { fontSize: 14, fontWeight: "800", color: colors.text },
  hint: { color: colors.textFaint, fontWeight: "600", fontSize: 12 },
  dayRow: { flexDirection: "row", justifyContent: "space-between" },
  dayPill: { width: 38, height: 38, borderRadius: 999, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  dayPillActive: { backgroundColor: colors.text, borderColor: colors.text },
  dayText: { fontSize: 13, fontWeight: "800", color: colors.textSoft },
  dayTextActive: { color: colors.white },
  wrapRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  catGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  catTile: { width: "31%", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.cardSm, paddingVertical: 14, backgroundColor: colors.surface },
  catTileActive: { borderColor: colors.accent1, backgroundColor: colors.surface2 },
  catLabel: { fontSize: 12, fontWeight: "700", color: colors.text },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sliderTrack: { height: 6, borderRadius: 999, backgroundColor: colors.border, marginVertical: 10, justifyContent: "center" },
  sliderFill: { position: "absolute", left: 0, height: 6, borderRadius: 999, backgroundColor: colors.accent1 },
  sliderThumb: { position: "absolute", width: 20, height: 20, borderRadius: 999, backgroundColor: "#fff", borderWidth: 3, borderColor: colors.accent1, marginLeft: -10 },
  sliderEdge: { fontSize: 11, color: colors.textFaint, fontWeight: "600" },
  previewBox: { backgroundColor: colors.surface2, borderRadius: radius.input, padding: 10, alignItems: "center" },
  previewText: { fontSize: 12.5, fontWeight: "700", color: colors.accent1 },
});
