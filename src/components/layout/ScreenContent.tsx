// src/components/layout/ScreenContent.tsx

import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { spacing } from "@/theme";

type SpacingKey = keyof typeof spacing;

type ScreenContentProps = {
  children: ReactNode;
  style?: ViewStyle;
  gap?: SpacingKey;
  padded?: boolean;
};

export default function ScreenContent({
  children,
  style,
  gap = "lg",
  padded = true,
}: ScreenContentProps) {
  return (
    <View
      style={[
        styles.container,
        padded && styles.padded,
        {
          gap: spacing[gap],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: spacing.lg,
  },

  padded: {
    paddingHorizontal: spacing.lg,
  },
});