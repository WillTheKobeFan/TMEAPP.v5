// app/admin/game-operations/playoff-seeding.tsx

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
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { doc, serverTimestamp, writeBatch } from "firebase/firestore";
import SubScreenLayout from "src/components/SubScreenLayout";
import { db } from "src/lib/firebase";

const THEME = "#250f74";

type PlayoffStatus = "draft" | "published" | "locked";
type GameType = "playoff" | "championship";

type TeamOption = {
  id: string;
  name: string;
};

type PlayoffGame = {
  id: string;
  label: string;
  week: number;
  date: string;
  time: string;
  venue: string;
  team1Seed: string;
  team1Id: string;
  team2Seed: string;
  team2Id: string;
  type: GameType;
};

type LeagueConfig = {
  id: string;
  label: string;
  venue: string;
  seasonId: string;
  seasonLabel: string;
  formatLabel: string;
  regularSeasonComplete: boolean;
  playoffStatus: PlayoffStatus;
  playoffTeams: number;
  teams: TeamOption[];
  games: PlayoffGame[];
};

const SEED_OPTIONS = ["", "1", "2", "3", "4", "5", "6", "7", "8"];

const PLACEHOLDER_TEAMS: TeamOption[] = [
  { id: "TBD", name: "TBD" },
  { id: "winner_g1", name: "Winner Game 1" },
  { id: "winner_g2", name: "Winner Game 2" },
  { id: "winner_g3", name: "Winner Game 3" },
  { id: "winner_g4", name: "Winner Game 4" },
];

