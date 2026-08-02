// src/features/scheduleGenerator/components/GameResultModal.ts

import React, { useState } from "react";

import {
  View,
  Text,
  Pressable,
  Modal,
} from "react-native";

import type { GameResult } from "@/types/gameResults";

import { saveGameResult } from "@/lib/games/saveGameResult";

type Props = {
  visible: boolean;

  game: GameResult | null;

  league: string;

  onClose: () => void;
};

export function GameResultModal({
  visible,
  game,
  league,
  onClose,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  if (!game) return null;

  const handleSelectWinner = async (
    winner: string
  ) => {
    setLoading(true);

    await saveGameResult(league, {
      ...game,
      winner,
      playedAt: new Date().toISOString(),
    });

    setLoading(false);

    onClose();
  };

  return (
    <Modal visible={visible} transparent>
      <View
        style={{
          flex: 1,
          justifyContent:
            "center",
          backgroundColor:
            "rgba(0,0,0,0.5)",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor:
              "white",
            padding: 20,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              marginBottom: 10,
            }}
          >
            Select Winner
          </Text>

          <Pressable
            onPress={() =>
              handleSelectWinner(
                game.team1
              )
            }
            style={{
              padding: 12,
              backgroundColor:
                "#eee",
              marginBottom: 10,
              borderRadius: 8,
            }}
          >
            <Text>
              {game.team1}
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              handleSelectWinner(
                game.team2
              )
            }
            style={{
              padding: 12,
              backgroundColor:
                "#eee",
              borderRadius: 8,
            }}
          >
            <Text>
              {game.team2}
            </Text>
          </Pressable>

          <Pressable
            onPress={onClose}
            style={{
              marginTop: 12,
            }}
          >
            <Text
              style={{
                textAlign:
                  "center",
                color: "red",
              }}
            >
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}