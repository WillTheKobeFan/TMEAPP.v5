// src/components/cards/ScheduleCard.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { ScheduleCardConfig } from "@/types/cards";
import { useTextSize } from "src/context/TextSizeContext";

type Props = {
  config: ScheduleCardConfig;
};

export default function ScheduleCard({ config }: Props) {
  const { textScale } = useTextSize();

  return (
    <View style={styles.card}>
      <Text
        style={[
          styles.title,
          {
            fontSize: 16 * textScale,
          },
        ]}
      >
        {config.awayTeam} vs {config.homeTeam}
      </Text>

      <Text
        style={[
          styles.text,
          {
            fontSize: 15 * textScale,
          },
        ]}
      >
        {config.date} @ {config.time}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 12,
  },

  title: {
    fontWeight: "800",
    fontSize: 16,
  },

  text: {
    marginTop: 6,
    fontSize: 15,
    color: "#222",
  },
});