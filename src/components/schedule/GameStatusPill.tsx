import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTextSize } from "src/context/TextSizeContext";

export type GameStatus = "scheduled" | "final" | "forfeit" | "cancelled";

type Props = {
  status: GameStatus;
};

const STATUS_CONFIG: Record<
  GameStatus,
  { label: string; backgroundColor: string; textColor: string }
> = {
  scheduled: {
    label: "SCHEDULED",
    backgroundColor: "#E9E9EE",
    textColor: "#34343A",
  },
  final: {
    label: "FINAL",
    backgroundColor: "#2E8B57",
    textColor: "#FFFFFF",
  },
  forfeit: {
    label: "FORFEIT",
    backgroundColor: "#F4C542",
    textColor: "#2E2A1F",
  },
  cancelled: {
    label: "CANCELLED",
    backgroundColor: "#C93A3A",
    textColor: "#FFFFFF",
  },
};

export default function GameStatusPill({ status }: Props) {
  const { textScale } = useTextSize();
  const config = STATUS_CONFIG[status];

  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: config.backgroundColor },
      ]}
    >
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[
          styles.text,
          {
            color: config.textColor,
            fontSize: 11 * textScale,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    width: 92,
    minHeight: 26,
    paddingHorizontal: 10,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "900",
    letterSpacing: 0.35,
    textAlign: "center",
  },
});
