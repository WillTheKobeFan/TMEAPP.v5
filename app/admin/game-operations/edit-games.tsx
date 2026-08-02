// app/admin/game-operations/edit-games.tsx

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
import { useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import SubScreenLayout from "src/components/SubScreenLayout";

const THEME = "#250f74";

type GameStatus = "scheduled" | "completed" | "final";
type GameType = "regular" | "playoff" | "championship";
type ResultType = "pending" | "normal" | "forfeit";
type WeekPhase = "regular" | "playoff";
type PreviewMode = "player" | "admin";

type TeamOption = {
  id: string;
  name: string;
};

type EditableGame = {
  id: string;
  time: string;
  venue: string;
  team1Seed: string;
  team1Id: string;
  team2Seed: string;
  team2Id: string;
  team1Score: string;
  team2Score: string;
  status: GameStatus;
  type: GameType;
  resultType: ResultType;
};

type EditableWeek = {
  id: string;
  week: number;
  label: string;
  date: string;
  phase: WeekPhase;
  games: EditableGame[];
  bye: string[];
};

type LeagueConfig = {
  id: string;
  label: string;
  venue: string;
  teams: TeamOption[];
  weeks: EditableWeek[];
};

const SEED_OPTIONS = ["", "1", "2", "3", "4", "5", "6", "7", "8"];

const TEAM_PLACEHOLDERS: TeamOption[] = [
  { id: "TBD", name: "TBD" },
  { id: "winner_g1", name: "Winner Game 1" },
  { id: "winner_g2", name: "Winner Game 2" },
  { id: "winner_g3", name: "Winner Game 3" },
  { id: "winner_g4", name: "Winner Game 4" },
];

function makeGame(
  id: string,
  time: string,
  venue: string,
  team1Seed: string,
  team1Id: string,
  team2Seed: string,
  team2Id: string,
  type: GameType
): EditableGame {
  return {
    id,
    time,
    venue,
    team1Seed,
    team1Id,
    team2Seed,
    team2Id,
    team1Score: "",
    team2Score: "",
    status: "scheduled",
    type,
    resultType: "pending",
  };
}

function getDateForWeek(startDate: string, weekNumber: number) {
  const date = new Date(`${startDate}T12:00:00`);
  date.setDate(date.getDate() + (weekNumber - 1) * 7);
  return date.toISOString().slice(0, 10);
}

function buildWeeks({
  leaguePrefix,
  startDate,
  totalWeeks,
  playoffWeeks,
}: {
  leaguePrefix: string;
  startDate: string;
  totalWeeks: number;
  playoffWeeks: Record<number, EditableWeek>;
}): EditableWeek[] {
  const weeks: EditableWeek[] = [];

  for (let weekNumber = 1; weekNumber <= totalWeeks; weekNumber++) {
    if (playoffWeeks[weekNumber]) {
      weeks.push(playoffWeeks[weekNumber]);
      continue;
    }

    weeks.push({
      id: `${leaguePrefix}_w${weekNumber}`,
      week: weekNumber,
      label: `Week ${weekNumber} · Regular Season`,
      date: getDateForWeek(startDate, weekNumber),
      phase: "regular",
      games: [],
      bye: [],
    });
  }

  return weeks;
}

function getTeamName(teams: TeamOption[], teamId: string) {
  const allOptions = [...TEAM_PLACEHOLDERS, ...teams];
  return allOptions.find((team) => team.id === teamId)?.name ?? "TBD";
}

function formatSeededTeam(seed: string, teamName: string) {
  return seed ? `(${seed}) ${teamName}` : teamName;
}

function replaceWeek(
  leagues: LeagueConfig[],
  leagueId: string,
  newWeek: EditableWeek
) {
  return leagues.map((league) => {
    if (league.id !== leagueId) return league;

    return {
      ...league,
      weeks: league.weeks.map((week) =>
        week.id === newWeek.id ? newWeek : week
      ),
    };
  });
}

const LEAGUES: LeagueConfig[] = [
  {
    id: "sunday",
    label: "Sunday AM · YMCA",
    venue: "YMCA",
    teams: [
      { id: "sun_tA", name: "Ziller" },
      { id: "sun_tB", name: "Tom" },
      { id: "sun_tC", name: "Edwards" },
      { id: "sun_tD", name: "Rich" },
      { id: "sun_tE", name: "Timmy" },
      { id: "sun_tF", name: "TeeJ" },
      { id: "sun_tG", name: "Dale" },
      { id: "sun_tH", name: "Prince" },
      { id: "sun_tI", name: "Dex" },
    ],
    weeks: buildWeeks({
      leaguePrefix: "sun",
      startDate: "2026-02-22",
      totalWeeks: 12,
      playoffWeeks: {
        11: {
          id: "sun_w11",
          week: 11,
          label: "Week 11 · Quarterfinals",
          date: getDateForWeek("2026-02-22", 11),
          phase: "playoff",
          bye: [],
          games: [
            makeGame("sun_w11_g1", "9:00 AM", "YMCA", "1", "TBD", "8", "TBD", "playoff"),
            makeGame("sun_w11_g2", "10:00 AM", "YMCA", "4", "TBD", "5", "TBD", "playoff"),
            makeGame("sun_w11_g3", "11:00 AM", "YMCA", "2", "TBD", "7", "TBD", "playoff"),
            makeGame("sun_w11_g4", "12:00 PM", "YMCA", "3", "TBD", "6", "TBD", "playoff"),
          ],
        },
        12: {
          id: "sun_w12",
          week: 12,
          label: "Week 12 · Semifinals",
          date: getDateForWeek("2026-02-22", 12),
          phase: "playoff",
          bye: [],
          games: [
            makeGame("sun_w12_g1", "11:00 AM", "YMCA", "", "winner_g1", "", "winner_g2", "playoff"),
            makeGame("sun_w12_g2", "12:00 PM", "YMCA", "", "winner_g3", "", "winner_g4", "playoff"),
          ],
        },
      },
    }),
  },
  {
    id: "monday",
    label: "Monday PM · Berlin",
    venue: "Berlin",
    teams: [
      { id: "mon_tA", name: "Trifecta" },
      { id: "mon_tB", name: "Beans" },
      { id: "mon_tC", name: "Chimney" },
      { id: "mon_tD", name: "MAAC" },
      { id: "mon_tE", name: "Hard Rock" },
      { id: "mon_tF", name: "The Other Bar" },
      { id: "mon_tG", name: "JRL" },
    ],
    weeks: buildWeeks({
      leaguePrefix: "mon",
      startDate: "2026-03-23",
      totalWeeks: 11,
      playoffWeeks: {
        11: {
          id: "mon_w11",
          week: 11,
          label: "Week 11 · Semifinals & Championship",
          date: getDateForWeek("2026-03-23", 11),
          phase: "playoff",
          bye: [],
          games: [
            makeGame("mon_w11_g1", "7:00 PM", "Berlin", "1", "TBD", "4", "TBD", "playoff"),
            makeGame("mon_w11_g2", "8:00 PM", "Berlin", "2", "TBD", "3", "TBD", "playoff"),
            makeGame("mon_w11_g3", "9:00 PM", "Berlin", "", "TBD", "", "TBD", "championship"),
          ],
        },
      },
    }),
  },
  {
    id: "tuesday",
    label: "Tuesday PM · YMCA",
    venue: "YMCA",
    teams: [
      { id: "tue_tA", name: "Team A" },
      { id: "tue_tB", name: "Team B" },
      { id: "tue_tC", name: "Team C" },
      { id: "tue_tD", name: "Team D" },
      { id: "tue_tE", name: "Team E" },
      { id: "tue_tF", name: "Team F" },
      { id: "tue_tG", name: "Team G" },
    ],
    weeks: buildWeeks({
      leaguePrefix: "tue",
      startDate: "2026-03-24",
      totalWeeks: 11,
      playoffWeeks: {
        11: {
          id: "tue_w11",
          week: 11,
          label: "Week 11 · Semifinals & Championship",
          date: getDateForWeek("2026-03-24", 11),
          phase: "playoff",
          bye: [],
          games: [
            makeGame("tue_w11_g1", "6:30 PM", "YMCA", "1", "TBD", "4", "TBD", "playoff"),
            makeGame("tue_w11_g2", "7:30 PM", "YMCA", "2", "TBD", "3", "TBD", "playoff"),
            makeGame("tue_w11_g3", "8:30 PM", "YMCA", "", "TBD", "", "TBD", "championship"),
          ],
        },
      },
    }),
  },
  {
    id: "wednesday",
    label: "Wednesday PM · Berlin",
    venue: "Berlin",
    teams: [
      { id: "wed_tA", name: "Duffy" },
      { id: "wed_tB", name: "Neil" },
      { id: "wed_tC", name: "Tom" },
      { id: "wed_tD", name: "Gross" },
      { id: "wed_tE", name: "Gervese" },
      { id: "wed_tF", name: "Rob" },
      { id: "wed_tG", name: "Mark" },
    ],
    weeks: buildWeeks({
      leaguePrefix: "wed",
      startDate: "2026-03-04",
      totalWeeks: 11,
      playoffWeeks: {
        11: {
          id: "wed_w11",
          week: 11,
          label: "Week 11 · Semifinals & Championship",
          date: getDateForWeek("2026-03-04", 11),
          phase: "playoff",
          bye: [],
          games: [
            makeGame("wed_w11_g1", "7:00 PM", "Berlin", "1", "TBD", "4", "TBD", "playoff"),
            makeGame("wed_w11_g2", "8:00 PM", "Berlin", "2", "TBD", "3", "TBD", "playoff"),
            makeGame("wed_w11_g3", "9:00 PM", "Berlin", "", "TBD", "", "TBD", "championship"),
          ],
        },
      },
    }),
  },
];

export default function EditGamesScreen() {
  const router = useRouter();

  const [leagueData, setLeagueData] = React.useState<LeagueConfig[]>(LEAGUES);
  const [selectedLeagueId, setSelectedLeagueId] = React.useState(LEAGUES[0].id);
  const [selectedWeekId, setSelectedWeekId] = React.useState(LEAGUES[0].weeks[0].id);

  const [leagueOpen, setLeagueOpen] = React.useState(false);
  const [weekOpen, setWeekOpen] = React.useState(false);
  const [previewMode, setPreviewMode] = React.useState<PreviewMode>("player");

  const [swapGameAId, setSwapGameAId] = React.useState("");
  const [swapGameBId, setSwapGameBId] = React.useState("");

  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    weekSettings: true,
    swapGames: false,
    byeTeams: false,
  });

  const selectedLeague =
    leagueData.find((league) => league.id === selectedLeagueId) ?? leagueData[0];

  const selectedWeek =
    selectedLeague.weeks.find((week) => week.id === selectedWeekId) ??
    selectedLeague.weeks[0];

  const teamOptions =
    selectedWeek.phase === "playoff"
      ? [...TEAM_PLACEHOLDERS, ...selectedLeague.teams]
      : selectedLeague.teams;

  function toggleSection(sectionId: string) {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }

  function selectLeague(leagueId: string) {
    const nextLeague = leagueData.find((league) => league.id === leagueId);
    if (!nextLeague) return;

    setSelectedLeagueId(nextLeague.id);
    setSelectedWeekId(nextLeague.weeks[0].id);
    setSwapGameAId("");
    setSwapGameBId("");
    setLeagueOpen(false);
    setWeekOpen(false);
  }

  function selectWeek(weekId: string) {
    setSelectedWeekId(weekId);
    setSwapGameAId("");
    setSwapGameBId("");
    setWeekOpen(false);
  }

  function updateWeekField(field: keyof EditableWeek, value: string) {
    const newWeek = { ...selectedWeek, [field]: value };
    setLeagueData((prev) => replaceWeek(prev, selectedLeague.id, newWeek));
  }

  function updateGame(gameId: string, field: keyof EditableGame, value: string) {
    const newWeek = {
      ...selectedWeek,
      games: selectedWeek.games.map((game) =>
        game.id === gameId ? { ...game, [field]: value } : game
      ),
    };

    setLeagueData((prev) => replaceWeek(prev, selectedLeague.id, newWeek));
  }

  function addGame() {
    const newGame = makeGame(
      `${selectedWeek.id}_g${selectedWeek.games.length + 1}`,
      "",
      selectedLeague.venue,
      "",
      selectedWeek.phase === "playoff"
        ? "TBD"
        : selectedLeague.teams[0]?.id ?? "TBD",
      "",
      selectedWeek.phase === "playoff"
        ? "TBD"
        : selectedLeague.teams[1]?.id ?? "TBD",
      selectedWeek.phase === "playoff" ? "playoff" : "regular"
    );

    const newWeek = {
      ...selectedWeek,
      games: [...selectedWeek.games, newGame],
    };

    setLeagueData((prev) => replaceWeek(prev, selectedLeague.id, newWeek));
  }

  function deleteGame(gameId: string) {
    const newWeek = {
      ...selectedWeek,
      games: selectedWeek.games.filter((game) => game.id !== gameId),
    };

    setLeagueData((prev) => replaceWeek(prev, selectedLeague.id, newWeek));

    if (swapGameAId === gameId) setSwapGameAId("");
    if (swapGameBId === gameId) setSwapGameBId("");
  }

  function toggleByeTeam(teamId: string) {
    const newWeek = {
      ...selectedWeek,
      bye: selectedWeek.bye.includes(teamId)
        ? selectedWeek.bye.filter((id) => id !== teamId)
        : [...selectedWeek.bye, teamId],
    };

    setLeagueData((prev) => replaceWeek(prev, selectedLeague.id, newWeek));
  }

  function resetPlayoffSeeds() {
    if (selectedWeek.phase !== "playoff") return;

    const isSunday = selectedLeague.id === "sunday";

    const games = isSunday
      ? [
          makeGame(`${selectedWeek.id}_g1`, "9:00 AM", selectedLeague.venue, "1", "TBD", "8", "TBD", "playoff"),
          makeGame(`${selectedWeek.id}_g2`, "10:00 AM", selectedLeague.venue, "4", "TBD", "5", "TBD", "playoff"),
          makeGame(`${selectedWeek.id}_g3`, "11:00 AM", selectedLeague.venue, "2", "TBD", "7", "TBD", "playoff"),
          makeGame(`${selectedWeek.id}_g4`, "12:00 PM", selectedLeague.venue, "3", "TBD", "6", "TBD", "playoff"),
        ]
      : [
          makeGame(
            `${selectedWeek.id}_g1`,
            selectedLeague.id === "tuesday" ? "6:30 PM" : "7:00 PM",
            selectedLeague.venue,
            "1",
            "TBD",
            "4",
            "TBD",
            "playoff"
          ),
          makeGame(
            `${selectedWeek.id}_g2`,
            selectedLeague.id === "tuesday" ? "7:30 PM" : "8:00 PM",
            selectedLeague.venue,
            "2",
            "TBD",
            "3",
            "TBD",
            "playoff"
          ),
          makeGame(
            `${selectedWeek.id}_g3`,
            selectedLeague.id === "tuesday" ? "8:30 PM" : "9:00 PM",
            selectedLeague.venue,
            "",
            "TBD",
            "",
            "TBD",
            "championship"
          ),
        ];

    setLeagueData((prev) =>
      replaceWeek(prev, selectedLeague.id, { ...selectedWeek, games })
    );

    setSwapGameAId("");
    setSwapGameBId("");
  }

  function pushWeekSevenDays() {
    const date = new Date(`${selectedWeek.date}T12:00:00`);
    date.setDate(date.getDate() + 7);
    updateWeekField("date", date.toISOString().slice(0, 10));
  }

  function applySwapGames() {
    if (!swapGameAId || !swapGameBId) {
      Alert.alert("Swap Error", "Select two games to swap.");
      return;
    }

    if (swapGameAId === swapGameBId) {
      Alert.alert("Swap Error", "Select two different games.");
      return;
    }

    const gameA = selectedWeek.games.find((game) => game.id === swapGameAId);
    const gameB = selectedWeek.games.find((game) => game.id === swapGameBId);

    if (!gameA || !gameB) {
      Alert.alert("Swap Error", "One of the selected games could not be found.");
      return;
    }

    const newWeek = {
      ...selectedWeek,
      games: selectedWeek.games.map((game) => {
        if (game.id === gameA.id) {
          return {
            ...game,
            time: gameB.time,
            venue: gameB.venue,
          };
        }

        if (game.id === gameB.id) {
          return {
            ...game,
            time: gameA.time,
            venue: gameA.venue,
          };
        }

        return game;
      }),
    };

    setLeagueData((prev) => replaceWeek(prev, selectedLeague.id, newWeek));
    setSwapGameAId("");
    setSwapGameBId("");

    Alert.alert(
      "Swap Applied",
      "The games were swapped within this same week. Review the live preview, then save changes."
    );
  }

  function saveChanges() {
    Alert.alert(
      "Saved",
      "Next step: connect this save to Firebase so it overwrites the selected week document instead of creating a duplicate week."
    );
  }

  return (
    <SubScreenLayout title="Edit Games">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Game Editor</Text>
          <Text style={styles.headerText}>
            Edit every week, playoff seed, team, time, venue, bye, and result.
            Swap games within the same week only so the schedule math stays clean.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>League</Text>

          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setLeagueOpen((prev) => !prev)}
          >
            <Text style={styles.dropdownText}>{selectedLeague.label}</Text>
            <FontAwesome6
              name={leagueOpen ? "chevron-up" : "chevron-down"}
              size={14}
              color={THEME}
            />
          </TouchableOpacity>

          {leagueOpen && (
            <View style={styles.dropdownList}>
              {leagueData.map((league) => (
                <TouchableOpacity
                  key={league.id}
                  style={styles.dropdownItem}
                  onPress={() => selectLeague(league.id)}
                >
                  <Text style={styles.dropdownItemText}>{league.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={[styles.label, styles.labelSpacing]}>Week</Text>

          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setWeekOpen((prev) => !prev)}
          >
            <Text style={styles.dropdownText}>{selectedWeek.label}</Text>
            <FontAwesome6
              name={weekOpen ? "chevron-up" : "chevron-down"}
              size={14}
              color={THEME}
            />
          </TouchableOpacity>

          {weekOpen && (
            <View style={styles.dropdownList}>
              {selectedLeague.weeks.map((week) => (
                <TouchableOpacity
                  key={week.id}
                  style={styles.dropdownItem}
                  onPress={() => selectWeek(week.id)}
                >
                  <Text style={styles.dropdownItemText}>{week.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.previewToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              previewMode === "player" && styles.toggleButtonActive,
            ]}
            onPress={() => setPreviewMode("player")}
          >
            <Text
              style={[
                styles.toggleText,
                previewMode === "player" && styles.toggleTextActive,
              ]}
            >
              Player Preview
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              previewMode === "admin" && styles.toggleButtonActive,
            ]}
            onPress={() => setPreviewMode("admin")}
          >
            <Text
              style={[
                styles.toggleText,
                previewMode === "admin" && styles.toggleTextActive,
              ]}
            >
              Admin Preview
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.previewTitle}>Live Preview</Text>
              <Text style={styles.previewSub}>
                {selectedWeek.label} · {selectedWeek.date}
              </Text>
            </View>

            <View style={styles.phaseBadge}>
              <Text style={styles.phaseBadgeText}>
                {selectedWeek.phase === "playoff" ? "Playoff" : "Regular"}
              </Text>
            </View>
          </View>

          {selectedWeek.games.length === 0 ? (
            <View style={styles.emptyPreview}>
              <Text style={styles.emptyTitle}>No games added yet</Text>
              <Text style={styles.emptyText}>
                Open this week and add games when the schedule is ready.
              </Text>
            </View>
          ) : (
            selectedWeek.games.map((game) => {
              const team1Name = formatSeededTeam(
                game.team1Seed,
                getTeamName(selectedLeague.teams, game.team1Id)
              );

              const team2Name = formatSeededTeam(
                game.team2Seed,
                getTeamName(selectedLeague.teams, game.team2Id)
              );

              return (
                <View key={game.id} style={styles.previewGame}>
                  <Text style={styles.previewTime}>
                    {game.time || "No time set"}
                    {game.type === "championship" ? "  🏆 Championship 🏆" : ""}
                  </Text>

                  <Text style={styles.previewMatchup}>
                    {team1Name} vs {team2Name}
                  </Text>

                  <Text style={styles.previewVenue}>📍 {game.venue}</Text>

                  {previewMode === "admin" && (
                    <Text style={styles.previewMeta}>
                      Game ID: {game.id} · Status: {game.status} · Type:{" "}
                      {game.type} · Result: {game.resultType}
                    </Text>
                  )}

                  {previewMode === "admin" && (
                    <Text style={styles.previewMeta}>
                      Team IDs: {game.team1Id} vs {game.team2Id}
                    </Text>
                  )}

                  {(game.team1Score || game.team2Score) && (
                    <Text style={styles.previewScore}>
                      Score: {game.team1Score || "0"} - {game.team2Score || "0"}
                    </Text>
                  )}
                </View>
              );
            })
          )}

          {selectedWeek.bye.length > 0 && (
            <View style={styles.byePreview}>
              <Text style={styles.byeTitle}>Bye</Text>
              <Text style={styles.byeText}>
                {selectedWeek.bye
                  .map((id) => getTeamName(selectedLeague.teams, id))
                  .join(", ")}
              </Text>
            </View>
          )}
        </View>

        {selectedWeek.phase === "playoff" && (
          <TouchableOpacity style={styles.seedButton} onPress={resetPlayoffSeeds}>
            <Text style={styles.seedButtonText}>Reset Standard Seed Matchups</Text>
          </TouchableOpacity>
        )}

        <SectionHeader
          title="Week Settings"
          isOpen={!!openSections.weekSettings}
          onPress={() => toggleSection("weekSettings")}
        />

        {openSections.weekSettings && (
          <View style={styles.card}>
            <Text style={styles.label}>Week Label</Text>
            <TextInput
              style={styles.input}
              value={selectedWeek.label}
              onChangeText={(text) => updateWeekField("label", text)}
            />

            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              value={selectedWeek.date}
              onChangeText={(text) => updateWeekField("date", text)}
              placeholder="YYYY-MM-DD"
            />

            <TouchableOpacity style={styles.secondaryButton} onPress={pushWeekSevenDays}>
              <Text style={styles.secondaryButtonText}>Push This Week +7 Days</Text>
            </TouchableOpacity>
          </View>
        )}

        <SectionHeader
          title="Swap Games"
          isOpen={!!openSections.swapGames}
          onPress={() => toggleSection("swapGames")}
        />

        {openSections.swapGames && (
          <View style={styles.card}>
            <Text style={styles.cardNote}>
              Swap two games within this same week only. Teams stay together,
              but the time and venue slots switch.
            </Text>

            {selectedWeek.games.length < 2 ? (
              <View style={styles.emptyMiniCard}>
                <Text style={styles.emptyTitle}>Need at least two games</Text>
                <Text style={styles.emptyText}>
                  Add two games to this week before using swap.
                </Text>
              </View>
            ) : (
              <>
                <SwapGameDropdown
                  label="Game A"
                  value={swapGameAId}
                  games={selectedWeek.games}
                  teams={selectedLeague.teams}
                  onSelect={setSwapGameAId}
                />

                <SwapGameDropdown
                  label="Game B"
                  value={swapGameBId}
                  games={selectedWeek.games}
                  teams={selectedLeague.teams}
                  onSelect={setSwapGameBId}
                />

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={applySwapGames}
                >
                  <Text style={styles.secondaryButtonText}>Apply Swap</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {selectedWeek.games.map((game, index) => (
          <View key={game.id}>
            <SectionHeader
              title={`Game ${index + 1}`}
              isOpen={!!openSections[game.id]}
              onPress={() => toggleSection(game.id)}
            />

            {openSections[game.id] && (
              <GameEditorCard
                game={game}
                teamOptions={teamOptions}
                showSeeds={selectedWeek.phase === "playoff"}
                onChange={updateGame}
                onDelete={deleteGame}
              />
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addGame}>
          <FontAwesome6 name="plus" size={14} color="#fff" />
          <Text style={styles.addButtonText}>Add Game</Text>
        </TouchableOpacity>

        <SectionHeader
          title="Bye Teams"
          isOpen={!!openSections.byeTeams}
          onPress={() => toggleSection("byeTeams")}
        />

        {openSections.byeTeams && (
          <View style={styles.card}>
            {selectedLeague.teams.map((team) => {
              const active = selectedWeek.bye.includes(team.id);

              return (
                <TouchableOpacity
                  key={team.id}
                  style={[styles.teamPill, active && styles.teamPillActive]}
                  onPress={() => toggleByeTeam(team.id)}
                >
                  <Text
                    style={[
                      styles.teamPillText,
                      active && styles.teamPillTextActive,
                    ]}
                  >
                    {active ? "✓ " : ""}
                    {team.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SubScreenLayout>
  );
}

function SectionHeader({
  title,
  isOpen,
  onPress,
}: {
  title: string;
  isOpen: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.sectionHeader} onPress={onPress}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
      <FontAwesome6
        name={isOpen ? "chevron-up" : "chevron-down"}
        size={14}
        color={THEME}
      />
    </TouchableOpacity>
  );
}

function GameEditorCard({
  game,
  teamOptions,
  showSeeds,
  onChange,
  onDelete,
}: {
  game: EditableGame;
  teamOptions: TeamOption[];
  showSeeds: boolean;
  onChange: (gameId: string, field: keyof EditableGame, value: string) => void;
  onDelete: (gameId: string) => void;
}) {
  const [team1SeedOpen, setTeam1SeedOpen] = React.useState(false);
  const [team2SeedOpen, setTeam2SeedOpen] = React.useState(false);
  const [team1Open, setTeam1Open] = React.useState(false);
  const [team2Open, setTeam2Open] = React.useState(false);
  const [statusOpen, setStatusOpen] = React.useState(false);
  const [typeOpen, setTypeOpen] = React.useState(false);
  const [resultOpen, setResultOpen] = React.useState(false);

  const team1Name =
    teamOptions.find((team) => team.id === game.team1Id)?.name ?? "TBD";

  const team2Name =
    teamOptions.find((team) => team.id === game.team2Id)?.name ?? "TBD";

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Time</Text>
      <TextInput
        style={styles.input}
        value={game.time}
        onChangeText={(text) => onChange(game.id, "time", text)}
        placeholder="7:00 PM"
      />

      <Text style={styles.label}>Venue</Text>
      <TextInput
        style={styles.input}
        value={game.venue}
        onChangeText={(text) => onChange(game.id, "venue", text)}
      />

      {showSeeds && (
        <SimpleDropdown
          label="Team 1 Seed"
          value={game.team1Seed ? `Seed ${game.team1Seed}` : "No Seed"}
          isOpen={team1SeedOpen}
          setIsOpen={setTeam1SeedOpen}
          options={SEED_OPTIONS}
          getLabel={(value) => (value ? `Seed ${value}` : "No Seed")}
          onSelect={(value) => onChange(game.id, "team1Seed", value)}
        />
      )}

      <Dropdown
        label="Team 1"
        value={team1Name}
        isOpen={team1Open}
        setIsOpen={setTeam1Open}
        options={teamOptions}
        onSelect={(id) => onChange(game.id, "team1Id", id)}
      />

      {showSeeds && (
        <SimpleDropdown
          label="Team 2 Seed"
          value={game.team2Seed ? `Seed ${game.team2Seed}` : "No Seed"}
          isOpen={team2SeedOpen}
          setIsOpen={setTeam2SeedOpen}
          options={SEED_OPTIONS}
          getLabel={(value) => (value ? `Seed ${value}` : "No Seed")}
          onSelect={(value) => onChange(game.id, "team2Seed", value)}
        />
      )}

      <Dropdown
        label="Team 2"
        value={team2Name}
        isOpen={team2Open}
        setIsOpen={setTeam2Open}
        options={teamOptions}
        onSelect={(id) => onChange(game.id, "team2Id", id)}
      />

      <View style={styles.scoreRow}>
        <View style={styles.scoreBox}>
          <Text style={styles.label}>Team 1 Score</Text>
          <TextInput
            style={styles.input}
            value={game.team1Score}
            onChangeText={(text) => onChange(game.id, "team1Score", text)}
            keyboardType="number-pad"
            placeholder="0"
          />
        </View>

        <View style={styles.scoreBox}>
          <Text style={styles.label}>Team 2 Score</Text>
          <TextInput
            style={styles.input}
            value={game.team2Score}
            onChangeText={(text) => onChange(game.id, "team2Score", text)}
            keyboardType="number-pad"
            placeholder="0"
          />
        </View>
      </View>

      <SimpleDropdown
        label="Status"
        value={game.status}
        isOpen={statusOpen}
        setIsOpen={setStatusOpen}
        options={["scheduled", "completed", "final"]}
        onSelect={(value) => onChange(game.id, "status", value)}
      />

      <SimpleDropdown
        label="Game Type"
        value={game.type}
        isOpen={typeOpen}
        setIsOpen={setTypeOpen}
        options={["regular", "playoff", "championship"]}
        onSelect={(value) => onChange(game.id, "type", value)}
      />

      <SimpleDropdown
        label="Result Type"
        value={game.resultType}
        isOpen={resultOpen}
        setIsOpen={setResultOpen}
        options={["pending", "normal", "forfeit"]}
        onSelect={(value) => onChange(game.id, "resultType", value)}
      />

      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(game.id)}>
        <Text style={styles.deleteButtonText}>Delete Game</Text>
      </TouchableOpacity>
    </View>
  );
}

function SwapGameDropdown({
  label,
  value,
  games,
  teams,
  onSelect,
}: {
  label: string;
  value: string;
  games: EditableGame[];
  teams: TeamOption[];
  onSelect: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedGame = games.find((game) => game.id === value);

  function getGameLabel(game: EditableGame) {
    const team1Name = formatSeededTeam(
      game.team1Seed,
      getTeamName(teams, game.team1Id)
    );

    const team2Name = formatSeededTeam(
      game.team2Seed,
      getTeamName(teams, game.team2Id)
    );

    return `${game.time || "No time"} · ${team1Name} vs ${team2Name}`;
  }

  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.dropdownText}>
          {selectedGame ? getGameLabel(selectedGame) : "Select game"}
        </Text>

        <FontAwesome6
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={14}
          color={THEME}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownList}>
          {games.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(game.id);
                setIsOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{getGameLabel(game)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

function Dropdown({
  label,
  value,
  isOpen,
  setIsOpen,
  options,
  onSelect,
}: {
  label: string;
  value: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  options: TeamOption[];
  onSelect: (id: string) => void;
}) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity style={styles.dropdownButton} onPress={() => setIsOpen(!isOpen)}>
        <Text style={styles.dropdownText}>{value}</Text>
        <FontAwesome6
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={14}
          color={THEME}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownList}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(option.id);
                setIsOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{option.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

function SimpleDropdown({
  label,
  value,
  isOpen,
  setIsOpen,
  options,
  getLabel,
  onSelect,
}: {
  label: string;
  value: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  options: string[];
  getLabel?: (value: string) => string;
  onSelect: (value: string) => void;
}) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity style={styles.dropdownButton} onPress={() => setIsOpen(!isOpen)}>
        <Text style={styles.dropdownText}>{value}</Text>
        <FontAwesome6
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={14}
          color={THEME}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownList}>
          {options.map((option) => (
            <TouchableOpacity
              key={option || "none"}
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>
                {getLabel ? getLabel(option) : option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f4fb" },
  content: { padding: 16, paddingBottom: 40 },
  headerCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e6e0f2",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: THEME,
    marginBottom: 6,
  },
  headerText: {
    fontSize: 14,
    color: "#4c4560",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e6e0f2",
  },
  cardNote: {
    fontSize: 13,
    fontWeight: "700",
    color: "#5a526b",
    lineHeight: 19,
    marginBottom: 12,
  },
  emptyMiniCard: {
    backgroundColor: "#f8f6fc",
    borderRadius: 14,
    padding: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME,
    marginBottom: 6,
  },
  labelSpacing: { marginTop: 14 },
  input: {
    backgroundColor: "#f8f6fc",
    borderWidth: 1,
    borderColor: "#ddd5ee",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1f1a2e",
    marginBottom: 12,
  },
  dropdownButton: {
    backgroundColor: "#f8f6fc",
    borderWidth: 1,
    borderColor: "#ddd5ee",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  dropdownText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#1f1a2e",
  },
  dropdownList: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd5ee",
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#eee9f7",
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2c2440",
  },
  previewToggle: {
    flexDirection: "row",
    backgroundColor: "#e9e2f5",
    padding: 4,
    borderRadius: 14,
    marginBottom: 14,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: "center",
  },
  toggleButtonActive: { backgroundColor: THEME },
  toggleText: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME,
  },
  toggleTextActive: { color: "#fff" },
  previewCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: THEME,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 10,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: THEME,
  },
  previewSub: {
    fontSize: 13,
    fontWeight: "700",
    color: "#5a526b",
    marginTop: 3,
  },
  phaseBadge: {
    backgroundColor: "#eee8f8",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  phaseBadgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: THEME,
  },
  previewGame: {
    backgroundColor: "#f8f6fc",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  previewTime: {
    fontSize: 13,
    fontWeight: "900",
    color: THEME,
    marginBottom: 4,
  },
  previewMatchup: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1f1a2e",
    marginBottom: 4,
  },
  previewVenue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4d4560",
  },
  previewMeta: {
    fontSize: 12,
    color: "#6b6477",
    marginTop: 6,
    fontWeight: "700",
  },
  previewScore: {
    fontSize: 13,
    color: "#1f1a2e",
    marginTop: 6,
    fontWeight: "900",
  },
  emptyPreview: {
    backgroundColor: "#f8f6fc",
    borderRadius: 14,
    padding: 14,
  },
  emptyTitle: {
    color: THEME,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4,
  },
  emptyText: {
    color: "#5a526b",
    fontSize: 13,
    fontWeight: "700",
  },
  byePreview: {
    backgroundColor: "#f1edf8",
    borderRadius: 14,
    padding: 12,
    marginTop: 4,
  },
  byeTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: THEME,
    marginBottom: 3,
  },
  byeText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1f1a2e",
  },
  seedButton: {
    backgroundColor: "#fff",
    borderColor: THEME,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    marginBottom: 14,
  },
  seedButtonText: {
    color: THEME,
    fontWeight: "900",
    fontSize: 14,
  },
  sectionHeader: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e6e0f2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "900",
    color: THEME,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: THEME,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: THEME,
    fontWeight: "900",
    fontSize: 14,
  },
  scoreRow: { flexDirection: "row", gap: 10 },
  scoreBox: { flex: 1 },
  addButton: {
    backgroundColor: THEME,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 15,
  },
  deleteButton: {
    backgroundColor: "#fff0f0",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#f0caca",
  },
  deleteButtonText: {
    color: "#b42318",
    fontWeight: "900",
    fontSize: 14,
  },
  teamPill: {
    backgroundColor: "#f8f6fc",
    borderWidth: 1,
    borderColor: "#ddd5ee",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
  },
  teamPillActive: {
    backgroundColor: THEME,
    borderColor: THEME,
  },
  teamPillText: {
    color: THEME,
    fontSize: 14,
    fontWeight: "900",
  },
  teamPillTextActive: { color: "#fff" },
  saveButton: {
    backgroundColor: THEME,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
  cancelButton: {
    paddingVertical: 15,
    alignItems: "center",
  },
  cancelButtonText: {
    color: THEME,
    fontSize: 15,
    fontWeight: "900",
  },
});