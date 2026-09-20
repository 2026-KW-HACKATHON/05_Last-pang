import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, gradient, radius, shadow } from "../theme";

export function PrimaryButton({ title, onPress, style, disabled }) {
  if (disabled) {
    return (
      <Pressable style={[styles.disabled, style]} disabled>
        <Text style={styles.disabledText}>{title}</Text>
      </Pressable>
    );
  }
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }, style]}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.primary, shadow.button]}
      >
        <Text style={styles.primaryText}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export function SecondaryButton({ title, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={[styles.secondary, style]}>
      <Text style={styles.secondaryText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    paddingVertical: 15,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { color: colors.white, fontWeight: "800", fontSize: 15 },
  secondary: {
    paddingVertical: 13,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  secondaryText: { color: colors.text, fontWeight: "700", fontSize: 14 },
  disabled: {
    paddingVertical: 15,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDE4DC",
  },
  disabledText: { color: colors.textFaint, fontWeight: "800", fontSize: 15 },
});
