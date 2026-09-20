import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, radius } from "../theme";

export function MerchantHeader({ storeName = "광운분식 월계본점", badge, open = true }) {
  return (
    <View style={styles.row}>
      <View>
        <View style={styles.brandRow}>
          <View style={styles.mark}><Text style={styles.markText}>팡</Text></View>
          <Text style={styles.brand}>라스트팡 사장님</Text>
          {open ? (
            <View style={styles.openRow}>
              <View style={styles.openDot} />
              <Text style={styles.openText}>영업중</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.storeRow}>
          <Text style={styles.store}>{storeName}</Text>
          {badge ? (
            <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>
          ) : null}
        </View>
      </View>
      <View style={styles.icons}>
        <View style={styles.iconBtn}>
          <Text style={{ fontSize: 15 }}>🔔</Text>
          <View style={styles.dot} />
        </View>
        <View style={[styles.iconBtn, styles.dark]}>
          <Text style={{ fontSize: 15 }}>👤</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 6, paddingBottom: 4 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  mark: { width: 16, height: 16, borderRadius: 5, backgroundColor: colors.accent1, alignItems: "center", justifyContent: "center" },
  markText: { color: colors.white, fontSize: 9, fontWeight: "800" },
  brand: { fontSize: 11, fontWeight: "800", color: colors.textFaint },
  openRow: { flexDirection: "row", alignItems: "center", gap: 4, marginLeft: 4 },
  openDot: { width: 6, height: 6, borderRadius: 999, backgroundColor: colors.success },
  openText: { fontSize: 10.5, color: colors.textFaint, fontWeight: "600" },
  storeRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  store: { fontSize: 16, fontWeight: "800", color: colors.text },
  badge: { backgroundColor: colors.accent1, paddingVertical: 3, paddingHorizontal: 8, borderRadius: radius.pill },
  badgeText: { color: colors.white, fontSize: 9.5, fontWeight: "800" },
  icons: { flexDirection: "row", gap: 8 },
  iconBtn: { width: 36, height: 36, borderRadius: 999, backgroundColor: colors.surface2, alignItems: "center", justifyContent: "center" },
  dark: { backgroundColor: colors.text },
  dot: { position: "absolute", top: 6, right: 7, width: 7, height: 7, borderRadius: 999, backgroundColor: colors.accent1, borderWidth: 1.5, borderColor: colors.surface2 },
});
