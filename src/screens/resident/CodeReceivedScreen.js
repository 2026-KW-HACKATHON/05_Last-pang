import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Screen } from "../../components/Screen";
import { Card } from "../../components/Basics";
import { PrimaryButton } from "../../components/Button";
import { colors } from "../../theme";

const CODE = ["7", "2", "9", "4", "0", "6"];

export default function CodeReceivedScreen({ navigation }) {
  return (
    <Screen>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>코드 받기 완료</Text>
        <Text style={styles.close} onPress={() => navigation.popToTop()}>닫기 ✕</Text>
      </View>

      <View style={{ alignItems: "center", paddingTop: 4 }}>
        <Image source={require("../../../assets/mascot/cheer.png")} style={{ width: 128, height: 128 }} resizeMode="contain" />
        <Text style={styles.title}>코드를 받았어요!</Text>
        <Text style={styles.sub}>가게에 방문해서 아래 코드를{"\n"}사장님께 보여주세요</Text>
      </View>

      <Card style={styles.codeCard}>
        <View style={styles.digitRow}>
          {CODE.map((d, i) => (
            <View key={i} style={styles.digitBox}><Text style={styles.digitText}>{d}</Text></View>
          ))}
        </View>
        <View style={styles.timerRow}>
          <View style={styles.timerDot} />
          <Text style={styles.timerText}>14 : 07</Text>
          <Text style={styles.timerNote}>남음 · 15분 내 미사용 시 자동 취소</Text>
        </View>
        <View style={styles.timerTrack}><View style={styles.timerFill} /></View>
      </Card>

      <Card style={styles.summaryCard}>
        <View style={styles.summaryThumb}>
          <Image source={require("../../../assets/mascot/rice.png")} style={{ width: 34, height: 34 }} resizeMode="contain" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.summaryStore}>황금밥상 한식당</Text>
          <Text style={styles.summaryItem}>제육볶음 정식 1인분 · 4,900원</Text>
        </View>
        <Text style={styles.summaryDist}>320m</Text>
      </Card>

      <PrimaryButton title="가게 위치 보기" onPress={() => {}} />
      <Text style={styles.cancel}>딜 취소하기</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 8 },
  headerTitle: { fontSize: 15, fontWeight: "800", color: colors.text },
  close: { fontSize: 13, color: colors.textFaint, fontWeight: "700" },
  title: { fontSize: 20, fontWeight: "800", color: colors.text, marginTop: 4 },
  sub: { fontSize: 13, color: colors.textSoft, fontWeight: "600", textAlign: "center", marginTop: 4 },
  codeCard: { padding: 22, alignItems: "center", gap: 16 },
  digitRow: { flexDirection: "row", gap: 8 },
  digitBox: { width: 38, height: 52, borderRadius: 12, backgroundColor: colors.surface2, alignItems: "center", justifyContent: "center" },
  digitText: { fontSize: 24, fontWeight: "800", color: colors.accent1 },
  timerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  timerDot: { width: 8, height: 8, borderRadius: 999, backgroundColor: colors.accent1 },
  timerText: { fontSize: 14, fontWeight: "800", color: colors.text },
  timerNote: { fontSize: 12, color: colors.textFaint, fontWeight: "700" },
  timerTrack: { width: "100%", height: 5, borderRadius: 999, backgroundColor: colors.border, overflow: "hidden" },
  timerFill: { width: "94%", height: "100%", backgroundColor: colors.accent1 },
  summaryCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  summaryThumb: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.surface2, alignItems: "center", justifyContent: "center" },
  summaryStore: { fontSize: 13, fontWeight: "800", color: colors.text },
  summaryItem: { fontSize: 12, color: colors.textSoft, fontWeight: "600" },
  summaryDist: { fontSize: 11, color: colors.textFaint, fontWeight: "700" },
  cancel: { textAlign: "center", fontSize: 12.5, color: colors.textFaint, fontWeight: "700" },
});
