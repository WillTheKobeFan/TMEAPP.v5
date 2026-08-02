// src/components/cards/GameResultsCard.tsx

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

type Props = {
  index: number;

  leagueKey: string;
  week: number;
  totalWeeks: number;

  teamA: string;
  teamB: string;

  scoreA: number;
  scoreB: number;

  onTeamPress?: (teamName: string) => void;
};

export default function GameResultsCard({
  index,
  week,
  totalWeeks,
  teamA,
  teamB,
  scoreA,
  scoreB,
  onTeamPress,
}: Props) {
  const teamAWon = scoreA > scoreB;

  const winner = teamAWon ? teamA : teamB;
  const loser = teamAWon ? teamB : teamA;

  const winnerScore = teamAWon ? scoreA : scoreB;
  const loserScore = teamAWon ? scoreB : scoreA;

  return (
    <View
      style={{
        backgroundColor: "#f3f3f3",
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          color: "#666",
          marginBottom: 4,
        }}
      >
        Week {week} of {totalWeeks}
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: "#000",
          }}
        >
          Game {index}:{" "}
        </Text>

        <TouchableOpacity
          onPress={() => onTeamPress?.(winner)}
          activeOpacity={0.7}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: "#250f74",
            }}
          >
            {winner}
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: "#000",
          }}
        >
          {" "}
          {winnerScore} def.{" "}
        </Text>

        <TouchableOpacity
          onPress={() => onTeamPress?.(loser)}
          activeOpacity={0.7}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: "#250f74",
            }}
          >
            {loser}
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: "#000",
          }}
        >
          {" "}
          {loserScore}
        </Text>
      </View>
    </View>
  );
}