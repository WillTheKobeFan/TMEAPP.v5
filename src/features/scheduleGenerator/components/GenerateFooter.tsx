// src/features/scheduleGenerator/components/GenerateFooter.tsx

import React from "react";
import { View, Pressable, Text } from "react-native";

type Props = {
  onGenerate: () => void;
  loading: boolean;
  disabled: boolean;
};

export function GenerateFooter({
  onGenerate,
  loading,
  disabled,
}: Props) {
  return (
    <View style={{ marginTop: 20 }}>
      <Pressable
        onPress={onGenerate}
        disabled={disabled || loading}
        style={{
          padding: 14,
          backgroundColor: disabled ? "#999" : "#111",
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>
          {loading ? "Generating..." : "Generate Schedule"}
        </Text>
      </Pressable>
    </View>
  );
}