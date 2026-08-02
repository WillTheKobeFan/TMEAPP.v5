// app/(tabs)/standings/seasonPicture/[league].tsx

import React, {
  ComponentProps,
  useMemo,
  useState,
} from "react";
import {
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
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
import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from "@/theme";

type SeasonStatus =
  | "locked"
  | "safe"
  | "close"
  | "currentlyIn"
  | "outside";

type SeasonTeamRow = {
  teamName: string;
  seed: number;
  record: string;
  gamesLeft: number;

  nextGame: string;
  playoffStatus: string;
  playoffPosition: string;
  tiebreakerStatus: string;
  statusDetails: string;

  seasonStatus: SeasonStatus;

  logo?: ImageSourcePropType;
  primaryColor?: string;
  secondaryColor?: string;
};

type SeasonData = {
  title: string;
  teams: SeasonTeamRow[];
};

type SearchTeamCardProps =
  ComponentProps<typeof SearchTeamCard>;

type SearchTeamData =
  NonNullable<SearchTeamCardProps["team"]>;

type LeagueName =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday";

const playoffCutoffMap: Record<LeagueName, number> = {
  Sunday: 8,
  Monday: 4,
  Tuesday: 4,
  Wednesday: 4,
};

const weekMap: Record<LeagueName, string> = {
  Sunday: "Week 9 of 10",
  Monday: "Week 9 of 10",
  Tuesday: "Week 9 of 10",
  Wednesday: "Week 9 of 10",
};

const sessionMap: Record<LeagueName, string> = {
  Sunday: "Spring 2026",
  Monday: "Spring 2026",
  Tuesday: "Spring 2026",
  Wednesday: "Spring 2026",
};

const teamAbbreviationMap: Record<string, string> = {
  Edwards: "ED",
  Timmy: "TM",
  TeeJ: "TJ",
  Prince: "PR",
  Tom: "TO",
  Dale: "DA",
  Rich: "RI",
  Dex: "DX",
  Ziller: "ZI",
};

const seasonData: Record<LeagueName, SeasonData> = {
  Sunday: {
    title: "Sunday AM Season Picture",

    teams: [
      {
        seed: 1,
        teamName: "Edwards",
        record: "7-2",
        gamesLeft: 1,

        nextGame: "vs Ziller",
        playoffStatus: "Clinched",
        playoffPosition: "#1 Seed",
        tiebreakerStatus:
          "Holds tiebreaker over Timmy",
        statusDetails:
          "Fighting for the top seed",

        seasonStatus: "locked",

        primaryColor: "#E97222",
        secondaryColor: "#111111",
      },

      {
        seed: 2,
        teamName: "Timmy",
        record: "6-3",
        gamesLeft: 1,

        nextGame: "vs Tom",
        playoffStatus: "Clinched",
        playoffPosition: "#2 Seed",
        tiebreakerStatus:
          "Lost tiebreaker to Edwards",
        statusDetails: "Can still move up",

        seasonStatus: "safe",

        primaryColor: "#2563EB",
        secondaryColor: "#FFFFFF",
      },

      {
        seed: 3,
        teamName: "TeeJ",
        record: "5-4",
        gamesLeft: 1,

        nextGame: "vs Dale",
        playoffStatus: "Currently In",
        playoffPosition: "#3 Seed",
        tiebreakerStatus:
          "Holds tiebreaker over Prince",
        statusDetails:
          "A win helps secure a higher seed",

        seasonStatus: "safe",

        primaryColor: "#EAB308",
        secondaryColor: "#111111",
      },

      {
        seed: 4,
        teamName: "Prince",
        record: "4-5",
        gamesLeft: 1,

        nextGame: "vs Rich",
        playoffStatus: "Currently In",
        playoffPosition: "#4 Seed",
        tiebreakerStatus:
          "Holds tiebreaker over Tom",
        statusDetails: "Win and in",

        seasonStatus: "close",

        primaryColor: "#DC2626",
        secondaryColor: "#FFFFFF",
      },

      {
        seed: 5,
        teamName: "Tom",
        record: "4-5",
        gamesLeft: 1,

        nextGame: "vs Timmy",
        playoffStatus: "Bubble Team",
        playoffPosition: "#5 Seed",
        tiebreakerStatus:
          "Lost tiebreaker to Prince",
        statusDetails:
          "Must win or receive help",

        seasonStatus: "close",

        primaryColor: "#FFFFFF",
        secondaryColor: "#111111",
      },

      {
        seed: 6,
        teamName: "Dale",
        record: "4-5",
        gamesLeft: 1,

        nextGame: "vs TeeJ",
        playoffStatus: "Bubble Team",
        playoffPosition: "#6 Seed",
        tiebreakerStatus:
          "Tiebreaker undecided",
        statusDetails: "Needs a win or help",

        seasonStatus: "close",

        primaryColor: "#2563EB",
        secondaryColor: "#EAB308",
      },

      {
        seed: 7,
        teamName: "Rich",
        record: "4-5",
        gamesLeft: 1,

        nextGame: "vs Prince",
        playoffStatus: "Bubble Team",
        playoffPosition: "#7 Seed",
        tiebreakerStatus:
          "Holds tiebreaker over Dex",
        statusDetails: "Must win",

        seasonStatus: "close",

        primaryColor: "#16A34A",
        secondaryColor: "#FFFFFF",
      },

      {
        seed: 8,
        teamName: "Dex",
        record: "4-5",
        gamesLeft: 1,

        nextGame: "TBD",
        playoffStatus: "Currently In",
        playoffPosition: "#8 Seed",
        tiebreakerStatus:
          "Lost tiebreaker to Rich",
        statusDetails:
          "Currently holds the final spot",

        seasonStatus: "currentlyIn",

        primaryColor: "#7C3AED",
        secondaryColor: "#FFFFFF",
      },

      {
        seed: 9,
        teamName: "Ziller",
        record: "2-7",
        gamesLeft: 1,

        nextGame: "vs Edwards",
        playoffStatus: "Needs Help",
        playoffPosition: "Outside Cutoff",
        tiebreakerStatus:
          "Needs help from teams above",
        statusDetails:
          "Needs multiple teams above to lose",

        seasonStatus: "outside",

        primaryColor: "#111111",
        secondaryColor: "#FFFFFF",
      },
    ],
  },

  Monday: {
    title: "Monday PM Season Picture",
    teams: [],
  },

  Tuesday: {
    title: "Tuesday PM Season Picture",
    teams: [],
  },

  Wednesday: {
    title: "Wednesday PM Season Picture",
    teams: [],
  },
};

function resolveLeague(
  input: string
): LeagueName {
  const value = input.toLowerCase();

  if (value.includes("mon")) {
    return "Monday";
  }

  if (value.includes("tue")) {
    return "Tuesday";
  }

  if (value.includes("wed")) {
    return "Wednesday";
  }

  return "Sunday";
}

function createTeamId(
  league: LeagueName,
  teamName: string
): string {
  const normalizedName = teamName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return `${league.toLowerCase()}-${normalizedName}`;
}

function parseRecord(record: string): {
  wins: number;
  losses: number;
} {
  const [winsValue, lossesValue] =
    record.split("-");

  return {
    wins: Number(winsValue) || 0,
    losses: Number(lossesValue) || 0,
  };
}

function getGamesBack(
  teamRecord: string,
  leaderRecord: string
): string {
  const team = parseRecord(teamRecord);
  const leader = parseRecord(leaderRecord);

  const gamesBack =
    (leader.wins -
      team.wins +
      (team.losses - leader.losses)) /
    2;

  if (gamesBack <= 0) {
    return "—";
  }

  return Number.isInteger(gamesBack)
    ? String(gamesBack)
    : gamesBack.toFixed(1);
}

function getTeamAbbreviation(
  teamName: string
): string {
  const configuredAbbreviation =
    teamAbbreviationMap[teamName];

  if (configuredAbbreviation) {
    return configuredAbbreviation;
  }

  return teamName
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getTiebreakerDisplay(
  tiebreakerStatus: string
): string {
  const normalized =
    tiebreakerStatus.toLowerCase();

  if (
    normalized.includes("holds tiebreaker over")
  ) {
    const teamName = tiebreakerStatus
      .replace(
        /holds tiebreaker over/i,
        ""
      )
      .trim();

    return `↑ ${getTeamAbbreviation(
      teamName
    )}`;
  }

  if (
    normalized.includes("lost tiebreaker to")
  ) {
    const teamName = tiebreakerStatus
      .replace(
        /lost tiebreaker to/i,
        ""
      )
      .trim();

    return `↓ ${getTeamAbbreviation(
      teamName
    )}`;
  }

  if (normalized.includes("undecided")) {
    return "↔ TBD";
  }

  return "—";
}

function getStatusPresentation(
  status: SeasonStatus
): {
  icon: string;
  label: string;
} {
  switch (status) {
    case "locked":
      return {
        icon: "🔒",
        label: "Locked",
      };

    case "safe":
      return {
        icon: "✅",
        label: "Safe",
      };

    case "close":
      return {
        icon: "⚠️",
        label: "Close",
      };

    case "currentlyIn":
      return {
        icon: "🎯",
        label: "Currently In",
      };

    case "outside":
      return {
        icon: "🚫",
        label: "Outside",
      };
  }
}

export default function SeasonPictureScreen() {
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

  const normalizedLeague = useMemo(
    () =>
      resolveLeague(
        rawLeague ?? "Sunday"
      ),
    [rawLeague]
  );

  const leagueKey =
    normalizedLeague.toLowerCase();

  const data =
    seasonData[normalizedLeague];

  const teams = [...data.teams].sort(
    (firstTeam, secondTeam) =>
      firstTeam.seed - secondTeam.seed
  );

  const playoffCutoff =
    playoffCutoffMap[normalizedLeague];

  const weekText =
    weekMap[normalizedLeague];

  const sessionText =
    sessionMap[normalizedLeague];

  const leaderRecord =
    teams[0]?.record ?? "0-0";

  const leagueNight = useMemo<
    LeagueNightData | undefined
  >(() => {
    return leagueNightConfig.find(
      (item) =>
        item.organizationId ===
          selectedLeagueId &&
        item.routeLeagueId.toLowerCase() ===
          leagueKey
    );
  }, [leagueKey, selectedLeagueId]);

  const leagueDayTitle = leagueNight
    ? `${leagueNight.day} • ${leagueNight.period}`
    : `${normalizedLeague} • ${
        normalizedLeague === "Sunday"
          ? "AM"
          : "PM"
      }`;

  const leagueDisplayName =
    leagueNight?.displayName ??
    "Adult Recreational League";

  const openTeamCard = (
    team: SeasonTeamRow
  ) => {
    const modalTeam = {
      id: createTeamId(
        normalizedLeague,
        team.teamName
      ),

      teamName: team.teamName,
      captain: team.teamName,
      league: normalizedLeague,

      record: team.record,
      place: team.seed,
      status: team.playoffStatus,

      nextGame: team.nextGame,
      nextMatch: team.nextGame,

      lastResult:
        team.tiebreakerStatus,

      schedule: [],
    } as SearchTeamData;

    setSelectedTeam(modalTeam);
  };

  const closeTeamCard = () => {
    setSelectedTeam(null);
  };

  return (
    <AppScreen
      contentContainerStyle={
        styles.scrollContent
      }
    >
      <ScreenHeader
        title="Season Picture"
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
                {normalizedLeague} League
              </Text>

              <Text style={styles.weekText}>
                {weekText}
              </Text>
            </View>

            <View
              style={
                styles.tableInfoBottomRow
              }
            >
              <Text style={styles.sessionText}>
                {sessionText}
              </Text>

              <Text
                style={
                  styles.playoffQualifierText
                }
              >
                Top {playoffCutoff} Teams Make
                Playoffs
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
                  label="Record"
                  style={styles.colRecord}
                />

                <TableHeaderCell
                  label="Games Left"
                  style={styles.colGamesLeft}
                />

                <TableHeaderCell
                  label="GB"
                  style={styles.colGamesBack}
                />

                <TableHeaderCell
                  label="Tiebreaker"
                  style={styles.colTiebreaker}
                />

                <TableHeaderCell
                  label="Status"
                  style={styles.colStatus}
                />
              </View>

              {teams.length === 0 ? (
                <View style={styles.emptyRow}>
                  <Text style={styles.emptyText}>
                    Season Picture data is not
                    available yet.
                  </Text>
                </View>
              ) : (
                teams.map((team, index) => {
                  const position = index + 1;

                  const isBelowCutoff =
                    position >
                    playoffCutoff;

                  const status =
                    getStatusPresentation(
                      team.seasonStatus
                    );

                  return (
                    <React.Fragment
                      key={`${team.seed}-${team.teamName}`}
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
                            Playoff Cut Off
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
                            styles.outsideRow,
                        ]}
                      >
                        <TableCell
                          value={String(
                            team.seed
                          )}
                          style={
                            styles.colRank
                          }
                        />

                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={styles.colTeam}
                          onPress={() =>
                            openTeamCard(team)
                          }
                        >
                          <View
                            style={
                              styles.teamCellContent
                            }
                          >
                            <TeamBrandMark
                              logo={team.logo}
                              primaryColor={
                                team.primaryColor
                              }
                              secondaryColor={
                                team.secondaryColor
                              }
                            />

                            <Text
                              numberOfLines={1}
                              style={[
                                styles.teamText,
                                isBelowCutoff &&
                                  styles.outsideText,
                              ]}
                            >
                              {team.teamName}
                            </Text>
                          </View>
                        </TouchableOpacity>

                        <TableCell
                          value={team.record}
                          style={
                            styles.colRecord
                          }
                        />

                        <TableCell
                          value={String(
                            team.gamesLeft
                          )}
                          style={
                            styles.colGamesLeft
                          }
                        />

                        <TableCell
                          value={getGamesBack(
                            team.record,
                            leaderRecord
                          )}
                          style={
                            styles.colGamesBack
                          }
                        />

                        <TableCell
                          value={getTiebreakerDisplay(
                            team.tiebreakerStatus
                          )}
                          style={
                            styles.colTiebreaker
                          }
                        />

                        <View
                          style={styles.colStatus}
                        >
                          <View
                            style={
                              styles.statusContent
                            }
                          >
                            <Text
                              style={
                                styles.statusIcon
                              }
                            >
                              {status.icon}
                            </Text>

                            <Text
                              numberOfLines={1}
                              style={[
                                styles.statusText,
                                isBelowCutoff &&
                                  styles.outsideText,
                              ]}
                            >
                              {status.label}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </React.Fragment>
                  );
                })
              )}
            </View>
          </ScrollView>
        </View>

        <View style={styles.guideCard}>
          <View style={styles.guideTitleRow}>
            <View style={styles.guideSportIcon}>
              <Ionicons
                name="basketball-outline"
                size={18}
                color={colors.surface}
              />
            </View>

            <Text style={styles.guideTitle}>
              Season Guide
            </Text>
          </View>

          <Text style={styles.guideSectionTitle}>
            STATUS
          </Text>

          <View style={styles.guideRows}>
            <GuideRow
              symbol="🔒"
              label="Locked"
              description="Clinched playoff berth"
            />

            <GuideRow
              symbol="✅"
              label="Safe"
              description="Comfortable playoff position"
            />

            <GuideRow
              symbol="⚠️"
              label="Close"
              description="Fighting for playoff position"
            />

            <GuideRow
              symbol="🚫"
              label="Outside"
              description="Outside the playoff cutoff"
            />
          </View>

          <View style={styles.guideDivider} />

          <Text style={styles.guideSectionTitle}>
            TIEBREAKERS
          </Text>

          <View style={styles.guideRows}>
            <GuideRow
              symbol="↑"
              label="Holds"
              description="Holds tiebreaker over listed team"
            />

            <GuideRow
              symbol="↓"
              label="Loses"
              description="Loses tiebreaker to listed team"
            />

            <GuideRow
              symbol="↔"
              label="TBD"
              description="Tiebreaker has not been decided"
            />
          </View>

          <View style={styles.guideDivider} />

          <Text style={styles.guideSectionTitle}>
            TEAM ABBREVIATIONS
          </Text>

          <View style={styles.abbreviationGrid}>
            {Object.entries(
              teamAbbreviationMap
            ).map(
              ([
                teamName,
                abbreviation,
              ]) => (
                <View
                  key={teamName}
                  style={
                    styles.abbreviationItem
                  }
                >
                  <Text
                    style={
                      styles.abbreviationCode
                    }
                  >
                    {abbreviation}
                  </Text>

                  <Text
                    style={
                      styles.abbreviationName
                    }
                  >
                    {teamName}
                  </Text>
                </View>
              )
            )}
          </View>

          <Text style={styles.guideNotice}>
            Standings already reflect all
            applicable league tiebreakers.
          </Text>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              router.push(
                {
                  pathname:
                    "/(tabs)/standings/[league]",
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
              Standings
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

type TeamBrandMarkProps = {
  logo?: ImageSourcePropType;
  primaryColor?: string;
  secondaryColor?: string;
};

function TeamBrandMark({
  primaryColor = colors.primary,
  secondaryColor,
}: TeamBrandMarkProps) {
  if (secondaryColor) {
    return (
      <View style={styles.brandMark}>
        <View
          style={[
            styles.brandHalf,
            {
              backgroundColor:
                primaryColor,
            },
          ]}
        />

        <View
          style={[
            styles.brandHalf,
            {
              backgroundColor:
                secondaryColor,
            },
          ]}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.brandMark,
        {
          backgroundColor: primaryColor,
        },
      ]}
    />
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

type GuideRowProps = {
  symbol: string;
  label: string;
  description: string;
};

function GuideRow({
  symbol,
  label,
  description,
}: GuideRowProps) {
  return (
    <View style={styles.guideRow}>
      <Text style={styles.guideSymbol}>
        {symbol}
      </Text>

      <Text style={styles.guideLabel}>
        {label}
      </Text>

      <Text style={styles.guideDescription}>
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

    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,

    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,

    backgroundColor: colors.surface,

    ...shadows.card,
  },

  identityContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: spacing.md,
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

  identityText: {
    justifyContent: "center",
  },

  leagueDay: {
    color: colors.primary,
    fontSize: typography.subheading,
    fontWeight: "800",
  },

  leagueName: {
    marginTop: 2,

    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "600",
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
    fontWeight: "700",
  },

  playoffQualifierText: {
    flex: 1,

    paddingLeft: spacing.md,

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
    minHeight: 48,

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
    fontSize: 11,
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

  textLeft: {
    textAlign: "left",
  },

  colRank: {
    width: 32,
    textAlign: "center",
  },

  colTeam: {
    width: 136,
  },

  colRecord: {
    width: 64,
    textAlign: "center",
  },

  colGamesLeft: {
    width: 74,
    textAlign: "center",
  },

  colGamesBack: {
    width: 46,
    textAlign: "center",
  },

  colTiebreaker: {
    width: 82,
    textAlign: "center",
  },

  colStatus: {
    width: 110,

    alignItems: "center",
    justifyContent: "center",
  },

  teamCellContent: {
    flexDirection: "row",
    alignItems: "center",

    gap: spacing.sm,

    paddingHorizontal: 4,
  },

  brandMark: {
    width: 19,
    height: 19,

    flexDirection: "row",

    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,

    overflow: "hidden",
  },

  brandHalf: {
    width: "50%",
    height: "100%",
  },

  teamText: {
    flex: 1,

    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },

  statusContent: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 4,
  },

  statusIcon: {
    fontSize: 12,
  },

  statusText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "700",
  },

  cutoffContainer: {
    width: "100%",
    minHeight: 34,

    flexDirection: "row",
    alignItems: "center",

    gap: spacing.sm,

    paddingHorizontal: spacing.sm,

    backgroundColor: colors.primarySoft,
  },

  cutoffLine: {
    flex: 1,
    height: 1,

    backgroundColor: colors.primary,
    opacity: 0.35,
  },

  cutoffText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },

  outsideRow: {
    opacity: 0.55,
  },

  outsideText: {
    color: colors.textMuted,
  },

  emptyRow: {
    width: 544,
    padding: spacing.xl,
  },

  emptyText: {
    color: colors.textMuted,
    fontWeight: "700",
    textAlign: "center",
  },

  guideCard: {
    width: "100%",

    padding: spacing.lg,

    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,

    backgroundColor: colors.surface,

    ...shadows.card,
  },

  guideTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: spacing.sm,
  },

  guideSportIcon: {
    width: 30,
    height: 30,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },

  guideTitle: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: "800",
  },

  guideSectionTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,

    color: colors.primary,
    fontSize: typography.small,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  guideRows: {
    gap: spacing.sm,
  },

  guideRow: {
    minHeight: 28,

    flexDirection: "row",
    alignItems: "center",
  },

  guideSymbol: {
    width: 28,

    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: "800",
    textAlign: "center",
  },

  guideLabel: {
    width: 75,

    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: "800",
  },

  guideDescription: {
    flex: 1,

    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: "600",
  },

  guideDivider: {
    height: StyleSheet.hairlineWidth,

    marginTop: spacing.lg,

    backgroundColor: colors.border,
  },

  abbreviationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  abbreviationItem: {
    width: "50%",

    flexDirection: "row",
    alignItems: "center",

    paddingVertical: spacing.xs,
  },

  abbreviationCode: {
    width: 32,

    color: colors.primary,
    fontSize: typography.small,
    fontWeight: "900",
  },

  abbreviationName: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: "600",
  },

  guideNotice: {
    marginTop: spacing.lg,

    color: colors.primary,
    fontSize: typography.small,
    fontWeight: "700",
    lineHeight: 18,
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
});