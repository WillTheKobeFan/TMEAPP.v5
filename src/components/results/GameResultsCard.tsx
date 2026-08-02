import React from "react";
import { View, Text } from "react-native";

type Props = {
  index: number;
  leagueKey: string;
  week: number;
  totalWeeks: number;

  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
};

export default function GameResultCard({
  index,
  week,
  totalWeeks,
  teamA,
  teamB,
  scoreA,
  scoreB,
}: Props) {
  const aWon = scoreA > scoreB;

  const winner = aWon ? teamA : teamB;
  const loser = aWon ? teamB : teamA;
  const wScore = aWon ? scoreA : scoreB;
  const lScore = aWon ? scoreB : scoreA;

  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={{ fontSize: 12, opacity: 0.6 }}>
        Week {week} of {totalWeeks}
      </Text>

      <Text style={{ fontSize: 14 }}>
        Game {index}: {winner} {wScore} def. {loser} {lScore}
      </Text>
    </View>
  );
}