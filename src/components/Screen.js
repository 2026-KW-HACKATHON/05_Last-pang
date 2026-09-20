import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme";

export function Screen({ children, scroll = true, style }) {
  const Wrapper = scroll ? ScrollView : View;
  const wrapperProps = scroll
    ? { contentContainerStyle: [styles.scrollContent, style], showsVerticalScrollIndicator: false }
    : { style: [styles.flexContent, style] };
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <Wrapper {...wrapperProps}>{children}</Wrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24, gap: 14 },
  flexContent: { flex: 1, paddingHorizontal: 20 },
});
