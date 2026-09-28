// src/components/layout/ScreenHeader.tsx

import React, { ReactNode } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import LeagueSwitcher from "@/components/league/LeagueSwitcher";
import {
  colors,
  radius,
  shadows,
  sizes,
  spacing,
  typography,
} from "@/theme";

type ScreenHeaderProps = {
  title: string;
  showBackButton?: boolean;
  showLeagueSwitcher?: boolean;
  onBackPress?: () => void;
  rightContent?: ReactNode;
  style?: StyleProp<ViewStyle>;
  backLabel?: string;
};

export default function ScreenHeader({
  title,
  showBackButton = true,
  showLeagueSwitcher = true,
  onBackPress,
  rightContent,
  style,
  backLabel = "Back",
}: ScreenHeaderProps) {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/");
  };

  const renderedRightContent =
    rightContent ??
    (showLeagueSwitcher ? <LeagueSwitcher /> : null);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.sideContainer}>
        {showBackButton ? (
          <View style={styles.backControl}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={backLabel}
              onPress={handleBackPress}
              hitSlop={10}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="arrow-back"
                size={26}
                color={colors.primary}
              />
            </Pressable>

            <Text numberOfLines={1} style={styles.backText}>
              {backLabel}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.titleContainer}>
        <Text
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.68}
          style={styles.title}
        >
          {title}
        </Text>
      </View>

      <View style={[styles.sideContainer, styles.rightSide]}>
        {renderedRightContent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: sizes.headerHeight,

    flexDirection: "row",
    alignItems: "flex-start",

    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,

    backgroundColor: colors.surface,

    ...shadows.header,
  },

  sideContainer: {
    width: sizes.headerSideWidth,
    minHeight: sizes.headerHeight - spacing.md,

    alignItems: "center",
    justifyContent: "flex-start",
  },

  rightSide: {
    alignItems: "flex-end",
  },

  titleContainer: {
    flex: 1,
    minWidth: 0,
    minHeight: sizes.headerHeight - spacing.md,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },

  title: {
    width: "100%",

    color: colors.primary,
    fontSize: typography.title,
    fontWeight: "800",
    textAlign: "center",

    includeFontPadding: false,
  },

  backControl: {
    alignItems: "center",
    justifyContent: "flex-start",
  },

  backButton: {
    width: sizes.backButton,
    height: sizes.backButton,
    borderRadius: radius.pill,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    ...shadows.navigationButton,
  },

  backText: {
    maxWidth: sizes.headerSideWidth,
    marginTop: spacing.xs,

    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: "700",
    textAlign: "center",

    includeFontPadding: false,
  },

  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.95 }],
  },
});