// src/features/scheduleGenerator/components/TeamPoolCard.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function TeamPoolCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Team Pool</Text>

      <Text style={styles.subtitle}>
        Selected league teams will appear here
      </Text>

      <Text style={styles.empty}>
        (No teams loaded yet)
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
    marginBottom: 10,
  },

  empty: {
    color: "#999",
    fontStyle: "italic",
  },
});