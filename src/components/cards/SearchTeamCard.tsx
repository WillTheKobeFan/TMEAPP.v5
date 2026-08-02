// src/components/cards/SearchTeamCard.tsx

import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";



const PURPLE = "#250f74";
const GREEN = "#22c55e";
const RED = "#ef4444";
const YELLOW = "#f59e0b";
const GRAY = "#6b7280";
const LIGHT_GRAY = "#f3f4f6";
const BORDER = "#e5e7eb";
const DARK = "#111827";

export type TeamScheduleItem = {
  week: number | string;
  time?: string;
  opponent?: string;
  venue?: string;
  isBye?: boolean;
  result?: "W" | "L" | "F" | "win" | "loss" | "forfeit" | "";
  score?: string;
};

export type TeamStandingStats = {
  rank?: number | string;
  record?: string;
  wins?: number;
  losses?: number;
  winPercentage?: string;
  pointsFor?: number;
  pointsAgainst?: number;
  pointDifferential?: number | string;
  streak?: string;
  gamesBack?: number | string;
  playoffStatus?: string;
};

export type SearchTeamCardTeam = {
  id: string;
  teamName?: string;
  captain?: string;
  league?: string;

  record?: string;
  place?: string;
  status?: string;

  nextGame?: string;
  lastResult?: string;

  roster?: string[];
  fullSchedule?: TeamScheduleItem[];
  standingStats?: TeamStandingStats;

  onPressGameResults?: () => void;
  onPressStandings?: () => void;
};

type Props = {
  visible: boolean;
  team: SearchTeamCardTeam | null;
  onClose: () => void;
};

