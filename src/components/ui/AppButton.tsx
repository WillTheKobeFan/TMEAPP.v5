import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface Props {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: ViewStyle;
  disabled?: boolean;
}

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  size = "md",
  style,
  disabled,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[size],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.text, styles[`text_${variant}`]]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },

  /* WIDTH CONTROL = HERE YOU WIN */
  sm: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: "flex-start", // 👈 makes it shrink to content
  },
  md: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: "center",
  },
  lg: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignSelf: "stretch",
  },

  primary: {
    backgroundColor: "#2563eb",
  },
  secondary: {
    backgroundColor: "#374151",
  },
  ghost: {
    backgroundColor: "transparent",
  },

  text: {
    fontWeight: "600",
    fontSize: 14,
  },
  text_primary: { color: "white" },
  text_secondary: { color: "white" },
  text_ghost: { color: "#2563eb" },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.4,
  },
});