const MOCK_LEAGUES: LeagueConfig[] = [
  {
    id: "sunday",
    label: "Sunday AM · YMCA",
    venue: "YMCA",
    seasonId: "spring2026",
    seasonLabel: "Spring 2026",
    formatLabel: "Top 8 · Quarterfinals / Semifinals / Championship Carryover",
    regularSeasonComplete: true,
    playoffStatus: "draft",
    playoffTeams: 8,
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
    games: [
      {
        id: "sun_w11_g1",
        label: "Game 1",
        week: 11,
        date: "2026-05-03",
        time: "9:00 AM",
        venue: "YMCA",
        team1Seed: "1",
        team1Id: "sun_tA",
        team2Seed: "8",
        team2Id: "sun_tI",
        type: "playoff",
      },
      {
        id: "sun_w11_g2",
        label: "Game 2",
        week: 11,
        date: "2026-05-03",
        time: "10:00 AM",
        venue: "YMCA",
        team1Seed: "4",
        team1Id: "sun_tH",
        team2Seed: "5",
        team2Id: "sun_tD",
        type: "playoff",
      },
      {
        id: "sun_w11_g3",
        label: "Game 3",
        week: 11,
        date: "2026-05-03",
        time: "11:00 AM",
        venue: "YMCA",
        team1Seed: "2",
        team1Id: "sun_tE",
        team2Seed: "7",
        team2Id: "sun_tC",
        type: "playoff",
      },
      {
        id: "sun_w11_g4",
        label: "Game 4",
        week: 11,
        date: "2026-05-03",
        time: "12:00 PM",
        venue: "YMCA",
        team1Seed: "3",
        team1Id: "sun_tB",
        team2Seed: "6",
        team2Id: "sun_tG",
        type: "playoff",
      },
      {
        id: "sun_w12_g1",
        label: "Semifinal Game 1",
        week: 12,
        date: "2026-05-10",
        time: "11:00 AM",
        venue: "YMCA",
        team1Seed: "",
        team1Id: "winner_g1",
        team2Seed: "",
        team2Id: "winner_g2",
        type: "playoff",
      },
      {
        id: "sun_w12_g2",
        label: "Semifinal Game 2",
        week: 12,
        date: "2026-05-10",
        time: "12:00 PM",
        venue: "YMCA",
        team1Seed: "",
        team1Id: "winner_g3",
        team2Seed: "",
        team2Id: "winner_g4",
        type: "playoff",
      },
    ],
  },
  {
    id: "monday",
    label: "Monday PM · Berlin",
    venue: "Berlin",
    seasonId: "spring2026",
    seasonLabel: "Spring 2026",
    formatLabel: "Top 4 · Semifinals & Championship",
    regularSeasonComplete: true,
    playoffStatus: "draft",
    playoffTeams: 4,
    teams: [
      { id: "mon_tA", name: "Trifecta" },
      { id: "mon_tB", name: "Beans" },
      { id: "mon_tC", name: "Chimney" },
      { id: "mon_tD", name: "MAAC" },
      { id: "mon_tE", name: "Hard Rock" },
      { id: "mon_tF", name: "The Other Bar" },
      { id: "mon_tG", name: "JRL" },
    ],
    games: [
      {
        id: "mon_w11_g1",
        label: "Semifinal Game 1",
        week: 11,
        date: "2026-06-01",
        time: "7:00 PM",
        venue: "Berlin",
        team1Seed: "1",
        team1Id: "mon_tA",
        team2Seed: "4",
        team2Id: "mon_tD",
        type: "playoff",
      },
      {
        id: "mon_w11_g2",
        label: "Semifinal Game 2",
        week: 11,
        date: "2026-06-01",
        time: "8:00 PM",
        venue: "Berlin",
        team1Seed: "2",
        team1Id: "mon_tB",
        team2Seed: "3",
        team2Id: "mon_tC",
        type: "playoff",
      },
      {
        id: "mon_w11_g3",
        label: "Championship",
        week: 11,
        date: "2026-06-01",
        time: "9:00 PM",
        venue: "Berlin",
        team1Seed: "",
        team1Id: "winner_g1",
        team2Seed: "",
        team2Id: "winner_g2",
        type: "championship",
      },
    ],
  },
  {
    id: "tuesday",
    label: "Tuesday PM · YMCA",
    venue: "YMCA",
    seasonId: "spring2026",
    seasonLabel: "Spring 2026",
    formatLabel: "Top 4 · Semifinals & Championship",
    regularSeasonComplete: true,
    playoffStatus: "draft",
    playoffTeams: 4,
    teams: [
      { id: "tue_tA", name: "Team A" },
      { id: "tue_tB", name: "Team B" },
      { id: "tue_tC", name: "Team C" },
      { id: "tue_tD", name: "Team D" },
      { id: "tue_tE", name: "Team E" },
      { id: "tue_tF", name: "Team F" },
      { id: "tue_tG", name: "Team G" },
    ],
    games: [
      {
        id: "tue_w11_g1",
        label: "Semifinal Game 1",
        week: 11,
        date: "2026-06-02",
        time: "6:30 PM",
        venue: "YMCA",
        team1Seed: "1",
        team1Id: "tue_tA",
        team2Seed: "4",
        team2Id: "tue_tD",
        type: "playoff",
      },
      {
        id: "tue_w11_g2",
        label: "Semifinal Game 2",
        week: 11,
        date: "2026-06-02",
        time: "7:30 PM",
        venue: "YMCA",
        team1Seed: "2",
        team1Id: "tue_tB",
        team2Seed: "3",
        team2Id: "tue_tC",
        type: "playoff",
      },
      {
        id: "tue_w11_g3",
        label: "Championship",
        week: 11,
        date: "2026-06-02",
        time: "8:30 PM",
        venue: "YMCA",
        team1Seed: "",
        team1Id: "winner_g1",
        team2Seed: "",
        team2Id: "winner_g2",
        type: "championship",
      },
    ],
  },
  {
    id: "wednesday",
    label: "Wednesday PM · Berlin",
    venue: "Berlin",
    seasonId: "spring2026",
    seasonLabel: "Spring 2026",
    formatLabel: "Top 4 · Semifinals & Championship",
    regularSeasonComplete: true,
    playoffStatus: "draft",
    playoffTeams: 4,
    teams: [
      { id: "wed_tA", name: "Duffy" },
      { id: "wed_tB", name: "Neil" },
      { id: "wed_tC", name: "Tom" },
      { id: "wed_tD", name: "Gross" },
      { id: "wed_tE", name: "Gervese" },
      { id: "wed_tF", name: "Rob" },
      { id: "wed_tG", name: "Mark" },
    ],
    games: [
      {
        id: "wed_w11_g1",
        label: "Semifinal Game 1",
        week: 11,
        date: "2026-05-13",
        time: "7:00 PM",
        venue: "Berlin",
        team1Seed: "1",
        team1Id: "wed_tA",
        team2Seed: "4",
        team2Id: "wed_tD",
        type: "playoff",
      },
      {
        id: "wed_w11_g2",
        label: "Semifinal Game 2",
        week: 11,
        date: "2026-05-13",
        time: "8:00 PM",
        venue: "Berlin",
        team1Seed: "2",
        team1Id: "wed_tB",
        team2Seed: "3",
        team2Id: "wed_tC",
        type: "playoff",
      },
      {
        id: "wed_w11_g3",
        label: "Championship",
        week: 11,
        date: "2026-05-13",
        time: "9:00 PM",
        venue: "Berlin",
        team1Seed: "",
        team1Id: "winner_g1",
        team2Seed: "",
        team2Id: "winner_g2",
        type: "championship",
      },
    ],
  },
];

