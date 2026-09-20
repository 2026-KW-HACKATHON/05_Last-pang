import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, gradient, radius, shadow } from "../theme";

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Pill({ label, active, style }) {
  return (
    <View style={[styles.pill, active && styles.pillActive, style]}>
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
    </View>
  );
}

export function BadgeDeal({ label, style }) {
  return (
    <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.badge, style]}>
      <Text style={styles.badgeText}>{label}</Text>
    </LinearGradient>
  );
}

export function BadgeSoft({ label, style }) {
  return (
    <View style={[styles.badgeSoft, style]}>
      <Text style={styles.badgeSoftText}>{label}</Text>
    </View>
  );
}

export function ProgressBar({ percent }) {
  return (
    <View style={styles.track}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.fill, { width: `${percent}%` }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    ...shadow.card,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pillActive: { backgroundColor: colors.text, borderColor: colors.text },
  pillText: { fontSize: 12.5, fontWeight: "700", color: colors.textSoft },
  pillTextActive: { color: colors.white },
  badge: { paddingVertical: 4, paddingHorizontal: 9, borderRadius: radius.pill },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: "800" },
  badgeSoft: { backgroundColor: colors.surface2, paddingVertical: 4, paddingHorizontal: 9, borderRadius: radius.pill },
  badgeSoftText: { color: colors.accent1, fontSize: 11, fontWeight: "800" },
  track: { height: 9, borderRadius: radius.pill, backgroundColor: colors.surface2, overflow: "hidden" },
  fill: { height: "100%", borderRadius: radius.pill },
});
