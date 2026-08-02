// src/components/PlayoffBanner.tsx

import React from "react";
import { View, Text } from "react-native";

type Props = {
  round: "quarterfinal" | "semifinal";
};

export default function PlayoffBanner({ round }: Props) {
  const title =
    round === "quarterfinal"
      ? "🏆 Quarter-Finals"
      : "🏆 Semi-Finals";

  return (
    <View
      style={{
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: "#fafafa",
      }}
    >
      <Text style={{ fontWeight: "800", fontSize: 14, marginBottom: 6 }}>
        {title}
      </Text>

      <Text style={{ fontSize: 13, color: "#444", lineHeight: 18 }}>
        Bracket Structure:
      </Text>

      <Text style={{ fontSize: 13, color: "#444", marginTop: 4 }}>
        • Winner (1 vs 8) → plays Winner (4 vs 5)
      </Text>

      <Text style={{ fontSize: 13, color: "#444" }}>
        • Winner (2 vs 7) → plays Winner (3 vs 6)
      </Text>
    </View>
  );
}