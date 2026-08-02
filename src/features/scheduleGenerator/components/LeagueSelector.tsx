// src/features/scheduleGenerator/components/LeagueSelector.tsx

import React from "react";
import { View, Text, Pressable } from "react-native";
import { leagueData } from "@/data/leagues/leagueData";

type Props = {
  selectedLeague: keyof typeof leagueData | null;
  onSelect: (league: keyof typeof leagueData) => void;
};

export function LeagueSelector({ selectedLeague, onSelect }: Props) {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={{ fontSize: 16, fontWeight: "600" }}>
        Select League
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {(Object.keys(leagueData) as (keyof typeof leagueData)[]).map(
          (league) => (
            <Pressable
              key={league}
              onPress={() => onSelect(league)}
              style={{
                padding: 10,
                backgroundColor:
                  selectedLeague === league ? "#333" : "#ddd",
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#000" }}>{league}</Text>
            </Pressable>
          )
        )}
      </View>
    </View>
  );
}