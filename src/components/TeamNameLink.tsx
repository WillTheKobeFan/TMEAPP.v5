// src/components/TeamNameLink.tsx

import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

const PURPLE = "#250f74";

type Props = {
  name: string;
  onPress: () => void;
  small?: boolean;
  center?: boolean;
};

export default function TeamNameLink({ name, onPress, small, center }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Text
        style={[
          styles.teamName,
          small && styles.small,
          center && styles.center,
        ]}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  teamName: {
    fontSize: 15,
    fontWeight: "600",
    color: PURPLE,
  },

  small: {
    fontSize: 13,
  },

  center: {
    textAlign: "center",
  },
});