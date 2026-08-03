// app/(tabs)/player-hub.tsx

import React from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import SubScreenLayout from "src/components/SubScreenLayout";
import { useTextSize } from "src/context/TextSizeContext";

const PURPLE = "#250f74";

const hubItems = [
  {
    title: "Find My Team",
    subtitle: "Search by team name or captain name to open a team card.",
    route: "/find-my-team",
  },
  {
    title: "Rosters",
    subtitle: "View roster info when rosters are published by league admin.",
    route: "/find-my-team",
  },
  {
    title: "League Info",
    subtitle: "View league-specific details for Sunday, Monday, Tuesday, or Wednesday.",
    route: "/league-info",
  },
  {
    title: "Schedule",
    subtitle: "View game dates, times, matchups, and bye weeks.",
    route: "/schedule",
  },
  {
    title: "Game Results",
    subtitle: "View scores, winners, and completed games.",
    route: "/schedule/results",
  },
  {
    title: "Standings",
    subtitle: "View records, rankings, playoff position, and season picture.",
    route: "/standings",
  },
  {
    title: "FAQ",
    subtitle: "Get answers about rules, registration, playoffs, rosters, and updates.",
    route: "/faq",
  },
];

export default function PlayerHubScreen() {
  const { textScale } = useTextSize();

  const titleSize = 20 * textScale;
  const subtitleSize = 14 * textScale;
  const headerTitleSize = 22 * textScale;
  const headerTextSize = 15 * textScale;

  return (
    <SubScreenLayout title="Player Hub">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.infoCard}>
          <Text style={[styles.infoTitle, { fontSize: headerTitleSize }]}>
            Find What You Need
          </Text>

          <Text style={[styles.infoText, { fontSize: headerTextSize }]}>
            Quick links for teams, rosters, schedules, standings, league info,
            game results, and common questions.
          </Text>
        </View>

        {hubItems.map((item) => (
          <TouchableOpacity
            key={item.title}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push(item.route as any)}
          >
            <Text style={[styles.cardTitle, { fontSize: titleSize }]}>
              {item.title}
            </Text>

            <Text style={[styles.cardSubtitle, { fontSize: subtitleSize }]}>
              {item.subtitle}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 160,
  },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  infoTitle: {
    color: PURPLE,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },

  infoText: {
    color: "#444",
    textAlign: "center",
    lineHeight: 22,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  cardTitle: {
    color: PURPLE,
    fontWeight: "900",
    marginBottom: 6,
  },

  cardSubtitle: {
    color: "#444",
    lineHeight: 21,
  },
});