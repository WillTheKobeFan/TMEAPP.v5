// src/components/league/LeagueNightButton.tsx

import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  LeagueDay,
  LeaguePeriod,
} from "@/config/leagueNightConfig";
import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from "@/theme";

type LeagueNightButtonProps = {
  day: LeagueDay;
  period: LeaguePeriod;
  displayName: string;

  badgeCount?: number;
  disabled?: boolean;

  onPress: () => void;
};

export default function LeagueNightButton({
  day,
  period,
  displayName,
  badgeCount = 0,
  disabled = false,
  onPress,
}: LeagueNightButtonProps) {
  const hasBadge = badgeCount > 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${day} ${period}, ${displayName}`}
      accessibilityState={{
        disabled,
      }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {hasBadge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badgeCount > 99 ? "99+" : badgeCount}
          </Text>
        </View>
      ) : null}

      <Text style={styles.dayText}>
        {day} • {period}
      </Text>

      <Text
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
        style={styles.leagueName}
      >
        {displayName}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "98%",
    maxWidth: 320,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,

    borderRadius: radius.lg,
    backgroundColor: colors.primary,

    ...shadows.card,
  },

  dayText: {
    color: colors.surface,
    fontSize: typography.subheading,
    fontWeight: "800",
    lineHeight: 24,
    textAlign: "center",
  },

  leagueName: {
    marginTop: spacing.xs,

    color: colors.surface,
    fontSize: typography.caption,
    fontWeight: "600",
    lineHeight: 19,
    textAlign: "center",

    opacity: 0.92,
  },

  badge: {
    position: "absolute",
    top: 8,
    right: 8,

    minWidth: 27,
    height: 27,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 6,

    borderWidth: 2,
    borderColor: colors.surface,
    borderRadius: radius.pill,

    backgroundColor: colors.danger,

    ...shadows.soft,
  },

  badgeText: {
    color: colors.surface,
    fontSize: typography.small,
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },

  disabled: {
    opacity: 0.45,
  },
});