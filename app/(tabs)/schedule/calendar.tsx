// app/(tabs)/schedule/calendar.tsx

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import { Calendar } from "react-native-calendars";

import ScreenLayout from "@/components/ScreenLayout";
import GameCard from "@/components/cards/GameCard";
import SearchTeamCard, {
  type Team,
} from "@/components/cards/SearchTeamCard";
import SeasonStatusPill from "@/components/schedule/SeasonStatusPill";

import { useLeagueSchedule } from "@/hooks/useLeagueSchedule";
import { useTextSize } from "@/context/TextSizeContext";
import { getTeamCardData } from "@/data/search/getTeamCardData";

type LeagueKey =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday";

type TeamBranding = {
  logoUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
};

type ByeTeam = TeamBranding & {
  id: string;
  name: string;
};

type WeekWithLeague = {
  id?: string;
  week: number;
  date: string;
  games: any[];

  bye?: Array<string | ByeTeam>;
  byes?: Array<string | ByeTeam>;
  byeTeams?: Array<string | ByeTeam>;

  announcements?: any[];

  venue?: string;
  location?: string;

  teamBranding?: Record<
    string,
    TeamBranding
  >;

  league: LeagueKey;
};

type PlayoffRound =
  | "Quarter-Finals"
  | "Semi-Finals"
  | undefined;

const PURPLE = "#250F74";
const BACKGROUND = "#FCF9F9";
const SURFACE = "#FFFFFF";
const BORDER = "#ECECF1";
const TEXT = "#111111";
const MUTED_TEXT = "#77777F";

const LEAGUE_VENUES: Record<
  LeagueKey,
  {
    defaultVenue: string;
    weekOverrides?: Record<
      number,
      string
    >;
  }
> = {
  sunday: {
    defaultVenue: "YMCA",
  },

  monday: {
    defaultVenue: "Berlin",
    weekOverrides: {
      1: "YMCA",
    },
  },

  tuesday: {
    defaultVenue: "YMCA",
  },

  wednesday: {
    defaultVenue: "Berlin",
  },
};

const TEAM_NAMES: Record<
  string,
  string
> = {
  sun_tA: "Ziller",
  sun_tB: "Tom",
  sun_tC: "Edwards",
  sun_tD: "Rich",
  sun_tE: "Timmy",
  sun_tF: "TeeJ",
  sun_tG: "Dale",
  sun_tH: "Prince",
  sun_tI: "Dex",

  mon_tA: "Trifecta",
  mon_tB: "Beans",
  mon_tC: "Chimney",
  mon_tD: "MAAC",
  mon_tE: "Hard Rock",
  mon_tF: "The Other Bar",
  mon_tG: "JRL",

  tue_tA: "Team A",
  tue_tB: "Team B",
  tue_tC: "Team C",
  tue_tD: "Team D",
  tue_tE: "Team E",
  tue_tF: "Team F",
  tue_tG: "Team G",

  wed_tA: "Duffy",
  wed_tB: "Neil",
  wed_tC: "Tom",
  wed_tD: "Gross",
  wed_tE: "Gervese",
  wed_tF: "Rob",
  wed_tG: "Mark",
};

function getTeamName(
  teamId?: string
) {
  if (!teamId) {
    return "TBD";
  }

  return TEAM_NAMES[teamId] ?? teamId;
}

function getLeagueTitle(
  league: LeagueKey
) {
  if (league === "sunday") {
    return "Sunday League";
  }

  if (league === "monday") {
    return "Monday League";
  }

  if (league === "tuesday") {
    return "Tuesday League";
  }

  return "Wednesday League";
}

function getTodayDate() {
  return new Date()
    .toISOString()
    .split("T")[0];
}

function getWeekday(
  dateString: string
) {
  const [year, month, day] =
    dateString
      .split("-")
      .map(Number);

  return new Date(
    year,
    month - 1,
    day
  ).toLocaleDateString("en-US", {
    weekday: "long",
  });
}

function getWeekVenue(
  week: WeekWithLeague
) {
  const firestoreVenue =
    week.venue?.trim() ||
    week.location?.trim();

  if (firestoreVenue) {
    return firestoreVenue;
  }

  const leagueVenue =
    LEAGUE_VENUES[week.league];

  const overrideVenue =
    leagueVenue.weekOverrides?.[
      Number(week.week)
    ];

  if (overrideVenue) {
    return overrideVenue;
  }

  return leagueVenue.defaultVenue;
}