export default function SearchTeamCard({ visible, team, onClose }: Props) {
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [showRoster, setShowRoster] = useState(false);
  const [showGameResults, setShowGameResults] = useState(false);
  const [showStandings, setShowStandings] = useState(false);

  const schedule = useMemo(() => team?.fullSchedule ?? [], [team]);
  const standings = team?.standingStats;

  if (!team) return null;

  const displayName = team.teamName || team.captain || "Team";
  const leagueName = team.league || "League";

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.teamName}>{displayName}</Text>
              <Text style={styles.leagueName}>{leagueName}</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.infoText}>
                Record: {team.record || "Not available"}
              </Text>
              <Text style={styles.infoText}>
                Place: {team.place || "Not available"}
              </Text>
              <Text style={styles.infoText}>
                Status: {team.status || "Season status pending"}
              </Text>
            </View>

            <Section title="🏀 Next Game">
              <Text style={styles.bodyText}>
                {team.nextGame || "Next game has not been posted yet."}
              </Text>
            </Section>

            <Section title="🏁 Last Result">
              <Text style={styles.bodyText}>
                {team.lastResult || "No recent result posted."}
              </Text>
            </Section>

            <DropdownHeader
              title="📅 Full Team Schedule"
              open={showFullSchedule}
              onPress={() => setShowFullSchedule((prev) => !prev)}
            />

            {showFullSchedule && (
              <View style={styles.dropdownBody}>
                {schedule.length === 0 ? (
                  <Text style={styles.emptyText}>
                    Full schedule has not been posted yet.
                  </Text>
                ) : (
                  schedule.map((item, index) => (
                    <ScheduleRow key={`${item.week}-${index}`} item={item} />
                  ))
                )}
              </View>
            )}

            <DropdownHeader
              title="👥 Roster"
              open={showRoster}
              onPress={() => setShowRoster((prev) => !prev)}
            />

            {showRoster && (
              <View style={styles.dropdownBody}>
                {team.roster && team.roster.length > 0 ? (
                  team.roster.map((player, index) => (
                    <Text key={`${player}-${index}`} style={styles.bodyText}>
                      {player}
                      {team.captain && player === team.captain ? " (C)" : ""}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.emptyText}>Roster not available.</Text>
                )}
              </View>
            )}

            <DropdownHeader
              title="🏀 Game Results"
              open={showGameResults}
              onPress={() => setShowGameResults((prev) => !prev)}
            />

            {showGameResults && (
              <View style={styles.dropdownBody}>
                <TouchableOpacity
                  style={styles.innerLink}
                  onPress={team.onPressGameResults}
                  activeOpacity={0.8}
                >
                  <Text style={styles.innerLinkText}>
                    View Full Game Results ➡️
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <DropdownHeader
              title="📊 League Standings"
              open={showStandings}
              onPress={() => setShowStandings((prev) => !prev)}
            />

            {showStandings && (
              <View style={styles.dropdownBody}>
                {standings ? (
                  <>
                    <StandingRow label="Rank" value={standings.rank} />
                    <StandingRow
                      label="Record"
                      value={
                        standings.record ??
                        formatRecord(standings.wins, standings.losses)
                      }
                    />
                    <StandingRow label="Win %" value={standings.winPercentage} />
                    <StandingRow label="PF" value={standings.pointsFor} />
                    <StandingRow label="PA" value={standings.pointsAgainst} />
                    <StandingRow label="PD" value={standings.pointDifferential} />
                    <StandingRow label="Streak" value={standings.streak} />
                    <StandingRow label="GB" value={standings.gamesBack} />
                    <StandingRow
                      label="Playoff Status"
                      value={standings.playoffStatus}
                    />

                    <TouchableOpacity
                      style={styles.innerLink}
                      onPress={team.onPressStandings}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.innerLinkText}>
                        View Full Standings ➡️
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.emptyText}>
                      Standings have not been posted yet.
                    </Text>

                    <TouchableOpacity
                      style={styles.innerLink}
                      onPress={team.onPressStandings}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.innerLinkText}>
                        View Full Standings ➡️
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function DropdownHeader({
  title,
  open,
  onPress,
}: {
  title: string;
  open: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.dropdownHeader}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.dropdownTitle}>{title}</Text>
      <Text style={styles.chevron}>{open ? "▾" : "▸"}</Text>
    </TouchableOpacity>
  );
}

function ScheduleRow({ item }: { item: TeamScheduleItem }) {
  const resultLabel = getResultLabel(item.result);
  const resultStyle = getResultStyle(resultLabel);

  if (item.isBye) {
    return (
      <View style={styles.scheduleRow}>
        <Text style={[styles.scheduleText, styles.byeText]}>
          Wk {item.week} • BYE
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.scheduleRow}>
      <Text style={styles.scheduleText}>
        Wk {item.week}
        {item.time ? ` • ${item.time}` : ""}
        {item.opponent ? ` • ${item.opponent}` : ""}
        {item.score ? ` • ${item.score}` : ""}
        {resultLabel ? " • " : ""}
        {resultLabel ? (
          <Text style={[styles.resultText, resultStyle]}>{resultLabel}</Text>
        ) : null}
      </Text>
    </View>
  );
}

function StandingRow({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <View style={styles.standingRow}>
      <Text style={styles.standingLabel}>{label}:</Text>
      <Text style={styles.standingValue}>
        {value !== undefined && value !== null && value !== ""
          ? value
          : "Not available"}
      </Text>
    </View>
  );
}

function getResultLabel(result?: TeamScheduleItem["result"]) {
  if (!result) return "";

  const value = String(result).toLowerCase();

  if (value === "w" || value === "win") return "W";
  if (value === "l" || value === "loss") return "L";
  if (value === "f" || value === "forfeit") return "F";

  return "";
}

function getResultStyle(result: string) {
  if (result === "W") return styles.winText;
  if (result === "L") return styles.lossText;
  if (result === "F") return styles.forfeitText;
  return undefined;
}

function formatRecord(wins?: number, losses?: number) {
  if (wins === undefined || losses === undefined) return undefined;
  return `${wins}-${losses}`;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
  },

  card: {
    width: "100%",
    maxHeight: "86%",
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
  },

  closeButton: {
    position: "absolute",
    right: 16,
    top: 12,
    zIndex: 10,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  closeText: {
    fontSize: 30,
    color: DARK,
    fontWeight: "500",
  },

  header: {
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 12,
  },

  teamName: {
    fontSize: 26,
    fontWeight: "800",
    color: PURPLE,
    textAlign: "center",
  },

  leagueName: {
    fontSize: 15,
    color: GRAY,
    marginTop: 3,
    textAlign: "center",
  },

  infoBlock: {
    backgroundColor: LIGHT_GRAY,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },

  infoText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },

  section: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingVertical: 13,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: DARK,
    marginBottom: 6,
  },

  bodyText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 21,
  },

  dropdownHeader: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dropdownTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: DARK,
  },

  chevron: {
    fontSize: 18,
    color: GRAY,
    fontWeight: "800",
  },

  dropdownBody: {
    backgroundColor: "#fafafa",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },

  scheduleRow: {
    paddingVertical: 5,
  },

  scheduleText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 21,
  },

  resultText: {
    fontWeight: "900",
  },

  winText: {
    color: GREEN,
  },

  lossText: {
    color: RED,
  },

  forfeitText: {
    color: YELLOW,
  },

  byeText: {
    color: GRAY,
    fontWeight: "700",
  },

  standingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 5,
  },

  standingLabel: {
    fontSize: 14,
    color: GRAY,
    fontWeight: "700",
  },

  standingValue: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "700",
    textAlign: "right",
    flex: 1,
  },

  emptyText: {
    fontSize: 14,
    color: GRAY,
    fontStyle: "italic",
    lineHeight: 21,
  },

  innerLink: {
    paddingVertical: 4,
  },

  innerLinkText: {
    fontSize: 14,
    fontWeight: "800",
    color: PURPLE,
  },
});