function getWeekDocId(weekNumber: number) {
  return `week${weekNumber}`;
}

function getPlayoffWeekLabel(leagueId: string, week: number) {
  if (leagueId === "sunday") {
    if (week === 11) return "Week 11 · Quarterfinals";
    if (week === 12) return "Week 12 · Semifinals";
  }

  return "Week 11 · Semifinals & Championship";
}

function buildFirebaseGame(game: PlayoffGame) {
  return {
    id: game.id,
    time: game.time,
    venue: game.venue,
    team1Id: game.team1Id,
    team2Id: game.team2Id,
    team1Seed: game.team1Seed,
    team2Seed: game.team2Seed,
    team1Score: "",
    team2Score: "",
    winnerId: "",
    winnerName: "",
    status: "scheduled",
    type: game.type,
    resultType: "pending",
  };
}

function getTeamName(teams: TeamOption[], teamId: string) {
  const allTeams = [...PLACEHOLDER_TEAMS, ...teams];
  return allTeams.find((team) => team.id === teamId)?.name ?? "TBD";
}

function formatSeededTeam(seed: string, name: string) {
  return seed ? `(${seed}) ${name}` : name;
}

function getGameTeamLabel(game: PlayoffGame, teams: TeamOption[], side: 1 | 2) {
  const seed = side === 1 ? game.team1Seed : game.team2Seed;
  const teamId = side === 1 ? game.team1Id : game.team2Id;
  const name = getTeamName(teams, teamId);

  return formatSeededTeam(seed, name);
}

function replaceLeague(leagues: LeagueConfig[], newLeague: LeagueConfig) {
  return leagues.map((league) =>
    league.id === newLeague.id ? newLeague : league
  );
}

function validateLeague(league: LeagueConfig) {
  const seedGames = league.games.filter((game) => game.week === 11);
  const seeds = seedGames.flatMap((game) => [game.team1Seed, game.team2Seed]);
  const teams = seedGames.flatMap((game) => [game.team1Id, game.team2Id]);

  const activeSeeds = seeds.filter(Boolean);

  const activeTeams = teams.filter(
    (id) => id && id !== "TBD" && !id.startsWith("winner_")
  );

  const duplicateSeeds = activeSeeds.filter(
    (seed, index) => activeSeeds.indexOf(seed) !== index
  );

  const duplicateTeams = activeTeams.filter(
    (team, index) => activeTeams.indexOf(team) !== index
  );

  const missingTimes = league.games.some((game) => !game.time.trim());
  const missingVenues = league.games.some((game) => !game.venue.trim());

  return {
    duplicateSeeds,
    duplicateTeams,
    missingTimes,
    missingVenues,
    seedCountValid: activeSeeds.length === league.playoffTeams,
    teamCountValid: activeTeams.length === league.playoffTeams,
  };
}

