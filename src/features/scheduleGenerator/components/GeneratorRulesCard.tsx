// src/features/scheduleGenerator/components/GeneratorRulesCard.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function GeneratorRulesCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Generator Rules</Text>

      <Text style={styles.subtitle}>
        Constraints and scheduling rules will appear here
      </Text>

      <View style={styles.ruleBox}>
        <Text style={styles.rule}>
          • Hard constraints (no conflicts, no duplicate matchups)
        </Text>

        <Text style={styles.rule}>
          • Soft constraints (fair rotation, spacing, balance)
        </Text>

        <Text style={styles.rule}>
          • League-specific rules (week restrictions, time slots)
        </Text>
      </View>

      <Text style={styles.empty}>
        (Rules UI not wired yet)
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

  ruleBox: {
    marginBottom: 10,
  },

  rule: {
    color: "#333",
    marginBottom: 6,
  },

  empty: {
    color: "#999",
    fontStyle: "italic",
  },
});