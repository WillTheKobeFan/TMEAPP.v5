// app/admin/league-overview.tsx

// app/admin/league-overview.tsx

import React, { useMemo, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Href,
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import ScreenLayout from "@/components/ScreenLayout";
import CustomNavBar from "@/components/CustomNavBar";
import { useTextSize } from "@/context/TextSizeContext";

const COLORS = {
  purple: "#250F74",
  lightPurple: "#F6F2FF",
  background: "#F8F7FB",
  white: "#FFFFFF",
  text: "#1E1B24",
  muted: "#6B6872",
  border: "#EAE5F2",
  divider: "#F0EDF4",

  success: "#138A4B",
  successBackground: "#EAF7EF",

  inactive: "#77727E",
  inactiveBackground: "#F1F0F4",

  warning: "#9A6700",
  warningBackground: "#FFF5D8",
};

type IconName =
  React.ComponentProps<typeof Ionicons>["name"];

type LeagueKey =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday";

type LeagueStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "UPCOMING";

type OverviewSectionId =
  | "season"
  | "games"
  | "teams";

type LeagueOverviewData = {
  key: LeagueKey;
  leagueName: string;
  dayPeriod: string;
  seasonName: string;
  status: LeagueStatus;
  currentWeek: number;
  regularWeeks: number;
  totalWeeks: number;
  activeTeams: number;
  gamesCompleted: number;
  gamesRemaining: number;
  missingScores: number;
  nextGameDate: string;
  location: string;
  playoffTeams: number;
  scheduleStatus:
    | "Published"
    | "Draft"
    | "Not Created";
};

type OverviewDropdownProps = {
  id: OverviewSectionId;
  title: string;
  subtitle: string;
  icon: IconName;
  activeSection: OverviewSectionId | null;
  onToggle: (id: OverviewSectionId) => void;
  children: React.ReactNode;
};

type OverviewRowProps = {
  label: string;
  value: string;
  icon: IconName;
  warning?: boolean;
  last?: boolean;
};

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LEAGUE_DATA: Record<
  LeagueKey,
  LeagueOverviewData
> = {
  sunday: {
    key: "sunday",
    leagueName: "Sunday",
    dayPeriod: "AM",
    seasonName: "Spring 2026",
    status: "ACTIVE",
    currentWeek: 7,
    regularWeeks: 10,
    totalWeeks: 12,
    activeTeams: 9,
    gamesCompleted: 22,
    gamesRemaining: 12,
    missingScores: 2,
    nextGameDate: "August 2, 2026",
    location: "YMCA",
    playoffTeams: 8,
    scheduleStatus: "Published",
  },

  monday: {
    key: "monday",
    leagueName: "Monday",
    dayPeriod: "PM",
    seasonName: "Spring 2026",
    status: "ACTIVE",
    currentWeek: 4,
    regularWeeks: 10,
    totalWeeks: 11,
    activeTeams: 7,
    gamesCompleted: 10,
    gamesRemaining: 20,
    missingScores: 0,
    nextGameDate: "August 3, 2026",
    location: "Berlin",
    playoffTeams: 4,
    scheduleStatus: "Published",
  },

  tuesday: {
    key: "tuesday",
    leagueName: "Tuesday",
    dayPeriod: "PM",
    seasonName: "No active season",
    status: "INACTIVE",
    currentWeek: 0,
    regularWeeks: 10,
    totalWeeks: 11,
    activeTeams: 0,
    gamesCompleted: 0,
    gamesRemaining: 0,
    missingScores: 0,
    nextGameDate: "Not scheduled",
    location: "YMCA",
    playoffTeams: 4,
    scheduleStatus: "Not Created",
  },

  wednesday: {
    key: "wednesday",
    leagueName: "Wednesday",
    dayPeriod: "PM",
    seasonName: "Spring 2026",
    status: "ACTIVE",
    currentWeek: 6,
    regularWeeks: 10,
    totalWeeks: 11,
    activeTeams: 7,
    gamesCompleted: 17,
    gamesRemaining: 13,
    missingScores: 1,
    nextGameDate: "August 5, 2026",
    location: "Berlin",
    playoffTeams: 4,
    scheduleStatus: "Published",
  },
};

function normalizeLeagueParam(
  value: string | string[] | undefined,
): LeagueKey {
  const candidate = Array.isArray(value)
    ? value[0]
    : value;

  switch (candidate?.toLowerCase()) {
    case "monday":
      return "monday";

    case "tuesday":
      return "tuesday";

    case "wednesday":
      return "wednesday";

    case "sunday":
    default:
      return "sunday";
  }
}

export default function LeagueOverviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    league?: string | string[];
  }>();

  const { textScale } = useTextSize();

  const selectedLeagueKey = useMemo(
    () => normalizeLeagueParam(params.league),
    [params.league],
  );

  const selectedLeague =
    LEAGUE_DATA[selectedLeagueKey];

  const [activeSection, setActiveSection] =
    useState<OverviewSectionId | null>(
      "season",
    );

  const toggleSection = (
    id: OverviewSectionId,
  ) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut,
    );

    setActiveSection((current) =>
      current === id ? null : id,
    );
  };

  const push = (href: Href) => {
    router.push(href);
  };

  const progress =
    selectedLeague.regularWeeks > 0
      ? Math.min(
          selectedLeague.currentWeek /
            selectedLeague.regularWeeks,
          1,
        )
      : 0;

  const progressPercent =
    Math.round(progress * 100);

  const statusColors =
    getStatusColors(selectedLeague.status);

  return (
    <ScreenLayout
      title="League Overview"
      showOrganizationSelector={true}
      showSettingsShortcut={false}
    >
      <View style={styles.screen}>
        <View style={styles.contentArea}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={
              styles.scrollContent
            }
          >
            <View style={styles.container}>
              <View style={styles.infoCard}>
                <View style={styles.infoIcon}>
                  <Ionicons
                    name="stats-chart-outline"
                    size={25}
                    color={COLORS.white}
                  />
                </View>

                <View style={styles.infoText}>
                  <Text
                    style={[
                      styles.infoTitle,
                      {
                        fontSize:
                          18 * textScale,
                      },
                    ]}
                  >
                    {selectedLeague.leagueName}{" "}
                    • {selectedLeague.dayPeriod}
                  </Text>

                  <Text
                    style={[
                      styles.infoDescription,
                      {
                        fontSize:
                          12.5 *
                          textScale,
                      },
                    ]}
                  >
                    Review the current season,
                    teams, schedule and game
                    activity.
                  </Text>
                </View>
              </View>

              <View style={styles.summaryCard}>
                <View
                  style={
                    styles.summaryHeader
                  }
                >
                  <View style={styles.summaryTitleArea}>
                    <View
                      style={
                        styles.summaryIcon
                      }
                    >
                      <Ionicons
                        name="basketball-outline"
                        size={22}
                        color={COLORS.purple}
                      />
                    </View>

                    <View
                      style={
                        styles.summaryTitleText
                      }
                    >
                      <Text
                        style={
                          styles.summaryLeague
                        }
                      >
                        {
                          selectedLeague.leagueName
                        }{" "}
                        •{" "}
                        {
                          selectedLeague.dayPeriod
                        }
                      </Text>

                      <Text
                        style={
                          styles.summarySeason
                        }
                      >
                        {
                          selectedLeague.seasonName
                        }
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          statusColors.background,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            statusColors.text,
                        },
                      ]}
                    >
                      {selectedLeague.status}
                    </Text>
                  </View>
                </View>

                {selectedLeague.status ===
                "INACTIVE" ? (
                  <View
                    style={
                      styles.inactiveState
                    }
                  >
                    <Ionicons
                      name="pause-circle-outline"
                      size={28}
                      color={COLORS.muted}
                    />

                    <Text
                      style={
                        styles.inactiveTitle
                      }
                    >
                      No Active Season
                    </Text>

                    <Text
                      style={
                        styles.inactiveDescription
                      }
                    >
                      This league does not
                      currently have an active
                      season.
                    </Text>
                  </View>
                ) : (
                  <>
                    <View
                      style={
                        styles.progressHeader
                      }
                    >
                      <View>
                        <Text
                          style={
                            styles.progressLabel
                          }
                        >
                          Current Week
                        </Text>

                        <Text
                          style={
                            styles.progressValue
                          }
                        >
                          Week{" "}
                          {
                            selectedLeague.currentWeek
                          }{" "}
                          of{" "}
                          {
                            selectedLeague.regularWeeks
                          }
                        </Text>
                      </View>

                      <Text
                        style={
                          styles.progressPercent
                        }
                      >
                        {progressPercent}%
                      </Text>
                    </View>

                    <View
                      style={
                        styles.progressTrack
                      }
                    >
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${progressPercent}%`,
                          },
                        ]}
                      />
                    </View>

                    <View
                      style={
                        styles.summaryMetrics
                      }
                    >
                      <SummaryMetric
                        label="Teams"
                        value={String(
                          selectedLeague.activeTeams,
                        )}
                      />

                      <View
                        style={
                          styles.metricDivider
                        }
                      />

                      <SummaryMetric
                        label="Completed"
                        value={String(
                          selectedLeague.gamesCompleted,
                        )}
                      />

                      <View
                        style={
                          styles.metricDivider
                        }
                      />

                      <SummaryMetric
                        label="Remaining"
                        value={String(
                          selectedLeague.gamesRemaining,
                        )}
                      />
                    </View>
                  </>
                )}
              </View>

              <OverviewDropdown
                id="season"
                title="Season Information"
                subtitle="Week, schedule and playoff setup."
                icon="calendar-outline"
                activeSection={activeSection}
                onToggle={toggleSection}
              >
                <OverviewRow
                  label="Current Week"
                  value={
                    selectedLeague.status ===
                    "INACTIVE"
                      ? "Not started"
                      : `Week ${selectedLeague.currentWeek} of ${selectedLeague.regularWeeks}`
                  }
                  icon="calendar-number-outline"
                />

                <OverviewRow
                  label="Total Season Weeks"
                  value={String(
                    selectedLeague.totalWeeks,
                  )}
                  icon="layers-outline"
                />

                <OverviewRow
                  label="Schedule Status"
                  value={
                    selectedLeague.scheduleStatus
                  }
                  icon="checkmark-circle-outline"
                />

                <OverviewRow
                  label="Playoff Qualifiers"
                  value={`${selectedLeague.playoffTeams} Teams`}
                  icon="trophy-outline"
                />

                <OverviewRow
                  label="Location"
                  value={
                    selectedLeague.location
                  }
                  icon="location-outline"
                  last
                />
              </OverviewDropdown>

              <OverviewDropdown
                id="games"
                title="Game Activity"
                subtitle="Completed, upcoming and missing results."
                icon="basketball-outline"
                activeSection={activeSection}
                onToggle={toggleSection}
              >
                <OverviewRow
                  label="Games Completed"
                  value={String(
                    selectedLeague.gamesCompleted,
                  )}
                  icon="checkmark-done-outline"
                />

                <OverviewRow
                  label="Games Remaining"
                  value={String(
                    selectedLeague.gamesRemaining,
                  )}
                  icon="time-outline"
                />

                <OverviewRow
                  label="Missing Scores"
                  value={String(
                    selectedLeague.missingScores,
                  )}
                  icon="alert-circle-outline"
                  warning={
                    selectedLeague.missingScores >
                    0
                  }
                />

                <OverviewRow
                  label="Next Game Date"
                  value={
                    selectedLeague.nextGameDate
                  }
                  icon="calendar-outline"
                  last
                />
              </OverviewDropdown>

              <OverviewDropdown
                id="teams"
                title="Team Activity"
                subtitle="Active teams and roster management."
                icon="people-outline"
                activeSection={activeSection}
                onToggle={toggleSection}
              >
                <OverviewRow
                  label="Active Teams"
                  value={String(
                    selectedLeague.activeTeams,
                  )}
                  icon="people-circle-outline"
                />

                <OverviewRow
                  label="Roster Status"
                  value={
                    selectedLeague.activeTeams > 0
                      ? "Available"
                      : "No teams"
                  }
                  icon="list-outline"
                  last
                />
              </OverviewDropdown>

              <View style={styles.bottomButtons}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Manage games"
                  style={styles.bottomButton}
                  onPress={() =>
                    push(
                      "/admin/manage-games" as Href,
                    )
                  }
                >
                  <Ionicons
                    name="basketball-outline"
                    size={20}
                    color={COLORS.purple}
                  />

                  <Text
                    style={[
                      styles.bottomButtonText,
                      {
                        fontSize:
                          13 * textScale,
                      },
                    ]}
                  >
                    Manage Games
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Manage teams"
                  style={styles.bottomButton}
                  onPress={() =>
                    push(
                      "/admin/teams-rosters" as Href,
                    )
                  }
                >
                  <Ionicons
                    name="people-outline"
                    size={20}
                    color={COLORS.purple}
                  />

                  <Text
                    style={[
                      styles.bottomButtonText,
                      {
                        fontSize:
                          13 * textScale,
                      },
                    ]}
                  >
                    Manage Teams
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>

        <CustomNavBar />
      </View>
    </ScreenLayout>
  );
}

function OverviewDropdown({
  id,
  title,
  subtitle,
  icon,
  activeSection,
  onToggle,
  children,
}: OverviewDropdownProps) {
  const expanded =
    activeSection === id;

  return (
    <View style={styles.dropdownCard}>
      <TouchableOpacity
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{
          expanded,
        }}
        style={styles.dropdownHeader}
        onPress={() => onToggle(id)}
      >
        <View style={styles.dropdownIcon}>
          <Ionicons
            name={icon}
            size={22}
            color={COLORS.purple}
          />
        </View>

        <View style={styles.dropdownHeaderText}>
          <Text style={styles.dropdownTitle}>
            {title}
          </Text>

          <Text
            style={
              styles.dropdownSubtitle
            }
          >
            {subtitle}
          </Text>
        </View>

        <Ionicons
          name={
            expanded
              ? "chevron-up"
              : "chevron-down"
          }
          size={21}
          color={COLORS.purple}
        />
      </TouchableOpacity>

      {expanded ? (
        <View style={styles.dropdownBody}>
          {children}
        </View>
      ) : null}
    </View>
  );
}

function OverviewRow({
  label,
  value,
  icon,
  warning = false,
  last = false,
}: OverviewRowProps) {
  return (
    <View
      style={[
        styles.overviewRow,
        last && styles.rowLast,
      ]}
    >
      <View
        style={[
          styles.overviewRowIcon,
          warning &&
            styles.warningIconBackground,
        ]}
      >
        <Ionicons
          name={icon}
          size={19}
          color={
            warning
              ? COLORS.warning
              : COLORS.purple
          }
        />
      </View>

      <Text style={styles.overviewLabel}>
        {label}
      </Text>

      <Text
        style={[
          styles.overviewValue,
          warning &&
            styles.warningValue,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function SummaryMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>
        {value}
      </Text>

      <Text style={styles.metricLabel}>
        {label}
      </Text>
    </View>
  );
}

function getStatusColors(
  status: LeagueStatus,
) {
  if (status === "ACTIVE") {
    return {
      text: COLORS.success,
      background:
        COLORS.successBackground,
    };
  }

  if (status === "UPCOMING") {
    return {
      text: COLORS.purple,
      background:
        COLORS.lightPurple,
    };
  }

  return {
    text: COLORS.inactive,
    background:
      COLORS.inactiveBackground,
  };
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  contentArea: {
    flex: 1,
    overflow: "hidden",
  },

  scrollContent: {
    paddingTop: 18,
    paddingBottom: 32,
  },

  container: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    paddingHorizontal: 16,
  },

  infoCard: {
    minHeight: 104,
    marginBottom: 16,
    paddingHorizontal: 17,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,

    shadowColor: "#1E1048",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.11,
    shadowRadius: 9,
    elevation: 5,
  },

  infoIcon: {
    width: 48,
    height: 48,
    marginRight: 13,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.purple,
  },

  infoText: {
    flex: 1,
  },

  infoTitle: {
    color: COLORS.purple,
    fontWeight: "800",
  },

  infoDescription: {
    marginTop: 4,
    color: COLORS.muted,
    fontWeight: "500",
    lineHeight: 18,
  },

  summaryCard: {
    marginBottom: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    backgroundColor: COLORS.white,

    shadowColor: "#1E1048",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  summaryTitleArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  summaryIcon: {
    width: 42,
    height: 42,
    marginRight: 11,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightPurple,
  },

  summaryTitleText: {
    flex: 1,
  },

  summaryLeague: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800",
  },

  summarySeason: {
    marginTop: 2,
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },

  statusBadge: {
    minHeight: 25,
    paddingHorizontal: 9,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  statusText: {
    fontSize: 9.5,
    lineHeight: 12,
    fontWeight: "900",
    letterSpacing: 0.25,
  },

  progressHeader: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  progressLabel: {
    color: COLORS.muted,
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: "600",
  },

  progressValue: {
    marginTop: 2,
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800",
  },

  progressPercent: {
    color: COLORS.purple,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800",
  },

  progressTrack: {
    height: 8,
    marginTop: 10,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: COLORS.lightPurple,
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: COLORS.purple,
  },

  summaryMetrics: {
    minHeight: 68,
    marginTop: 16,
    paddingHorizontal: 4,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },

  metric: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  metricValue: {
    color: COLORS.purple,
    fontSize: 17,
    lineHeight: 21,
    fontWeight: "900",
  },

  metricLabel: {
    marginTop: 2,
    color: COLORS.muted,
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: "600",
  },

  metricDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },

  inactiveState: {
    minHeight: 150,
    marginTop: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      COLORS.inactiveBackground,
  },

  inactiveTitle: {
    marginTop: 8,
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },

  inactiveDescription: {
    maxWidth: 260,
    marginTop: 4,
    textAlign: "center",
    color: COLORS.muted,
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: "500",
  },

  dropdownCard: {
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 21,
    overflow: "hidden",
    backgroundColor: COLORS.white,

    shadowColor: "#1E1048",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 4,
  },

  dropdownHeader: {
    minHeight: 84,
    paddingHorizontal: 15,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  dropdownIcon: {
    width: 42,
    height: 42,
    marginRight: 12,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightPurple,
  },

  dropdownHeaderText: {
    flex: 1,
    paddingRight: 10,
  },

  dropdownTitle: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },

  dropdownSubtitle: {
    marginTop: 3,
    color: COLORS.muted,
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: "500",
  },

  dropdownBody: {
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },

  overviewRow: {
    minHeight: 64,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    flexDirection: "row",
    alignItems: "center",
  },

  overviewRowIcon: {
    width: 36,
    height: 36,
    marginRight: 10,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightPurple,
  },

  warningIconBackground: {
    backgroundColor:
      COLORS.warningBackground,
  },

  overviewLabel: {
    flex: 1,
    paddingRight: 10,
    color: COLORS.text,
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: "700",
  },

  overviewValue: {
    maxWidth: "44%",
    textAlign: "right",
    color: COLORS.muted,
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: "600",
  },

  warningValue: {
    color: COLORS.warning,
    fontWeight: "800",
  },

  rowLast: {
    borderBottomWidth: 0,
  },

  bottomButtons: {
    marginTop: 4,
    flexDirection: "row",
    gap: 10,
  },

  bottomButton: {
    flex: 1,
    minHeight: 54,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: COLORS.white,

    shadowColor: "#1E1048",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  bottomButtonText: {
    flexShrink: 1,
    textAlign: "center",
    color: COLORS.purple,
    fontWeight: "800",
  },
});