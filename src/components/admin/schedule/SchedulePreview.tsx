// src/components/admin/schedule/SchedulePreview.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

type Game = {
  homeTeam: string;
  awayTeam: string;
  time: string;
  court?: string;
};

type Week = {
  week: number;
  games: Game[];
};

type Props = {
  weeks: Week[];
};

export default function SchedulePreview({
  weeks,
}: Props) {
  if (!weeks.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          Generate a schedule to preview
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {weeks.map((week) => (
        <View
          key={week.week}
          style={styles.weekCard}
        >
          <Text style={styles.weekTitle}>
            Week {week.week}
          </Text>

          {week.games.map((game, i) => (
            <View
              key={i}
              style={styles.game}
            >
              <Text style={styles.team}>
                {game.homeTeam}
              </Text>

              <Text style={styles.vs}>
                vs
              </Text>

              <Text style={styles.team}>
                {game.awayTeam}
              </Text>

              <Text style={styles.meta}>
                {game.time}
                {game.court
                  ? ` • ${game.court}`
                  : ""}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },

  empty: {
    padding: 24,
    alignItems: "center",
  },

  emptyText: {
    opacity: 0.6,
  },

  weekCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#151515",
  },

  weekTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  game: {
    marginBottom: 10,
  },

  team: {
    color: "white",
    fontSize: 15,
  },

  vs: {
    color: "#999",
  },

  meta: {
    color: "#777",
    marginTop: 4,
  },
});