// app/admin/game-operations/schedule-generator.tsx

import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  exportGeneratedScheduleToTsv,
  generateSchedule,
  type GeneratedWeek,
  type GeneratorTeam,
  type LeagueNight,
  type SundayChampionshipMode,
} from "src/utils/schedule-generators";

const PURPLE = "#250f74";
const TAB_BLUE = "#0f3d91";
const RED = "#dc2626";
const GREEN = "#15803d";
const GRAY = "#6b7280";
const LIGHT = "#f5f5f7";

const LEAGUE_NIGHTS: LeagueNight[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DEFAULT_TEAMS: Record<LeagueNight, GeneratorTeam[]> = {
  Sunday: [
    { id: "sun_tA", teamName: "Ziller" },
    { id: "sun_tB", teamName: "Tom" },
    { id: "sun_tC", teamName: "Edwards" },
    { id: "sun_tD", teamName: "Rich" },
    { id: "sun_tE", teamName: "Timmy" },
    { id: "sun_tF", teamName: "TeeJ" },
    { id: "sun_tG", teamName: "Dale" },
    { id: "sun_tH", teamName: "Prince" },
    { id: "sun_tI", teamName: "Dex" },
  ],
  Monday: [
    { id: "mon_tA", teamName: "Trifecta" },
    { id: "mon_tB", teamName: "Beans" },
    { id: "mon_tC", teamName: "Chimney" },
    { id: "mon_tD", teamName: "MAAC" },
    { id: "mon_tE", teamName: "Hard Rock" },
    { id: "mon_tF", teamName: "The Other Bar" },
    { id: "mon_tG", teamName: "JRL" },
  ],
  Tuesday: [
    { id: "tue_tA", teamName: "Team A" },
    { id: "tue_tB", teamName: "Team B" },
    { id: "tue_tC", teamName: "Team C" },
    { id: "tue_tD", teamName: "Team D" },
    { id: "tue_tE", teamName: "Team E" },
    { id: "tue_tF", teamName: "Team F" },
    { id: "tue_tG", teamName: "Team G" },
  ],
  Wednesday: [
    { id: "wed_tA", teamName: "Duffy" },
    { id: "wed_tB", teamName: "Neil" },
    { id: "wed_tC", teamName: "Tom" },
    { id: "wed_tD", teamName: "Gross" },
    { id: "wed_tE", teamName: "Gervese" },
    { id: "wed_tF", teamName: "Rob" },
    { id: "wed_tG", teamName: "Mark" },
  ],
  Thursday: [
    { id: "thu_tA", teamName: "Team A" },
    { id: "thu_tB", teamName: "Team B" },
    { id: "thu_tC", teamName: "Team C" },
    { id: "thu_tD", teamName: "Team D" },
    { id: "thu_tE", teamName: "Team E" },
    { id: "thu_tF", teamName: "Team F" },
    { id: "thu_tG", teamName: "Team G" },
  ],
  Friday: [
    { id: "fri_tA", teamName: "Team A" },
    { id: "fri_tB", teamName: "Team B" },
    { id: "fri_tC", teamName: "Team C" },
    { id: "fri_tD", teamName: "Team D" },
    { id: "fri_tE", teamName: "Team E" },
    { id: "fri_tF", teamName: "Team F" },
    { id: "fri_tG", teamName: "Team G" },
  ],
  Saturday: [
    { id: "sat_tA", teamName: "Team A" },
    { id: "sat_tB", teamName: "Team B" },
    { id: "sat_tC", teamName: "Team C" },
    { id: "sat_tD", teamName: "Team D" },
    { id: "sat_tE", teamName: "Team E" },
    { id: "sat_tF", teamName: "Team F" },
    { id: "sat_tG", teamName: "Team G" },
  ],
};

const DEFAULT_TIME_SLOTS: Record<LeagueNight, string[]> = {
  Sunday: ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"],
  Monday: ["7:00 PM", "8:00 PM", "9:00 PM"],
  Tuesday: ["6:30 PM", "7:30 PM", "8:30 PM"],
  Wednesday: ["7:00 PM", "8:00 PM", "9:00 PM"],
  Thursday: ["7:00 PM", "8:00 PM", "9:00 PM"],
  Friday: ["7:00 PM", "8:00 PM", "9:00 PM"],
  Saturday: ["9:00 AM", "10:00 AM", "11:00 AM"],
};

const DEFAULT_VENUES: Record<LeagueNight, string> = {
  Sunday: "YMCA",
  Monday: "Berlin",
  Tuesday: "Berlin",
  Wednesday: "Berlin",
  Thursday: "TBD",
  Friday: "TBD",
  Saturday: "TBD",
};

function getTeamName(teamId: string, teams: GeneratorTeam[]) {
  return teams.find((team) => team.id === teamId)?.teamName ?? teamId;
}

function getVisibleByes(week: GeneratedWeek) {
  return week.byes.filter((id) => !week.hiddenByes?.includes(id));
}

function getByeCounts(weeks: GeneratedWeek[], teams: GeneratorTeam[]) {
  const counts: Record<string, number> = {};

  teams.forEach((team) => {
    counts[team.id] = 0;
  });

  weeks
    .filter((week) => week.week <= 10)
    .forEach((week) => {
      const totalByes = [...week.byes, ...(week.hiddenByes ?? [])];

      totalByes.forEach((teamId) => {
        counts[teamId] = (counts[teamId] ?? 0) + 1;
      });
    });

  return counts;
}

function defaultSeasonId(leagueNight: LeagueNight) {
  return `summer_2026_${leagueNight.toLowerCase()}`;
}

function nextTeamId(leagueNight: LeagueNight, count: number) {
  const prefixMap: Record<LeagueNight, string> = {
    Sunday: "sun",
    Monday: "mon",
    Tuesday: "tue",
    Wednesday: "wed",
    Thursday: "thu",
    Friday: "fri",
    Saturday: "sat",
  };

  const letter = String.fromCharCode(65 + count);
  return `${prefixMap[leagueNight]}_t${letter}`;
}

export default function ScheduleGeneratorScreen() {
  const [leagueNight, setLeagueNight] = useState<LeagueNight>("Sunday");
  const [seasonId, setSeasonId] = useState(defaultSeasonId("Sunday"));
  const [startDate, setStartDate] = useState("2026-07-05");

  const [teamsByLeague, setTeamsByLeague] =
    useState<Record<LeagueNight, GeneratorTeam[]>>(DEFAULT_TEAMS);

  const [timeSlotsByLeague, setTimeSlotsByLeague] =
    useState<Record<LeagueNight, string[]>>(DEFAULT_TIME_SLOTS);

  const [venueByLeague, setVenueByLeague] =
    useState<Record<LeagueNight, string>>(DEFAULT_VENUES);

  const [previewWeeks, setPreviewWeeks] = useState<GeneratedWeek[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [exportText, setExportText] = useState("");

  const [sundayChampionshipMode, setSundayChampionshipMode] =
    useState<SundayChampionshipMode>("carryover");

  const [championshipTeamIds, setChampionshipTeamIds] = useState<string[]>([
    "sun_tF",
    "sun_tH",
  ]);

  const [championshipTime, setChampionshipTime] = useState("12:00 PM");
  const [championshipVenue, setChampionshipVenue] = useState("YMCA");

  const teams = teamsByLeague[leagueNight];
  const timeSlots = timeSlotsByLeague[leagueNight];
  const venue = venueByLeague[leagueNight];

  const displayWeeks = useMemo(
    () => previewWeeks.filter((week) => week.week <= 10),
    [previewWeeks],
  );

  const byeCounts = useMemo(() => {
    return getByeCounts(previewWeeks, teams);
  }, [previewWeeks, teams]);

  const selectedTeamSchedule = useMemo(() => {
    if (!selectedTeamId) return [];

    return displayWeeks.map((week) => {
      const game = week.games.find(
        (item) =>
          item.team1Id === selectedTeamId || item.team2Id === selectedTeamId,
      );

      if (!game) {
        return {
          week: week.week,
          date: week.date,
          time: "Bye",
          opponent: "Bye",
          venue: "-",
        };
      }

      const opponentId =
        game.team1Id === selectedTeamId ? game.team2Id : game.team1Id;

      return {
        week: week.week,
        date: week.date,
        time: game.time,
        opponent:
          game.type === "championship"
            ? `🏆 ${getTeamName(opponentId, teams)}`
            : getTeamName(opponentId, teams),
        venue: game.venue,
      };
    });
  }, [displayWeeks, selectedTeamId, teams]);

  function resetPreview() {
    setPreviewWeeks([]);
    setValidationErrors([]);
    setExportText("");
    setAttempts(0);
    setSelectedTeamId(null);
  }

  function updateLeagueNight(nextLeagueNight: LeagueNight) {
    setLeagueNight(nextLeagueNight);
    setSeasonId(defaultSeasonId(nextLeagueNight));
    resetPreview();
  }

  function updateTeamName(teamId: string, value: string) {
    setTeamsByLeague((prev) => ({
      ...prev,
      [leagueNight]: prev[leagueNight].map((team) =>
        team.id === teamId ? { ...team, teamName: value } : team,
      ),
    }));

    resetPreview();
  }

  function addTeam() {
    setTeamsByLeague((prev) => {
      const nextTeams = prev[leagueNight];
      const id = nextTeamId(leagueNight, nextTeams.length);

      return {
        ...prev,
        [leagueNight]: [
          ...nextTeams,
          {
            id,
            teamName: `Team ${String.fromCharCode(65 + nextTeams.length)}`,
          },
        ],
      };
    });

    resetPreview();
  }

  function deleteTeam(teamId: string) {
    setTeamsByLeague((prev) => ({
      ...prev,
      [leagueNight]: prev[leagueNight].filter((team) => team.id !== teamId),
    }));

    setChampionshipTeamIds((prev) => prev.filter((id) => id !== teamId));
    resetPreview();
  }

  function updateTimeSlot(index: number, value: string) {
    setTimeSlotsByLeague((prev) => ({
      ...prev,
      [leagueNight]: prev[leagueNight].map((slot, i) =>
        i === index ? value : slot,
      ),
    }));

    resetPreview();
  }

  function updateVenue(value: string) {
    setVenueByLeague((prev) => ({
      ...prev,
      [leagueNight]: value,
    }));

    if (leagueNight === "Sunday") {
      setChampionshipVenue(value);
    }

    resetPreview();
  }

  function toggleChampionshipTeam(teamId: string) {
    setChampionshipTeamIds((prev) => {
      if (prev.includes(teamId)) {
        return prev.filter((id) => id !== teamId);
      }

      if (prev.length >= 2) {
        return [prev[1], teamId];
      }

      return [...prev, teamId];
    });

    resetPreview();
  }

  function handleGenerate() {
    setPreviewWeeks([]);
    setValidationErrors([]);
    setExportText("");

    const result = generateSchedule({
      leagueNight,
      seasonId,
      startDate,
      teams,
      timeSlots,
      venue,
      seed: Date.now(),
      sundayChampionshipMode,
      championshipTeamIds,
      championshipTime,
      championshipVenue,
    });

    setAttempts((prev) => prev + 1);
    setPreviewWeeks(result.weeks);
    setValidationErrors(result.errors ?? []);
  }

  function handleExport() {
    if (previewWeeks.length === 0) {
      Alert.alert("No preview", "Generate a schedule first.");
      return;
    }

    const text = exportGeneratedScheduleToTsv(previewWeeks);
    setExportText(text);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Text style={styles.backText}>← Back</Text>
        <Text style={styles.title}>Schedule Generator</Text>
        <Text style={styles.subtitle}>
          Generate, validate, preview, and export schedule data before uploading.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>League Night</Text>

        <View style={styles.rowWrap}>
          {LEAGUE_NIGHTS.map((night) => (
            <Pressable
              key={night}
              style={[styles.pill, leagueNight === night && styles.pillActive]}
              onPress={() => updateLeagueNight(night)}
            >
              <Text
                style={[
                  styles.pillText,
                  leagueNight === night && styles.pillTextActive,
                ]}
              >
                {night}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>SeasonID</Text>

        <Text style={styles.blackLabel}>SeasonID</Text>
        <TextInput
          style={styles.input}
          value={seasonId}
          onChangeText={(value) => {
            setSeasonId(value);
            resetPreview();
          }}
          placeholder="summer_2026_sunday"
        />

        <Text style={styles.blackLabel}>Week 1 Date</Text>
        <TextInput
          style={styles.input}
          value={startDate}
          onChangeText={(value) => {
            setStartDate(value);
            resetPreview();
          }}
          placeholder="YYYY-MM-DD"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Time Slots / Venue</Text>

        <Text style={styles.blackLabel}>Time Slots</Text>
        {timeSlots.map((slot, index) => (
          <TextInput
            key={`${leagueNight}-slot-${index}`}
            style={styles.input}
            value={slot}
            onChangeText={(value) => updateTimeSlot(index, value)}
          />
        ))}

        <Text style={styles.blackLabel}>Venue</Text>
        <TextInput style={styles.input} value={venue} onChangeText={updateVenue} />
      </View>

      {leagueNight === "Sunday" && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sunday Championship Mode</Text>

          <View style={styles.rowWrap}>
            {(["carryover", "sameSession", "none"] as SundayChampionshipMode[]).map(
              (mode) => (
                <Pressable
                  key={mode}
                  style={[
                    styles.modeButton,
                    sundayChampionshipMode === mode && styles.modeButtonActive,
                  ]}
                  onPress={() => {
                    setSundayChampionshipMode(mode);
                    resetPreview();
                  }}
                >
                  <Text
                    style={[
                      styles.modeText,
                      sundayChampionshipMode === mode && styles.modeTextActive,
                    ]}
                  >
                    {mode === "carryover"
                      ? "Carryover"
                      : mode === "sameSession"
                        ? "Same Session"
                        : "None"}
                  </Text>
                </Pressable>
              ),
            )}
          </View>

          {sundayChampionshipMode === "carryover" && (
            <>
              <Text style={styles.subsectionTitle}>🏆 Championship Game</Text>

              <Text style={styles.blackLabel}>Teams</Text>
              <View style={styles.rowWrap}>
                {teams.map((team) => {
                  const active = championshipTeamIds.includes(team.id);

                  return (
                    <Pressable
                      key={team.id}
                      style={[styles.smallPill, active && styles.smallPillActive]}
                      onPress={() => toggleChampionshipTeam(team.id)}
                    >
                      <Text
                        style={[
                          styles.smallPillText,
                          active && styles.smallPillTextActive,
                        ]}
                      >
                        {team.teamName}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.blackLabel}>Championship Time</Text>
              <View style={styles.rowWrap}>
                {timeSlots.map((slot) => (
                  <Pressable
                    key={`champ-time-${slot}`}
                    style={[
                      styles.smallPill,
                      championshipTime === slot && styles.smallPillActive,
                    ]}
                    onPress={() => {
                      setChampionshipTime(slot);
                      resetPreview();
                    }}
                  >
                    <Text
                      style={[
                        styles.smallPillText,
                        championshipTime === slot && styles.smallPillTextActive,
                      ]}
                    >
                      {slot}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.blackLabel}>Championship Venue</Text>
              <TextInput
                style={styles.input}
                value={championshipVenue}
                onChangeText={(value) => {
                  setChampionshipVenue(value);
                  resetPreview();
                }}
              />
            </>
          )}
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Teams</Text>

        {teams.map((team) => {
          const isChampionshipTeam = championshipTeamIds.includes(team.id);

          return (
            <View key={team.id} style={styles.teamRow}>
              <Text style={styles.teamId}>{team.id}</Text>

              <TextInput
                style={styles.teamInput}
                value={team.teamName}
                onChangeText={(value) => updateTeamName(team.id, value)}
              />

              {previewWeeks.length > 0 && (
                <Text
                  style={[
                    styles.byeBadge,
                    byeCounts[team.id] === 2 ? styles.byeGood : styles.byeBad,
                  ]}
                >
                  {byeCounts[team.id] ?? 0} off
                </Text>
              )}

              {leagueNight === "Sunday" && isChampionshipTeam && (
                <Text style={styles.champTag}>🏆</Text>
              )}

              <Pressable
                style={styles.deleteButton}
                onPress={() => deleteTeam(team.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          );
        })}

        <Pressable style={styles.addButton} onPress={addTeam}>
          <Text style={styles.addButtonText}>+ Add Team</Text>
        </Pressable>
      </View>

      {leagueNight === "Sunday" && (
        <View style={styles.rulesCard}>
          <Text style={styles.sectionTitle}>Sunday Rules</Text>
          <Text style={styles.rule}>✅ Exactly 2 byes per team</Text>
          <Text style={styles.rule}>✅ No back-to-back repeat matchups</Text>
          <Text style={styles.rule}>✅ Tom cannot have Week 10 bye</Text>
          <Text style={styles.rule}>✅ Weeks 8–10: no 9:00 AM games</Text>
          <Text style={styles.rule}>✅ Timmy only 11:00 AM / 12:00 PM</Text>
          <Text style={styles.rule}>✅ Prince only 11:00 AM / 12:00 PM</Text>
          <Text style={styles.rule}>
            ✅ Timmy = four 11 AM + four 12 PM games
          </Text>
          <Text style={styles.rule}>
            ✅ Prince = four 11 AM + four 12 PM games
          </Text>
          <Text style={styles.rule}>✅ Timmy vs Prince = 12:00 PM</Text>
        </View>
      )}

      {leagueNight !== "Sunday" && (
        <View style={styles.rulesCard}>
          <Text style={styles.sectionTitle}>{leagueNight} Rules</Text>
          <Text style={styles.rule}>✅ Exactly 2 byes per team</Text>
          <Text style={styles.rule}>✅ No back-to-back repeat matchups</Text>
          <Text style={styles.rule}>
            ✅ Weeks 9–10: 2 games, 3 byes, no late slot
          </Text>
          <Text style={styles.rule}>✅ Week 11: semi-finals + championship</Text>
        </View>
      )}

      <View style={styles.actionRow}>
        <Pressable style={styles.primaryButton} onPress={handleGenerate}>
          <Text style={styles.primaryButtonText}>Generate Preview</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={handleGenerate}>
          <Text style={styles.secondaryButtonText}>Regenerate</Text>
        </Pressable>
      </View>

      {attempts > 0 && (
        <Text style={styles.attemptText}>Generation attempts: {attempts}</Text>
      )}

      {validationErrors.length > 0 && (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Validation Errors</Text>

          {validationErrors.map((error, index) => (
            <Text key={`${error}-${index}`} style={styles.errorText}>
              • {error}
            </Text>
          ))}
        </View>
      )}

      {previewWeeks.length > 0 && validationErrors.length === 0 && (
        <View style={styles.successCard}>
          <Text style={styles.successTitle}>Valid Schedule Preview ✅</Text>
          <Text style={styles.successText}>
            Showing Weeks 1–10 only. Playoff/championship rows still export.
          </Text>
        </View>
      )}

      {previewWeeks.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Team Preview</Text>

          <View style={styles.rowWrap}>
            {teams.map((team) => (
              <Pressable
                key={team.id}
                style={[
                  styles.smallPill,
                  selectedTeamId === team.id && styles.smallPillActive,
                ]}
                onPress={() => setSelectedTeamId(team.id)}
              >
                <Text
                  style={[
                    styles.smallPillText,
                    selectedTeamId === team.id && styles.smallPillTextActive,
                  ]}
                >
                  {team.teamName}
                </Text>
              </Pressable>
            ))}
          </View>

          {selectedTeamId && (
            <View style={styles.teamPreviewBox}>
              <View style={styles.gridHeader}>
                <Text style={styles.gridCell}>Week</Text>
                <Text style={styles.gridCell}>Time</Text>
                <Text style={styles.gridCell}>Opponent</Text>
                <Text style={styles.gridCell}>Venue</Text>
              </View>

              {selectedTeamSchedule.map((item) => (
                <View key={`team-preview-${item.week}`} style={styles.gridRow}>
                  <Text style={styles.gridCell}>{item.week}</Text>
                  <Text style={styles.gridCell}>{item.time}</Text>
                  <Text style={styles.gridCell}>{item.opponent}</Text>
                  <Text style={styles.gridCell}>{item.venue}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {displayWeeks.map((week) => {
        const visibleByes = getVisibleByes(week);

        return (
          <View key={`week-${week.week}`} style={styles.weekCard}>
            <Text style={styles.weekTitle}>
              Week {week.week} • {week.date}
            </Text>

            {week.games
              .sort((a, b) => {
                const order = [
                  "6:30 PM",
                  "7:00 PM",
                  "7:30 PM",
                  "8:00 PM",
                  "8:30 PM",
                  "9:00 PM",
                  "9:00 AM",
                  "10:00 AM",
                  "11:00 AM",
                  "12:00 PM",
                ];

                return order.indexOf(a.time) - order.indexOf(b.time);
              })
              .map((game) => (
                <View key={game.id} style={styles.gameRow}>
                  <Text style={styles.gameTime}>{game.time}</Text>
                  <Text style={styles.gameText}>
                    {game.type === "championship" ? "🏆 " : ""}
                    {game.team1Name} vs {game.team2Name}
                  </Text>
                  <Text style={styles.venueText}>{game.venue}</Text>
                </View>
              ))}

            {visibleByes.length > 0 && (
              <View style={styles.byeBox}>
                <Text style={styles.byeText}>
                  Bye: {visibleByes.map((id) => getTeamName(id, teams)).join(", ")}
                </Text>
              </View>
            )}

            {week.hiddenByes && week.hiddenByes.length > 0 && (
              <View style={styles.hiddenByeBox}>
                <Text style={styles.hiddenByeText}>
                  Hidden Bye:{" "}
                  {week.hiddenByes
                    .map((id) => getTeamName(id, teams))
                    .join(", ")}
                </Text>
              </View>
            )}
          </View>
        );
      })}

      {previewWeeks.length > 0 && (
        <View style={styles.card}>
          <Pressable style={styles.primaryButtonFull} onPress={handleExport}>
            <Text style={styles.primaryButtonText}>
              Create Excel-Ready Export
            </Text>
          </Pressable>

          {exportText.length > 0 && (
            <View style={styles.exportBox}>
              <Text style={styles.exportTitle}>Copy/Paste Export</Text>
              <Text selectable style={styles.exportText}>
                {exportText}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: LIGHT,
  },
  content: {
    padding: 16,
  },
  headerCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  backText: {
    color: PURPLE,
    fontWeight: "700",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: PURPLE,
  },
  subtitle: {
    marginTop: 6,
    color: GRAY,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  rulesCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: PURPLE,
    marginBottom: 12,
  },
  subsectionTitle: {
    color: PURPLE,
    fontWeight: "900",
    marginTop: 14,
    marginBottom: 8,
  },
  blackLabel: {
    color: "#111827",
    fontWeight: "900",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#111827",
    marginBottom: 8,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#eef2ff",
  },
  pillActive: {
    backgroundColor: TAB_BLUE,
  },
  pillText: {
    color: TAB_BLUE,
    fontWeight: "800",
  },
  pillTextActive: {
    color: "#fff",
  },
  modeButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
  },
  modeButtonActive: {
    backgroundColor: TAB_BLUE,
  },
  modeText: {
    color: "#111827",
    fontWeight: "900",
  },
  modeTextActive: {
    color: "#fff",
  },
  smallPill: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#f3f4f6",
  },
  smallPillActive: {
    backgroundColor: TAB_BLUE,
  },
  smallPillText: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 12,
  },
  smallPillTextActive: {
    color: "#fff",
  },
  teamRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  teamId: {
    width: 64,
    fontSize: 12,
    color: GRAY,
    fontWeight: "800",
  },
  teamInput: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  byeBadge: {
    overflow: "hidden",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontSize: 11,
    fontWeight: "900",
  },
  byeGood: {
    backgroundColor: "#dcfce7",
    color: GREEN,
  },
  byeBad: {
    backgroundColor: "#fee2e2",
    color: RED,
  },
  champTag: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#fee2e2",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  deleteButtonText: {
    color: RED,
    fontWeight: "900",
    fontSize: 11,
  },
  addButton: {
    backgroundColor: TAB_BLUE,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "900",
  },
  rule: {
    color: "#111827",
    fontWeight: "700",
    marginBottom: 6,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: TAB_BLUE,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryButtonFull: {
    backgroundColor: TAB_BLUE,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "900",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#dbeafe",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: TAB_BLUE,
    fontWeight: "900",
  },
  attemptText: {
    color: GRAY,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  errorCard: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  errorTitle: {
    color: RED,
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 8,
  },
  errorText: {
    color: RED,
    marginBottom: 5,
    lineHeight: 19,
  },
  successCard: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  successTitle: {
    color: GREEN,
    fontWeight: "900",
    fontSize: 16,
  },
  successText: {
    color: GREEN,
    marginTop: 4,
  },
  teamPreviewBox: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    overflow: "hidden",
  },
  gridHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
  },
  gridRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  gridCell: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
  weekCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  weekTitle: {
    color: PURPLE,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 10,
  },
  gameRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  gameTime: {
    width: 78,
    color: "#111827",
    fontWeight: "900",
    fontSize: 12,
  },
  gameText: {
    flex: 1,
    color: "#111827",
    fontWeight: "800",
  },
  venueText: {
    color: GRAY,
    fontWeight: "700",
    fontSize: 12,
  },
  byeBox: {
    marginTop: 10,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 10,
  },
  byeText: {
    color: GRAY,
    fontWeight: "800",
  },
  hiddenByeBox: {
    marginTop: 8,
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 10,
  },
  hiddenByeText: {
    color: TAB_BLUE,
    fontWeight: "900",
  },
  exportBox: {
    marginTop: 14,
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 12,
  },
  exportTitle: {
    color: "#fff",
    fontWeight: "900",
    marginBottom: 8,
  },
  exportText: {
    color: "#fff",
    fontSize: 11,
    lineHeight: 16,
  },
});