import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "../../components/Button";
import { colors } from "../../theme";

export default function OnboardingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>팡</Text>
          </View>
          <Text style={styles.brandName}>라스트팡</Text>
        </View>

        <View style={styles.avatar}>
          <Image source={require("../../../assets/mascot/wave.png")} style={styles.mascot} resizeMode="contain" />
        </View>

        <Text style={styles.headline}>지금, 이 동네에만{"\n"}있는 특가를 잡아요</Text>
        <Text style={styles.sub}>
          비는 시간에 맞춰, 우리 동네 사장님들의{"\n"}마감 임박 특가를 알림으로 받아보세요
        </Text>
      </View>

      <View style={styles.bottom}>
        <PrimaryButton title="전화번호로 3초만에 시작하기" onPress={() => navigation.navigate("Login")} />
        <Text style={styles.footNote}>이름·이메일 없이 닉네임으로만 가입해요</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 28 },
  brandMark: { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.accent1, alignItems: "center", justifyContent: "center" },
  brandMarkText: { color: colors.white, fontWeight: "800", fontSize: 16 },
  brandName: { fontSize: 20, fontWeight: "800", color: colors.text },
  avatar: { width: 220, height: 220, borderRadius: 110, backgroundColor: colors.surface2, alignItems: "center", justifyContent: "center", marginBottom: 26 },
  mascot: { width: 170, height: 170 },
  headline: { fontSize: 24, fontWeight: "800", textAlign: "center", color: colors.text, lineHeight: 32, marginBottom: 12 },
  sub: { fontSize: 14, color: colors.textSoft, textAlign: "center", lineHeight: 22, fontWeight: "500" },
  bottom: { paddingHorizontal: 24, paddingBottom: 24, gap: 10 },
  footNote: { textAlign: "center", fontSize: 12.5, color: colors.textFaint, fontWeight: "600" },
});
