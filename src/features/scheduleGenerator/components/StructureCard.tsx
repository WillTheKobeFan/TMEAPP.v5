// src/features/scheduleGenerator/components/StructureCard.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function StructureCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Schedule Structure</Text>

      <Text style={styles.subtitle}>
        Defines how the league schedule is organized
      </Text>

      <View style={styles.box}>
        <Text style={styles.item}>• Weeks / Rounds structure</Text>
        <Text style={styles.item}>• Game slots per week</Text>
        <Text style={styles.item}>• Team rotation logic</Text>
        <Text style={styles.item}>• Home / away balancing</Text>
      </View>

      <Text style={styles.empty}>
        (Structure configuration not connected yet)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F6F6F6",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },

  subtitle: {
    color: "#666",
    marginBottom: 12,
  },

  box: {
    marginBottom: 10,
  },

  item: {
    color: "#333",
    marginBottom: 6,
  },

  empty: {
    color: "#999",
    fontStyle: "italic",
  },
});