import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Screen } from "../../components/Screen";
import { Card, Pill } from "../../components/Basics";
import { PrimaryButton } from "../../components/Button";
import { colors, radius } from "../../theme";

export default function MerchantOnboardingScreen({ navigation }) {
  return (
    <Screen>
      <View style={styles.headerRow}>
        <Text style={styles.back} onPress={() => navigation.goBack()}>←</Text>
        <Text style={styles.title}>매장 정보 등록</Text>
        <Text style={styles.step}>1 / 1</Text>
      </View>

      <View style={styles.photoRow}>
        <View style={styles.photoBox}><Text style={{ fontSize: 22, color: colors.textFaint }}>📷</Text></View>
        <Text style={styles.photoHint}>매장 대표 사진을{"\n"}등록해주세요 (선택)</Text>
      </View>

      <View>
        <Text style={styles.fieldLabel}>매장명</Text>
        <View style={styles.input}><Text style={styles.inputText}>황금밥상 한식당</Text></View>
      </View>
      <View>
        <Text style={styles.fieldLabel}>업종</Text>
        <View style={styles.wrapRow}>
          <Pill label="☕️ 카페" />
          <Pill label="🍢 분식" />
          <Pill label="🍚 한식" active />
          <Pill label="🥐 베이커리" />
        </View>
      </View>
      <View>
        <Text style={styles.fieldLabel}>매장 주소</Text>
        <View style={styles.input}><Text style={styles.inputText}>노원구 월계동 89-1</Text></View>
      </View>
      <View>
        <Text style={styles.fieldLabel}>사업자등록번호</Text>
        <View style={styles.input}><Text style={styles.inputText}>123-45-6789X</Text></View>
      </View>

      <Card style={styles.noticeCard}>
        <Text style={{ fontSize: 22 }}>⏳</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.noticeTitle}>제출 후 승인까지 영업일 기준 1일 이내</Text>
          <Text style={styles.noticeSub}>등록하신 정보는 운영진 확인 후 승인되며, 승인 완료 시 알림으로 안내드려요.</Text>
        </View>
      </Card>

      <PrimaryButton title="승인 요청하기" onPress={() => navigation.reset({ index: 0, routes: [{ name: "MerchantTabs" }] })} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 8 },
  back: { fontSize: 16 },
  title: { fontSize: 15, fontWeight: "800", color: colors.text },
  step: { fontSize: 12, color: colors.textFaint, fontWeight: "800" },
  photoRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  photoBox: { width: 64, height: 64, borderRadius: 16, backgroundColor: colors.surface2, borderWidth: 1.5, borderColor: colors.border, borderStyle: "dashed", alignItems: "center", justifyContent: "center" },
  photoHint: { fontSize: 12.5, color: colors.textSoft, fontWeight: "600", lineHeight: 18 },
  fieldLabel: { fontSize: 12.5, fontWeight: "800", color: colors.textSoft, marginBottom: 6 },
  input: { backgroundColor: colors.surface2, borderRadius: radius.input, paddingVertical: 14, paddingHorizontal: 16 },
  inputText: { fontSize: 14, fontWeight: "600", color: colors.text },
  wrapRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  noticeCard: { flexDirection: "row", gap: 12, padding: 16, alignItems: "flex-start" },
  noticeTitle: { fontSize: 13, fontWeight: "800", color: colors.text, marginBottom: 2 },
  noticeSub: { fontSize: 12, color: colors.textSoft, fontWeight: "500", lineHeight: 18 },
});