function timeToMinutes(
  time?: string
) {
  if (!time) {
    return 999999;
  }

  const cleaned = time
    .trim()
    .toUpperCase();

  const match = cleaned.match(
    /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/
  );

  if (!match) {
    return 999999;
  }

  let hours = Number(match[1]);
  const minutes = Number(
    match[2] ?? 0
  );
  const modifier = match[3];

  if (
    modifier === "PM" &&
    hours !== 12
  ) {
    hours += 12;
  }

  if (
    modifier === "AM" &&
    hours === 12
  ) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

function getPlayoffRound(
  league: LeagueKey,
  week: number
): PlayoffRound {
  if (league === "sunday") {
    if (week === 11) {
      return "Quarter-Finals";
    }

    if (week === 12) {
      return "Semi-Finals";
    }
  }

  if (
    league === "monday" ||
    league === "wednesday"
  ) {
    if (week === 11) {
      return "Semi-Finals";
    }
  }

  return undefined;
}

function findGameBranding(
  week: WeekWithLeague,
  teamId: string
): TeamBranding {
  const game = week.games.find(
    (item: any) =>
      item.team1Id === teamId ||
      item.team2Id === teamId
  );

  if (!game) {
    return {};
  }

  if (game.team1Id === teamId) {
    return {
      logoUrl:
        game.team1LogoUrl ??
        game.team1Logo ??
        null,

      primaryColor:
        game.team1PrimaryColor ??
        game.team1Color ??
        null,

      secondaryColor:
        game.team1SecondaryColor ??
        null,
    };
  }

  return {
    logoUrl:
      game.team2LogoUrl ??
      game.team2Logo ??
      null,

    primaryColor:
      game.team2PrimaryColor ??
      game.team2Color ??
      null,

    secondaryColor:
      game.team2SecondaryColor ??
      null,
  };
}

function getTeamBranding(
  week: WeekWithLeague,
  teamId: string
): TeamBranding {
  const storedBranding =
    week.teamBranding?.[teamId];

  if (storedBranding) {
    return storedBranding;
  }

  return findGameBranding(
    week,
    teamId
  );
}

function normalizeByeTeam(
  item: string | ByeTeam,
  week: WeekWithLeague
): ByeTeam {
  if (typeof item !== "string") {
    const fallbackBranding =
      getTeamBranding(
        week,
        item.id
      );

    return {
      id: item.id,

      name:
        item.name ||
        getTeamName(item.id),

      logoUrl:
        item.logoUrl ??
        fallbackBranding.logoUrl ??
        null,

      primaryColor:
        item.primaryColor ??
        fallbackBranding.primaryColor ??
        PURPLE,

      secondaryColor:
        item.secondaryColor ??
        fallbackBranding.secondaryColor ??
        null,
    };
  }

  const branding =
    getTeamBranding(
      week,
      item
    );

  return {
    id: item,
    name: getTeamName(item),

    logoUrl:
      branding.logoUrl ??
      null,

    primaryColor:
      branding.primaryColor ??
      PURPLE,

    secondaryColor:
      branding.secondaryColor ??
      null,
  };
}

function getAnnouncements(
  week: WeekWithLeague
) {
  const announcements =
    week.announcements ?? [];

  if (
    !Array.isArray(
      announcements
    )
  ) {
    return [];
  }

  return announcements
    .map((announcement: any) => {
      if (
        typeof announcement ===
        "string"
      ) {
        return announcement;
      }

      return (
        announcement?.message ??
        ""
      );
    })
    .filter(Boolean);
}

function mapGames(
  week: WeekWithLeague
) {
  if (!Array.isArray(week.games)) {
    return [];
  }

  return week.games
    .map((game: any) => {
      const team1Id =
        game.team1Id ?? "";

      const team2Id =
        game.team2Id ?? "";

      const team1Branding =
        getTeamBranding(
          week,
          team1Id
        );

      const team2Branding =
        getTeamBranding(
          week,
          team2Id
        );

      return {
        id:
          game.id ??
          `${game.time}-${team1Id}-${team2Id}`,

        time:
          game.time ?? "",

        teamA: {
          id: team1Id,

          name:
            game.team1 ??
            getTeamName(team1Id),

          score:
            typeof game.team1Score ===
            "number"
              ? game.team1Score
              : null,

          logoUrl:
            game.team1LogoUrl ??
            game.team1Logo ??
            team1Branding.logoUrl ??
            null,

          primaryColor:
            game.team1PrimaryColor ??
            game.team1Color ??
            team1Branding.primaryColor ??
            PURPLE,

          secondaryColor:
            game.team1SecondaryColor ??
            team1Branding.secondaryColor ??
            null,
        },

        teamB: {
          id: team2Id,

          name:
            game.team2 ??
            getTeamName(team2Id),

          score:
            typeof game.team2Score ===
            "number"
              ? game.team2Score
              : null,

          logoUrl:
            game.team2LogoUrl ??
            game.team2Logo ??
            team2Branding.logoUrl ??
            null,

          primaryColor:
            game.team2PrimaryColor ??
            game.team2Color ??
            team2Branding.primaryColor ??
            PURPLE,

          secondaryColor:
            game.team2SecondaryColor ??
            team2Branding.secondaryColor ??
            null,
        },

        team1Seed:
          typeof game.team1Seed ===
          "number"
            ? game.team1Seed
            : game.team1Seed ??
              null,

        team2Seed:
          typeof game.team2Seed ===
          "number"
            ? game.team2Seed
            : game.team2Seed ??
              null,

        resultType:
          game.resultType ===
          "forfeit"
            ? ("forfeit" as const)
            : ("normal" as const),

        winner:
          game.winner ?? null,

        status:
          game.status ?? null,

        tag:
          game.type ===
          "championship"
            ? "championship"
            : game.type ??
              "regular",
      };
    })
    .sort(
      (gameA, gameB) =>
        timeToMinutes(
          gameA.time
        ) -
        timeToMinutes(
          gameB.time
        )
    );
}

export default function CalendarScreen() {
  const router = useRouter();
  const { textScale } = useTextSize();

  const sundaySchedule =
    useLeagueSchedule({
      league: "sunday",
      season: "spring2026",
    });

  const mondaySchedule =
    useLeagueSchedule({
      league: "monday",
      season: "spring2026",
    });

  const tuesdaySchedule =
    useLeagueSchedule({
      league: "tuesday",
      season: "spring2026",
    });

  const wednesdaySchedule =
    useLeagueSchedule({
      league: "wednesday",
      season: "spring2026",
    });

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(getTodayDate());

  const [
    selectedTeam,
    setSelectedTeam,
  ] = useState<Team | null>(null);

  const loading =
    sundaySchedule.loading ||
    mondaySchedule.loading ||
    tuesdaySchedule.loading ||
    wednesdaySchedule.loading;

  const allWeeks =
    useMemo<WeekWithLeague[]>(() => {
      const sundayWeeks =
        sundaySchedule.weeks.map(
          (week: any) => ({
            ...week,
            league:
              "sunday" as LeagueKey,
          })
        );

      const mondayWeeks =
        mondaySchedule.weeks.map(
          (week: any) => ({
            ...week,
            league:
              "monday" as LeagueKey,
          })
        );

      const tuesdayWeeks =
        tuesdaySchedule.weeks.map(
          (week: any) => ({
            ...week,
            league:
              "tuesday" as LeagueKey,
          })
        );

      const wednesdayWeeks =
        wednesdaySchedule.weeks.map(
          (week: any) => ({
            ...week,
            league:
              "wednesday" as LeagueKey,
          })
        );

      return [
        ...sundayWeeks,
        ...mondayWeeks,
        ...tuesdayWeeks,
        ...wednesdayWeeks,
      ].sort((weekA, weekB) => {
        const dateCompare =
          weekA.date.localeCompare(
            weekB.date
          );

        if (dateCompare !== 0) {
          return dateCompare;
        }

        return (
          Number(weekA.week) -
          Number(weekB.week)
        );
      });
    }, [
      sundaySchedule.weeks,
      mondaySchedule.weeks,
      tuesdaySchedule.weeks,
      wednesdaySchedule.weeks,
    ]);

  /*
   * Global viewing preferences will
   * eventually filter this collection.
   *
   * Example:
   *
   * const visibleWeeks = allWeeks.filter(
   *   (week) =>
   *     selectedLeagueKeys.includes(
   *       week.league
   *     )
   * );
   *
   * Until that Settings system is wired,
   * the calendar displays all leagues.
   */
  const visibleWeeks = allWeeks;

  useEffect(() => {
    if (
      loading ||
      visibleWeeks.length === 0
    ) {
      return;
    }

    const today = getTodayDate();

    const todayHasGames =
      visibleWeeks.some(
        (week) =>
          week.date === today
      );

    if (todayHasGames) {
      setSelectedDate(today);
      return;
    }

    const nextGameDate =
      visibleWeeks.find(
        (week) =>
          week.date >= today
      )?.date;

    setSelectedDate(
      nextGameDate ??
        visibleWeeks[0].date
    );
  }, [
    loading,
    visibleWeeks,
  ]);

  const selectedDayName =
    getWeekday(selectedDate);

  /*
   * filter() allows more than one visible
   * league to populate on the same date.
   */
  const selectedWeeks =
    useMemo(
      () =>
        visibleWeeks.filter(
          (week) =>
            week.date ===
            selectedDate
        ),
      [
        visibleWeeks,
        selectedDate,
      ]
    );

  const markedDates =
    useMemo(() => {
      const marks: Record<
        string,
        any
      > = {};

      visibleWeeks.forEach(
        (week) => {
          if (!week.date) {
            return;
          }

          marks[week.date] = {
            marked: true,
            dotColor: PURPLE,
          };
        }
      );

      marks[selectedDate] = {
        ...(marks[selectedDate] ??
          {}),

        selected: true,
        selectedColor: PURPLE,
        selectedTextColor:
          SURFACE,
      };

      return marks;
    }, [
      visibleWeeks,
      selectedDate,
    ]);

  const openTeamCard = (
    teamIdOrName: string,
    league: LeagueKey
  ) => {
    const teamCard =
      getTeamCardData(
        teamIdOrName,
        league
      );

    if (teamCard) {
      setSelectedTeam(teamCard);
    }
  };

  if (loading) {
    return (
      <ScreenLayout
        title="Calendar"
        disableScroll
      >
        <View
          style={
            styles.loadingContainer
          }
        >
          <Text
            style={[
              styles.loadingText,
              {
                fontSize:
                  16 * textScale,
              },
            ]}
          >
            Loading schedule...
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      title="Calendar"
      disableScroll
    >
      <View style={styles.screen}>
        <View
          style={styles.calendarCard}
        >
          <Calendar
            key={selectedDate}
            current={selectedDate}
            onDayPress={(day) =>
              setSelectedDate(
                day.dateString
              )
            }
            markedDates={
              markedDates
            }
            enableSwipeMonths
            hideExtraDays={false}
            theme={{
              calendarBackground:
                SURFACE,

              arrowColor:
                PURPLE,

              monthTextColor:
                PURPLE,

              todayTextColor:
                PURPLE,

              selectedDayBackgroundColor:
                PURPLE,

              selectedDayTextColor:
                SURFACE,

              textDayFontSize:
                14 * textScale,

              textMonthFontSize:
                18 * textScale,

              textDayHeaderFontSize:
                13 * textScale,

              textMonthFontWeight:
                "900",

              textDayHeaderFontWeight:
                "700",

              textDayFontWeight:
                "500",

              dayTextColor:
                "#243746",

              textDisabledColor:
                "#D8E0E8",

              dotColor:
                PURPLE,

              selectedDotColor:
                SURFACE,
            }}
          />
        </View>

        <ScrollView
          style={styles.scheduleScroll}
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          {selectedWeeks.length ===
            0 && (
            <View
              style={styles.emptyState}
            >
              <Text
                style={[
                  styles.emptyTitle,
                  {
                    fontSize:
                      16 * textScale,
                  },
                ]}
              >
                No games scheduled for
                this date
              </Text>

              <Text
                style={[
                  styles.emptySubtitle,
                  {
                    fontSize:
                      13 * textScale,
                  },
                ]}
              >
                {selectedDayName}
              </Text>
            </View>
          )}

          {selectedWeeks.map(
            (week) => {
              const weekNumber =
                Number(week.week);

              const isPlayoffs =
                weekNumber >= 11;

              const playoffRound =
                getPlayoffRound(
                  week.league,
                  weekNumber
                );

              const rawByeTeams =
                week.bye ??
                week.byes ??
                week.byeTeams ??
                [];

              const byeTeams =
                Array.isArray(
                  rawByeTeams
                )
                  ? rawByeTeams.map(
                      (item) =>
                        normalizeByeTeam(
                          item,
                          week
                        )
                    )
                  : [];

              return (
                <View
                  key={
                    week.id ??
                    `${week.league}-${week.date}-${week.week}`
                  }
                  style={
                    styles.leagueSection
                  }
                >
                  <View
                    style={
                      styles.showingPill
                    }
                  >
                    <Text
                      style={[
                        styles.showingLabel,
                        {
                          fontSize:
                            12 *
                            textScale,
                        },
                      ]}
                    >
                      Showing
                    </Text>

                    <Text
                      style={[
                        styles.showingValue,
                        {
                          fontSize:
                            14 *
                            textScale,
                        },
                      ]}
                    >
                      {getLeagueTitle(
                        week.league
                      )}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.seasonPillWrap
                    }
                  >
                    <SeasonStatusPill
                      phase={
                        isPlayoffs
                          ? "playoffs"
                          : "regular"
                      }
                      week={
                        weekNumber
                      }
                      totalWeeks={10}
                      date={
                        selectedDate
                      }
                      playoffRound={
                        playoffRound
                      }
                    />
                  </View>

                  <GameCard
                    week={
                      weekNumber
                    }
                    totalWeeks={10}
                    date={selectedDate}
                    games={mapGames(
                      week
                    )}
                    byeTeams={
                      byeTeams
                    }
                    location={getWeekVenue(
                      week
                    )}
                    announcements={getAnnouncements(
                      week
                    )}
                    phase={
                      isPlayoffs
                        ? "playoffs"
                        : "regular"
                    }
                    playoffRound={
                      playoffRound
                    }
                    onTeamPress={(
                      teamIdOrName
                    ) =>
                      openTeamCard(
                        teamIdOrName,
                        week.league
                      )
                    }
                    embedded
                  />
                </View>
              );
            }
          )}

          {selectedWeeks.length >
            0 && (
            <View
              style={
                styles.actionButtonRow
              }
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View game results"
                onPress={() =>
                  router.push(
                    "/schedule/results"
                  )
                }
                style={({
                  pressed,
                }) => [
                  styles.actionButton,
                  pressed &&
                    styles.actionButtonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    {
                      fontSize:
                        14 *
                        textScale,
                    },
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                   Game Results
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View standings"
                onPress={() =>
                  router.push(
                    "/standings"
                  )
                }
                style={({
                  pressed,
                }) => [
                  styles.actionButton,
                  pressed &&
                    styles.actionButtonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    {
                      fontSize:
                        14 *
                        textScale,
                    },
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                   Standings
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>

        {selectedTeam && (
          <SearchTeamCard
            team={selectedTeam}
            onClose={() =>
              setSelectedTeam(null)
            }
          />
        )}
      </View>
    </ScreenLayout>
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: BACKGROUND,
    },

    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      backgroundColor: BACKGROUND,
    },

    loadingText: {
      color: TEXT,
      fontWeight: "600",
    },

    calendarCard: {
      marginTop: 12,
      marginHorizontal: 12,
      paddingVertical: 4,

      borderRadius: 18,
      borderWidth: 1,
      borderColor: BORDER,

      overflow: "hidden",
      backgroundColor: SURFACE,

      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },

    scheduleScroll: {
      flex: 1,
    },

    scrollContent: {
      paddingHorizontal: 12,
      paddingTop: 16,
      paddingBottom: 110,
    },

    leagueSection: {
      marginBottom: 24,
    },

    showingPill: {
      alignSelf: "flex-start",
      minWidth: 150,

      marginBottom: 14,
      paddingVertical: 8,
      paddingHorizontal: 14,

      borderRadius: 14,
      borderWidth: 1,
      borderColor: BORDER,

      backgroundColor: SURFACE,

      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },

    showingLabel: {
      color: MUTED_TEXT,
      fontWeight: "700",
    },

    showingValue: {
      marginTop: 1,
      color: PURPLE,
      fontWeight: "900",
    },

    seasonPillWrap: {
      marginBottom: 16,
    },

    emptyState: {
      alignItems: "center",
      paddingVertical: 50,
    },

    emptyTitle: {
      color: TEXT,
      fontWeight: "700",
      textAlign: "center",
    },

    emptySubtitle: {
      marginTop: 6,
      color: "#999999",
      textAlign: "center",
    },

    actionButtonRow: {
      width: "100%",
      flexDirection: "row",
      gap: 12,

      marginTop: 2,
      marginBottom: 10,
    },

    actionButton: {
      flex: 1,
      minHeight: 48,

      alignItems: "center",
      justifyContent: "center",

      paddingVertical: 10,
      paddingHorizontal: 10,

      borderRadius: 14,
      backgroundColor: PURPLE,

      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.12,
      shadowRadius: 5,
      elevation: 3,
    },

    actionButtonPressed: {
      opacity: 0.76,
      transform: [
        {
          scale: 0.98,
        },
      ],
    },

    actionButtonText: {
      color: SURFACE,
      fontWeight: "800",
      textAlign: "center",
    },
  });