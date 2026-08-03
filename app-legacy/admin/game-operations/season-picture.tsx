// app/admin/game-operations/season-picture.tsx

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";

import SubScreenLayout from "src/components/SubScreenLayout";
import { useTextSize } from "src/context/TextSizeContext";

type LeagueKey = "sunday" | "monday" | "tuesday" | "wednesday";

type TeamPicture = {
  teamId: string;
  teamName: string;
  wins: string;
  losses: string;
  gamesLeft: string;
  nextOpponentId: string;
  playoffStatus: string;
  playoffPosition: string;
  tiebreakerStatus: string;
  tiebreakerTeamId: string;
  seasonStatus: string;
};

const PURPLE = "#250f74";

const LEAGUES: { label: string; value: LeagueKey }[] = [
  { label: "Sunday", value: "sunday" },
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
];

const TEAMS: Record<LeagueKey, { teamId: string; teamName: string }[]> = {
  sunday: [
    { teamId: "sun_tA", teamName: "Ziller" },
    { teamId: "sun_tB", teamName: "Tom" },
    { teamId: "sun_tC", teamName: "Edwards" },
    { teamId: "sun_tD", teamName: "Rich" },
    { teamId: "sun_tE", teamName: "Timmy" },
    { teamId: "sun_tF", teamName: "TeeJ" },
    { teamId: "sun_tG", teamName: "Dale" },
    { teamId: "sun_tH", teamName: "Prince" },
    { teamId: "sun_tI", teamName: "Dex" },
  ],
  monday: [
    { teamId: "mon_tA", teamName: "Trifecta" },
    { teamId: "mon_tB", teamName: "Beans" },
    { teamId: "mon_tC", teamName: "Chimney" },
    { teamId: "mon_tD", teamName: "MAAC" },
    { teamId: "mon_tE", teamName: "Hard Rock" },
    { teamId: "mon_tF", teamName: "The Other Bar" },
    { teamId: "mon_tG", teamName: "JRL" },
  ],
  tuesday: [
    { teamId: "tue_tA", teamName: "Team A" },
    { teamId: "tue_tB", teamName: "Team B" },
    { teamId: "tue_tC", teamName: "Team C" },
    { teamId: "tue_tD", teamName: "Team D" },
  ],
  wednesday: [
    { teamId: "wed_tA", teamName: "Duffy" },
    { teamId: "wed_tB", teamName: "Neil" },
    { teamId: "wed_tC", teamName: "Tom" },
    { teamId: "wed_tD", teamName: "Gross" },
    { teamId: "wed_tE", teamName: "Gervese" },
    { teamId: "wed_tF", teamName: "Rob" },
    { teamId: "wed_tG", teamName: "Mark" },
  ],
};

const PLAYOFF_STATUS = [
  "Clinched",
  "Currently In",
  "Bubble Team",
  "Needs Help",
];

const PLAYOFF_POSITION = [
  "1 Seed",
  "2 Seed",
  "3 Seed",
  "4 Seed",
  "5 Seed",
  "6 Seed",
  "7 Seed",
  "8 Seed",
  "Outside Cutoff",
];

const TIEBREAKER_STATUS = [
  "Holds tiebreaker over",
  "Lost tiebreaker to",
  "Tiebreaker undecided",
];

const SEASON_STATUS = [
  "Fighting for top seed",
  "Can still move up",
  "Win helps secure higher seed",
  "Win and in",
  "Must win or get help",
  "Needs win or help",
  "Must win",
  "Currently holds final spot",
  "Needs multiple losses",
];

function buildInitialTeams(league: LeagueKey): TeamPicture[] {
  return TEAMS[league].map((team, index) => ({
    teamId: team.teamId,
    teamName: team.teamName,
    wins: "0",
    losses: "0",
    gamesLeft: "0",
    nextOpponentId: "",
    playoffStatus: index < 4 ? "Currently In" : "Bubble Team",
    playoffPosition: index < 8 ? `${index + 1} Seed` : "Outside Cutoff",
    tiebreakerStatus: "Tiebreaker undecided",
    tiebreakerTeamId: "",
    seasonStatus: index < 4 ? "Can still move up" : "Needs win or help",
  }));
}

