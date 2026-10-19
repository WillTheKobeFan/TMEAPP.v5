// app/organization/[organizationId]/league-directory/index.tsx

import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { getConfiguredOfferingsForOrganization } from "@/data/offerings";
import { getOfferingIdForLeague } from "@/adapters/leagueOfferingIds";
import StackNavBar from "@/components/navigation/StackNavBar";
import {
  ORGANIZATIONS,
  ORGANIZATION_IDS,
  type OrganizationId,
} from "@/config/organizations";
import { AppTheme, useTheme } from "@/theme";

const HEADER_SIDE_WIDTH = 96;

type LeagueStatus = "Active" | "Inactive";

type Facility = {
  name: string;
  type: "Primary" | "Alternate";
};

type ScheduleConflict = {
  label: string;
};

type PossibleInterruption = {
  label: string;
  note: string;
  icon:
    | "business-outline"
    | "rainy-outline"
    | "close-circle-outline"
    | "refresh-outline";
};

type League = {
  id: string;
  title: string;
  leagueType: string;
  level: string;
  location: string;
  status: LeagueStatus;

  currentSession: string;
  sessionStartDate: string;
  seasonLength: string;

  teamCount: number;

  facilities: Facility[];
  scheduleConflicts: ScheduleConflict[];
};

const TME_LEAGUES: League[] = [
  {
    id: "sunday-am",
    title: "Sunday AM",
    leagueType: "Men's Rec League",
    level: "Advanced Competition",
    location: "YMCA",
    status: "Active",

    currentSession: "Fall 2026",
    sessionStartDate: "October 8th",
    seasonLength: "10 Weeks + Playoffs",

    teamCount: 9,

    facilities: [
      {
        name: "YMCA",
        type: "Primary",
      },
    ],

    scheduleConflicts: [
      {
        label: "Easter Sunday",
      },
      {
        label: "Mother's Day",
      },
      {
        label: "Father's Day",
      },
    ],
  },

  {
    id: "monday-pm",
    title: "Monday PM",
    leagueType: "Men's Rec League",
    level: "Friendly Competition",
    location: "Berlin",
    status: "Active",

    currentSession: "Fall 2026",
    sessionStartDate: "October 8th",
    seasonLength: "10 Weeks + Playoffs",

    teamCount: 7,

    facilities: [
      {
        name: "Berlin",
        type: "Primary",
      },
      {
        name: "YMCA",
        type: "Alternate",
      },
    ],

    scheduleConflicts: [
      {
        label: "Memorial Day",
      },
      {
        label: "Labor Day",
      },
    ],
  },

  {
    id: "wednesday-pm",
    title: "Wednesday PM",
    leagueType: "Men's Rec League",
    level: "Intermediate Competition",
    location: "Berlin",
    status: "Active",

    currentSession: "Fall 2026",
    sessionStartDate: "October 8th",
    seasonLength: "10 Weeks + Playoffs",

    teamCount: 7,

    facilities: [
      {
        name: "Berlin",
        type: "Primary",
      },
      {
        name: "YMCA",
        type: "Alternate",
      },
    ],

    scheduleConflicts: [],
  },
];

const POSSIBLE_INTERRUPTION_ITEMS: PossibleInterruption[] = [
  {
    label: "Facility Closures",
    note: "Games may be relocated, postponed or rescheduled.",
    icon: "business-outline",
  },
  {
    label: "Weather-Related Cancellations",
    note: "Weather may affect scheduled games.",
    icon: "rainy-outline",
  },
  {
    label: "Organization Closure",
    note: "Organization-wide closures may affect scheduled activities.",
    icon: "close-circle-outline",
  },
  {
    label: "Rescheduled Games",
    note: "Previously scheduled games may move to another date.",
    icon: "refresh-outline",
  },
];

function formatHeaderDate(date: Date) {
  return date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    .toUpperCase();
}

function formatHeaderTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function isOrganizationId(value: string): value is OrganizationId {
  return Object.values(ORGANIZATION_IDS).includes(
    value as OrganizationId
  );
}

