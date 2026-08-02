// src/features/scheduleGenerator/components/ValidationPreview.tsx

import React from "react";
import { View, Text } from "react-native";

type Props = {
  totalGames: number;

  totalWeeks: number;

  totalTeams: number;
};

export function ValidationPreview({
  totalGames,
  totalWeeks,
  totalTeams,
}: Props) {
  return (
    <View
      style={{
        marginTop: 20,
      }}
    >
      <Text>
        Teams:
        {" "}
        {totalTeams}
      </Text>

      <Text>
        Games:
        {" "}
        {totalGames}
      </Text>

      <Text>
        Weeks:
        {" "}
        {totalWeeks}
      </Text>
    </View>
  );
}