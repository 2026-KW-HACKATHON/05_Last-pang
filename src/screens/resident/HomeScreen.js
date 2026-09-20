import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Screen } from "../../components/Screen";
import { Card, Pill, BadgeDeal, BadgeSoft } from "../../components/Basics";
import { colors, radius } from "../../theme";

const FILTERS = ["전체", "☕️ 카페", "🍢 분식", "🍚 한식", "🥐 베이커리"];

const DEALS = [
  { id: "1", store: "황금밥상 한식당", item: "제육볶음 정식 1인분 · 2개 남음", price: "4,900원", orig: "7,000원", left: "마감 18분", dist: "도보 4분 · 320m", img: require("../../../assets/mascot/rice.png"), emoji: null },
  { id: "2", store: "모닝커피 광운점", item: "아메리카노 톨 · 5개 남음", price: "1,500원", orig: "3,000원", left: "마감 1시간", dist: "도보 6분 · 480m", emoji: "☕️" },
  { id: "3", store: "노원 베이커리", item: "식빵 1봉 · 1개 남음", price: "2,000원", orig: "4,500원", left: "마감 2시간", dist: "도보 9분 · 700m", emoji: "🥐" },
];

export default function HomeScreen({ navigation }) {
  return (
    <Screen>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>현재 위치</Text>
          <Text style={styles.location}>📍 월계1동 · 반경 800m</Text>
        </View>
        <View style={styles.bell}>
          <Text style={{ fontSize: 17 }}>🔔</Text>
          <View style={styles.bellDot} />
        </View>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f, i) => (
          <Pill key={f} label={f} active={i === 0} />
        ))}
      </View>

      <View style={styles.mapMock}>
        <Text style={styles.mapBadge}>지금 활성 딜 7개</Text>
        <Text style={styles.mapCta}>목록 보기</Text>
      </View>

      <Text style={styles.sectionTitle}>지금 내 시간대에 딱 맞는 딜</Text>

      {DEALS.map((d) => (
        <Pressable key={d.id} onPress={() => navigation.navigate("DealDetail", { deal: d })}>
          <Card style={styles.dealCard}>
            <View style={styles.thumb}>
              {d.img ? <Image source={d.img} style={{ width: 52, height: 52 }} resizeMode="contain" /> : <Text style={{ fontSize: 26 }}>{d.emoji}</Text>}
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <View style={styles.rowBetween}>
                <Text style={styles.storeName}>{d.store}</Text>
                {d.id === "1" ? <BadgeDeal label={d.left} /> : <BadgeSoft label={d.left} />}
              </View>
              <Text style={styles.itemText}>{d.item}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>{d.price}</Text>
                <Text style={styles.orig}>{d.orig}</Text>
                <Text style={styles.dist}>{d.dist}</Text>
              </View>
            </View>
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 6 },
  eyebrow: { fontSize: 11, color: colors.textFaint, fontWeight: "700" },
  location: { fontSize: 16, fontWeight: "800", color: colors.text },
  bell: { width: 38, height: 38, borderRadius: 999, backgroundColor: colors.surface2, alignItems: "center", justifyContent: "center" },
  bellDot: { position: "absolute", top: 6, right: 7, width: 8, height: 8, borderRadius: 999, backgroundColor: colors.accent1, borderWidth: 1.5, borderColor: colors.surface2 },
  filterRow: { flexDirection: "row", gap: 8 },
  mapMock: { height: 150, borderRadius: radius.card, backgroundColor: colors.surface2, justifyContent: "flex-end", padding: 10 },
  mapBadge: { position: "absolute", top: 10, left: 10, backgroundColor: "rgba(58,42,28,0.75)", color: colors.white, fontSize: 11, fontWeight: "700", paddingVertical: 6, paddingHorizontal: 11, borderRadius: 999, overflow: "hidden" },
  mapCta: { alignSelf: "flex-end", backgroundColor: colors.surface, fontSize: 11, fontWeight: "800", paddingVertical: 7, paddingHorizontal: 12, borderRadius: 999, overflow: "hidden" },
  sectionTitle: { fontSize: 14, fontWeight: "800", color: colors.text },
  dealCard: { flexDirection: "row", gap: 12, padding: 12 },
  thumb: { width: 64, height: 64, borderRadius: 14, backgroundColor: colors.surface2, alignItems: "center", justifyContent: "center" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  storeName: { fontSize: 13.5, fontWeight: "800", color: colors.text },
  itemText: { fontSize: 12.5, color: colors.textSoft, fontWeight: "600" },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  price: { fontSize: 15, fontWeight: "900", color: colors.accent1 },
  orig: { fontSize: 12, color: colors.textFaint, textDecorationLine: "line-through" },
  dist: { fontSize: 11, color: colors.textFaint, marginLeft: "auto" },
});
