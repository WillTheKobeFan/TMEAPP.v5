// src/features/scheduleGenerator/components/SchedulePreview.tsx

import React from "react";

import {
  View,
  Text,
  ScrollView,
  Pressable,
} from "react-native";

import type {
  GameResult,
} from "@/types/gameResults";

type Props = {
  games: GameResult[];

  onGamePress: (
    game: GameResult
  ) => void;
};

export function SchedulePreview({
  games,
  onGamePress,
}: Props) {
  const grouped =
    games.reduce<
      Record<
        number,
        GameResult[]
      >
    >(
      (
        acc,
        game
      ) => {
        if (
          !acc[
          game.week
          ]
        ) {
          acc[
            game.week
          ] = [];
        }

        acc[
          game.week
        ].push(
          game
        );

        return acc;
      },

      {}
    );

  return (
    <ScrollView>
      {Object.entries(
        grouped
      ).map(
        (
          [
            week,
            weekGames,
          ]
        ) => (
          <View
            key={week}
            style={{
              marginTop: 24,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight:
                  "700",
                marginBottom: 10,
              }}
            >
              Week {week}
            </Text>

            {weekGames.map(
              (
                game
              ) => (
                <Pressable
                  key={
                    game.id
                  }
                  onPress={() =>
                    onGamePress(
                      game
                    )
                  }
                  style={{
                    padding: 14,

                    borderRadius:
                      12,

                    marginBottom:
                      10,

                    backgroundColor:
                      game.winner
                        ? "#E9F8ED"
                        : "#F3F3F3",
                  }}
                >
                  <Text
                    style={{
                      fontWeight:
                        "700",
                    }}
                  >
                    {game.team1} (
                    {game.team1Name})
                  </Text>

                  <Text>
                    vs
                  </Text>

                  <Text
                    style={{
                      fontWeight:
                        "700",
                    }}
                  >
                    {game.team2} (
                    {game.team2Name})
                  </Text>

                  {!!game.winner && (
                    <Text
                      style={{
                        marginTop: 8,
                      }}
                    >
                      Winner:
                      {" "}
                      {
                        game.winner
                      }
                    </Text>
                  )}
                </Pressable>
              )
            )}
          </View>
        )
      )}
    </ScrollView>
  );
}