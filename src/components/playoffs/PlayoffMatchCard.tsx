import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// -----------------------------
// MOCK BRACKET DATA (STRUCTURED)
// -----------------------------

const BRACKET = [
  {
    title: "QUARTERFINALS",
    matches: [
      ["(1) Team A", "(8) Team H"],
      ["(4) Team D", "(5) Team E"],
      ["(3) Team C", "(6) Team F"],
      ["(2) Team B", "(7) Team G"],
    ],
  },
  {
    title: "SEMIFINALS",
    matches: [
      ["Winner QF1", "Winner QF2"],
      ["Winner QF3", "Winner QF4"],
    ],
  },
  {
    title: "CHAMPIONSHIP",
    matches: [["Winner SF1", "Winner SF2"]],
  },
];

// -----------------------------
// MATCH CARD (BRACKET STYLE)
// -----------------------------

const MatchCard = ({ teamA, teamB }: { teamA: string; teamB: string }) => {
  return (
    <View className="w-64 border border-black rounded-xl p-3 bg-white mb-10">

      <View className="flex-row justify-between">
        <Text>{teamA}</Text>
      </View>

      <View className="my-2 border-t border-black/10" />

      <View className="flex-row justify-between">
        <Text>{teamB}</Text>
      </View>

    </View>
  );
};

// -----------------------------
// SCREEN
// -----------------------------

export default function PlayoffBracketScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">

      {/* HEADER */}
      <View className="pt-14 pb-4 items-center">
        <Text className="text-sm border border-black px-4 py-2 rounded-xl">
          Playoff seeds are not reseeded
        </Text>
      </View>

      {/* BRACKET */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row px-6">

          {BRACKET.map((round, roundIndex) => (
            <View key={round.title} className="mr-12 items-center">

              {/* Round Title */}
              <Text className="font-bold mb-6 tracking-widest">
                {round.title}
              </Text>

              {/* Matches */}
              <View className="justify-center">
                {round.matches.map((m, i) => (
                  <MatchCard key={i} teamA={m[0]} teamB={m[1]} />
                ))}
              </View>

            </View>
          ))}

        </View>
      </ScrollView>

    </SafeAreaView>
  );
}