import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Screen } from "../../components/Screen";
import { PrimaryButton } from "../../components/Button";
import { colors, radius } from "../../theme";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

export default function LoginScreen({ navigation }) {
  const [code, setCode] = useState("48");

  function pressKey(k) {
    if (k === "⌫") return setCode((c) => c.slice(0, -1));
    if (k === "" || code.length >= 4) return;
    setCode((c) => c + k);
  }

  const filled = code.length === 4;

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <Text style={styles.back} onPress={() => navigation.goBack()}>←</Text>
      </View>

      <Text style={styles.title}>인증번호를 입력해주세요</Text>
      <Text style={styles.sub}>
        <Text style={{ fontWeight: "800", color: colors.text }}>010-4829-06XX</Text>로 전송된{"\n"}4자리 인증번호를 입력하세요
      </Text>

      <View style={styles.otpRow}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.otpBox, code[i] && styles.otpBoxFilled]}>
            <Text style={styles.otpDigit}>{code[i] ?? ""}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.timer}>
        <Text style={{ color: colors.accent1, fontWeight: "800" }}>02:47</Text>
        <Text style={{ color: colors.textFaint, fontWeight: "600" }}> 남음 · 문자를 못 받으셨나요? </Text>
        <Text style={{ fontWeight: "800", textDecorationLine: "underline" }}>재전송</Text>
      </Text>

      <View style={{ flex: 1 }} />

      <View style={styles.keypad}>
        {KEYS.map((k, i) => (
          <Pressable key={i} style={styles.key} onPress={() => pressKey(k)}>
            <Text style={styles.keyText}>{k}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.bottom}>
        <PrimaryButton
          title="확인"
          disabled={!filled}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: "Setup" }] })}
        />
        <Text style={styles.footNote}>이름·이메일 없이 닉네임으로만 이용해요</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingVertical: 14 },
  back: { fontSize: 16 },
  title: { fontSize: 22, fontWeight: "800", color: colors.text, marginBottom: 6 },
  sub: { fontSize: 13, color: colors.textSoft, fontWeight: "500", lineHeight: 20, marginBottom: 22 },
  otpRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  otpBox: { width: 52, height: 58, borderRadius: 14, backgroundColor: colors.surface2, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "transparent" },
  otpBoxFilled: { borderColor: colors.accent1, backgroundColor: colors.surface },
  otpDigit: { fontSize: 22, fontWeight: "800", color: colors.accent1 },
  timer: { fontSize: 13 },
  keypad: { flexDirection: "row", flexWrap: "wrap", gap: 6, paddingBottom: 8 },
  key: { width: "31.5%", height: 56, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  keyText: { fontSize: 20, fontWeight: "700", color: colors.text },
  bottom: { paddingVertical: 16, gap: 10 },
  footNote: { textAlign: "center", fontSize: 12, color: colors.textFaint, fontWeight: "600" },
});
