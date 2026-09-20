import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton, SecondaryButton } from "../components/Button";
import { colors } from "../theme";

// 데모/발표용 시작 화면 — 주민앱과 사장님앱 중 체험할 플로우를 선택합니다.
export default function RoleSelectScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>팡</Text></View>
          <Text style={styles.brandName}>라스트팡</Text>
        </View>
        <Image source={require("../../assets/mascot/wave.png")} style={{ width: 140, height: 140, marginBottom: 20 }} resizeMode="contain" />
        <Text style={styles.headline}>어떤 화면으로{"\n"}둘러보시겠어요?</Text>
      </View>
      <View style={styles.bottom}>
        <PrimaryButton title="🙋 주민앱 체험하기" onPress={() => navigation.navigate("Onboarding")} />
        <SecondaryButton title="🏪 사장님앱 체험하기" onPress={() => navigation.navigate("MerchantOnboarding")} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 18 },
  brandMark: { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.accent1, alignItems: "center", justifyContent: "center" },
  brandMarkText: { color: colors.white, fontWeight: "800", fontSize: 16 },
  brandName: { fontSize: 20, fontWeight: "800", color: colors.text },
  headline: { fontSize: 22, fontWeight: "800", color: colors.text, textAlign: "center", lineHeight: 30 },
  bottom: { paddingHorizontal: 24, paddingBottom: 24, gap: 10 },
});
