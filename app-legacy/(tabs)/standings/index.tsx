// app/(tabs)/standings/index.tsx

import React, { useMemo } from "react";
import {
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
import { LeagueNightButton } from "@/components/league";
import { useLeague } from "@/context/LeagueContext";
import {
  getActiveLeagueNights,
  type LeagueNightData,
} from "@/config/leagueNightConfig";
import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from "@/theme";

export default function StandingsIndex() {
  const router = useRouter();
  const { selectedLeagueId } = useLeague();

  const activeLeagueNights = useMemo(
    () => getActiveLeagueNights(selectedLeagueId),
    [selectedLeagueId]
  );

  const handleLeaguePress = (
    league: LeagueNightData
  ) => {
    router.push({
      pathname: "/(tabs)/standings/[league]",
      params: {
        league: league.routeLeagueId,
      },
    });
  };

  return (
    <AppScreen>
      <ScreenHeader
        title="Standings"
        showBackButton
        showLeagueSwitcher
      />

      <ScreenContent gap="xl">
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>
            📊 Standings Overview
          </Text>

          <Text style={styles.overviewText}>
            Select a league to view:
          </Text>

          <View style={styles.bulletList}>
            <Text style={styles.bulletText}>
              • Current team records
            </Text>

            <Text style={styles.bulletText}>
              • Playoff positioning
            </Text>

            <Text style={styles.bulletText}>
              • Points for and against
            </Text>

            <Text style={styles.bulletText}>
              • Season and playoff picture
            </Text>
          </View>
        </View>

        {activeLeagueNights.length > 0 ? (
          <View style={styles.buttonList}>
  {activeLeagueNights.map((league) => (
    <View
      key={league.id}
      style={styles.buttonWrapper}
    >
      <LeagueNightButton
        day={league.day}
        period={league.period}
        displayName={league.displayName}
        badgeCount={league.badgeCount}
        onPress={() =>
          handleLeaguePress(league)
        }
      />
    </View>
  ))}
</View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              No active leagues
            </Text>

            <Text style={styles.emptyText}>
              There are currently no active standings
              available for this organization.
            </Text>
          </View>
        )}
      </ScreenContent>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  overviewCard: {
  width: "78%",
  maxWidth: 360,

  alignSelf: "center",

  padding: spacing.xl,

  borderRadius: radius.lg,

  backgroundColor: colors.surface,

  borderWidth: 1,
  borderColor: colors.border,

  ...shadows.card,
},

  overviewTitle: {
    color: colors.primary,
    fontSize: typography.subheading,
    fontWeight: "800",
    textAlign: "center",
  },

  overviewText: {
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

  buttonList: {
  width: "100%",
  alignItems: "center",
  gap: spacing.xl,
  paddingBottom: spacing.xl,
},

buttonWrapper: {
  width: "78%",
  maxWidth: 360,
},

  emptyCard: {
    width: "100%",

    padding: spacing.xl,

    borderRadius: radius.lg,
    backgroundColor: colors.surface,

    ...shadows.soft,
  },

  emptyTitle: {
    color: colors.primary,
    fontSize: typography.subheading,
    fontWeight: "800",
    textAlign: "center",
  },

  emptyText: {
    marginTop: spacing.sm,

    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 20,
    textAlign: "center",
  },
});