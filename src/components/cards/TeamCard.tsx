// src/components/cards/TeamCard.tsx

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

type Player = {
  id?: string;
  name?: string;
  displayName?: string;
  captain?: boolean;
};

type GameResult = {
  id?: string;
  week?: number;
  opponent?: string;
  result?: string;
  summary?: string;
};

type TeamCardProps = {
  visible: boolean;
  onClose: () => void;

  teamName?: string;
  leagueName?: string;

  record?: string;
  place?: string | number;
  status?: string;

  nextGame?: {
    opponent?: string;
    date?: string;
    time?: string;
    venue?: string;
  };

  lastResult?: {
    summary?: string;
    opponent?: string;
    teamScore?: number | string;
    opponentScore?: number | string;
  };

  roster?: Player[];
  gameResults?: GameResult[];
  standingsLabel?: string;
};

const PURPLE = "#250f74";
const TEXT = "#202020";
const MUTED = "#666";
const BORDER = "#d7d7d7";

export default function TeamCard({
  visible,
  onClose,
  teamName = "Team",
  leagueName = "League",
  record = "Not available",
  place = "Not available",
  status = "Season status pending",
  nextGame,
  lastResult,
  roster = [],
  gameResults = [],
  standingsLabel,
}: TeamCardProps) {
  const [showRoster, setShowRoster] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showStandings, setShowStandings] = useState(false);

  const nextGameText = useMemo(() => {
    const parts = [
      nextGame?.opponent,
      nextGame?.time,
      nextGame?.venue,
    ].filter(Boolean);

    return parts.length
      ? parts.join(" • ")
      : "Next game has not been posted yet.";
  }, [nextGame]);

  const lastResultText = useMemo(() => {
    if (lastResult?.summary) return lastResult.summary;

    if (
      lastResult?.opponent &&
      lastResult?.teamScore !== undefined &&
      lastResult?.opponentScore !== undefined
    ) {
      return `${teamName}: ${lastResult.teamScore} def ${lastResult.opponent}: ${lastResult.opponentScore}`;
    }

    return "No recent result posted.";
  }, [lastResult, teamName]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.teamName}>{teamName}</Text>
            <Text style={styles.leagueName}>{leagueName}</Text>

            <View style={styles.summaryBlock}>
              <Text style={styles.summaryText}>
                <Text style={styles.bold}>Record:</Text> {record}
              </Text>
              <Text style={styles.summaryText}>
                <Text style={styles.bold}>Place:</Text> {place}
              </Text>
              <Text style={styles.summaryText}>
                <Text style={styles.bold}>Status:</Text> {status}
              </Text>
            </View>

            <Divider />

            <InfoSection emoji="🏀" title="Next Game" text={nextGameText} />

            <Divider />

            <InfoSection emoji="🏁" title="Last Result" text={lastResultText} />

            <Divider />

            <DropdownRow
              emoji="👥"
              title="Roster"
              open={showRoster}
              onPress={() => setShowRoster((prev) => !prev)}
            />

            {showRoster && (
              <View style={styles.dropdownContent}>
                {roster.length ? (
                  roster.map((player, index) => (
                    <Text key={player.id ?? index} style={styles.dropdownText}>
                      {player.displayName || player.name || "Player"}
                      {player.captain ? " (C)" : ""}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.dropdownMuted}>No roster available.</Text>
                )}
              </View>
            )}

            <Divider />

            <DropdownRow
              emoji="🏀"
              title="Game Results"
              open={showResults}
              onPress={() => setShowResults((prev) => !prev)}
            />

            {showResults && (
              <View style={styles.dropdownContent}>
                {gameResults.length ? (
                  gameResults.map((game, index) => (
                    <Text key={game.id ?? index} style={styles.dropdownText}>
                      {game.summary ??
                        `Week ${game.week ?? "-"} • ${game.result ?? ""} vs ${
                          game.opponent ?? "Opponent"
                        }`}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.dropdownMuted}>
                    No game results available.
                  </Text>
                )}
              </View>
            )}

            <Divider />

            <DropdownRow
              emoji="📊"
              title="League Standings"
              open={showStandings}
              onPress={() => setShowStandings((prev) => !prev)}
            />

            {showStandings && (
              <View style={styles.dropdownContent}>
                <Text style={styles.dropdownText}>
                  {standingsLabel ?? `Record: ${record} • Place: ${place}`}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function InfoSection({
  emoji,
  title,
  text,
}: {
  emoji: string;
  title: string;
  text: string;
}) {
  return (
    <View>
      <View style={styles.titleRow}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.bodyText}>{text}</Text>
    </View>
  );
}

function DropdownRow({
  emoji,
  title,
  open,
  onPress,
}: {
  emoji: string;
  title: string;
  open: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.dropdownRow}
    >
      <View style={styles.titleRow}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      <Text style={styles.chevron}>{open ? "▼" : "▶"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.42)",
  },

  card: {
    width: "85%",
    maxHeight: "65%",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingTop: 38,
    paddingHorizontal: 24,
    paddingBottom: 22,
  },

  closeButton: {
    position: "absolute",
    top: 8,
    right: 12,
    width: 48,
    height: 48,
    zIndex: 9999,
    elevation: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  closeText: {
    fontSize: 42,
    fontWeight: "900",
    color: "#333",
    lineHeight: 44,
  },

  teamName: {
    fontSize: 30,
    fontWeight: "900",
    color: PURPLE,
    textAlign: "center",
  },

  leagueName: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "700",
    color: MUTED,
    textAlign: "center",
  },

  summaryBlock: {
    marginTop: 26,
    gap: 6,
  },

  summaryText: {
    fontSize: 17,
    color: TEXT,
    lineHeight: 24,
  },

  bold: {
    fontWeight: "900",
  },

  divider: {
    height: 1.25,
    backgroundColor: BORDER,
    marginVertical: 17,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  emoji: {
    fontSize: 21,
    marginRight: 9,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: PURPLE,
  },

  bodyText: {
    marginTop: 8,
    fontSize: 17,
    color: TEXT,
    lineHeight: 24,
  },

  dropdownRow: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  chevron: {
    fontSize: 21,
    fontWeight: "900",
    color: "#555",
  },

  dropdownContent: {
    marginTop: 10,
    paddingLeft: 30,
    gap: 6,
  },

  dropdownText: {
    fontSize: 15,
    color: TEXT,
    lineHeight: 22,
  },

  dropdownMuted: {
    fontSize: 15,
    color: MUTED,
    fontStyle: "italic",
    lineHeight: 22,
  },
});