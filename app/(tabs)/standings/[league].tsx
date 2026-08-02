// app/(tabs)/standings/[league].tsx

import React, {
  ComponentProps,
  useMemo,
  useState,
} from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import SearchTeamCard from "@/components/cards/SearchTeamCard";
import {
  AppScreen,
  ScreenContent,
  ScreenHeader,
} from "@/components/layout";
import {
  leagueNightConfig,
  type LeagueNightData,
} from "@/config/leagueNightConfig";
import { useLeague } from "@/context/LeagueContext";
import { leagueData } from "@/data/leagues/leagueData";
import { standingsMap } from "@/data/standings/standingsMap";
import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from "@/theme";

type StandingTeam = {
  team: string;
  wins: number;
  losses: number;
  pf?: number;
  pa?: number;
  streak?: string;
};

type SearchTeamCardProps =
  ComponentProps<typeof SearchTeamCard>;

type SearchTeamData =
  NonNullable<SearchTeamCardProps["team"]>;

const playoffCutoffMap: Record<string, number> = {
  sunday: 8,
  monday: 4,
  tuesday: 4,
  wednesday: 4,
};

const weekMap: Record<string, string> = {
  sunday: "Week 7 of 10",
  monday: "Week 7 of 10",
  tuesday: "Week 7 of 10",
  wednesday: "Week 7 of 10",
};

const sessionMap: Record<string, string> = {
  sunday: "Spring 2026",
  monday: "Spring 2026",
  tuesday: "Spring 2026",
  wednesday: "Spring 2026",
};

function formatModalLeague(
  leagueKey: string
): string {
  switch (leagueKey) {
    case "monday":
      return "Monday";

    case "tuesday":
      return "Tuesday";

    case "wednesday":
      return "Wednesday";

    case "sunday":
    default:
      return "Sunday";
  }
}

function createTeamId(
  leagueKey: string,
  teamName: string
): string {
  const normalizedName = teamName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return `${leagueKey}-${normalizedName}`;
}

