import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTextSize } from "src/context/TextSizeContext";

export type SeasonPhase = "regular" | "playoffs";

type Props = {
  phase: SeasonPhase;
  week: number;
  totalWeeks?: number;
  date: string;
  playoffRound?: "Quarter-Finals" | "Semi-Finals" | "Championship";
};

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function SeasonStatusPill({
  phase,
  week,
  totalWeeks = 10,
  date,
  playoffRound,
}: Props) {
  const { textScale } = useTextSize();

  const phaseText =
    phase === "playoffs"
      ? playoffRound
        ? `Playoffs • ${playoffRound}`
        : "Playoffs"
      : `Regular Season • Week ${week} of ${totalWeeks}`;

  return (
    <View style={styles.pill}>
      <Text
        style={[styles.phaseText, { fontSize: 15 * textScale }]}
        numberOfLines={2}
        adjustsFontSizeToFit
      >
        {phaseText}
      </Text>

      <Text style={[styles.dateText, { fontSize: 13 * textScale }]}> 
        {formatDate(date)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "center",
    maxWidth: "94%",
    minWidth: "72%",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
    elevation: 4,
  },
  phaseText: {
    color: "#250F74",
    fontWeight: "900",
    textAlign: "center",
  },
  dateText: {
    marginTop: 2,
    color: "#5F5F66",
    fontWeight: "700",
    textAlign: "center",
  },
});
