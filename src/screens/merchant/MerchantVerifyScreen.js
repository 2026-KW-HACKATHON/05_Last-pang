import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Screen } from "../../components/Screen";
import { MerchantHeader } from "../../components/MerchantHeader";
import { Card } from "../../components/Basics";
import { colors, radius } from "../../theme";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "지우기", "0", "확인"];

export default function MerchantVerifyScreen() {
  const [code, setCode] = useState("482");

  function pressKey(k) {
    if (k === "지우기") return setCode((c) => c.slice(0, -1));
    if (k === "확인") return;
    if (code.length >= 6) return;
    setCode((c) => c + k);
  }

  return (
    <Screen>
      <MerchantHeader badge="실시간 검증기 ON" />

      <Card style={styles.introCard}>
        <Image source={require("../../../assets/mascot/phone.png")} style={{ width: 46, height: 46 }} resizeMode="contain" />
        <View style={{ flex: 1 }}>
          <Text style={styles.introTitle}>손님의 6자리 인증코드</Text>
          <Text style={styles.introText}>화면의 숫자를 누르시면 <Text style={{ color: colors.text, fontWeight: "800" }}>1초 만에</Text> 승인됩니다.</Text>
        </View>
      </Card>

      <View>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>방문 인증번호</Text>
          <Text style={styles.refresh}>↻ 새로고침</Text>
        </View>
        <View style={styles.digitRow}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={[styles.digitBox, code[i] && styles.digitBoxFilled]}>
              <Text style={[styles.digitText, !code[i] && styles.digitDash]}>{code[i] ?? "–"}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.hint}>남은 {6 - code.length}자리를 아래 키패드로 눌러주세요</Text>
      </View>

      <View style={styles.keypad}>
        {KEYS.map((k) => (
          <Pressable
            key={k}
            onPress={() => pressKey(k)}
            style={[styles.key, k === "확인" && styles.keyPrimary]}
          >
            <Text style={[styles.keyText, k === "지우기" && styles.keyMuted, k === "확인" && styles.keyPrimaryText]}>{k}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.altRow}>
        <View style={styles.altBtn}><Text style={{ fontSize: 15 }}>📷</Text><Text style={styles.altText}>카메라 QR 스캔</Text></View>
        <View style={styles.altBtn}><Text style={{ fontSize: 15 }}>🧾</Text><Text style={styles.altText}>포스 바코드 연동</Text></View>
      </View>

      <View>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>최근 처리 완료 내역</Text>
          <Text style={styles.hint}>오늘 18건 완료</Text>
        </View>
        <Card style={{ paddingHorizontal: 14, marginTop: 8 }}>
          <View style={styles.histRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.histTitle}>482910 <Text style={styles.histTime}>방금 전 (14:28)</Text></Text>
              <Text style={styles.histMeta}>떡볶이 1인분 (인덕대 이*호 님)</Text>
            </View>
            <Text style={styles.histDone}>✅ 사용완료</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.histRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.histTitle}>931024 <Text style={styles.histTime}>20분 전 (14:10)</Text></Text>
              <Text style={styles.histMeta}>모듬튀김 5종 세트</Text>
            </View>
            <Text style={styles.histDone}>✅ 사용완료</Text>
          </View>
        </Card>
        <Text style={styles.footNote}>인터넷이 불안정해도 단말기에 즉시 검증 처리되며, 네트워크 재연결 시 자동으로 동기화됩니다.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  introCard: { padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  introTitle: { fontSize: 14, fontWeight: "800", color: colors.text, marginBottom: 2 },
  introText: { fontSize: 11.5, color: colors.textSoft, fontWeight: "600", lineHeight: 17 },
  altRow: { flexDirection: "row", gap: 8 },
  altBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 12, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  altText: { fontSize: 12.5, fontWeight: "800", color: colors.text },
  histTime: { fontSize: 10.5, color: colors.textFaint, fontWeight: "600" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  label: { fontSize: 12, fontWeight: "800", color: colors.textSoft },
  refresh: { fontSize: 11, fontWeight: "800", color: colors.accent1 },
  digitRow: { flexDirection: "row", gap: 6, justifyContent: "center" },
  digitBox: { width: 42, height: 50, borderRadius: 14, backgroundColor: colors.surface2, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "transparent" },
  digitBoxFilled: { borderColor: colors.accent1, backgroundColor: colors.surface },
  digitText: { fontSize: 18, fontWeight: "800", color: colors.accent1 },
  digitDash: { color: colors.textFaint },
  hint: { textAlign: "center", fontSize: 10.5, color: colors.textFaint, fontWeight: "600", marginTop: 6 },
  keypad: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  key: { width: "31.5%", height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface2 },
  keyPrimary: { backgroundColor: colors.accent1 },
  keyText: { fontSize: 18, fontWeight: "700", color: colors.text },
  keyMuted: { fontSize: 13, color: colors.textFaint },
  keyPrimaryText: { color: colors.white, fontSize: 15, fontWeight: "800" },
  histRow: { flexDirection: "row", alignItems: "center", paddingVertical: 13, gap: 10 },
  histTitle: { fontSize: 12, fontWeight: "800", color: colors.text },
  histMeta: { fontSize: 10.5, color: colors.textFaint, fontWeight: "600" },
  histDone: { fontSize: 11, color: colors.success, fontWeight: "800" },
  divider: { height: 1, backgroundColor: colors.border },
  footNote: { fontSize: 10, color: colors.textFaint, fontWeight: "600", marginTop: 6, lineHeight: 15 },
});
