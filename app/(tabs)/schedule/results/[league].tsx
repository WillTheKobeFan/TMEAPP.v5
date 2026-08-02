// app/(tabs)/schedule/results/[league].tsx

import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import ScreenLayout from "src/components/ScreenLayout";
import SearchTeamCard, { Team } from "src/components/cards/SearchTeamCard";
import { db } from "src/lib/firebase";

type Game = {
  id?: string;
  date?: string;
  time?: string;
  venue?: string;
  location?: string;

  team1Id?: string;
  team2Id?: string;
  team1Name?: string;
  team2Name?: string;
  team1Captain?: string;
  team2Captain?: string;
  team1Seed?: number | string | null;
  team2Seed?: number | string | null;

  team1Score?: number | string | null;
  team2Score?: number | string | null;

  winner?: string | null;
  winnerId?: string | null;
  winnerName?: string | null;

  status?: string;
  type?: string;
  resultType?: string;
};

type WeekDoc = {
  id: string;
  week: number;
  date?: string;
  title?: string;
  games: Game[];
  bye?: string[];
  byes?: string[];
};

type TeamMap = Record<string, string>;

const PURPLE = "#250f74";

const LEAGUE_LABELS: Record<string, Team["league"]> = {
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
};

export default function LeagueResultsScreen() {
  const params = useLocalSearchParams();

  const leagueParam = Array.isArray(params.league)
    ? params.league[0]
    : params.league;

  const leagueId = String(leagueParam || "sunday").toLowerCase();

  const [loading, setLoading] = React.useState(true);
  const [leagueName, setLeagueName] = React.useState<Team["league"]>(
    LEAGUE_LABELS[leagueId] || "Sunday"
  );
  const [weeks, setWeeks] = React.useState<WeekDoc[]>([]);
  const [teams, setTeams] = React.useState<TeamMap>({});
  const [selectedWeek, setSelectedWeek] = React.useState(1);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null);

  React.useEffect(() => {
    let unsubscribeWeeks: undefined | (() => void);

    async function loadTeamNames(seasonId: string) {
      const teamMap: TeamMap = {};

      function addTeam(team: any, fallbackId?: string) {
        const id = team?.id || team?.teamId || team?.TeamID || fallbackId;

        const name =
          team?.name ||
          team?.teamName ||
          team?.TeamName ||
          team?.captain ||
          team?.Captain ||
          team?.displayName ||
          team?.DisplayName;

        if (id && name) {
          teamMap[String(id)] = String(name);
        }
      }

      try {
        const seasonSnap = await getDoc(
          doc(db, "leagues", leagueId, "seasons", seasonId)
        );

        if (seasonSnap.exists()) {
          const seasonData = seasonSnap.data();

          if (Array.isArray(seasonData.teams)) {
            seasonData.teams.forEach((team: any) => addTeam(team));
          }
        }

        const seasonTeamsSnap = await getDocs(
          collection(db, "leagues", leagueId, "seasons", seasonId, "teams")
        );

        seasonTeamsSnap.docs.forEach((teamDoc) => {
          addTeam(teamDoc.data(), teamDoc.id);
        });

        const leagueTeamsSnap = await getDocs(
          collection(db, "leagues", leagueId, "teams")
        );

        leagueTeamsSnap.docs.forEach((teamDoc) => {
          addTeam(teamDoc.data(), teamDoc.id);
        });
      } catch (error) {
        console.log("Team name load error:", error);
      }

      return teamMap;
    }

    async function loadResults() {
      setLoading(true);

      try {
        const leagueSnap = await getDoc(doc(db, "leagues", leagueId));

        if (!leagueSnap.exists()) {
          setWeeks([]);
          setLoading(false);
          return;
        }

        const leagueData = leagueSnap.data();
        const seasonId = leagueData.activeSeasonId || leagueData.currentSeasonId;

        setLeagueName(LEAGUE_LABELS[leagueId] || "Sunday");

        if (!seasonId) {
          setWeeks([]);
          setLoading(false);
          return;
        }

        const teamMap = await loadTeamNames(seasonId);
        setTeams(teamMap);

        const weeksRef = collection(
          db,
          "leagues",
          leagueId,
          "seasons",
          seasonId,
          "weeks"
        );

        unsubscribeWeeks = onSnapshot(
          query(weeksRef, orderBy("week", "asc")),
          (snapshot) => {
            const rawWeeks: WeekDoc[] = snapshot.docs.map((weekDoc) => {
              const data = weekDoc.data();

              return {
                id: weekDoc.id,
                week: Number(data.week || weekDoc.id.replace(/\D/g, "")) || 0,
                date: data.date,
                title: data.title,
                games: Array.isArray(data.games) ? data.games : [],
                bye: Array.isArray(data.bye) ? data.bye : [],
                byes: Array.isArray(data.byes) ? data.byes : [],
              };
            });

            const dedupedWeeks = mergeDuplicateWeeks(rawWeeks);
            setWeeks(dedupedWeeks);

            if (dedupedWeeks.length > 0) {
              setSelectedWeek((current) =>
                dedupedWeeks.some((week) => week.week === current)
                  ? current
                  : dedupedWeeks[0].week
              );
            }

            setLoading(false);
          },
          (error) => {
            console.log("Results listener error:", error);
            setLoading(false);
          }
        );
      } catch (error) {
        console.log("Results load error:", error);
        setLoading(false);
      }
    }

    loadResults();

    return () => {
      if (unsubscribeWeeks) unsubscribeWeeks();
    };
  }, [leagueId]);

  const selectedWeekData =
    weeks.find((week) => week.week === selectedWeek) || weeks[0];

  const byeTeamIds = [
    ...(selectedWeekData?.bye || []),
    ...(selectedWeekData?.byes || []),
  ];

  function mergeDuplicateWeeks(rawWeeks: WeekDoc[]) {
    const weekMap = new Map<number, WeekDoc>();

    rawWeeks.forEach((week) => {
      const existing = weekMap.get(week.week);

      if (!existing) {
        weekMap.set(week.week, {
          ...week,
          games: dedupeGames(week.games),
          bye: dedupeStrings(week.bye || []),
          byes: dedupeStrings(week.byes || []),
        });
        return;
      }

      weekMap.set(week.week, {
        ...existing,
        title: existing.title || week.title,
        date: existing.date || week.date,
        games: dedupeGames([...(existing.games || []), ...(week.games || [])]),
        bye: dedupeStrings([...(existing.bye || []), ...(week.bye || [])]),
        byes: dedupeStrings([...(existing.byes || []), ...(week.byes || [])]),
      });
    });

    return Array.from(weekMap.values()).sort((a, b) => a.week - b.week);
  }

  function dedupeGames(games: Game[]) {
    const seen = new Set<string>();

    return games.filter((game, index) => {
      const key =
        game.id ||
        `${game.time}-${game.team1Id}-${game.team2Id}-${game.type}-${index}`;

      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    });
  }

  function dedupeStrings(items: string[]) {
    return Array.from(new Set(items.filter(Boolean)));
  }

  function getTeamNameById(teamId?: string) {
    if (!teamId) return "Team";
    return teams[teamId] || teamId || "Team";
  }

  function getTeamName(game: Game, side: "team1" | "team2") {
    const id = side === "team1" ? game.team1Id : game.team2Id;

    const savedName =
      side === "team1"
        ? game.team1Name || game.team1Captain
        : game.team2Name || game.team2Captain;

    return savedName || getTeamNameById(id);
  }

  function getScore(value: unknown) {
    if (value === null || value === undefined || value === "") return null;

    const score = Number(value);
    return Number.isFinite(score) ? score : null;
  }

  function isForfeit(game: Game) {
    return String(game.resultType || "").toLowerCase() === "forfeit";
  }

  function isChampionship(game: Game) {
    return String(game.type || "").toLowerCase() === "championship";
  }

  function getWinnerName(game: Game) {
    const team1Name = getTeamName(game, "team1");
    const team2Name = getTeamName(game, "team2");

    if (game.winnerName) return game.winnerName;

    const winnerId = game.winnerId || game.winner;

    if (winnerId && winnerId === game.team1Id) return team1Name;
    if (winnerId && winnerId === game.team2Id) return team2Name;

    const team1Score = getScore(game.team1Score);
    const team2Score = getScore(game.team2Score);

    if (team1Score !== null && team2Score !== null) {
      if (team1Score > team2Score) return team1Name;
      if (team2Score > team1Score) return team2Name;
    }

    return null;
  }

  function isFinal(game: Game) {
    const status = String(game.status || "").toLowerCase();

    return (
      status === "final" ||
      status === "completed" ||
      isForfeit(game) ||
      Boolean(getWinnerName(game))
    );
  }

  function isLosingSide(game: Game, side: "team1" | "team2") {
    if (!isFinal(game)) return false;

    if (isForfeit(game)) {
      const winnerId = game.winnerId || game.winner;
      const teamId = side === "team1" ? game.team1Id : game.team2Id;

      if (!winnerId || !teamId) return false;
      return winnerId !== teamId;
    }

    const team1Score = getScore(game.team1Score);
    const team2Score = getScore(game.team2Score);

    if (team1Score === null || team2Score === null) return false;
    if (team1Score === team2Score) return false;

    if (side === "team1") return team1Score < team2Score;
    return team2Score < team1Score;
  }

  function getStatusLabel(game: Game) {
    if (isForfeit(game)) return "FORFEIT";
    if (isFinal(game)) return "FINAL";
    return "SCHEDULED";
  }

  function getStatusStyle(game: Game) {
    if (isForfeit(game)) return styles.statusForfeit;
    if (isFinal(game)) return styles.statusFinal;
    return styles.statusScheduled;
  }

  function getWeekLabel(week: WeekDoc) {
    if (week.title) return week.title;

    const hasChampionship = week.games.some((game) => isChampionship(game));

    const hasPlayoff = week.games.some(
      (game) => String(game.type || "").toLowerCase() === "playoff"
    );

    if (hasChampionship) return `Week ${week.week}: Championship`;
    if (hasPlayoff) return `Week ${week.week}: Playoffs`;

    return `Regular Season: Week ${week.week}`;
  }

  function formatDate(date?: string) {
    if (!date) return "";

    const safeDate = new Date(`${date}T12:00:00`);

    if (Number.isNaN(safeDate.getTime())) return date;

    return safeDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  function getGameDate(game: Game) {
    return game.date || selectedWeekData?.date || "";
  }

  function getSeed(game: Game, side: "team1" | "team2") {
    const seed = side === "team1" ? game.team1Seed : game.team2Seed;
    if (seed === null || seed === undefined || seed === "") return "";
    return `(${seed}) `;
  }

  function getDisplayScore(game: Game, side: "team1" | "team2") {
    const score = side === "team1" ? game.team1Score : game.team2Score;
    const cleanScore = getScore(score);

    if (isForfeit(game)) {
      const winnerId = game.winnerId || game.winner;
      const teamId = side === "team1" ? game.team1Id : game.team2Id;

      if (winnerId && teamId && winnerId === teamId) return "W";
      return "F";
    }

    return cleanScore === null ? "--" : String(cleanScore);
  }

  function openTeamCard(game: Game, side: "team1" | "team2") {
    const teamId = side === "team1" ? game.team1Id : game.team2Id;
    const teamName = getTeamName(game, side);
    const opponentName = getTeamName(game, side === "team1" ? "team2" : "team1");

    setSelectedTeam({
      id: teamId || teamName,
      teamName,
      league: leagueName,
      record: "Not available",
      place: "Not available",
      status: getStatusLabel(game),
      nextGame: `${opponentName} • ${game.time || "TBD"}${
        game.venue || game.location ? ` • ${game.venue || game.location}` : ""
      }`,
      lastResult: `${teamName} vs ${opponentName}`,
      recentResults: [
        {
          week: `Week ${selectedWeekData?.week || selectedWeek}`,
          display: `${teamName} vs ${opponentName}`,
        },
      ],
    });
  }

  function openByeTeamCard(teamId: string) {
    const teamName = getTeamNameById(teamId);

    setSelectedTeam({
      id: teamId,
      teamName,
      league: leagueName,
      record: "Not available",
      place: "Not available",
      status: "Bye Week",
      nextGame: "This team is on a bye this week.",
      lastResult: "No recent result posted.",
      recentResults: [],
    });
  }

  function renderTeamRow(game: Game, side: "team1" | "team2") {
    const losingSide = isLosingSide(game, side);

    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => openTeamCard(game, side)}
        style={styles.teamRow}
      >
        <Text style={[styles.teamName, losingSide && styles.loserText]}>
          {getSeed(game, side)}
          {getTeamName(game, side)}
        </Text>

        <Text style={[styles.scoreText, losingSide && styles.loserText]}>
          {getDisplayScore(game, side)}
        </Text>
      </TouchableOpacity>
    );
  }

  if (loading) {
    return (
      <ScreenLayout title="Results">
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Loading results...</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title="Results">
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headerCard}>
            <Text style={styles.headerTitle}>{leagueName} Results</Text>
            <Text style={styles.headerText}>
              Select a week to view game results, upcoming matchups, forfeits,
              and championship games.
            </Text>
          </View>

          {weeks.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No results yet</Text>
              <Text style={styles.emptyText}>
                Once games are added or finalized, they will show here automatically.
              </Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={styles.dropdownButton}
                activeOpacity={0.85}
                onPress={() => setDropdownOpen((prev) => !prev)}
              >
                <View style={styles.dropdownTextBox}>
                  <Text style={styles.dropdownLabel}>Select Week</Text>
                  <Text style={styles.dropdownValue}>
                    {selectedWeekData ? getWeekLabel(selectedWeekData) : "Week"}
                  </Text>
                </View>

                <Text style={styles.dropdownArrow}>
                  {dropdownOpen ? "▼" : "▶"}
                </Text>
              </TouchableOpacity>

              {dropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {weeks.map((week) => (
                    <TouchableOpacity
                      key={week.id}
                      style={[
                        styles.dropdownItem,
                        selectedWeek === week.week && styles.dropdownItemActive,
                      ]}
                      activeOpacity={0.85}
                      onPress={() => {
                        setSelectedWeek(week.week);
                        setDropdownOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          selectedWeek === week.week &&
                            styles.dropdownItemTextActive,
                        ]}
                      >
                        {getWeekLabel(week)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {selectedWeekData && (
                <View style={styles.weekCard}>
                  <Text style={styles.weekTitle}>
                    {getWeekLabel(selectedWeekData)}
                  </Text>

                  {!!selectedWeekData.date && (
                    <Text style={styles.weekDate}>
                      {formatDate(selectedWeekData.date)}
                    </Text>
                  )}

                  <View style={styles.weekDivider} />

                  {selectedWeekData.games.map((game, index) => {
                    const championship = isChampionship(game);

                    return (
                      <View
                        key={game.id || `${selectedWeekData.id}-${index}`}
                        style={styles.gameCard}
                      >
                        <View style={styles.gameTopRow}>
                          <Text style={styles.gameMeta}>
                            {[
                              formatDate(getGameDate(game)),
                              game.time,
                              game.venue || game.location,
                            ]
                              .filter(Boolean)
                              .join(" • ")}
                          </Text>

                          <View style={[styles.statusBubble, getStatusStyle(game)]}>
                            <Text style={styles.statusBubbleText}>
                              {getStatusLabel(game)}
                            </Text>
                          </View>
                        </View>

                        {championship && (
                          <Text style={styles.championshipTitle}>
                            🏆 Championship 🏆
                          </Text>
                        )}

                        <View style={styles.cardDivider} />

                        {renderTeamRow(game, "team1")}
                        {renderTeamRow(game, "team2")}
                      </View>
                    );
                  })}

                  {byeTeamIds.length > 0 && (
                    <View style={styles.byeBox}>
                      <Text style={styles.byeTitle}>BYE WEEK</Text>

                      {byeTeamIds.map((teamId) => (
                        <TouchableOpacity
                          key={teamId}
                          activeOpacity={0.75}
                          onPress={() => openByeTeamCard(teamId)}
                        >
                          <Text style={styles.byeTeamLink}>
                            • {getTeamNameById(teamId)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </>
          )}
        </ScrollView>

        {selectedTeam && (
          <SearchTeamCard
            team={selectedTeam}
            onClose={() => setSelectedTeam(null)}
          />
        )}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    padding: 16,
    paddingBottom: 130,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#555",
  },

  headerCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111",
    marginBottom: 6,
  },

  headerText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },

  dropdownButton: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#dedede",
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dropdownTextBox: {
    flex: 1,
    paddingRight: 12,
  },

  dropdownLabel: {
    fontSize: 12,
    color: "#777",
    marginBottom: 4,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  dropdownValue: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111",
  },

  dropdownArrow: {
    fontSize: 15,
    fontWeight: "900",
    color: PURPLE,
  },

  dropdownMenu: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dedede",
    overflow: "hidden",
    marginBottom: 14,
  },

  dropdownItem: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  dropdownItemActive: {
    backgroundColor: "#f1efff",
  },

  dropdownItemText: {
    fontSize: 15,
    color: "#222",
    fontWeight: "700",
  },

  dropdownItemTextActive: {
    color: PURPLE,
    fontWeight: "900",
  },

  weekCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },

  weekTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#111",
  },

  weekDate: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
    fontWeight: "700",
  },

  weekDivider: {
    height: 1,
    backgroundColor: "#e8e8e8",
    marginVertical: 14,
  },

  gameCard: {
    backgroundColor: "#f7f7f7",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e1e1e1",
  },

  gameTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  gameMeta: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
    color: "#555",
  },

  statusBubble: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },

  statusFinal: {
    backgroundColor: "#168A3A",
  },

  statusScheduled: {
    backgroundColor: "#F4B400",
  },

  statusForfeit: {
    backgroundColor: "#D62828",
  },

  statusBubbleText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.4,
  },

  championshipTitle: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "900",
    color: "#111",
  },

  cardDivider: {
    height: 1,
    backgroundColor: "#d8d8d8",
    marginVertical: 12,
  },

  teamRow: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },

  teamName: {
    flex: 1,
    paddingRight: 12,
    fontSize: 21,
    fontWeight: "800",
    color: PURPLE,
  },

  scoreText: {
    minWidth: 52,
    textAlign: "right",
    fontSize: 27,
    fontWeight: "800",
    color: "#111",
  },

  loserText: {
    color: "#9b9b9b",
  },

  byeBox: {
    backgroundColor: "#f8f8f8",
    borderRadius: 14,
    padding: 12,
    marginTop: 4,
  },

  byeTitle: {
    fontSize: 13,
    color: "#777",
    fontWeight: "900",
    marginBottom: 4,
    textTransform: "uppercase",
  },

  byeTeamLink: {
    fontSize: 16,
    color: PURPLE,
    fontWeight: "900",
    marginTop: 6,
  },

  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111",
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});