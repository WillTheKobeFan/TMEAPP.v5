// app/(tabs)/league-home.tsx

// Organizations main league hub 

// app/(tabs)/league-home.tsx

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

export default function LeagueHomeScreen() {
  const { leagueSelection } = useLocalSearchParams<{
    leagueSelection?: string;
  }>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Selected League Home</Text>

        <Text style={styles.subtitle}>
          {leagueSelection ?? "No league selected"}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  title: {
    color: "#250F74",
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 12,
    color: "#575260",
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "700",
    textAlign: "center",
  },
});