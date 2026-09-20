import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, BadgeDeal, BadgeSoft } from "../../components/Basics";
import { PrimaryButton } from "../../components/Button";
import { colors, radius } from "../../theme";

export default function DealDetailScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>
        <View style={styles.hero}>
          <Text style={styles.back} onPress={() => navigation.goBack()}>←</Text>
          <Text style={styles.heart}>🤍</Text>
          <Image source={require("../../../assets/mascot/rice.png")} style={{ width: 190, height: 190 }} resizeMode="contain" />
          <View style={styles.timeBadge}><BadgeDeal label="⏰ 마감까지 18분" /></View>
        </View>

        <View style={styles.body}>
          <View>
            <View style={styles.rowGap}>
              <BadgeSoft label="🍚 한식" />
              <Text style={styles.distText}>도보 4분 · 320m</Text>
            </View>
            <Text style={styles.storeName}>황금밥상 한식당</Text>
            <Text style={styles.itemName}>제육볶음 정식 1인분</Text>
          </View>

          <Card style={styles.priceCard}>
            <View>
              <View style={styles.rowGap}>
                <Text style={styles.price}>4,900원</Text>
                <Text style={styles.orig}>7,000원</Text>
              </View>
              <Text style={styles.discountNote}>30% 할인 · 남은 수량 2개</Text>
            </View>
            <View style={styles.discBadge}><Text style={styles.discBadgeText}>30%</Text></View>
          </Card>

          <Card style={styles.infoCard}>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>픽업 가능 시간</Text><Text style={styles.infoValue}>오늘 17:40 – 18:00</Text></View>
            <View style={styles.divider} />
            <View style={styles.infoRow}><Text style={styles.infoLabel}>위치</Text><Text style={styles.infoValue}>노원구 월계동 89-1</Text></View>
          </Card>

          <Text style={styles.desc}>
            오늘 준비한 제육볶음 정식이 조금 남았어요. 방문 시 코드를 보여주시면 바로 픽업하실 수 있어요 🙌
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>받을 수 있는 수량</Text>
          <Text style={styles.footerValue}>1인 1개</Text>
        </View>
        <PrimaryButton title="코드 받기" style={{ flex: 1 }} onPress={() => navigation.navigate("CodeReceived")} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  hero: { height: 220, backgroundColor: colors.surface2, alignItems: "center", justifyContent: "center" },
  back: { position: "absolute", top: 16, left: 16, width: 36, height: 36, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.9)", textAlign: "center", lineHeight: 36, fontSize: 16 },
  heart: { position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.9)", textAlign: "center", lineHeight: 36, fontSize: 16 },
  timeBadge: { position: "absolute", bottom: 14, left: 16 },
  body: { paddingHorizontal: 20, paddingTop: 18, gap: 14 },
  rowGap: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  distText: { fontSize: 12, color: colors.textFaint, fontWeight: "700" },
  storeName: { fontSize: 14, fontWeight: "700", color: colors.textSoft },
  itemName: { fontSize: 21, fontWeight: "800", color: colors.text, marginTop: 2 },
  priceCard: { padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  price: { fontSize: 24, fontWeight: "800", color: colors.accent1 },
  orig: { fontSize: 14, color: colors.textFaint, textDecorationLine: "line-through", fontWeight: "700" },
  discountNote: { fontSize: 12, color: colors.textSoft, fontWeight: "700", marginTop: 2 },
  discBadge: { width: 52, height: 52, borderRadius: 999, backgroundColor: colors.accent1, alignItems: "center", justifyContent: "center" },
  discBadgeText: { color: colors.white, fontSize: 15, fontWeight: "800" },
  infoCard: { padding: 16, gap: 10 },
  infoRow: { flexDirection: "row", justifyContent: "space-between" },
  infoLabel: { fontSize: 13, color: colors.textSoft, fontWeight: "700" },
  infoValue: { fontSize: 13, fontWeight: "800", color: colors.text },
  divider: { height: 1, backgroundColor: colors.border },
  desc: { fontSize: 13, lineHeight: 21, color: colors.textSoft, fontWeight: "500" },
  footer: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingVertical: 14, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  footerLabel: { fontSize: 11, color: colors.textFaint, fontWeight: "700" },
  footerValue: { fontSize: 15, fontWeight: "900", color: colors.text },
});
