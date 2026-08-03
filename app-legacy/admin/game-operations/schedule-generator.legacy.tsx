// app/admin/schedule-generator.tsx

import React, { useMemo, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { generateSchedule } from "src/lib/schedules/scheduleGeneratorService";
import { TIME_SLOTS } from "src/lib/schedules/constraints";
import type {
  ChampionshipCarryover,
  LeagueNight,
  ScheduleWeek,
  Team,
  TeamConstraint,
  ValidationResult,
} from "src/lib/schedules/types";

const THEME = "#250f74";

type ScheduleStatus = "editing" | "draft" | "published" | "locked";

const LEAGUE_NIGHTS: LeagueNight[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DEFAULT_TEAMS: Record<LeagueNight, Team[]> = {
  Sunday: [
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
  Monday: [
    { id: "mon_tA", name: "Cam" },
    { id: "mon_tB", name: "Coffey" },
    { id: "mon_tC", name: "John" },
    { id: "mon_tD", name: "Gibson" },
    { id: "mon_tE", name: "Ladd" },
    { id: "mon_tF", name: "Gross" },
    { id: "mon_tG", name: "Justin" },
  ],
  Tuesday: [
    { id: "tue_tA", name: "Team A" },
    { id: "tue_tB", name: "Team B" },
    { id: "tue_tC", name: "Team C" },
    { id: "tue_tD", name: "Team D" },
    { id: "tue_tE", name: "Team E" },
    { id: "tue_tF", name: "Team F" },
    { id: "tue_tG", name: "Team G" },
  ],
  Wednesday: [
    { id: "wed_tA", name: "Duffy" },
    { id: "wed_tB", name: "Neil" },
    { id: "wed_tC", name: "Tom" },
    { id: "wed_tD", name: "Gross" },
    { id: "wed_tE", name: "Gervese" },
    { id: "wed_tF", name: "Rob" },
    { id: "wed_tG", name: "Mark" },
  ],
  Thursday: [
    { id: "thu_tA", name: "Team A" },
    { id: "thu_tB", name: "Team B" },
    { id: "thu_tC", name: "Team C" },
    { id: "thu_tD", name: "Team D" },
    { id: "thu_tE", name: "Team E" },
    { id: "thu_tF", name: "Team F" },
    { id: "thu_tG", name: "Team G" },
  ],
  Friday: [
    { id: "fri_tA", name: "Team A" },
    { id: "fri_tB", name: "Team B" },
    { id: "fri_tC", name: "Team C" },
    { id: "fri_tD", name: "Team D" },
    { id: "fri_tE", name: "Team E" },
    { id: "fri_tF", name: "Team F" },
    { id: "fri_tG", name: "Team G" },
  ],
  Saturday: [
    { id: "sat_tA", name: "Team A" },
    { id: "sat_tB", name: "Team B" },
    { id: "sat_tC", name: "Team C" },
    { id: "sat_tD", name: "Team D" },
    { id: "sat_tE", name: "Team E" },
    { id: "sat_tF", name: "Team F" },
    { id: "sat_tG", name: "Team G" },
  ],
};

const emptyValidation: ValidationResult = {
  valid: false,
  errors: [],
  warnings: [],
};

const getDefaultStartDate = (league: LeagueNight) => {
  if (league === "Sunday") return "2026-06-07";
  if (league === "Monday") return "2026-06-22";
  if (league === "Tuesday") return "2026-06-23";
  if (league === "Wednesday") return "2026-06-24";
  if (league === "Thursday") return "2026-06-25";
  if (league === "Friday") return "2026-06-26";
  return "2026-06-27";
};

const getLeaguePrefix = (league: LeagueNight) => {
  if (league === "Sunday") return "sun";
  if (league === "Monday") return "mon";
  if (league === "Tuesday") return "tue";
  if (league === "Wednesday") return "wed";
  if (league === "Thursday") return "thu";
  if (league === "Friday") return "fri";
  return "sat";
};

const buildInitialConstraints = (teams: Team[]): TeamConstraint[] =>
  teams.map((team) => ({
    teamId: team.id,
    preferredTimes: [],
    avoidByeWeeks: [],
    avoidWeek10Bye: false,
  }));

export default function ScheduleGeneratorScreen() {
  const router = useRouter();

  const [league, setLeague] = useState<LeagueNight>("Sunday");
  const [season, setSeason] = useState("Summer");
  const [year, setYear] = useState("2026");
  const [startDate, setStartDate] = useState(getDefaultStartDate("Sunday"));

  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS.Sunday);
  const [constraints, setConstraints] = useState<TeamConstraint[]>(
    buildInitialConstraints(DEFAULT_TEAMS.Sunday)
  );

  const [championshipCarryover, setChampionshipCarryover] =
    useState<ChampionshipCarryover>({
      enabled: true,
      team1Id: "sun_tF",
      team2Id: "sun_tH",
      time: "11:00 AM",
    });

  const [previewWeeks, setPreviewWeeks] = useState<ScheduleWeek[]>([]);
  const [savedDraftWeeks, setSavedDraftWeeks] = useState<ScheduleWeek[]>([]);
  const [validation, setValidation] =
    useState<ValidationResult>(emptyValidation);

  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([
    DEFAULT_TEAMS.Sunday[0].id,
  ]);

  const [generationId, setGenerationId] = useState(0);
  const [generationMessage, setGenerationMessage] = useState("");
  const [workflowMessage, setWorkflowMessage] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [scheduleStatus, setScheduleStatus] =
    useState<ScheduleStatus>("editing");

  const scheduleIsLocked = scheduleStatus === "locked";
  const totalIssues = validation.errors.length + validation.warnings.length;

  const selectedPreferredTimes = TIME_SLOTS[league].filter((time) =>
    selectedTeamIds.every((teamId) =>
      constraints
        .find((constraint) => constraint.teamId === teamId)
        ?.preferredTimes.includes(time)
    )
  );

  const selectedAvoidByeWeeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((week) =>
    selectedTeamIds.every((teamId) =>
      constraints
        .find((constraint) => constraint.teamId === teamId)
        ?.avoidByeWeeks.includes(week)
    )
  );

  const getTeamRows = useMemo(() => {
    return (team: Team) =>
      previewWeeks
        .filter((week) => week.week <= 10)
        .map((week) => {
          const championshipGame = week.games.find(
            (game) =>
              game.type === "championship" &&
              (game.team1.id === team.id || game.team2.id === team.id)
          );

          if (championshipGame) {
            const opponent =
              championshipGame.team1.id === team.id
                ? championshipGame.team2.name
                : championshipGame.team1.name;

            return {
              week: week.week,
              date: week.date,
              time: championshipGame.time,
              opponent: `🏆 Championship vs ${opponent}`,
            };
          }

          const visibleBye = (week.byes ?? []).some(
            (byeTeam) => byeTeam.id === team.id
          );

          const hiddenBye = week.hiddenByes?.some(
            (byeTeam) => byeTeam.id === team.id
          );

          if (visibleBye || hiddenBye) {
            return {
              week: week.week,
              date: week.date,
              time: hiddenBye ? "Hidden Bye" : "BYE",
              opponent: "—",
            };
          }

          const game = week.games.find(
            (item) =>
              item.type === "regular" &&
              (item.team1.id === team.id || item.team2.id === team.id)
          );

          if (!game) {
            return {
              week: week.week,
              date: week.date,
              time: "—",
              opponent: "—",
            };
          }

          return {
            week: week.week,
            date: week.date,
            time: game.time,
            opponent:
              game.team1.id === team.id ? game.team2.name : game.team1.name,
          };
        });
  }, [previewWeeks]);

  const resetWorkflow = () => {
    setPreviewWeeks([]);
    setSavedDraftWeeks([]);
    setValidation(emptyValidation);
    setHasGenerated(false);
    setGenerationMessage("");
    setWorkflowMessage("");
    setScheduleStatus("editing");
  };

  const guardLocked = () => {
    if (!scheduleIsLocked) return false;

    setWorkflowMessage(
      "Schedule is locked. Only same-week edits/swaps should be allowed from the edit games screen."
    );

    return true;
  };

  const getNextTeamId = () => {
    const prefix = getLeaguePrefix(league);
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let index = 0; index < alphabet.length; index++) {
      const nextId = `${prefix}_t${alphabet[index]}`;

      if (!teams.some((team) => team.id === nextId)) {
        return nextId;
      }
    }

    return `${prefix}_t${teams.length + 1}`;
  };

  const handleLeagueChange = (nextLeague: LeagueNight) => {
    if (guardLocked()) return;

    const nextTeams = DEFAULT_TEAMS[nextLeague];

    setLeague(nextLeague);
    setTeams(nextTeams);
    setConstraints(buildInitialConstraints(nextTeams));
    setSelectedTeamIds([nextTeams[0].id]);
    setStartDate(getDefaultStartDate(nextLeague));
    resetWorkflow();

    if (nextLeague === "Sunday") {
      setChampionshipCarryover({
        enabled: true,
        team1Id: "sun_tF",
        team2Id: "sun_tH",
        time: "11:00 AM",
      });
    } else {
      setChampionshipCarryover({
        enabled: false,
        team1Id: "",
        team2Id: "",
        time: TIME_SLOTS[nextLeague][0],
      });
    }
  };

  const updateTeamName = (teamId: string, name: string) => {
    if (guardLocked()) return;

    setTeams((current) =>
      current.map((team) => (team.id === teamId ? { ...team, name } : team))
    );

    resetWorkflow();
  };

  const addTeam = () => {
    if (guardLocked()) return;

    const newTeam: Team = {
      id: getNextTeamId(),
      name: `Team ${teams.length + 1}`,
    };

    setTeams((current) => [...current, newTeam]);
    setConstraints((current) => [
      ...current,
      {
        teamId: newTeam.id,
        preferredTimes: [],
        avoidByeWeeks: [],
        avoidWeek10Bye: false,
      },
    ]);
    setSelectedTeamIds([newTeam.id]);
    resetWorkflow();
  };

  const deleteTeam = (teamId: string) => {
    if (guardLocked()) return;
    if (teams.length <= 2) return;

    const nextTeams = teams.filter((team) => team.id !== teamId);

    setTeams(nextTeams);
    setConstraints((current) =>
      current.filter((constraint) => constraint.teamId !== teamId)
    );

    setSelectedTeamIds((current) => {
      const nextSelected = current.filter((id) => id !== teamId);
      return nextSelected.length ? nextSelected : [nextTeams[0]?.id ?? ""];
    });

    if (league === "Sunday") {
      setChampionshipCarryover((current) => ({
        ...current,
        team1Id:
          current.team1Id === teamId ? nextTeams[0]?.id ?? "" : current.team1Id,
        team2Id:
          current.team2Id === teamId ? nextTeams[1]?.id ?? "" : current.team2Id,
      }));
    }

    resetWorkflow();
  };

  const toggleSelectedTeam = (teamId: string) => {
    setSelectedTeamIds((current) =>
      current.includes(teamId)
        ? current.filter((id) => id !== teamId)
        : [...current, teamId]
    );
  };

  const togglePreferredTimeForSelected = (time: string) => {
    if (guardLocked()) return;
    if (!selectedTeamIds.length) return;

    const allActive = selectedTeamIds.every((teamId) =>
      constraints
        .find((constraint) => constraint.teamId === teamId)
        ?.preferredTimes.includes(time)
    );

    setConstraints((current) =>
      current.map((constraint) => {
        if (!selectedTeamIds.includes(constraint.teamId)) return constraint;

        return {
          ...constraint,
          preferredTimes: allActive
            ? constraint.preferredTimes.filter((item) => item !== time)
            : Array.from(new Set([...constraint.preferredTimes, time])),
        };
      })
    );

    resetWorkflow();
  };

  const toggleAvoidByeWeekForSelected = (week: number) => {
    if (guardLocked()) return;
    if (!selectedTeamIds.length) return;

    const allActive = selectedTeamIds.every((teamId) =>
      constraints
        .find((constraint) => constraint.teamId === teamId)
        ?.avoidByeWeeks.includes(week)
    );

    setConstraints((current) =>
      current.map((constraint) => {
        if (!selectedTeamIds.includes(constraint.teamId)) return constraint;

        return {
          ...constraint,
          avoidByeWeeks: allActive
            ? constraint.avoidByeWeeks.filter((item) => item !== week)
            : Array.from(new Set([...constraint.avoidByeWeeks, week])),
          avoidWeek10Bye: week === 10 ? !allActive : constraint.avoidWeek10Bye,
        };
      })
    );

    resetWorkflow();
  };

  const buildGeneratorPayload = (forceNew = false) => ({
    league,
    teams,
    startDate,
    constraints,
    championshipCarryover:
      league === "Sunday" ? championshipCarryover : undefined,
    seed: Date.now(),
    forceNew,
  });

  const applyGenerateResult = (isRegenerate: boolean) => {
    if (guardLocked()) return;

    try {
      const result = generateSchedule(buildGeneratorPayload(isRegenerate));

      setHasGenerated(true);
      setPreviewWeeks(result.weeks);
      setValidation(result.validation);
      setSavedDraftWeeks([]);
      setScheduleStatus("editing");
      setWorkflowMessage("");
      setGenerationId((current) => current + 1);

      const issues =
        result.validation.errors.length + result.validation.warnings.length;

      setGenerationMessage(
        `${isRegenerate ? "Regenerated" : "Generated"} in ${result.attemptsUsed ?? 1
        } attempt(s). ${issues} issue(s) found.`
      );
    } catch (error) {
      setHasGenerated(true);
      setPreviewWeeks([]);
      setValidation({
        valid: false,
        errors: [error instanceof Error ? error.message : "Generation failed."],
        warnings: [],
      });
      setGenerationMessage(
        error instanceof Error ? error.message : "Generation failed."
      );
    }
  };

  const handleGenerate = () => applyGenerateResult(false);

  const handleRegenerate = () => {
    if (guardLocked()) return;

    setPreviewWeeks([]);
    setValidation(emptyValidation);
    setGenerationMessage("Regenerating...");
    setWorkflowMessage("");

    requestAnimationFrame(() => {
      applyGenerateResult(true);
    });
  };

  const handleSaveDraft = () => {
    if (!validation.valid || !previewWeeks.length) {
      setWorkflowMessage("Generate a valid schedule before saving a draft.");
      return;
    }

    setSavedDraftWeeks(previewWeeks);
    setScheduleStatus("draft");
    setWorkflowMessage("Draft saved. This schedule is not visible to players yet.");
  };

  const handlePublishSchedule = () => {
    const sourceWeeks = savedDraftWeeks.length ? savedDraftWeeks : previewWeeks;

    if (!validation.valid || !sourceWeeks.length) {
      setWorkflowMessage("Save or generate a valid schedule before publishing.");
      return;
    }

    setPreviewWeeks(sourceWeeks);
    setScheduleStatus("published");
    setWorkflowMessage(
      "Schedule published. Next step: lock it when you are ready to prevent full regeneration."
    );
  };

  const handleLockSchedule = () => {
    if (scheduleStatus !== "published") {
      setWorkflowMessage("Publish the schedule before locking it.");
      return;
    }

    setScheduleStatus("locked");
    setWorkflowMessage(
      "Schedule locked. Only same-week edits/swaps should be allowed now."
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome6 name="arrow-left" size={16} color={THEME} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Schedule Generator</Text>
        <Text style={styles.subtitle}>
          Build schedules, apply constraints, review validation, save drafts,
          publish schedules, and lock final schedules.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Schedule Status</Text>
          <Text style={styles.statusValue}>{scheduleStatus.toUpperCase()}</Text>
          {!!workflowMessage && (
            <Text style={styles.workflowMessage}>{workflowMessage}</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Session Setup</Text>

          <Text style={styles.label}>League Night</Text>
          <View style={styles.rowWrap}>
            {LEAGUE_NIGHTS.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.pill, league === item && styles.pillActive]}
                onPress={() => handleLeagueChange(item)}
              >
                <Text
                  style={[
                    styles.pillText,
                    league === item && styles.pillTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.twoColumn}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Season</Text>
              <TextInput
                value={season}
                onChangeText={setSeason}
                editable={!scheduleIsLocked}
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Year</Text>
              <TextInput
                value={year}
                onChangeText={setYear}
                editable={!scheduleIsLocked}
                style={styles.input}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <Text style={styles.label}>Anchor Week 1 Date</Text>
          <TextInput
            value={startDate}
            onChangeText={setStartDate}
            editable={!scheduleIsLocked}
            style={styles.input}
            placeholder="YYYY-MM-DD"
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleGenerate}>
              <Text style={styles.primaryButtonText}>Generate Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleRegenerate}>
              <Text style={styles.secondaryButtonText}>Regenerate</Text>
            </TouchableOpacity>
          </View>

          {!!generationMessage && (
            <Text style={styles.generationMessage}>{generationMessage}</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>League Rules</Text>
          <Text style={styles.ruleText}>
            {league === "Sunday"
              ? "Sunday: 9 teams, 10 regular weeks, championship carryover byes, every matchup once, exactly 2 byes per team."
              : `${league}: weeknight format, 10 regular weeks, every team plays all opponents at least once, controlled duplicates allowed, exactly 2 byes per team.`}
          </Text>
          <Text style={styles.ruleText}>
            Week 9/10 uses reduced schedule. Playoff weeks are preview only and do
            not count toward regular-season bye validation.
          </Text>
        </View>

        {league === "Sunday" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Championship Carryover</Text>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                championshipCarryover.enabled && styles.toggleButtonActive,
              ]}
              onPress={() => {
                if (guardLocked()) return;
                setChampionshipCarryover((current) => ({
                  ...current,
                  enabled: !current.enabled,
                }));
                resetWorkflow();
              }}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  championshipCarryover.enabled && styles.toggleButtonTextActive,
                ]}
              >
                {championshipCarryover.enabled
                  ? "Carryover Enabled"
                  : "Carryover Disabled"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>Championship Team 1</Text>
            <View style={styles.rowWrap}>
              {teams.map((team) => (
                <TouchableOpacity
                  key={`champ-1-${team.id}`}
                  style={[
                    styles.smallPill,
                    championshipCarryover.team1Id === team.id && styles.pillActive,
                  ]}
                  onPress={() => {
                    if (guardLocked()) return;
                    setChampionshipCarryover((current) => ({
                      ...current,
                      team1Id: team.id,
                    }));
                    resetWorkflow();
                  }}
                >
                  <Text
                    style={[
                      styles.smallPillText,
                      championshipCarryover.team1Id === team.id &&
                      styles.pillTextActive,
                    ]}
                  >
                    {team.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Championship Team 2</Text>
            <View style={styles.rowWrap}>
              {teams.map((team) => (
                <TouchableOpacity
                  key={`champ-2-${team.id}`}
                  style={[
                    styles.smallPill,
                    championshipCarryover.team2Id === team.id && styles.pillActive,
                  ]}
                  onPress={() => {
                    if (guardLocked()) return;
                    setChampionshipCarryover((current) => ({
                      ...current,
                      team2Id: team.id,
                    }));
                    resetWorkflow();
                  }}
                >
                  <Text
                    style={[
                      styles.smallPillText,
                      championshipCarryover.team2Id === team.id &&
                      styles.pillTextActive,
                    ]}
                  >
                    {team.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Championship Time</Text>
            <View style={styles.rowWrap}>
              {TIME_SLOTS.Sunday.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.pill,
                    championshipCarryover.time === time && styles.pillActive,
                  ]}
                  onPress={() => {
                    if (guardLocked()) return;
                    setChampionshipCarryover((current) => ({
                      ...current,
                      time,
                    }));
                    resetWorkflow();
                  }}
                >
                  <Text
                    style={[
                      styles.pillText,
                      championshipCarryover.time === time && styles.pillTextActive,
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Team Management</Text>
              <Text style={styles.cardSubtitle}>
                Add, edit, or delete teams before generating a schedule.
              </Text>
            </View>

            <TouchableOpacity style={styles.addTeamButton} onPress={addTeam}>
              <Text style={styles.addTeamButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {teams.map((team) => (
            <View key={team.id} style={styles.teamRow}>
              <Text style={styles.teamId}>{team.id}</Text>

              <TextInput
                value={team.name}
                onChangeText={(text) => updateTeamName(team.id, text)}
                editable={!scheduleIsLocked}
                style={styles.teamInput}
              />

              <TouchableOpacity
                style={styles.deleteIconButton}
                onPress={() => deleteTeam(team.id)}
              >
                <Text style={styles.deleteIconText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Scheduling Constraints</Text>
          <Text style={styles.cardSubtitle}>
            Select one or more teams and apply preferred times or avoid-bye weeks
            together.
          </Text>

          <Text style={styles.label}>Selected Teams</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.rowWrapNoFlex}>
              {teams.map((team) => {
                const active = selectedTeamIds.includes(team.id);

                return (
                  <TouchableOpacity
                    key={`constraint-team-${team.id}`}
                    style={[styles.smallPill, active && styles.pillActive]}
                    onPress={() => toggleSelectedTeam(team.id)}
                  >
                    <Text
                      style={[
                        styles.smallPillText,
                        active && styles.pillTextActive,
                      ]}
                    >
                      {team.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <Text style={styles.miniLabel}>Selected Team Preferred Times</Text>
          <View style={styles.rowWrap}>
            {TIME_SLOTS[league].map((time) => {
              const active =
                selectedTeamIds.length > 0 &&
                selectedTeamIds.every((teamId) =>
                  constraints
                    .find((constraint) => constraint.teamId === teamId)
                    ?.preferredTimes.includes(time)
                );

              return (
                <TouchableOpacity
                  key={`multi-time-${time}`}
                  style={[styles.smallPill, active && styles.pillActive]}
                  onPress={() => togglePreferredTimeForSelected(time)}
                >
                  <Text
                    style={[
                      styles.smallPillText,
                      active && styles.pillTextActive,
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.miniLabel}>Avoid Bye Weeks</Text>
          <View style={styles.rowWrap}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((week) => {
              const active =
                selectedTeamIds.length > 0 &&
                selectedTeamIds.every((teamId) =>
                  constraints
                    .find((constraint) => constraint.teamId === teamId)
                    ?.avoidByeWeeks.includes(week)
                );

              return (
                <TouchableOpacity
                  key={`multi-avoid-${week}`}
                  style={[styles.weekPill, active && styles.pillActive]}
                  onPress={() => toggleAvoidByeWeekForSelected(week)}
                >
                  <Text
                    style={[
                      styles.weekPillText,
                      active && styles.pillTextActive,
                    ]}
                  >
                    W{week}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.appliedRulesBox}>
            <Text style={styles.appliedRulesTitle}>Applied Rules</Text>
            <Text style={styles.appliedRulesText}>
              Preferred Times:{" "}
              {selectedPreferredTimes.length
                ? selectedPreferredTimes.join(", ")
                : "—"}
            </Text>
            <Text style={styles.appliedRulesText}>
              Avoid Bye Weeks:{" "}
              {selectedAvoidByeWeeks.length
                ? selectedAvoidByeWeeks.map((week) => `W${week}`).join(", ")
                : "—"}
            </Text>
          </View>
        </View>

        {hasGenerated && (
          <View key={`preview-${generationId}`}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Validation</Text>
              {validation.valid ? (
                <Text style={styles.successText}>✅ Schedule passed validation.</Text>
              ) : (
                <Text style={styles.errorSummary}>
                  ⚠️ {totalIssues} issue(s) found. Adjust constraints or regenerate.
                </Text>
              )}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Warnings Log</Text>
              {validation.errors.length === 0 && validation.warnings.length === 0 ? (
                <Text style={styles.successText}>✅ No warnings or errors.</Text>
              ) : (
                <>
                  {validation.errors.map((error, index) => (
                    <Text key={`log-error-${index}`} style={styles.errorText}>
                      ❌ {error}
                    </Text>
                  ))}
                  {validation.warnings.map((warning, index) => (
                    <Text key={`log-warning-${index}`} style={styles.warningText}>
                      ⚠️ {warning}
                    </Text>
                  ))}
                </>
              )}
            </View>

            {!!previewWeeks.length && (
              <>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Individual Team Schedules</Text>

                  {teams.map((team) => {
                    const rows = getTeamRows(team);

                    return (
                      <View key={`team-card-${team.id}`} style={styles.individualTeamCard}>
                        <Text style={styles.individualTeamTitle}>{team.name}</Text>

                        {rows.map((row) => (
                          <View
                            key={`${team.id}-week-${row.week}`}
                            style={styles.teamScheduleRow}
                          >
                            <Text style={styles.teamScheduleDate}>{row.date}</Text>
                            <Text style={styles.teamScheduleWeek}>W{row.week}</Text>
                            <Text style={styles.teamScheduleTime}>{row.time}</Text>
                            <Text style={styles.teamScheduleOpponent}>
                              {row.opponent}
                            </Text>
                          </View>

                        ))}
                      </View>
                    );
                  })}
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Season Preview</Text>

                  {previewWeeks.map((week) => (
                    <View key={`week-${week.week}`} style={styles.weekCard}>
                      <Text style={styles.weekTitle}>
                        Week {week.week}
                        {week.label ? `; ${week.label}` : ""}
                      </Text>

                      {week.games.length ? (
                        week.games.map((game) => (
                          <Text key={game.id} style={styles.gameLine}>
                            {game.time} —{" "}
                            {game.type === "championship"
                              ? `🏆 Championship 🏆 — ${game.team1.name}/${game.team2.name}`
                              : `${game.team1.name}/${game.team2.name}`}
                          </Text>
                        ))
                      ) : (
                        <Text style={styles.gameLine}>TBD</Text>
                      )}

                      <Text style={styles.byeLine}>
                        Bye:{" "}
                        {(week.byes ?? []).length
                          ? (week.byes ?? []).map((team) => team.name).join("; ")
                          : "—"}
                      </Text>

                      {!!week.hiddenByes?.length && (
                        <Text style={styles.hiddenByeLine}>
                          Hidden Bye:{" "}
                          {week.hiddenByes.map((team) => team.name).join("; ")}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>

                <View style={styles.workflowCard}>
                  <Text style={styles.cardTitle}>Schedule Workflow</Text>

                  <View style={styles.buttonRowBottom}>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={handleSaveDraft}
                    >
                      <Text style={styles.primaryButtonText}>Save Draft</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={handlePublishSchedule}
                    >
                      <Text style={styles.secondaryButtonText}>Publish Schedule</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.lockButton,
                      scheduleStatus === "locked" && styles.lockButtonActive,
                    ]}
                    onPress={handleLockSchedule}
                  >
                    <Text
                      style={[
                        styles.lockButtonText,
                        scheduleStatus === "locked" && styles.lockButtonTextActive,
                      ]}
                    >
                      {scheduleStatus === "locked"
                        ? "Schedule Locked"
                        : "Lock Schedule"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f5f3fb" },
  header: {
    backgroundColor: "#fff",
    paddingTop: 58,
    paddingHorizontal: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#e8e3f3",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  backText: { color: THEME, fontWeight: "700", fontSize: 15 },
  title: { fontSize: 26, fontWeight: "900", color: THEME },
  subtitle: { marginTop: 6, color: "#6f6680", fontSize: 14, lineHeight: 20 },
  content: { padding: 16, paddingBottom: 40 },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e6e0f2",
  },
  statusLabel: {
    color: "#6f6680",
    fontWeight: "800",
    fontSize: 12,
  },
  statusValue: {
    color: THEME,
    fontWeight: "900",
    fontSize: 18,
    marginTop: 4,
  },
  workflowMessage: {
    marginTop: 8,
    color: "#5f5575",
    fontWeight: "800",
    lineHeight: 18,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e6e0f2",
  },
  cardTitle: { fontSize: 18, fontWeight: "900", color: THEME, marginBottom: 12 },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  cardSubtitle: {
    color: "#6f6680",
    fontSize: 12,
    fontWeight: "700",
    marginTop: -6,
    marginBottom: 10,
    lineHeight: 17,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: "#35245f",
    marginBottom: 8,
    marginTop: 8,
  },
  miniLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#4b3a70",
    marginTop: 10,
    marginBottom: 6,
  },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  rowWrapNoFlex: { flexDirection: "row", gap: 8, marginBottom: 14 },
  pill: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#f1edf8",
    borderWidth: 1,
    borderColor: "#dfd5ee",
  },
  smallPill: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#f1edf8",
    borderWidth: 1,
    borderColor: "#dfd5ee",
  },
  weekPill: {
    paddingVertical: 6,
    paddingHorizontal: 9,
    borderRadius: 999,
    backgroundColor: "#f1edf8",
    borderWidth: 1,
    borderColor: "#dfd5ee",
  },
  pillActive: { backgroundColor: THEME, borderColor: THEME },
  pillText: { color: THEME, fontWeight: "800" },
  smallPillText: { color: THEME, fontWeight: "800", fontSize: 12 },
  weekPillText: { color: THEME, fontWeight: "900", fontSize: 11 },
  pillTextActive: { color: "#fff" },
  twoColumn: { flexDirection: "row", gap: 12 },
  inputGroup: { flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd3ed",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#23183c",
    backgroundColor: "#fbfaff",
    fontWeight: "700",
  },
  buttonRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  buttonRowBottom: { flexDirection: "row", gap: 10, marginBottom: 12 },
  primaryButton: {
    flex: 1,
    backgroundColor: THEME,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "900" },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME,
  },
  secondaryButtonText: { color: THEME, fontWeight: "900" },
  generationMessage: {
    marginTop: 10,
    color: "#5f5575",
    fontWeight: "800",
    fontSize: 12,
  },
  ruleText: {
    color: "#3c3059",
    fontWeight: "700",
    lineHeight: 20,
    marginBottom: 8,
  },
  toggleButton: {
    alignSelf: "flex-start",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: THEME,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  toggleButtonActive: { backgroundColor: THEME },
  toggleButtonText: { color: THEME, fontWeight: "900" },
  toggleButtonTextActive: { color: "#fff" },
  addTeamButton: {
    backgroundColor: THEME,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  addTeamButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 12,
  },
  teamRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  teamId: { width: 75, color: "#6f6680", fontWeight: "800", fontSize: 12 },
  teamInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd3ed",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: "#23183c",
    fontWeight: "700",
    backgroundColor: "#fff",
  },
  deleteIconButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#fff1f1",
    borderWidth: 1,
    borderColor: "#c0392b",
  },
  deleteIconText: {
    color: "#c0392b",
    fontWeight: "900",
    fontSize: 11,
  },
  appliedRulesBox: {
    backgroundColor: "#fbfaff",
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#e6def2",
  },
  appliedRulesTitle: {
    color: THEME,
    fontWeight: "900",
    fontSize: 12,
    marginBottom: 4,
  },
  appliedRulesText: {
    color: "#3c3059",
    fontWeight: "700",
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 17,
  },
  successText: { color: "#1f7a3f", fontWeight: "900", lineHeight: 20 },
  errorSummary: {
    color: "#8a4b00",
    fontWeight: "900",
    marginBottom: 10,
    lineHeight: 20,
  },
  errorText: {
    color: "#a12626",
    fontWeight: "800",
    marginBottom: 8,
    lineHeight: 20,
  },
  warningText: {
    color: "#8a4b00",
    fontWeight: "800",
    marginBottom: 8,
    lineHeight: 20,
  },
  individualTeamCard: {
    backgroundColor: "#fbfaff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e6def2",
  },
  individualTeamTitle: {
    color: THEME,
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 8,
  },
  teamScheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee8f7",
    gap: 6,
  },

  teamScheduleDate: {
    width: 84,
    color: "#2f2447",
    fontWeight: "700",
    fontSize: 12,
  },
  teamScheduleWeek: {
    width: 36,
    color: THEME,
    fontWeight: "900",
    fontSize: 12,
  },
  teamScheduleTime: {
    width: 80,
    color: "#2f2447",
    fontWeight: "700",
    fontSize: 12,
  },
  teamScheduleOpponent: {
    flex: 1,
    color: "#2f2447",
    fontWeight: "700",
    fontSize: 12,
  },
  weekCard: {
    backgroundColor: "#fbfaff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e6def2",
  },
  weekTitle: { color: THEME, fontWeight: "900", marginBottom: 8 },
  gameLine: { color: "#302445", fontWeight: "700", marginBottom: 5 },
  byeLine: { color: "#6f6680", fontWeight: "800", marginTop: 6 },
  hiddenByeLine: {
    color: "#7b5db0",
    fontWeight: "800",
    marginTop: 4,
  },
  workflowCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e6e0f2",
  },
  lockButton: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#8a4b00",
  },
  lockButtonActive: {
    backgroundColor: "#8a4b00",
  },
  lockButtonText: {
    color: "#8a4b00",
    fontWeight: "900",
  },
  lockButtonTextActive: {
    color: "#fff",
  },
});