export default function LeagueStandingsScreen() {
  const params = useLocalSearchParams<{
    league?: string | string[];
  }>();

  const router = useRouter();
  const { selectedLeagueId } = useLeague();

  const [selectedTeam, setSelectedTeam] =
    useState<SearchTeamData | null>(null);

  const rawLeague = Array.isArray(params.league)
    ? params.league[0]
    : params.league;

  const leagueKey = (rawLeague ?? "sunday")
    .trim()
    .toLowerCase()
    .replace("standings", "")
    .replace(/\//g, "")
    .trim();

  const leagueInfo =
    leagueData[
    leagueKey as keyof typeof leagueData
    ];

  const standings = (
    standingsMap[
    leagueKey as keyof typeof standingsMap
    ] ?? []
  ) as StandingTeam[];

  const leagueNight = useMemo<
    LeagueNightData | undefined
  >(() => {
    return leagueNightConfig.find(
      (item) =>
        item.organizationId === selectedLeagueId &&
        item.routeLeagueId.toLowerCase() ===
        leagueKey
    );
  }, [leagueKey, selectedLeagueId]);

  const playoffCutoff =
    playoffCutoffMap[leagueKey] ?? 4;

  const weekText =
    weekMap[leagueKey] ?? "Current Session";

  const sessionText =
    sessionMap[leagueKey] ?? "Current Session";

  const leagueDayTitle = leagueNight
    ? `${leagueNight.day} • ${leagueNight.period}`
    : leagueInfo?.name ?? "League";

  const leagueDisplayName =
    leagueNight?.displayName ??
    leagueInfo?.name ??
    "League Standings";

  const leaderWins =
    standings[0]?.wins ?? 0;

  const leaderLosses =
    standings[0]?.losses ?? 0;

  const getWinPercentage = (
    wins: number,
    losses: number
  ): string => {
    const gamesPlayed = wins + losses;

    if (gamesPlayed === 0) {
      return ".000";
    }

    return (wins / gamesPlayed)
      .toFixed(3)
      .replace(/^0/, "");
  };

  const getGamesBack = (
    wins: number,
    losses: number
  ): string => {
    if (!standings.length) {
      return "—";
    }

    const gamesBack =
      (leaderWins -
        wins +
        (losses - leaderLosses)) /
      2;

    if (gamesBack === 0) {
      return "—";
    }

    return Number.isInteger(gamesBack)
      ? String(gamesBack)
      : gamesBack.toFixed(1);
  };

  const getPointDifference = (
    pointsFor = 0,
    pointsAgainst = 0
  ): string => {
    const difference =
      pointsFor - pointsAgainst;

    if (difference > 0) {
      return `+${difference}`;
    }

    return String(difference);
  };

  const openTeamCard = (
    team: StandingTeam,
    position: number
  ) => {
    const modalTeam = {
      id: createTeamId(
        leagueKey,
        team.team
      ),
      teamName: team.team,
      captain: team.team,
      league: formatModalLeague(leagueKey),
      record: `${team.wins}-${team.losses}`,
      place: position,
      status: "active",
      nextGame: undefined,
      nextMatch: undefined,
      lastResult: undefined,
      schedule: undefined,
    } as SearchTeamData;

    setSelectedTeam(modalTeam);
  };

  const closeTeamCard = () => {
    setSelectedTeam(null);
  };

  if (!leagueInfo) {
    return (
      <AppScreen>
        <ScreenHeader
          title="Standings"
          showBackButton
          showLeagueSwitcher
        />

        <ScreenContent>
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>
              League not found
            </Text>

            <Text style={styles.errorText}>
              Standings are not available for
              “{leagueKey}.”
            </Text>
          </View>
        </ScreenContent>
      </AppScreen>
    );
  }

  return (
    <AppScreen
      contentContainerStyle={
        styles.scrollContent
      }
    >
      <ScreenHeader
        title="Standings"
        showBackButton
        showLeagueSwitcher
      />

      <ScreenContent gap="lg">
        <View style={styles.leagueIdentityCard}>
          <View style={styles.identityContent}>

            <View style={styles.sportCircle}>
              <Ionicons
                name="basketball-outline"
                size={30}
                color={colors.surface}
              />
            </View>

            <View style={styles.identityText}>
              <Text style={styles.leagueDay}>
                {leagueDayTitle}
              </Text>

              <Text style={styles.leagueName}>
                {leagueDisplayName}
              </Text>
            </View>

          </View>
        </View>
        <View style={styles.tableCard}>
          <View style={styles.tableInfoSection}>
            <View style={styles.tableInfoTopRow}>
              <Text style={styles.tableTitle}>
                {leagueInfo.name}
              </Text>

              <Text style={styles.weekText}>
                {weekText}
              </Text>
            </View>

            <View style={styles.tableInfoBottomRow}>
              <Text style={styles.sessionText}>
                {sessionText}
              </Text>

              <Text
                style={
                  styles.playoffQualifierText
                }
              >
                Top {playoffCutoff} teams make
                playoffs
              </Text>
            </View>
          </View>

          <View style={styles.tableDivider} />

          <ScrollView
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.horizontalTable
            }
          >
            <View>
              <View
                style={[
                  styles.tableRow,
                  styles.tableHeader,
                ]}
              >
                <TableHeaderCell
                  label="#"
                  style={styles.colRank}
                />

                <TableHeaderCell
                  label="Team"
                  style={styles.colTeam}
                  align="left"
                />

                <TableHeaderCell
                  label="W"
                  style={styles.colTiny}
                />

                <TableHeaderCell
                  label="L"
                  style={styles.colTiny}
                />

                <TableHeaderCell
                  label="PF"
                  style={styles.colSmall}
                />

                <TableHeaderCell
                  label="PA"
                  style={styles.colSmall}
                />

                <TableHeaderCell
                  label="PD"
                  style={styles.colSmall}
                />

                <TableHeaderCell
                  label="PCT"
                  style={styles.colPct}
                />

                <TableHeaderCell
                  label="GB"
                  style={styles.colSmall}
                />
              </View>

              {standings.length === 0 ? (
                <View style={styles.emptyRow}>
                  <Text style={styles.emptyText}>
                    No standings data is
                    available yet.
                  </Text>
                </View>
              ) : (
                standings.map(
                  (team, index) => {
                    const position =
                      index + 1;

                    const isBelowCutoff =
                      position >
                      playoffCutoff;

                    return (
                      <React.Fragment
                        key={`${team.team}-${index}`}
                      >
                        {index ===
                          playoffCutoff ? (
                          <View
                            style={
                              styles.cutoffContainer
                            }
                          >
                            <View
                              style={
                                styles.cutoffLine
                              }
                            />

                            <Text
                              style={
                                styles.cutoffText
                              }
                            >
                              Playoff Cutoff
                            </Text>

                            <View
                              style={
                                styles.cutoffLine
                              }
                            />
                          </View>
                        ) : null}

                        <View
                          style={[
                            styles.tableRow,
                            isBelowCutoff &&
                            styles.belowCutoffRow,
                          ]}
                        >
                          <TableCell
                            value={String(
                              position
                            )}
                            style={
                              styles.colRank
                            }
                          />

                          <TouchableOpacity
                            activeOpacity={0.7}
                            style={
                              styles.colTeam
                            }
                            onPress={() =>
                              openTeamCard(
                                team,
                                position
                              )
                            }
                          >
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.teamText,
                                isBelowCutoff &&
                                styles.belowCutoffText,
                              ]}
                            >
                              {team.team}
                            </Text>
                          </TouchableOpacity>

                          <TableCell
                            value={String(
                              team.wins
                            )}
                            style={
                              styles.colTiny
                            }
                          />

                          <TableCell
                            value={String(
                              team.losses
                            )}
                            style={
                              styles.colTiny
                            }
                          />

                          <TableCell
                            value={String(
                              team.pf ?? 0
                            )}
                            style={
                              styles.colSmall
                            }
                          />

                          <TableCell
                            value={String(
                              team.pa ?? 0
                            )}
                            style={
                              styles.colSmall
                            }
                          />

                          <TableCell
                            value={getPointDifference(
                              team.pf,
                              team.pa
                            )}
                            style={
                              styles.colSmall
                            }
                          />

                          <TableCell
                            value={getWinPercentage(
                              team.wins,
                              team.losses
                            )}
                            style={
                              styles.colPct
                            }
                          />

                          <TableCell
                            value={getGamesBack(
                              team.wins,
                              team.losses
                            )}
                            style={
                              styles.colSmall
                            }
                          />
                        </View>
                      </React.Fragment>
                    );
                  }
                )
              )}
            </View>
          </ScrollView>
        </View>

        <View style={styles.keyCard}>
          <Text style={styles.keyTitle}>
            Standings Key
          </Text>

          <View style={styles.keyGrid}>
            <KeyItem
              abbreviation="PF"
              description="Points For"
            />

            <KeyItem
              abbreviation="PA"
              description="Points Against"
            />

            <KeyItem
              abbreviation="GB"
              description="Games Back"
            />

            <KeyItem
              abbreviation="Win %"
              description="Winning Percentage"
            />
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              router.push(
                {
                  pathname:
                    "/(tabs)/standings/seasonPicture/[league]",
                  params: {
                    league: leagueKey,
                  },
                } as any
              )
            }
            style={({ pressed }) => [
              styles.actionButton,
              pressed &&
              styles.actionButtonPressed,
            ]}
          >
            <Ionicons
              name="bar-chart"
              size={18}
              color={colors.surface}
            />

            <Text style={styles.actionText}>
              Season Picture
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() =>
              router.push(
                {
                  pathname:
                    "/(tabs)/standings/playoffBracket/[league]",
                  params: {
                    league: leagueKey,
                  },
                } as any
              )
            }
            style={({ pressed }) => [
              styles.actionButton,
              pressed &&
              styles.actionButtonPressed,
            ]}
          >
            <Ionicons
              name="trophy"
              size={18}
              color={colors.surface}
            />

            <Text style={styles.actionText}>
              Playoff Bracket
            </Text>
          </Pressable>
        </View>
      </ScreenContent>

      {selectedTeam ? (
        <SearchTeamCard
          visible
          team={selectedTeam}
          onClose={closeTeamCard}
        />
      ) : null}
    </AppScreen>
  );
}

