// app/(tabs)/updates/index.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ScreenLayout from "src/components/ScreenLayout";
import LeagueNightButtons from "src/components/navigation/LeagueNightButtons";

export default function Updates() {
  return (
    <ScreenLayout title="Updates" hideBack>
      <View style={styles.wrapper}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Updates Overview</Text>

          <Text style={styles.infoText}>
            Choose a league night to view current updates.
          </Text>

          <Text style={styles.bulletText}>• League Announcements</Text>
          <Text style={styles.bulletText}>• Schedule Changes</Text>
          <Text style={styles.bulletText}>• Gym Changes</Text>
          <Text style={styles.bulletText}>• Playoff Updates</Text>
          <Text style={styles.bulletText}>• Championship News</Text>
        </View>

        <LeagueNightButtons baseRoute="/updates" />
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
    marginBottom: 30,
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
});