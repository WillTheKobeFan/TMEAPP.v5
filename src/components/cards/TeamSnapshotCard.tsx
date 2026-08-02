// src/components/cards/TeamSnapshotCard.tsx

import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { TeamSnapshot } from "../../types/team";
import { getStatusMeta } from "../../utils/teamStatus";

type Props = {
  team: TeamSnapshot;
  onClose?: () => void;
  onPressGameResults?: () => void;
  onPressRoster?: () => void;
  onPressStandings?: () => void;
};

export default function TeamSnapshotCard({
  team,
  onClose,
  onPressGameResults,
  onPressRoster,
  onPressStandings,
}: Props) {
  const status =
    getStatusMeta(team.status) ?? {
      label: "Upcoming",
      color: "#999",
    };

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        {onClose && (
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        )}

        <Text style={styles.name}>{team.name}</Text>

        <Text style={styles.league}>
          ({team.league}) League
        </Text>

        <View style={styles.block}>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Record: </Text>
            {team.record.wins}-{team.record.losses}
          </Text>

          <Text style={styles.infoText}>
            <Text style={styles.label}>Place: </Text>
            #{team.place}
          </Text>

          <Text style={styles.infoText}>
            <Text style={styles.label}>Status: </Text>
            <Text style={{ color: status.color }}>
              {status.label}
            </Text>
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Next Match</Text>
        {team.nextMatch ? (
          <Text style={styles.centerText}>
            vs {team.nextMatch.opponent}{"\n"}
            {team.nextMatch.day}, {team.nextMatch.time}
          </Text>
        ) : (
          <Text style={styles.centerText}>No upcoming game</Text>
        )}

        <Text style={styles.sectionTitle}>Last Result</Text>
        {team.lastResult ? (
          <Text style={styles.centerText}>
            {team.lastResult.result} vs {team.lastResult.opponent}{"\n"}
            {team.lastResult.score}
          </Text>
        ) : (
          <Text style={styles.centerText}>No results yet</Text>
        )}

        <Text style={styles.sectionTitle}>Full Schedule</Text>

        {team.schedule.length > 0 ? (
          team.schedule.map((g, i) => (
            <Text key={i} style={styles.scheduleText}>
              Week {g.week} — {g.result}{" "}
              {g.opponent ? `vs ${g.opponent}` : ""}
            </Text>
          ))
        ) : (
          <Text style={styles.centerText}>Schedule coming soon</Text>
        )}

        <View style={styles.buttonGroup}>
          <Pressable style={styles.button} onPress={onPressGameResults}>
            <Text style={styles.buttonText}>Game Results</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={onPressRoster}>
            <Text style={styles.buttonText}>Roster</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={onPressStandings}>
            <Text style={styles.buttonText}>League Standings</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const PURPLE = "#250f74";

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
  },

  card: {
  width: "100%",
  maxWidth: 390,

  paddingTop: 44,
  paddingBottom: 24,
  paddingHorizontal: 20,

  backgroundColor: "#fff",

  borderRadius: 18,

  borderWidth: 2,
  borderColor: "#250f74",

  alignItems: "center",
  position: "relative",

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.12,
  shadowRadius: 4,

  elevation: 4,
},

  closeButton: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  closeText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111",
  },

  name: {
    fontSize: 24,
    fontWeight: "900",
    color: PURPLE,
    textAlign: "center",
  },

  league: {
    color: "#666",
    marginTop: 4,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "600",
  },

  block: {
    width: "100%",
    marginBottom: 12,
    alignItems: "center",
  },

  infoText: {
    textAlign: "center",
    marginBottom: 4,
  },

  label: {
    fontWeight: "800",
  },

  sectionTitle: {
    fontWeight: "900",
    marginTop: 12,
    marginBottom: 4,
    textAlign: "center",
    color: "#111",
  },

  centerText: {
    textAlign: "center",
    color: "#333",
  },

  scheduleText: {
    textAlign: "center",
    color: "#333",
    marginBottom: 4,
  },

  buttonGroup: {
    width: "100%",
    marginTop: 18,
    gap: 10,
    alignItems: "center",
  },

  button: {
    width: "70%",
    backgroundColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "900",
    textAlign: "center",
  },
});