export default function PlayoffSeedingScreen() {
  const [leagueData, setLeagueData] = React.useState<LeagueConfig[]>(MOCK_LEAGUES);
  const [selectedLeagueId, setSelectedLeagueId] = React.useState(MOCK_LEAGUES[0].id);
  const [leagueOpen, setLeagueOpen] = React.useState(false);
  const [publishing, setPublishing] = React.useState(false);

  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    seeds: true,
    games: true,
    gameCardsPreview: true,
    bracketPreview: true,
    validation: true,
  });

  const selectedLeague =
    leagueData.find((league) => league.id === selectedLeagueId) ?? leagueData[0];

  const validation = validateLeague(selectedLeague);

  const teamOptions = selectedLeague.teams;
  const bracketTeamOptions = [...PLACEHOLDER_TEAMS, ...selectedLeague.teams];

  function toggleSection(sectionId: string) {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }

  function updateSelectedLeague(newLeague: LeagueConfig) {
    setLeagueData((prev) => replaceLeague(prev, newLeague));
  }

  function selectLeague(leagueId: string) {
    setSelectedLeagueId(leagueId);
    setLeagueOpen(false);
  }

  function updateGame(gameId: string, field: keyof PlayoffGame, value: string) {
    const updatedLeague = {
      ...selectedLeague,
      games: selectedLeague.games.map((game) =>
        game.id === gameId ? { ...game, [field]: value } : game
      ),
    };

    updateSelectedLeague(updatedLeague);
  }

  function resetFromStandings() {
    Alert.alert(
      "Reset From Standings",
      "Next step: connect this to standings order after Week 10. For now, this keeps the mock seed setup."
    );
  }

  function clearPlayoffSetup() {
    const updatedLeague = {
      ...selectedLeague,
      games: selectedLeague.games.map((game) => ({
        ...game,
        team1Seed: game.team1Id.startsWith("winner_") ? game.team1Seed : "",
        team1Id: game.team1Id.startsWith("winner_") ? game.team1Id : "TBD",
        team2Seed: game.team2Id.startsWith("winner_") ? game.team2Seed : "",
        team2Id: game.team2Id.startsWith("winner_") ? game.team2Id : "TBD",
      })),
      playoffStatus: "draft" as PlayoffStatus,
    };

    updateSelectedLeague(updatedLeague);
  }

  function saveDraft() {
    Alert.alert(
      "Draft Saved",
      "Next step: save this setup to a Firebase draft path if you want drafts separate from published playoff weeks."
    );
  }

  async function publishMatchups() {
    if (
      validation.duplicateSeeds.length ||
      validation.duplicateTeams.length ||
      validation.missingTimes ||
      validation.missingVenues ||
      !validation.seedCountValid ||
      !validation.teamCountValid
    ) {
      Alert.alert(
        "Check Playoff Setup",
        "Fix duplicate seeds, duplicate teams, missing times, or missing venues before publishing."
      );
      return;
    }

    try {
      setPublishing(true);

      const batch = writeBatch(db);

      const gamesByWeek = selectedLeague.games.reduce<Record<number, PlayoffGame[]>>(
        (acc, game) => {
          if (!acc[game.week]) acc[game.week] = [];
          acc[game.week].push(game);
          return acc;
        },
        {}
      );

      Object.entries(gamesByWeek).forEach(([weekNumber, games]) => {
        const week = Number(weekNumber);
        const weekDocId = getWeekDocId(week);

        const weekRef = doc(
          db,
          "leagues",
          selectedLeague.id,
          "seasons",
          selectedLeague.seasonId,
          "weeks",
          weekDocId
        );

        batch.set(
          weekRef,
          {
            week,
            date: games[0]?.date ?? "",
            label: getPlayoffWeekLabel(selectedLeague.id, week),
            phase: "playoff",
            games: games.map(buildFirebaseGame),
            bye: [],
            updatedAt: serverTimestamp(),
            playoffPublished: true,
          },
          { merge: true }
        );
      });

      const leagueRef = doc(db, "leagues", selectedLeague.id);

      batch.set(
        leagueRef,
        {
          playoffStatus: "published",
          playoffPublishedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await batch.commit();

      const updatedLeague = {
        ...selectedLeague,
        playoffStatus: "published" as PlayoffStatus,
      };

      updateSelectedLeague(updatedLeague);

      Alert.alert(
        "Playoffs Published",
        "Playoff games were written to the existing week docs. Schedule and Bracket can now read the same playoff data."
      );
    } catch (error) {
      console.log("Publish playoff matchups error:", error);

      Alert.alert(
        "Publish Failed",
        "Something went wrong while publishing playoff matchups."
      );
    } finally {
      setPublishing(false);
    }
  }

  function lockMatchups() {
    const updatedLeague = {
      ...selectedLeague,
      playoffStatus: "locked" as PlayoffStatus,
    };

    updateSelectedLeague(updatedLeague);

    Alert.alert("Playoffs Locked", "Playoff matchups are now locked locally.");
  }

  const week11Games = selectedLeague.games.filter((game) => game.week === 11);
  const futureGames = selectedLeague.games.filter((game) => game.week !== 11);

  return (
    <SubScreenLayout title="Playoff Seeding">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Playoff Seeding</Text>
          <Text style={styles.headerText}>
            Build playoff matchups after Week 10. Edit every seed, team, time,
            and venue before publishing to game cards and the bracket.
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

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Season</Text>
            <Text style={styles.infoValue}>{selectedLeague.seasonLabel}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Week 10</Text>
            <Text style={styles.infoValue}>
              {selectedLeague.regularSeasonComplete ? "Finalized ✅" : "Not Final"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Playoff Status</Text>
            <Text style={styles.infoValue}>{selectedLeague.playoffStatus}</Text>
          </View>

          <Text style={styles.formatText}>{selectedLeague.formatLabel}</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={resetFromStandings}>
              <Text style={styles.secondaryButtonText}>Reset From Standings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.warningButton} onPress={clearPlayoffSetup}>
              <Text style={styles.warningButtonText}>Clear Setup</Text>
            </TouchableOpacity>
          </View>
        </View>

        <SectionHeader
          title="Seed Assignment"
          isOpen={!!openSections.seeds}
          onPress={() => toggleSection("seeds")}
        />

        {openSections.seeds && (
          <View style={styles.card}>
            <Text style={styles.cardNote}>
              Seeds stay next to team names everywhere. Example: (1) Ziller vs (8) Dex.
            </Text>

            {week11Games
              .filter((game) => game.type === "playoff")
              .map((game) => (
                <View key={game.id} style={styles.seedGameBlock}>
                  <Text style={styles.seedGameTitle}>{game.label}</Text>

                  <View style={styles.inlineRow}>
                    <SimpleDropdown
                      label="Seed"
                      value={game.team1Seed || "No Seed"}
                      options={SEED_OPTIONS}
                      getLabel={(value) => (value ? `Seed ${value}` : "No Seed")}
                      onSelect={(value) => updateGame(game.id, "team1Seed", value)}
                    />

                    <TeamDropdown
                      label="Team"
                      value={game.team1Id}
                      teams={teamOptions}
                      onSelect={(id) => updateGame(game.id, "team1Id", id)}
                    />
                  </View>

                  <View style={styles.inlineRow}>
                    <SimpleDropdown
                      label="Seed"
                      value={game.team2Seed || "No Seed"}
                      options={SEED_OPTIONS}
                      getLabel={(value) => (value ? `Seed ${value}` : "No Seed")}
                      onSelect={(value) => updateGame(game.id, "team2Seed", value)}
                    />

                    <TeamDropdown
                      label="Team"
                      value={game.team2Id}
                      teams={teamOptions}
                      onSelect={(id) => updateGame(game.id, "team2Id", id)}
                    />
                  </View>
                </View>
              ))}
          </View>
        )}

        <SectionHeader
          title="Playoff Games Editor"
          isOpen={!!openSections.games}
          onPress={() => toggleSection("games")}
        />

        {openSections.games && (
          <View>
            {selectedLeague.games.map((game) => (
              <View key={game.id} style={styles.card}>
                <Text style={styles.gameTitle}>
                  Week {game.week} · {game.label}
                  {game.type === "championship" ? " 🏆" : ""}
                </Text>

                <Text style={styles.label}>Date</Text>
                <TextInput
                  style={styles.input}
                  value={game.date}
                  onChangeText={(text) => updateGame(game.id, "date", text)}
                  placeholder="YYYY-MM-DD"
                />

                <Text style={styles.label}>Time</Text>
                <TextInput
                  style={styles.input}
                  value={game.time}
                  onChangeText={(text) => updateGame(game.id, "time", text)}
                  placeholder="7:00 PM"
                />

                <Text style={styles.label}>Venue</Text>
                <TextInput
                  style={styles.input}
                  value={game.venue}
                  onChangeText={(text) => updateGame(game.id, "venue", text)}
                  placeholder="YMCA"
                />

                <SimpleDropdown
                  label="Team 1 Seed"
                  value={game.team1Seed || "No Seed"}
                  options={SEED_OPTIONS}
                  getLabel={(value) => (value ? `Seed ${value}` : "No Seed")}
                  onSelect={(value) => updateGame(game.id, "team1Seed", value)}
                />

                <TeamDropdown
                  label="Team 1"
                  value={game.team1Id}
                  teams={bracketTeamOptions}
                  onSelect={(id) => updateGame(game.id, "team1Id", id)}
                />

                <SimpleDropdown
                  label="Team 2 Seed"
                  value={game.team2Seed || "No Seed"}
                  options={SEED_OPTIONS}
                  getLabel={(value) => (value ? `Seed ${value}` : "No Seed")}
                  onSelect={(value) => updateGame(game.id, "team2Seed", value)}
                />

                <TeamDropdown
                  label="Team 2"
                  value={game.team2Id}
                  teams={bracketTeamOptions}
                  onSelect={(id) => updateGame(game.id, "team2Id", id)}
                />
              </View>
            ))}
          </View>
        )}

        <SectionHeader
          title="Live Preview 1 · Game Cards"
          isOpen={!!openSections.gameCardsPreview}
          onPress={() => toggleSection("gameCardsPreview")}
        />

        {openSections.gameCardsPreview && (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Schedule Screen Preview</Text>

            {selectedLeague.games.map((game) => (
              <View key={game.id} style={styles.previewGame}>
                <Text style={styles.previewTime}>
                  Week {game.week} · {game.date}
                </Text>

                <Text style={styles.previewTime}>
                  {game.time || "No time set"}
                  {game.type === "championship" ? "  🏆 Championship 🏆" : ""}
                </Text>

                <Text style={styles.previewMatchup}>
                  {getGameTeamLabel(game, selectedLeague.teams, 1)} vs{" "}
                  {getGameTeamLabel(game, selectedLeague.teams, 2)}
                </Text>

                <Text style={styles.previewVenue}>📍 {game.venue || "No venue set"}</Text>
              </View>
            ))}
          </View>
        )}

        <SectionHeader
          title="Live Preview 2 · Bracket"
          isOpen={!!openSections.bracketPreview}
          onPress={() => toggleSection("bracketPreview")}
        />

        {openSections.bracketPreview && (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Bracket Screen Preview</Text>

            {selectedLeague.playoffTeams === 8 ? (
              <>
                <Text style={styles.bracketRound}>Quarterfinals</Text>

                {week11Games
                  .filter((game) => game.type === "playoff")
                  .map((game) => (
                    <View key={game.id} style={styles.bracketGame}>
                      <Text style={styles.bracketGameTitle}>{game.label}</Text>
                      <Text style={styles.bracketTeam}>
                        {getGameTeamLabel(game, selectedLeague.teams, 1)}
                      </Text>
                      <Text style={styles.bracketVs}>vs</Text>
                      <Text style={styles.bracketTeam}>
                        {getGameTeamLabel(game, selectedLeague.teams, 2)}
                      </Text>
                      <Text style={styles.bracketMeta}>
                        Winner advances to semifinals
                      </Text>
                    </View>
                  ))}

                <Text style={styles.bracketRound}>Semifinals</Text>

                {futureGames.map((game) => (
                  <View key={game.id} style={styles.bracketGame}>
                    <Text style={styles.bracketGameTitle}>{game.label}</Text>
                    <Text style={styles.bracketTeam}>
                      {getGameTeamLabel(game, selectedLeague.teams, 1)}
                    </Text>
                    <Text style={styles.bracketVs}>vs</Text>
                    <Text style={styles.bracketTeam}>
                      {getGameTeamLabel(game, selectedLeague.teams, 2)}
                    </Text>
                  </View>
                ))}

                <View style={styles.carryoverCard}>
                  <Text style={styles.carryoverTitle}>🏆 Championship Carryover</Text>
                  <Text style={styles.carryoverText}>
                    Sunday Championship carries over to next session Week 1.
                    Finalists receive a hidden bye and the championship game does
                    not count toward regular season standings.
                  </Text>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.bracketRound}>Semifinals</Text>

                {week11Games
                  .filter((game) => game.type === "playoff")
                  .map((game) => (
                    <View key={game.id} style={styles.bracketGame}>
                      <Text style={styles.bracketGameTitle}>{game.label}</Text>
                      <Text style={styles.bracketTeam}>
                        {getGameTeamLabel(game, selectedLeague.teams, 1)}
                      </Text>
                      <Text style={styles.bracketVs}>vs</Text>
                      <Text style={styles.bracketTeam}>
                        {getGameTeamLabel(game, selectedLeague.teams, 2)}
                      </Text>
                    </View>
                  ))}

                <Text style={styles.bracketRound}>Championship</Text>

                {week11Games
                  .filter((game) => game.type === "championship")
                  .map((game) => (
                    <View key={game.id} style={styles.bracketGame}>
                      <Text style={styles.bracketGameTitle}>🏆 {game.label}</Text>
                      <Text style={styles.bracketTeam}>
                        {getGameTeamLabel(game, selectedLeague.teams, 1)}
                      </Text>
                      <Text style={styles.bracketVs}>vs</Text>
                      <Text style={styles.bracketTeam}>
                        {getGameTeamLabel(game, selectedLeague.teams, 2)}
                      </Text>
                    </View>
                  ))}
              </>
            )}
          </View>
        )}

        <SectionHeader
          title="Validation"
          isOpen={!!openSections.validation}
          onPress={() => toggleSection("validation")}
        />

        {openSections.validation && (
          <View style={styles.card}>
            <ValidationRow
              passed={validation.seedCountValid}
              text={`Seeds assigned: ${selectedLeague.playoffTeams}`}
            />
            <ValidationRow
              passed={validation.teamCountValid}
              text={`Teams assigned: ${selectedLeague.playoffTeams}`}
            />
            <ValidationRow
              passed={validation.duplicateSeeds.length === 0}
              text="No duplicate seeds"
            />
            <ValidationRow
              passed={validation.duplicateTeams.length === 0}
              text="No duplicate teams"
            />
            <ValidationRow passed={!validation.missingTimes} text="Times assigned" />
            <ValidationRow passed={!validation.missingVenues} text="Venues assigned" />
          </View>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={saveDraft}>
          <Text style={styles.saveButtonText}>Save Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.publishButton, publishing && styles.disabledButton]}
          onPress={publishMatchups}
          disabled={publishing}
        >
          <Text style={styles.publishButtonText}>
            {publishing ? "Publishing..." : "Publish Playoff Matchups"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.lockButton} onPress={lockMatchups}>
          <Text style={styles.lockButtonText}>Lock Playoff Matchups</Text>
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

function SimpleDropdown({
  label,
  value,
  options,
  getLabel,
  onSelect,
}: {
  label: string;
  value: string;
  options: string[];
  getLabel?: (value: string) => string;
  onSelect: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <View style={styles.dropdownWrap}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen((prev) => !prev)}
      >
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

function TeamDropdown({
  label,
  value,
  teams,
  onSelect,
}: {
  label: string;
  value: string;
  teams: TeamOption[];
  onSelect: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedName = getTeamName(teams, value);

  return (
    <View style={styles.dropdownWrap}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen((prev) => !prev)}
      >
        <Text style={styles.dropdownText}>{selectedName}</Text>
        <FontAwesome6
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={14}
          color={THEME}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownList}>
          {teams.map((team) => (
            <TouchableOpacity
              key={team.id}
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(team.id);
                setIsOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{team.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

function ValidationRow({ passed, text }: { passed: boolean; text: string }) {
  return (
    <View style={styles.validationRow}>
      <Text style={[styles.validationIcon, passed ? styles.validText : styles.errorText]}>
        {passed ? "✓" : "!"}
      </Text>
      <Text style={styles.validationText}>{text}</Text>
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
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME,
    marginBottom: 6,
  },
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
  dropdownWrap: { flex: 1 },
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
    gap: 8,
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
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee9f7",
  },
  infoLabel: {
    color: "#5a526b",
    fontSize: 13,
    fontWeight: "800",
  },
  infoValue: {
    color: THEME,
    fontSize: 13,
    fontWeight: "900",
  },
  formatText: {
    color: "#1f1a2e",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 12,
    lineHeight: 19,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: THEME,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: THEME,
    fontWeight: "900",
    fontSize: 13,
  },
  warningButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#f0caca",
    backgroundColor: "#fff0f0",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  warningButtonText: {
    color: "#b42318",
    fontWeight: "900",
    fontSize: 13,
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
  seedGameBlock: {
    backgroundColor: "#f8f6fc",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  seedGameTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: THEME,
    marginBottom: 10,
  },
  inlineRow: {
    flexDirection: "row",
    gap: 10,
  },
  gameTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: THEME,
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: THEME,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: THEME,
    marginBottom: 12,
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
  bracketRound: {
    fontSize: 17,
    fontWeight: "900",
    color: THEME,
    marginTop: 4,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  bracketGame: {
    backgroundColor: "#f8f6fc",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  bracketGameTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: THEME,
    marginBottom: 6,
  },
  bracketTeam: {
    fontSize: 15,
    fontWeight: "900",
    color: "#1f1a2e",
  },
  bracketVs: {
    fontSize: 12,
    fontWeight: "900",
    color: "#5a526b",
    marginVertical: 3,
  },
  bracketMeta: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5a526b",
    marginTop: 6,
  },
  carryoverCard: {
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
  },
  carryoverTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#9a3412",
    marginBottom: 5,
  },
  carryoverText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9a3412",
    lineHeight: 18,
  },
  validationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 7,
  },
  validationIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    textAlign: "center",
    lineHeight: 22,
    fontSize: 14,
    fontWeight: "900",
    overflow: "hidden",
  },
  validText: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  errorText: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  validationText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    color: "#1f1a2e",
  },
  saveButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: THEME,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
  },
  saveButtonText: {
    color: THEME,
    fontSize: 16,
    fontWeight: "900",
  },
  publishButton: {
    backgroundColor: THEME,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  publishButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
  lockButton: {
    backgroundColor: "#1f1a2e",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  lockButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
  disabledButton: {
    opacity: 0.6,
  },
});