type TableHeaderCellProps = {
  label: string;
  style: StyleProp<TextStyle>;
  align?: "left" | "center";
};

function TableHeaderCell({
  label,
  style,
  align = "center",
}: TableHeaderCellProps) {
  return (
    <Text
      style={[
        styles.headerText,
        style,
        align === "left" &&
        styles.textLeft,
      ]}
    >
      {label}
    </Text>
  );
}

type TableCellProps = {
  value: string;
  style: StyleProp<TextStyle>;
};

function TableCell({
  value,
  style,
}: TableCellProps) {
  return (
    <Text
      style={[styles.cellText, style]}
    >
      {value}
    </Text>
  );
}

type KeyItemProps = {
  abbreviation: string;
  description: string;
};

function KeyItem({
  abbreviation,
  description,
}: KeyItemProps) {
  return (
    <View style={styles.keyItem}>
      <Text style={styles.keyAbbreviation}>
        {abbreviation}
      </Text>

      <Text style={styles.keyDescription}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 150,
  },

  leagueIdentityCard: {
    width: "100%",
    minHeight: 88,

    alignItems: "center",
    justifyContent: "center",

    paddingVertical: spacing.md,

    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,

    backgroundColor: colors.surface,

    ...shadows.card,
  },

  sportCircle: {
    width: 54,
    height: 54,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: radius.pill,
    backgroundColor: colors.primary,

    ...shadows.soft,
  },

  identityContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: spacing.md,
  },

  identityText: {
    justifyContent: "center",
  },

  leagueDay: {
    color: colors.primary,
    fontSize: typography.subheading,
    fontWeight: "800",
    textAlign: "left",
  },

  leagueName: {
    marginTop: 2,

    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "600",
    textAlign: "left",
  },

  tableCard: {
    width: "100%",

    padding: spacing.lg,

    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,

    backgroundColor: colors.surface,

    ...shadows.card,
  },

  tableInfoSection: {
    width: "100%",
    gap: spacing.md,
  },

  tableInfoTopRow: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    gap: spacing.md,
  },

  tableInfoBottomRow: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    gap: spacing.md,

    paddingTop: spacing.sm,

    borderTopWidth:
      StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },

  tableTitle: {
    flex: 1,

    color: colors.primary,
    fontSize: typography.subheading,
    fontWeight: "800",
  },

  weekText: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: "800",
    textAlign: "right",
  },

  sessionText: {
    flex: 0.75,

    color: colors.primary,
    fontSize: typography.small,
    fontWeight: "900",
  },

  playoffQualifierText: {
    flex: 1.25,
    paddingLeft: spacing.xl,
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: "800",
    textAlign: "right",

  },

  tableDivider: {
    height: 1,

    marginTop: spacing.lg,
    marginBottom: spacing.md,

    backgroundColor: colors.border,
  },

  horizontalTable: {
    paddingBottom: spacing.xs,
  },

  tableRow: {
    minHeight: 44,

    flexDirection: "row",
    alignItems: "center",

    borderBottomWidth:
      StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },

  tableHeader: {
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
  },

  headerText: {
    paddingVertical: spacing.sm,

    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
  },

  cellText: {
    paddingVertical: spacing.sm,

    color: colors.text,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },

  teamText: {
    paddingHorizontal: 4,
    paddingVertical: spacing.sm,

    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },

  textLeft: {
    textAlign: "left",
  },

  colRank: {
    width: 34,
    textAlign: "center",
  },

  colTeam: {
    width: 118,
  },

  colTiny: {
    width: 38,
    textAlign: "center",
  },

  colSmall: {
    width: 50,
    textAlign: "center",
  },

  colPct: {
    width: 62,
    textAlign: "center",
  },

  cutoffContainer: {
    width: "100%",
    minHeight: 28,

    flexDirection: "row",
    alignItems: "center",

    gap: spacing.sm,

    paddingHorizontal: spacing.sm,
  },

  cutoffLine: {
    flex: 1,
    height: 1,

    backgroundColor: colors.primary,
    opacity: 0.3,
  },

  cutoffText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  belowCutoffRow: {
    opacity: 0.52,
  },

  belowCutoffText: {
    color: colors.textMuted,
  },

  emptyRow: {
    width: 478,
    padding: spacing.xl,
  },

  emptyText: {
    color: colors.textMuted,
    fontWeight: "700",
    textAlign: "center",
  },

  keyCard: {
    width: "100%",

    padding: spacing.lg,

    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,

    backgroundColor: colors.surface,

    ...shadows.card,
  },

  keyTitle: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: "800",
    textAlign: "center",
  },

  keyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",

    marginTop: spacing.md,
  },

  keyItem: {
    width: "50%",

    alignItems: "center",
    justifyContent: "center",

    padding: spacing.sm,
  },

  keyAbbreviation: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: "800",
    textAlign: "center",
  },

  keyDescription: {
    marginTop: 2,

    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: "600",
    textAlign: "center",
  },

  actionRow: {
    width: "100%",

    flexDirection: "row",

    gap: spacing.md,
  },

  actionButton: {
    flex: 1,
    minHeight: 50,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: spacing.sm,

    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,

    borderRadius: radius.md,
    backgroundColor: colors.primary,

    ...shadows.navigationButton,
  },

  actionText: {
    color: colors.surface,
    fontSize: typography.small,
    fontWeight: "800",
    textAlign: "center",
  },

  actionButtonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },

  errorCard: {
    width: "100%",

    padding: spacing.xl,

    borderRadius: radius.lg,
    backgroundColor: colors.surface,

    ...shadows.card,
  },

  errorTitle: {
    color: colors.primary,
    fontSize: typography.heading,
    fontWeight: "800",
    textAlign: "center",
  },

  errorText: {
    marginTop: spacing.sm,

    color: colors.textMuted,
    fontSize: typography.body,
    textAlign: "center",
  },
});