function facilitySummary(league: League) {
  return league.facilities.map((facility) => facility.name).join(" • ");
}

export default function LeagueDirectoryRoute() {
  const router = useRouter();

  const params =
    useLocalSearchParams<{
      organizationId?: string;
    }>();

  const { theme, isDark } = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const styles = useMemo(
    () => createStyles(theme, isDark),
    [theme, isDark]
  );

  const pagerRef = useRef<ScrollView>(null);

  const [currentDateTime, setCurrentDateTime] = useState(
    () => new Date()
  );

  const [pageIndex, setPageIndex] = useState(0);

  const [facilityOpen, setFacilityOpen] = useState(false);
  const [offDaysOpen, setOffDaysOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentDateTime(new Date()),
      30_000
    );

    return () => clearInterval(interval);
  }, []);

  const requestedId =
    typeof params.organizationId === "string"
      ? params.organizationId
      : ORGANIZATION_IDS.TME;

  const organizationId: OrganizationId = isOrganizationId(
    requestedId
  )
    ? requestedId
    : ORGANIZATION_IDS.TME;

  const organization = ORGANIZATIONS[organizationId];

  const configuredOfferings =
    getConfiguredOfferingsForOrganization(organizationId);

  const configuredOfferingIds = new Set(
    configuredOfferings.map((offering) => offering.id)
  );

  const leagues =
    organizationId === ORGANIZATION_IDS.TME
      ? TME_LEAGUES.filter((league) => {
          const offeringId = getOfferingIdForLeague(league.id);
          return (
            offeringId !== undefined &&
            configuredOfferingIds.has(offeringId)
          );
        })
      : [];

  const organizationLogo =
    organizationId === ORGANIZATION_IDS.TME
      ? require("../../../../assets/logos/tme.png")
      : organizationId === ORGANIZATION_IDS.PICKUP
        ? require("../../../../assets/logos/pickup.png")
        : require("../../../../assets/logos/taj.png");

  const pageWidth = screenWidth;

  const loopingLeagues =
    leagues.length > 1
      ? [leagues[leagues.length - 1], ...leagues, leagues[0]]
      : leagues;

  const handleMomentumEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const nextIndex = Math.round(
      event.nativeEvent.contentOffset.x / pageWidth
    );

    if (leagues.length <= 1) {
      setPageIndex(0);
    } else if (nextIndex === 0) {
      setPageIndex(leagues.length - 1);
      pagerRef.current?.scrollTo({
        x: leagues.length * pageWidth,
        animated: false,
      });
    } else if (nextIndex === leagues.length + 1) {
      setPageIndex(0);
      pagerRef.current?.scrollTo({
        x: pageWidth,
        animated: false,
      });
    } else {
      setPageIndex(
        Math.max(0, Math.min(nextIndex - 1, leagues.length - 1))
      );
    }

    // Start every league page in its compact state.
    setFacilityOpen(false);
    setOffDaysOpen(false);
    setQuickActionsOpen(false);
  };

  const openSchedule = (league: League) => {
    router.push({
      pathname: "/(tabs)/schedule",
      params: {
        organizationId,
        leagueId: league.id,
      },
    } as never);
  };

  const openStandings = (league: League) => {
    router.push({
      pathname: "/(tabs)/standings",
      params: {
        organizationId,
        leagueId: league.id,
      },
    } as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        {/* PERMANENT HEADER */}
        <View style={styles.header}>
          <View style={styles.leftHeaderSlot}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={8}
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={theme.headerIcon}
              />

              <Text style={styles.backText}>
                Back
              </Text>
            </Pressable>
          </View>

          <View style={styles.titleContainer}>
            <Text
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.68}
              style={styles.headerTitle}
            >
              League Directory
            </Text>
          </View>

          <View style={styles.rightHeaderSlot}>
            <Text style={styles.headerDate}>
              {formatHeaderDate(currentDateTime)}
            </Text>

            <Text style={styles.headerTime}>
              {formatHeaderTime(currentDateTime)}
            </Text>
          </View>
        </View>

        {/* DIRECTORY INTRO */}
        <View style={styles.intro}>
          <View style={styles.logoCard}>
            <Image
              source={organizationLogo}
              resizeMode="contain"
              style={styles.logo}
            />
          </View>

          <View style={styles.introTextWrap}>
            <Text style={styles.introText}>
              Browse league teams, locations,
              schedules and standings.
            </Text>
          </View>
        </View>

        {leagues.length > 0 ? (
          <ScrollView
            ref={pagerRef}
            horizontal
            pagingEnabled
            contentOffset={{
              x: leagues.length > 1 ? pageWidth : 0,
              y: 0,
            }}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleMomentumEnd}
            style={styles.pager}
          >
            {loopingLeagues.map((league, loopIndex) => {
              const realIndex =
                leagues.length > 1
                  ? (loopIndex - 1 + leagues.length) % leagues.length
                  : loopIndex;

              const isCurrentPage =
                pageIndex === realIndex;

              const isFacilityOpen =
                facilityOpen && isCurrentPage;

              const isOffDaysOpen =
                offDaysOpen && isCurrentPage;

              const isQuickActionsOpen =
                quickActionsOpen && isCurrentPage;

              return (
                <ScrollView
                  key={`${league.id}-${loopIndex}`}
                  style={{
                    width: pageWidth,
                  }}
                  contentContainerStyle={
                    styles.pageContent
                  }
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled
                >
                  {/* LEAGUE IDENTITY */}
                  <View style={styles.leagueIdentity}>
                    <Text style={styles.leagueTitle}>
                      {league.title}
                    </Text>

                    <Text style={styles.leagueType}>
                      {league.leagueType}
                      {" • "}
                      {league.level}
                    </Text>

                    <View style={styles.locationRow}>
                      <Ionicons
                        name="location"
                        size={17}
                        color={
                          isDark
                            ? "#FFFFFF"
                            : theme.primary
                        }
                      />

                      <Text style={styles.locationText}>
                        {league.location}
                      </Text>
                    </View>

                    <View style={styles.infoRows}>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                          League Status:
                        </Text>

                        <Text
                          style={[
                            styles.infoValue,
                            league.status === "Active"
                              ? styles.activeStatus
                              : styles.inactiveStatus,
                          ]}
                        >
                          {league.status}
                        </Text>
                      </View>

                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                          Current Session:
                        </Text>

                        <Text style={styles.infoValue}>
                          {league.currentSession}
                        </Text>
                      </View>

                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                          Session Start Date:
                        </Text>

                        <Text style={styles.infoValue}>
                          {league.sessionStartDate}
                        </Text>
                      </View>

                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                          Season Length:
                        </Text>

                        <Text style={styles.infoValue}>
                          {league.seasonLength}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* TEAMS */}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${league.title} teams`}
                    style={styles.destinationCard}
                  >
                    <View style={styles.destinationIcon}>
                      <Ionicons
                        name="people-outline"
                        size={27}
                        color={
                          isDark
                            ? "#FFFFFF"
                            : theme.primary
                        }
                      />
                    </View>

                    <View style={styles.destinationText}>
                      <Text style={styles.destinationTitle}>
                        Teams
                      </Text>

                      <Text
                        style={
                          styles.destinationDescription
                        }
                      >
                        {league.teamCount} participating teams
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={23}
                      color={theme.textMuted}
                    />
                  </Pressable>

                  {/* FACILITY */}
                  <View style={styles.expandableCard}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`${league.title} facility`}
                      accessibilityState={{
                        expanded: isFacilityOpen,
                      }}
                      onPress={() => {
                        setOffDaysOpen(false);
                        setQuickActionsOpen(false);
                        setFacilityOpen(
                          (current) => !current
                        );
                      }}
                      style={styles.expandableHeader}
                    >
                      <View style={styles.destinationIcon}>
                        <Ionicons
                          name="business-outline"
                          size={27}
                          color={
                            isDark
                              ? "#FFFFFF"
                              : theme.primary
                          }
                        />
                      </View>

                      <View style={styles.destinationText}>
                        <Text style={styles.destinationTitle}>
                          Facility
                        </Text>

                        <Text
                          style={
                            styles.destinationDescription
                          }
                        >
                          {facilitySummary(league)}
                        </Text>
                      </View>

                      <Ionicons
                        name={
                          isFacilityOpen
                            ? "chevron-down"
                            : "chevron-forward"
                        }
                        size={23}
                        color={theme.textMuted}
                      />
                    </Pressable>

                    {isFacilityOpen ? (
                      <View style={styles.expandedMenu}>
                        {league.facilities.map(
                          (facility, facilityIndex) => (
                            <React.Fragment
                              key={`${league.id}-${facility.name}`}
                            >
                              {facilityIndex > 0 ? (
                                <View
                                  style={
                                    styles.actionDivider
                                  }
                                />
                              ) : null}

                              <View
                                style={
                                  styles.detailRow
                                }
                              >
                                <View
                                  style={
                                    styles.detailIcon
                                  }
                                >
                                  <Ionicons
                                    name={
                                      facility.type ===
                                      "Primary"
                                        ? "location-outline"
                                        : "swap-horizontal-outline"
                                    }
                                    size={22}
                                    color={
                                      isDark
                                        ? "#FFFFFF"
                                        : theme.primary
                                    }
                                  />
                                </View>

                                <View
                                  style={
                                    styles.detailText
                                  }
                                >
                                  <Text
                                    style={
                                      styles.detailLabel
                                    }
                                  >
                                    {facility.type} Facility
                                  </Text>

                                  <Text
                                    style={
                                      styles.detailValue
                                    }
                                  >
                                    {facility.name}
                                  </Text>

                                  <Text
                                    style={
                                      styles.detailDescription
                                    }
                                  >
                                    {facility.type ===
                                    "Primary"
                                      ? "Most league games are played here."
                                      : "Used when scheduled games cannot be played at the primary facility."}
                                  </Text>
                                </View>
                              </View>
                            </React.Fragment>
                          )
                        )}

                        <View style={styles.noticeBox}>
                          <Ionicons
                            name="information-circle-outline"
                            size={19}
                            color={theme.textMuted}
                          />

                          <Text style={styles.noticeText}>
                            Always check the Schedule for the
                            official location of each game.
                          </Text>
                        </View>
                      </View>
                    ) : null}
                  </View>

                  {/* POSSIBLE OFF DAYS / HOLIDAYS */}
                  <View style={styles.expandableCard}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`${league.title} possible off days and holidays`}
                      accessibilityState={{
                        expanded: isOffDaysOpen,
                      }}
                      onPress={() => {
                        setFacilityOpen(false);
                        setQuickActionsOpen(false);
                        setOffDaysOpen(
                          (current) => !current
                        );
                      }}
                      style={styles.expandableHeader}
                    >
                      <View style={styles.destinationIcon}>
                        <Ionicons
                          name="calendar-clear-outline"
                          size={27}
                          color={
                            isDark
                              ? "#FFFFFF"
                              : theme.primary
                          }
                        />
                      </View>

                      <View style={styles.destinationText}>
                        <Text style={styles.destinationTitle}>
                          Possible Off Days / Holidays
                        </Text>

                        <Text
                          style={
                            styles.destinationDescription
                          }
                        >
                          View possible schedule interruptions
                        </Text>
                      </View>

                      <Ionicons
                        name={
                          isOffDaysOpen
                            ? "chevron-down"
                            : "chevron-forward"
                        }
                        size={23}
                        color={theme.textMuted}
                      />
                    </Pressable>

                    {isOffDaysOpen ? (
                      <View style={styles.expandedMenu}>
                        <View style={styles.sectionHeadingWrap}>
                          <Text style={styles.sectionHeading}>
                            Potential Schedule Conflicts
                          </Text>
                        </View>

                        {league.scheduleConflicts.length > 0 ? (
                          league.scheduleConflicts.map(
                            (conflict, conflictIndex) => (
                              <React.Fragment
                                key={`${league.id}-${conflict.label}`}
                              >
                                {conflictIndex > 0 ? (
                                  <View style={styles.actionDivider} />
                                ) : null}

                                <View style={styles.conflictRow}>
                                  <View style={styles.detailIcon}>
                                    <Ionicons
                                      name="calendar-outline"
                                      size={22}
                                      color={
                                        isDark
                                          ? "#FFFFFF"
                                          : theme.primary
                                      }
                                    />
                                  </View>

                                  <View style={styles.detailText}>
                                    <Text style={styles.detailValue}>
                                      {conflict.label}
                                    </Text>
                                  </View>
                                </View>
                              </React.Fragment>
                            )
                          )
                        ) : (
                          <View style={styles.detailRow}>
                            <View style={styles.detailIcon}>
                              <Ionicons
                                name="checkmark-circle-outline"
                                size={22}
                                color={
                                  isDark
                                    ? "#FFFFFF"
                                    : theme.primary
                                }
                              />
                            </View>

                            <View style={styles.detailText}>
                              <Text style={styles.detailDescription}>
                                No major holiday conflicts currently identified.
                              </Text>
                            </View>
                          </View>
                        )}

                        <View style={styles.sectionDivider} />

                        <View style={styles.sectionHeadingWrap}>
                          <Text style={styles.sectionHeading}>
                            Other Possible Interruptions
                          </Text>
                        </View>

                        {POSSIBLE_INTERRUPTION_ITEMS.map(
                          (item, itemIndex) => (
                            <React.Fragment key={item.label}>
                              {itemIndex > 0 ? (
                                <View style={styles.actionDivider} />
                              ) : null}

                              <View style={styles.detailRow}>
                                <View style={styles.detailIcon}>
                                  <Ionicons
                                    name={item.icon}
                                    size={22}
                                    color={
                                      isDark
                                        ? "#FFFFFF"
                                        : theme.primary
                                    }
                                  />
                                </View>

                                <View style={styles.detailText}>
                                  <Text style={styles.detailValue}>
                                    {item.label}
                                  </Text>

                                  <Text style={styles.detailDescription}>
                                    {item.note}
                                  </Text>
                                </View>
                              </View>
                            </React.Fragment>
                          )
                        )}

                        <View style={styles.noticeBox}>
                          <Ionicons
                            name="information-circle-outline"
                            size={19}
                            color={theme.textMuted}
                          />

                          <Text style={styles.noticeText}>
                            Dates are subject to change. Official
                            schedule changes will be communicated by
                            the league. Always check the Schedule for
                            official league dates.
                          </Text>
                        </View>
                      </View>
                    ) : null}
                  </View>

                  {/* QUICK ACTIONS */}
                  <View style={styles.expandableCard}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Quick Actions"
                      accessibilityState={{
                        expanded: isQuickActionsOpen,
                      }}
                      onPress={() => {
                        setFacilityOpen(false);
                        setOffDaysOpen(false);
                        setQuickActionsOpen(
                          (current) => !current
                        );
                      }}
                      style={styles.expandableHeader}
                    >
                      <View style={styles.destinationIcon}>
                        <Ionicons
                          name="flash-outline"
                          size={27}
                          color={
                            isDark
                              ? "#FFFFFF"
                              : theme.primary
                          }
                        />
                      </View>

                      <View style={styles.destinationText}>
                        <Text style={styles.destinationTitle}>
                          Quick Actions
                        </Text>

                        <Text
                          style={
                            styles.destinationDescription
                          }
                        >
                          View schedule / standings
                        </Text>
                      </View>

                      <Ionicons
                        name={
                          isQuickActionsOpen
                            ? "chevron-down"
                            : "chevron-forward"
                        }
                        size={23}
                        color={theme.textMuted}
                      />
                    </Pressable>

                    {isQuickActionsOpen ? (
                      <View style={styles.expandedMenu}>
                        <Pressable
                          onPress={() =>
                            openSchedule(league)
                          }
                          style={styles.quickActionRow}
                        >
                          <View
                            style={styles.quickActionIcon}
                          >
                            <Ionicons
                              name="calendar-outline"
                              size={23}
                              color={
                                isDark
                                  ? "#FFFFFF"
                                  : theme.primary
                              }
                            />
                          </View>

                          <View
                            style={styles.quickActionText}
                          >
                            <Text
                              style={
                                styles.quickActionTitle
                              }
                            >
                              View Schedule
                            </Text>

                            <Text
                              style={
                                styles.quickActionDescription
                              }
                            >
                              {league.title} schedule
                            </Text>
                          </View>

                          <Ionicons
                            name="chevron-forward"
                            size={22}
                            color={theme.textMuted}
                          />
                        </Pressable>

                        <View style={styles.actionDivider} />

                        <Pressable
                          onPress={() =>
                            openStandings(league)
                          }
                          style={styles.quickActionRow}
                        >
                          <View
                            style={styles.quickActionIcon}
                          >
                            <Ionicons
                              name="stats-chart-outline"
                              size={23}
                              color={
                                isDark
                                  ? "#FFFFFF"
                                  : theme.primary
                              }
                            />
                          </View>

                          <View
                            style={styles.quickActionText}
                          >
                            <Text
                              style={
                                styles.quickActionTitle
                              }
                            >
                              View Standings
                            </Text>

                            <Text
                              style={
                                styles.quickActionDescription
                              }
                            >
                              {league.title} standings
                            </Text>
                          </View>

                          <Ionicons
                            name="chevron-forward"
                            size={22}
                            color={theme.textMuted}
                          />
                        </Pressable>
                      </View>
                    ) : null}
                  </View>

                  {/* PAGE DOTS */}
                  <View style={styles.pageDots}>
                    {leagues.map((_, dotIndex) => (
                      <View
                        key={dotIndex}
                        style={[
                          styles.pageDot,
                          dotIndex === pageIndex &&
                            styles.activePageDot,
                        ]}
                      />
                    ))}
                  </View>
                </ScrollView>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="list-outline"
              size={36}
              color={theme.textMuted}
            />

            <Text style={styles.emptyTitle}>
              No leagues available
            </Text>

            <Text style={styles.emptyDescription}>
              League information for {organization?.name ?? "this organization"} will
              appear here.
            </Text>
          </View>
        )}
      </View>

      <StackNavBar />
    </SafeAreaView>
  );
}

const createStyles = (
  theme: AppTheme,
  isDark: boolean
) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.backgroundSecondary,
    },

    screen: {
      flex: 1,
      minHeight: 0,
      backgroundColor: theme.background,
    },

    header: {
      minHeight: 106,

      paddingHorizontal: 18,
      paddingTop: 8,
      paddingBottom: 10,

      flexDirection: "row",
      alignItems: "center",

      backgroundColor: theme.surface,

      zIndex: 30,

      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.08,
      shadowRadius: 7,
      elevation: 5,
    },

    leftHeaderSlot: {
      width: HEADER_SIDE_WIDTH,
      alignSelf: "stretch",
      justifyContent: "center",
      alignItems: "flex-start",
    },

    rightHeaderSlot: {
      width: HEADER_SIDE_WIDTH,
      alignSelf: "stretch",
      alignItems: "center",
      justifyContent: "center",
    },

    backButton: {
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
    },

    backText: {
      marginLeft: 2,
      color: theme.headerText,
      fontSize: 15,
      fontWeight: "800",
    },

    titleContainer: {
      flex: 1,
      minWidth: 0,
      paddingHorizontal: 6,
      alignItems: "center",
      justifyContent: "center",
    },

    headerTitle: {
      width: "100%",
      color: theme.headerText,
      fontSize: 25,
      lineHeight: 28,
      fontWeight: "900",
      textAlign: "center",
      letterSpacing: -0.6,
    },

    headerDate: {
      width: "100%",
      color: theme.headerText,
      fontSize: 13,
      fontWeight: "800",
      textAlign: "center",
      letterSpacing: 0.3,
    },

    headerTime: {
      width: "100%",
      marginTop: 3,
      color: theme.headerText,
      fontSize: 12,
      fontWeight: "800",
      textAlign: "center",
    },

    intro: {
      marginHorizontal: 20,
      marginTop: 20,
      marginBottom: 14,

      flexDirection: "row",
      alignItems: "center",
    },

    logoCard: {
      width: 92,
      height: 92,

      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,

      backgroundColor: theme.logoSurface,

      alignItems: "center",
      justifyContent: "center",

      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.08,
      shadowRadius: 7,
      elevation: 3,
    },

    logo: {
      width: 76,
      height: 76,
    },

    introTextWrap: {
      flex: 1,
      minWidth: 0,
      paddingLeft: 16,
      paddingRight: 4,
    },

    introText: {
      color: theme.textMuted,
      fontSize: 15,
      lineHeight: 21,
      fontWeight: "700",
    },

    pager: {
      flex: 1,
      minHeight: 0,
    },

    pageContent: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 24,
    },

    leagueIdentity: {
      marginBottom: 16,
      paddingBottom: 16,

      borderBottomWidth:
        StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
    },

    leagueTitle: {
      color: isDark
        ? "#FFFFFF"
        : theme.primary,

      fontSize: 26,
      lineHeight: 31,
      fontWeight: "900",
      letterSpacing: -0.5,
    },

    leagueType: {
      marginTop: 4,

      color: theme.textMuted,

      fontSize: 15,
      lineHeight: 20,
      fontWeight: "700",
    },

    locationRow: {
      marginTop: 9,

      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },

    locationText: {
      color: isDark
        ? "#FFFFFF"
        : theme.primary,

      fontSize: 14,
      fontWeight: "800",
    },

    infoRows: {
      marginTop: 10,
      gap: 6,
    },

    infoRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      flexWrap: "wrap",
      gap: 5,
    },

    infoLabel: {
      color: isDark
        ? "#FFFFFF"
        : theme.primary,

      fontSize: 14,
      lineHeight: 19,
      fontWeight: "800",
    },

    infoValue: {
      color: theme.text,
      fontSize: 14,
      lineHeight: 19,
      fontWeight: "800",
    },

    activeStatus: {
      color: "#16A34A",
      fontWeight: "900",
    },

    inactiveStatus: {
      color: "#DC2626",
      fontWeight: "900",
    },

    destinationCard: {
      minHeight: 78,

      marginBottom: 10,
      paddingHorizontal: 15,
      paddingVertical: 12,

      flexDirection: "row",
      alignItems: "center",

      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.border,

      backgroundColor: theme.surface,

      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 2,
    },

    expandableCard: {
      marginBottom: 10,

      overflow: "hidden",

      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.border,

      backgroundColor: theme.surface,

      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 2,
    },

    expandableHeader: {
      minHeight: 78,

      paddingHorizontal: 15,
      paddingVertical: 12,

      flexDirection: "row",
      alignItems: "center",
    },

    destinationIcon: {
      width: 44,
      alignItems: "flex-start",
      justifyContent: "center",
    },

    destinationText: {
      flex: 1,
      minWidth: 0,
      paddingRight: 8,
    },

    destinationTitle: {
      color: isDark
        ? "#FFFFFF"
        : theme.primary,

      fontSize: 16,
      fontWeight: "900",
    },

    destinationDescription: {
      marginTop: 3,

      color: theme.textMuted,

      fontSize: 13,
      lineHeight: 17,
      fontWeight: "600",
    },

    expandedMenu: {
      borderTopWidth:
        StyleSheet.hairlineWidth,
      borderTopColor: theme.border,
    },

    sectionHeadingWrap: {
      paddingHorizontal: 15,
      paddingTop: 15,
      paddingBottom: 7,
    },

    sectionHeading: {
      color: isDark
        ? "#FFFFFF"
        : theme.primary,

      fontSize: 13,
      lineHeight: 18,
      fontWeight: "900",
      textTransform: "uppercase",
      letterSpacing: 0.4,
    },

    sectionDivider: {
      height: StyleSheet.hairlineWidth,
      marginTop: 4,
      backgroundColor: theme.border,
    },

    conflictRow: {
      minHeight: 44,

      paddingHorizontal: 15,
      paddingVertical: 7,

      flexDirection: "row",
      alignItems: "center",
    },

    detailRow: {
      minHeight: 72,

      paddingHorizontal: 15,
      paddingVertical: 11,

      flexDirection: "row",
      alignItems: "flex-start",
    },

    detailIcon: {
      width: 44,
      paddingTop: 1,

      alignItems: "flex-start",
    },

    detailText: {
      flex: 1,
      minWidth: 0,
      paddingRight: 4,
    },

    detailLabel: {
      color: isDark
        ? "#FFFFFF"
        : theme.primary,

      fontSize: 12,
      fontWeight: "800",
    },

    detailValue: {
      marginTop: 2,

      color: theme.text,

      fontSize: 15,
      lineHeight: 20,
      fontWeight: "900",
    },

    detailDescription: {
      marginTop: 3,

      color: theme.textMuted,

      fontSize: 12.5,
      lineHeight: 17,
      fontWeight: "600",
    },

    noticeBox: {
      marginHorizontal: 15,
      marginTop: 5,
      marginBottom: 14,

      paddingHorizontal: 12,
      paddingVertical: 10,

      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,

      borderRadius: 12,
      backgroundColor: theme.backgroundSecondary,
    },

    noticeText: {
      flex: 1,

      color: theme.textMuted,

      fontSize: 12,
      lineHeight: 17,
      fontWeight: "600",
    },

    quickActionRow: {
      minHeight: 68,

      paddingHorizontal: 15,
      paddingVertical: 10,

      flexDirection: "row",
      alignItems: "center",
    },

    quickActionIcon: {
      width: 44,

      alignItems: "flex-start",
      justifyContent: "center",
    },

    quickActionText: {
      flex: 1,
      minWidth: 0,
      paddingRight: 8,
    },

    quickActionTitle: {
      color: isDark
        ? "#FFFFFF"
        : theme.primary,

      fontSize: 15,
      fontWeight: "900",
    },

    quickActionDescription: {
      marginTop: 2,

      color: theme.textMuted,

      fontSize: 12.5,
      fontWeight: "600",
    },

    actionDivider: {
      height:
        StyleSheet.hairlineWidth,

      marginLeft: 59,

      backgroundColor: theme.border,
    },

    pageDots: {
      minHeight: 28,

      marginTop: 6,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
    },

    pageDot: {
      width: 7,
      height: 7,

      borderRadius: 4,

      backgroundColor: isDark
        ? "rgba(255,255,255,0.28)"
        : "rgba(0,0,0,0.20)",
    },

    activePageDot: {
      width: 9,
      height: 9,

      borderRadius: 5,

      backgroundColor: theme.primary,
    },

    emptyState: {
      marginHorizontal: 20,
      marginTop: 20,

      paddingHorizontal: 24,
      paddingVertical: 40,

      alignItems: "center",

      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,

      backgroundColor: theme.surface,
    },

    emptyTitle: {
      marginTop: 12,

      color: theme.text,

      fontSize: 18,
      fontWeight: "900",
    },

    emptyDescription: {
      marginTop: 6,

      color: theme.textMuted,

      fontSize: 14,
      lineHeight: 20,
      fontWeight: "600",
      textAlign: "center",
    },
  });
