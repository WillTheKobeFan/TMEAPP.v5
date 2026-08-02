// app/(tabs)/schedule/results/index.tsx

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import ScreenLayout from "src/components/ScreenLayout";

const leagues = [
  {
    id: "Sunday",
    label: "Sunday AM • YMCA",
  },
  {
    id: "Monday",
    label: "Monday PM • Berlin",
  },
  {
    id: "Tuesday",
    label: "Tuesday PM • YMCA",
  },
  {
    id: "Wednesday",
    label: "Wednesday PM • Berlin",
  },
];

export default function GameResults() {
  const router = useRouter();

  return (
    <ScreenLayout title="Game Results" hideBack>
      <View style={styles.wrapper}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Game Results Overview</Text>

          <Text style={styles.infoText}>
            Choose a league night to view game results.
          </Text>

          <Text style={styles.bulletText}>• Weekly Matchups</Text>
          <Text style={styles.bulletText}>• Final Scores</Text>
          <Text style={styles.bulletText}>• Forfeit Results</Text>
          <Text style={styles.bulletText}>• Playoff Results</Text>
          <Text style={styles.bulletText}>• Championship Results</Text>
        </View>

        <View style={styles.buttonGroup}>
          {leagues.map((league) => (
            <TouchableOpacity
              key={league.id}
              style={styles.button}
              onPress={() => router.push(`/schedule/results/${league.id}`)}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>{league.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
  },

  infoCard: {
    width: "70%",
    backgroundColor: "#f2efef",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  infoTitle: {
    color: "#250f74ff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },

  infoText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },

  bulletText: {
    color: "#333",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 4,
    textAlign: "center",
  },

  buttonGroup: {
    width: "70%",
    gap: 12,
  },

  button: {
    backgroundColor: "#250f74ff",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginBottom: 14,      // <-- gives consistent spacing
    flexDirection: "row",
    alignItems: "center",
  },

  buttonEmoji: {
    fontSize: 18,
    marginRight: 10,
  },

  buttonText: {
    flex: 1,
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",   // <-- centers the league name
  },

});