function getTeamName(league: LeagueKey, teamId: string) {
  return TEAMS[league].find((team) => team.teamId === teamId)?.teamName ?? "";
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.optionWrap}>
        {options.map((option) => {
          const selected = value === option;

          return (
            <TouchableOpacity
              key={option}
              style={[styles.optionChip, selected && styles.optionChipActive]}
              onPress={() => onChange(option)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.optionChipText,
                  selected && styles.optionChipTextActive,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function AdminSeasonPictureScreen() {
  const { textScale } = useTextSize();

  const [league, setLeague] = useState<LeagueKey>("sunday");
  const [week, setWeek] = useState("Week 8");
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);

  const [teamsByLeague, setTeamsByLeague] = useState<
    Record<LeagueKey, TeamPicture[]>
  >({
    sunday: buildInitialTeams("sunday"),
    monday: buildInitialTeams("monday"),
    tuesday: buildInitialTeams("tuesday"),
    wednesday: buildInitialTeams("wednesday"),
  });

  const teams = teamsByLeague[league];

  const weekOptions = useMemo(() => {
    const max = league === "sunday" ? 12 : 11;
    return Array.from({ length: max }, (_, i) => `Week ${i + 1}`);
  }, [league]);

  const editingTeam = useMemo(() => {
    return teams.find((team) => team.teamId === editingTeamId) ?? null;
  }, [teams, editingTeamId]);

  const updateTeam = (
    teamId: string,
    key: keyof TeamPicture,
    value: string
  ) => {
    setTeamsByLeague((prev) => ({
      ...prev,
      [league]: prev[league].map((team) =>
        team.teamId === teamId ? { ...team, [key]: value } : team
      ),
    }));
  };

  const resetLeague = () => {
    setTeamsByLeague((prev) => ({
      ...prev,
      [league]: buildInitialTeams(league),
    }));
  };

  const saveDraft = () => {
    console.log("SAVE DRAFT:", { league, week, teams });
  };

  const publish = () => {
    console.log("PUBLISH SEASON PICTURE:", { league, week, teams });
  };

  return (
    <SubScreenLayout
      title="Season Picture"
      titleFontSize={20}
      backRoute="/admin"
    >
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerCard}>
            <Text style={[styles.headerTitle, { fontSize: 20 * textScale }]}>
              Season Picture Manager
            </Text>

            <Text style={[styles.headerSubtitle, { fontSize: 13 * textScale }]}>
              Keep the public screen clean, then tap Edit to update each team’s
              record, games left, next game, playoff status, playoff position,
              tiebreakers, and season outlook.
            </Text>
          </View>

          <View style={styles.controlCard}>
            <Text style={[styles.label, { fontSize: 13 * textScale }]}>
              League
            </Text>

            <View style={styles.segmentRow}>
              {LEAGUES.map((item) => {
                const selected = league === item.value;

                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.segmentButton,
                      selected && styles.segmentButtonActive,
                    ]}
                    onPress={() => {
                      setLeague(item.value);
                      setEditingTeamId(null);
                    }}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        selected && styles.segmentTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.label, { fontSize: 13 * textScale }]}>
              Week
            </Text>

            <View style={styles.weekGrid}>
              {weekOptions.map((item) => {
                const selected = week === item;

                return (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.weekButton,
                      selected && styles.weekButtonActive,
                    ]}
                    onPress={() => setWeek(item)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.weekButtonText,
                        selected && styles.weekButtonTextActive,
                      ]}
                    >
                      {item.replace("Week ", "Wk ")}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.listHeader}>
            <Text style={[styles.listTitle, { fontSize: 16 * textScale }]}>
              Teams
            </Text>

            <Text style={[styles.listSubtitle, { fontSize: 12 * textScale }]}>
              Tap Edit to update details
            </Text>
          </View>

          {teams.map((team, index) => {
            const nextOpponent = team.nextOpponentId
              ? getTeamName(league, team.nextOpponentId)
              : "TBD";

            return (
              <TouchableOpacity
                key={team.teamId}
                style={styles.teamRowCard}
                onPress={() => setEditingTeamId(team.teamId)}
                activeOpacity={0.8}
              >
                <View style={styles.rankPill}>
                  <Text style={styles.rankPillText}>#{index + 1}</Text>
                </View>

                <View style={styles.teamSummary}>
                  <Text
                    style={[styles.teamName, { fontSize: 16 * textScale }]}
                  >
                    {team.teamName}
                  </Text>

                  <Text
                    style={[
                      styles.teamMeta,
                      { fontSize: 12 * textScale },
                    ]}
                  >
                    {team.wins}-{team.losses} • {team.playoffStatus} •{" "}
                    {team.playoffPosition}
                  </Text>

                  <Text
                    style={[
                      styles.teamMetaLight,
                      { fontSize: 12 * textScale },
                    ]}
                  >
                    Next: vs {nextOpponent} • Games left: {team.gamesLeft}
                  </Text>
                </View>

                <Text style={styles.editText}>Edit ›</Text>
              </TouchableOpacity>
            );
          })}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={resetLeague}
            >
              <Text style={styles.secondaryButtonText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={saveDraft}>
              <Text style={styles.secondaryButtonText}>Save Draft</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.publishButton} onPress={publish}>
            <Text style={styles.publishButtonText}>Publish Season Picture</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal
          visible={!!editingTeam}
          transparent
          animationType="slide"
          onRequestClose={() => setEditingTeamId(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              {editingTeam && (
                <>
                  <View style={styles.modalHeader}>
                    <View>
                      <Text
                        style={[
                          styles.modalTitle,
                          { fontSize: 20 * textScale },
                        ]}
                      >
                        {editingTeam.teamName}
                      </Text>

                      <Text
                        style={[
                          styles.modalSubtitle,
                          { fontSize: 12 * textScale },
                        ]}
                      >
                        Edit Season Picture details
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setEditingTeamId(null)}
                    >
                      <Text style={styles.closeButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>

                  <ScrollView
                    contentContainerStyle={styles.modalContent}
                    showsVerticalScrollIndicator={false}
                  >
                    <View style={styles.twoColRow}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Wins</Text>

                        <TextInput
                          value={editingTeam.wins}
                          onChangeText={(value: string) =>
                            updateTeam(editingTeam.teamId, "wins", value)
                          }
                          keyboardType="numeric"
                          style={styles.input}
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Losses</Text>

                        <TextInput
                          value={editingTeam.losses}
                          onChangeText={(value: string) =>
                            updateTeam(editingTeam.teamId, "losses", value)
                          }
                          keyboardType="numeric"
                          style={styles.input}
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Games Left</Text>

                      <TextInput
                        value={editingTeam.gamesLeft}
                        onChangeText={(value: string) =>
                          updateTeam(editingTeam.teamId, "gamesLeft", value)
                        }
                        keyboardType="numeric"
                        style={styles.input}
                      />
                    </View>

                    <View style={styles.fieldBlock}>
                      <Text style={styles.label}>Next Game</Text>

                      <View style={styles.optionWrap}>
                        <TouchableOpacity
                          style={[
                            styles.optionChip,
                            editingTeam.nextOpponentId === "" &&
                              styles.optionChipActive,
                          ]}
                          onPress={() =>
                            updateTeam(
                              editingTeam.teamId,
                              "nextOpponentId",
                              ""
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.optionChipText,
                              editingTeam.nextOpponentId === "" &&
                                styles.optionChipTextActive,
                            ]}
                          >
                            TBD
                          </Text>
                        </TouchableOpacity>

                        {teams
                          .filter(
                            (opponent) =>
                              opponent.teamId !== editingTeam.teamId
                          )
                          .map((opponent) => {
                            const selected =
                              editingTeam.nextOpponentId === opponent.teamId;

                            return (
                              <TouchableOpacity
                                key={opponent.teamId}
                                style={[
                                  styles.optionChip,
                                  selected && styles.optionChipActive,
                                ]}
                                onPress={() =>
                                  updateTeam(
                                    editingTeam.teamId,
                                    "nextOpponentId",
                                    opponent.teamId
                                  )
                                }
                              >
                                <Text
                                  style={[
                                    styles.optionChipText,
                                    selected && styles.optionChipTextActive,
                                  ]}
                                >
                                  vs {opponent.teamName}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                      </View>
                    </View>

                    <SelectField
                      label="Playoff Status"
                      value={editingTeam.playoffStatus}
                      options={PLAYOFF_STATUS}
                      onChange={(value) =>
                        updateTeam(editingTeam.teamId, "playoffStatus", value)
                      }
                    />

                    <SelectField
                      label="Playoff Position"
                      value={editingTeam.playoffPosition}
                      options={PLAYOFF_POSITION}
                      onChange={(value) =>
                        updateTeam(editingTeam.teamId, "playoffPosition", value)
                      }
                    />

                    <SelectField
                      label="Tiebreaker Status"
                      value={editingTeam.tiebreakerStatus}
                      options={TIEBREAKER_STATUS}
                      onChange={(value) =>
                        updateTeam(
                          editingTeam.teamId,
                          "tiebreakerStatus",
                          value
                        )
                      }
                    />

                    <View style={styles.fieldBlock}>
                      <Text style={styles.label}>Tiebreaker Team</Text>

                      <View style={styles.optionWrap}>
                        <TouchableOpacity
                          style={[
                            styles.optionChip,
                            editingTeam.tiebreakerTeamId === "" &&
                              styles.optionChipActive,
                          ]}
                          onPress={() =>
                            updateTeam(
                              editingTeam.teamId,
                              "tiebreakerTeamId",
                              ""
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.optionChipText,
                              editingTeam.tiebreakerTeamId === "" &&
                                styles.optionChipTextActive,
                            ]}
                          >
                            TBD
                          </Text>
                        </TouchableOpacity>

                        {teams
                          .filter(
                            (opponent) =>
                              opponent.teamId !== editingTeam.teamId
                          )
                          .map((opponent) => {
                            const selected =
                              editingTeam.tiebreakerTeamId === opponent.teamId;

                            return (
                              <TouchableOpacity
                                key={opponent.teamId}
                                style={[
                                  styles.optionChip,
                                  selected && styles.optionChipActive,
                                ]}
                                onPress={() =>
                                  updateTeam(
                                    editingTeam.teamId,
                                    "tiebreakerTeamId",
                                    opponent.teamId
                                  )
                                }
                              >
                                <Text
                                  style={[
                                    styles.optionChipText,
                                    selected && styles.optionChipTextActive,
                                  ]}
                                >
                                  {opponent.teamName}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                      </View>
                    </View>

                    <SelectField
                      label="Season Status"
                      value={editingTeam.seasonStatus}
                      options={SEASON_STATUS}
                      onChange={(value) =>
                        updateTeam(editingTeam.teamId, "seasonStatus", value)
                      }
                    />

                    <TouchableOpacity
                      style={styles.doneButton}
                      onPress={() => setEditingTeamId(null)}
                    >
                      <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },

  headerCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e2e2",
    marginBottom: 14,
  },

  headerTitle: {
    color: PURPLE,
    fontWeight: "900",
    marginBottom: 6,
  },

  headerSubtitle: {
    color: "#555",
    fontWeight: "600",
    lineHeight: 19,
  },

  controlCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e2e2",
    marginBottom: 14,
  },

  label: {
    color: "#555",
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 8,
  },

  segmentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },

  segmentButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 13,
  },

  segmentButtonActive: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },

  segmentText: {
    color: "#333",
    fontWeight: "900",
  },

  segmentTextActive: {
    color: "#fff",
  },

  weekGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  weekButton: {
    width: "22%",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },

  weekButtonActive: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },

  weekButtonText: {
    color: "#333",
    fontWeight: "900",
  },

  weekButtonTextActive: {
    color: "#fff",
  },

  listHeader: {
    marginBottom: 8,
  },

  listTitle: {
    color: "#111",
    fontWeight: "900",
  },

  listSubtitle: {
    color: "#777",
    fontWeight: "700",
    marginTop: 2,
  },

  teamRowCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e2e2",
    marginBottom: 10,
  },

  rankPill: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  rankPillText: {
    color: "#fff",
    fontWeight: "900",
  },

  teamSummary: {
    flex: 1,
  },

  teamName: {
    color: "#111",
    fontWeight: "900",
  },

  teamMeta: {
    color: "#333",
    fontWeight: "800",
    marginTop: 3,
  },

  teamMetaLight: {
    color: "#777",
    fontWeight: "700",
    marginTop: 3,
  },

  editText: {
    color: PURPLE,
    fontWeight: "900",
    marginLeft: 8,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: PURPLE,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    backgroundColor: "#fff",
  },

  secondaryButtonText: {
    color: PURPLE,
    fontWeight: "900",
  },

  publishButton: {
    backgroundColor: PURPLE,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 12,
  },

  publishButtonText: {
    color: "#fff",
    fontWeight: "900",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "88%",
    paddingTop: 16,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  modalTitle: {
    color: PURPLE,
    fontWeight: "900",
  },

  modalSubtitle: {
    color: "#777",
    fontWeight: "700",
    marginTop: 3,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    justifyContent: "center",
  },

  closeButtonText: {
    color: "#111",
    fontSize: 26,
    fontWeight: "800",
    marginTop: -2,
  },

  modalContent: {
    padding: 18,
    paddingBottom: 50,
  },

  twoColRow: {
    flexDirection: "row",
    gap: 10,
  },

  inputGroup: {
    flex: 1,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fafafa",
    color: "#111",
    fontWeight: "800",
  },

  fieldBlock: {
    marginTop: 10,
  },

  optionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  optionChip: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 2,
  },

  optionChipActive: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },

  optionChipText: {
    color: "#333",
    fontWeight: "900",
  },

  optionChipTextActive: {
    color: "#fff",
  },

  doneButton: {
    backgroundColor: PURPLE,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 18,
  },

  doneButtonText: {
    color: "#fff",
    fontWeight: "900",
  },
});