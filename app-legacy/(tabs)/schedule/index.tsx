// app/(tabs)/schedule/index.tsx

import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import {
  AppScreen,
  ScreenContent,
  ScreenHeader,
} from "@/components/layout";
import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from "@/theme";

export default function ScheduleIndex() {
  const router = useRouter();

  return (
    <AppScreen>
      <ScreenHeader
        title="Schedules"
        showLeagueSwitcher
      />

      <ScreenContent gap="xl">
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            📅 Schedule Overview
          </Text>

          <Text style={styles.infoIntro}>
            Select an option to view:
          </Text>

          <View style={styles.bulletList}>
            <Text style={styles.bulletText}>
              • Upcoming games
            </Text>

            <Text style={styles.bulletText}>
              • Weekly schedules
            </Text>

            <Text style={styles.bulletText}>
              • Team matchups
            </Text>

            <Text style={styles.bulletText}>
              • Final scores
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            📣 Schedule Notice
          </Text>

          <View style={styles.bulletList}>
            <Text style={styles.noticeText}>
              • Schedules are subject to change.
            </Text>

            <Text style={styles.noticeText}>
              • Games may be moved because of weather, gym availability,
              holidays, league operations, or unforeseen circumstances.
            </Text>

            <Text style={styles.noticeText}>
              • Schedule updates will be posted in the Updates section of the
              app.
            </Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/schedule/calendar")}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>
              Calendar
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/schedule/results")}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>
              Game Results
            </Text>
          </Pressable>
        </View>
      </ScreenContent>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    width: "100%",
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadows.card,
  },

  infoTitle: {
    color: colors.primary,
    fontSize: typography.subheading,
    fontWeight: "800",
    textAlign: "center",
  },

  infoIntro: {
    marginTop: spacing.md,
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "600",
    textAlign: "center",
  },

  bulletList: {
  marginTop: spacing.md,
  alignItems: "center",
  gap: spacing.sm,
},

bulletText: {
  width: "100%",
  color: colors.text,
  fontSize: typography.body,
  fontWeight: "500",
  lineHeight: 22,
  textAlign: "center",
},

  noticeText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "500",
    lineHeight: 21,
    textAlign: "left",
  },

  buttonRow: {
    width: "100%",
    flexDirection: "row",
    gap: spacing.md,
  },

  button: {
    flex: 1,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    ...shadows.soft,
  },

  buttonPressed: {
    opacity: 0.76,
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: "700",
    textAlign: "center",
  },
});