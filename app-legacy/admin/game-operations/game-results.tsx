import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import SubScreenLayout from "src/components/SubScreenLayout";
import SearchTeamCard, { Team } from "src/components/cards/SearchTeamCard";
import { db } from "src/lib/firebase";

type LeagueKey =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

type GameStatus = "scheduled" | "completed" | "final";
type ResultType = "normal" | "forfeit" | "pending";

type Game = {
  id?: string;
  time?: string;
  date?: string;
  venue?: string;
  location?: string;

  team1Id?: string;
  team2Id?: string;
  team1Name?: string;
  team2Name?: string;
  team1Captain?: string;
  team2Captain?: string;

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

type EditableGame = Game & {
  localId: string;
  team1ScoreInput: string;
  team2ScoreInput: string;
  statusInput: GameStatus;
  resultTypeInput: ResultType;
  winnerInput: string | null;
};

type TeamMap = Record<string, string>;

const PURPLE = "#250f74";

const LEAGUE_LABELS: Record<LeagueKey, Team["league"]> = {
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
};

const LEAGUES: LeagueKey[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export default function AdminGameResultsScreen() {
  const [leagueId, setLeagueId] = React.useState<LeagueKey>("sunday");
  const [leagueDropdownOpen, setLeagueDropdownOpen] = React.useState(false);

  const [seasonId, setSeasonId] = React.useState<string | null>(null);
  const [weeks, setWeeks] = React.useState<WeekDoc[]>([]);
  const [teams, setTeams] = React.useState<TeamMap>({});
  const [selectedWeek, setSelectedWeek] = React.useState(1);
  const [weekDropdownOpen, setWeekDropdownOpen] = React.useState(false);

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null);

  React.useEffect(() => {
    let unsubscribeWeeks: undefined | (() => void);

    async function loadTeamNames(activeSeasonId: string) {
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

        if (id && name) teamMap[String(id)] = String(name);
      }

      try {
        const seasonSnap = await getDoc(
          doc(db, "leagues", leagueId, "seasons", activeSeasonId)
        );

        if (seasonSnap.exists()) {
          const seasonData = seasonSnap.data();

          if (Array.isArray(seasonData.teams)) {
            seasonData.teams.forEach((team: any) => addTeam(team));
          }
        }

        const seasonTeamsSnap = await getDocs(
          collection(db, "leagues", leagueId, "seasons", activeSeasonId, "teams")
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
        console.log("Admin team name load error:", error);
      }

      return teamMap;
    }

    async function loadResults() {
      setLoading(true);
      setWeeks([]);
      setTeams({});
      setSeasonId(null);
      setSelectedTeam(null);

      try {
        const leagueSnap = await getDoc(doc(db, "leagues", leagueId));

        if (!leagueSnap.exists()) {
          setLoading(false);
          return;
        }

        const leagueData = leagueSnap.data();
        const activeSeasonId =
          leagueData.activeSeasonId || leagueData.currentSeasonId;

        if (!activeSeasonId) {
          setLoading(false);
          return;
        }

        setSeasonId(String(activeSeasonId));

        const teamMap = await loadTeamNames(String(activeSeasonId));
        setTeams(teamMap);

        const weeksRef = collection(
          db,
          "leagues",
          leagueId,
          "seasons",
          String(activeSeasonId),
          "weeks"
        );

        const weeksQuery = query(weeksRef, orderBy("week", "asc"));

        unsubscribeWeeks = onSnapshot(
          weeksQuery,
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
            console.log("Admin game results listener error:", error);
            setLoading(false);
          }
        );
      } catch (error) {
        console.log("Admin game results load error:", error);
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

  const editableGames = React.useMemo<EditableGame[]>(() => {
    if (!selectedWeekData?.games) return [];

    return selectedWeekData.games.map((game, index) => {
      const localId =
        game.id ||
        `${selectedWeekData.id}-${index}-${game.team1Id}-${game.team2Id}`;

      return {
        ...game,
        localId,
        team1ScoreInput:
          game.team1Score === null || game.team1Score === undefined
            ? ""
            : String(game.team1Score),
        team2ScoreInput:
          game.team2Score === null || game.team2Score === undefined
            ? ""
            : String(game.team2Score),
        statusInput: normalizeStatus(game.status),
        resultTypeInput: normalizeResultType(game.resultType),
        winnerInput: getWinnerId(game),
      };
    });
  }, [selectedWeekData]);

  const [localGames, setLocalGames] = React.useState<EditableGame[]>([]);

  React.useEffect(() => {
    setLocalGames(editableGames);
  }, [editableGames]);

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

  function normalizeStatus(status?: string): GameStatus {
    const safe = String(status || "").toLowerCase();

    if (safe === "completed") return "completed";
    if (safe === "final") return "final";

    return "scheduled";
  }

  function normalizeResultType(resultType?: string): ResultType {
    const safe = String(resultType || "").toLowerCase();

    if (safe === "forfeit") return "forfeit";
    if (safe === "pending") return "pending";

    return "normal";
  }

  function getWinnerId(game: Game) {
    if (game.winnerId) return game.winnerId;
    if (game.winner) return game.winner;

    const team1Score = getScore(game.team1Score);
    const team2Score = getScore(game.team2Score);

    if (team1Score !== null && team2Score !== null) {
      if (team1Score > team2Score) return game.team1Id || null;
      if (team2Score > team1Score) return game.team2Id || null;
    }

    return null;
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

  function updateLocalGame(localId: string, patch: Partial<EditableGame>) {
    setLocalGames((current) =>
      current.map((game) =>
        game.localId === localId ? { ...game, ...patch } : game
      )
    );
  }

  function getPreviewResult(game: EditableGame) {
    const team1Name = getTeamName(game, "team1");
    const team2Name = getTeamName(game, "team2");

    const team1Score = getScore(game.team1ScoreInput);
    const team2Score = getScore(game.team2ScoreInput);

    const winnerId =
      game.winnerInput ||
      (team1Score !== null && team2Score !== null
        ? team1Score > team2Score
          ? game.team1Id
          : team2Score > team1Score
            ? game.team2Id
            : null
        : null);

    const winnerName =
      winnerId === game.team1Id
        ? team1Name
        : winnerId === game.team2Id
          ? team2Name
          : null;

    const loserName =
      winnerName === team1Name
        ? team2Name
        : winnerName === team2Name
          ? team1Name
          : null;

    if (game.resultTypeInput === "pending") {
      return `${team1Name} vs ${team2Name}`;
    }

    if (winnerName && loserName && team1Score !== null && team2Score !== null) {
      const winnerScore = winnerName === team1Name ? team1Score : team2Score;
      const loserScore = winnerName === team1Name ? team2Score : team1Score;

      return `${winnerName}: ${winnerScore} def ${loserName}: ${loserScore}`;
    }

    if (winnerName && loserName) {
      return `${winnerName} def ${loserName}`;
    }

    return `${team1Name} vs ${team2Name}`;
  }

  function openTeamCard(game: Game, side: "team1" | "team2") {
    const teamId = side === "team1" ? game.team1Id : game.team2Id;
    const teamName = getTeamName(game, side);
    const opponentName = getTeamName(game, side === "team1" ? "team2" : "team1");

    setSelectedTeam({
      id: teamId || teamName,
      teamName,
      league: LEAGUE_LABELS[leagueId],
      record: "Not available",
      place: "Not available",
      status: normalizeStatus(game.status).toUpperCase(),
      nextGame: `${opponentName} • ${game.time || "TBD"}${
        game.venue || game.location ? ` • ${game.venue || game.location}` : ""
      }`,
      lastResult: getPreviewResult(game as EditableGame),
      recentResults: [
        {
          week: `Week ${selectedWeekData?.week || selectedWeek}`,
          display: getPreviewResult(game as EditableGame),
        },
      ],
    });
  }

  function openByeTeamCard(teamId: string) {
    const teamName = getTeamNameById(teamId);

    setSelectedTeam({
      id: teamId,
      teamName,
      league: LEAGUE_LABELS[leagueId],
      record: "Not available",
      place: "Not available",
      status: "Bye Week",
      nextGame: "This team is on a bye this week.",
      lastResult: "No recent result posted.",
      recentResults: [],
    });
  }

  async function saveResults() {
    if (!seasonId || !selectedWeekData) {
      Alert.alert("Missing week", "No week is selected.");
      return;
    }

    setSaving(true);

    try {
      const updatedGames: Game[] = localGames.map((game) => {
        const team1Score = getScore(game.team1ScoreInput);
        const team2Score = getScore(game.team2ScoreInput);

        const autoWinner =
          team1Score !== null && team2Score !== null
            ? team1Score > team2Score
              ? game.team1Id || null
              : team2Score > team1Score
                ? game.team2Id || null
                : null
            : null;

        const winnerId = game.winnerInput || autoWinner;

        const winnerName =
          winnerId === game.team1Id
            ? getTeamName(game, "team1")
            : winnerId === game.team2Id
              ? getTeamName(game, "team2")
              : null;

        return {
          ...game,
          team1Score,
          team2Score,
          status: game.statusInput,
          resultType: game.resultTypeInput,
          winner: winnerId,
          winnerId,
          winnerName,
        };
      });

      await updateDoc(
        doc(
          db,
          "leagues",
          leagueId,
          "seasons",
          seasonId,
          "weeks",
          selectedWeekData.id
        ),
        {
          games: updatedGames,
        }
      );

      Alert.alert("Saved", "Game results were updated.");
    } catch (error) {
      console.log("Save game results error:", error);
      Alert.alert("Save failed", "Could not save game results.");
    } finally {
      setSaving(false);
    }
  }

  const byeTeamIds = [
    ...(selectedWeekData?.bye || []),
    ...(selectedWeekData?.byes || []),
  ];

  return (
    <SubScreenLayout title="Game Results" backRoute="/admin">
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headerCard}>
            <Text style={styles.headerTitle}>Game Results</Text>
            <Text style={styles.headerText}>
              Select a league and week, edit scores or winners, preview the
              result, then save.
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.dropdownButton}
            onPress={() => setLeagueDropdownOpen((prev) => !prev)}
          >
            <View>
              <Text style={styles.dropdownLabel}>League</Text>
              <Text style={styles.dropdownValue}>
                {LEAGUE_LABELS[leagueId]} League
              </Text>
            </View>
            <Text style={styles.dropdownArrow}>
              {leagueDropdownOpen ? "▼" : "▶"}
            </Text>
          </TouchableOpacity>

          {leagueDropdownOpen && (
            <View style={styles.dropdownMenu}>
              {LEAGUES.map((league) => (
                <TouchableOpacity
                  key={league}
                  activeOpacity={0.85}
                  style={[
                    styles.dropdownItem,
                    leagueId === league && styles.dropdownItemActive,
                  ]}
                  onPress={() => {
                    setLeagueId(league);
                    setSelectedWeek(1);
                    setLeagueDropdownOpen(false);
                    setWeekDropdownOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      leagueId === league && styles.dropdownItemTextActive,
                    ]}
                  >
                    {LEAGUE_LABELS[league]} League
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {loading ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Loading results...</Text>
              <Text style={styles.emptyText}>
                Pulling the active season schedule from Firebase.
              </Text>
            </View>
          ) : weeks.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No weeks found</Text>
              <Text style={styles.emptyText}>
                This league does not have an active schedule yet.
              </Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.dropdownButton}
                onPress={() => setWeekDropdownOpen((prev) => !prev)}
              >
                <View>
                  <Text style={styles.dropdownLabel}>Week</Text>
                  <Text style={styles.dropdownValue}>
                    {selectedWeekData
                      ? getWeekLabel(selectedWeekData)
                      : "Select Week"}
                  </Text>
                </View>
                <Text style={styles.dropdownArrow}>
                  {weekDropdownOpen ? "▼" : "▶"}
                </Text>
              </TouchableOpacity>

              {weekDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {weeks.map((week) => (
                    <TouchableOpacity
                      key={week.id}
                      activeOpacity={0.85}
                      style={[
                        styles.dropdownItem,
                        selectedWeek === week.week && styles.dropdownItemActive,
                      ]}
                      onPress={() => {
                        setSelectedWeek(week.week);
                        setWeekDropdownOpen(false);
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
                    <Text style={styles.weekDate}>{selectedWeekData.date}</Text>
                  )}

                  <View style={styles.weekDivider} />

                  {localGames.map((game, index) => {
                    const team1Name = getTeamName(game, "team1");
                    const team2Name = getTeamName(game, "team2");

                    return (
                      <View key={game.localId} style={styles.gameCard}>
                        <View style={styles.gameHeaderRow}>
                          <Text style={styles.gameNumber}>Game {index + 1}</Text>
                          <Text style={styles.gameMeta}>
                            {[game.time, game.venue || game.location]
                              .filter(Boolean)
                              .join(" • ")}
                          </Text>
                        </View>

                        <View style={styles.subtleDivider} />

                        <View style={styles.teamEditRow}>
                          <TouchableOpacity
                            activeOpacity={0.75}
                            onPress={() => openTeamCard(game, "team1")}
                            style={styles.teamNameButton}
                          >
                            <Text style={styles.teamName}>{team1Name}</Text>
                          </TouchableOpacity>

                          <TextInput
                            value={game.team1ScoreInput}
                            onChangeText={(text) =>
                              updateLocalGame(game.localId, {
                                team1ScoreInput: text.replace(/[^0-9]/g, ""),
                              })
                            }
                            keyboardType="number-pad"
                            placeholder="0"
                            style={styles.scoreInput}
                          />
                        </View>

                        <Text style={styles.vsText}>vs</Text>

                        <View style={styles.teamEditRow}>
                          <TouchableOpacity
                            activeOpacity={0.75}
                            onPress={() => openTeamCard(game, "team2")}
                            style={styles.teamNameButton}
                          >
                            <Text style={styles.teamName}>{team2Name}</Text>
                          </TouchableOpacity>

                          <TextInput
                            value={game.team2ScoreInput}
                            onChangeText={(text) =>
                              updateLocalGame(game.localId, {
                                team2ScoreInput: text.replace(/[^0-9]/g, ""),
                              })
                            }
                            keyboardType="number-pad"
                            placeholder="0"
                            style={styles.scoreInput}
                          />
                        </View>

                        <View style={styles.subtleDivider} />

                        <Text style={styles.sectionLabel}>Result Type</Text>
                        <View style={styles.choiceRow}>
                          {(["normal", "forfeit", "pending"] as ResultType[]).map(
                            (type) => (
                              <TouchableOpacity
                                key={type}
                                activeOpacity={0.85}
                                style={[
                                  styles.choiceButton,
                                  game.resultTypeInput === type &&
                                    styles.choiceButtonActive,
                                ]}
                                onPress={() =>
                                  updateLocalGame(game.localId, {
                                    resultTypeInput: type,
                                  })
                                }
                              >
                                <Text
                                  style={[
                                    styles.choiceText,
                                    game.resultTypeInput === type &&
                                      styles.choiceTextActive,
                                  ]}
                                >
                                  {type.toUpperCase()}
                                </Text>
                              </TouchableOpacity>
                            )
                          )}
                        </View>

                        <Text style={styles.sectionLabel}>Winner</Text>
                        <View style={styles.choiceRow}>
                          <TouchableOpacity
                            activeOpacity={0.85}
                            style={[
                              styles.choiceButton,
                              game.winnerInput === game.team1Id &&
                                styles.choiceButtonActive,
                            ]}
                            onPress={() =>
                              updateLocalGame(game.localId, {
                                winnerInput: game.team1Id || team1Name,
                              })
                            }
                          >
                            <Text
                              style={[
                                styles.choiceText,
                                game.winnerInput === game.team1Id &&
                                  styles.choiceTextActive,
                              ]}
                            >
                              {team1Name}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            activeOpacity={0.85}
                            style={[
                              styles.choiceButton,
                              game.winnerInput === game.team2Id &&
                                styles.choiceButtonActive,
                            ]}
                            onPress={() =>
                              updateLocalGame(game.localId, {
                                winnerInput: game.team2Id || team2Name,
                              })
                            }
                          >
                            <Text
                              style={[
                                styles.choiceText,
                                game.winnerInput === game.team2Id &&
                                  styles.choiceTextActive,
                              ]}
                            >
                              {team2Name}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            activeOpacity={0.85}
                            style={[
                              styles.choiceButton,
                              !game.winnerInput && styles.choiceButtonActive,
                            ]}
                            onPress={() =>
                              updateLocalGame(game.localId, {
                                winnerInput: null,
                              })
                            }
                          >
                            <Text
                              style={[
                                styles.choiceText,
                                !game.winnerInput && styles.choiceTextActive,
                              ]}
                            >
                              TBD
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <Text style={styles.sectionLabel}>Status</Text>
                        <View style={styles.choiceRow}>
                          {(["scheduled", "completed", "final"] as GameStatus[]).map(
                            (status) => (
                              <TouchableOpacity
                                key={status}
                                activeOpacity={0.85}
                                style={[
                                  styles.choiceButton,
                                  game.statusInput === status &&
                                    styles.choiceButtonActive,
                                ]}
                                onPress={() =>
                                  updateLocalGame(game.localId, {
                                    statusInput: status,
                                  })
                                }
                              >
                                <Text
                                  style={[
                                    styles.choiceText,
                                    game.statusInput === status &&
                                      styles.choiceTextActive,
                                  ]}
                                >
                                  {status.toUpperCase()}
                                </Text>
                              </TouchableOpacity>
                            )
                          )}
                        </View>

                        <View style={styles.previewBox}>
                          <Text style={styles.previewLabel}>Preview</Text>
                          <Text style={styles.previewText}>
                            {getPreviewResult(game)}
                          </Text>
                        </View>
                      </View>
                    );
                  })}

                  {byeTeamIds.length > 0 && (
                    <View style={styles.byeBox}>
                      <Text style={styles.byeTitle}>Bye</Text>

                      {byeTeamIds.map((teamId) => (
                        <TouchableOpacity
                          key={teamId}
                          activeOpacity={0.75}
                          onPress={() => openByeTeamCard(teamId)}
                        >
                          <Text style={styles.byeTeamLink}>
                            {getTeamNameById(teamId)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <TouchableOpacity
                    activeOpacity={0.9}
                    disabled={saving}
                    style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                    onPress={saveResults}
                  >
                    <Text style={styles.saveButtonText}>
                      {saving ? "Saving..." : "Save Results"}
                    </Text>
                  </TouchableOpacity>
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
    </SubScreenLayout>
  );
}

function getWeekLabel(week: WeekDoc) {
  if (week.title) return week.title;

  const hasChampionship = week.games.some(
    (game) => String(game.type || "").toLowerCase() === "championship"
  );

  const hasPlayoff = week.games.some(
    (game) => String(game.type || "").toLowerCase() === "playoff"
  );

  if (hasChampionship) return `Week ${week.week}: Championship`;
  if (hasPlayoff) return `Week ${week.week}: Playoffs`;

  return `Regular Season: Week ${week.week}`;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    padding: 16,
    paddingBottom: 130,
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
    fontSize: 22,
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

  dropdownLabel: {
    fontSize: 12,
    color: "#777",
    marginBottom: 4,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  dropdownValue: {
    fontSize: 16,
    color: "#111",
    fontWeight: "900",
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
    backgroundColor: "#fafafa",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eeeeee",
  },

  gameHeaderRow: {
    gap: 4,
  },

  gameNumber: {
    fontSize: 15,
    color: "#111",
    fontWeight: "900",
  },

  gameMeta: {
    fontSize: 13,
    color: "#555",
    fontWeight: "700",
  },

  subtleDivider: {
    height: 1,
    backgroundColor: "#e4e4e4",
    marginVertical: 12,
  },

  teamEditRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  teamNameButton: {
    flex: 1,
    paddingVertical: 6,
  },

  teamName: {
    fontSize: 17,
    fontWeight: "900",
    color: PURPLE,
  },

  scoreInput: {
    width: 72,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d8d8d8",
    backgroundColor: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
    color: "#111",
  },

  vsText: {
    fontSize: 13,
    color: "#777",
    fontWeight: "900",
    marginVertical: 4,
  },

  sectionLabel: {
    marginTop: 10,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "900",
    color: "#777",
    textTransform: "uppercase",
  },

  choiceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  choiceButton: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  choiceButtonActive: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },

  choiceText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#333",
  },

  choiceTextActive: {
    color: "#fff",
  },

  previewBox: {
    marginTop: 14,
    backgroundColor: "#f1efff",
    borderRadius: 14,
    padding: 12,
  },

  previewLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: PURPLE,
    marginBottom: 4,
    textTransform: "uppercase",
  },

  previewText: {
    fontSize: 15,
    color: "#111",
    fontWeight: "900",
    lineHeight: 21,
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
    fontSize: 15,
    color: PURPLE,
    fontWeight: "900",
    marginTop: 6,
  },

  saveButton: {
    marginTop: 18,
    backgroundColor: PURPLE,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },

  saveButtonDisabled: {
    opacity: 0.55,
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
});