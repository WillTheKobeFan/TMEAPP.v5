// app/components/BackButton.tsx
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, RelativePathString, ExternalPathString } from "expo-router";

interface BackButtonProps {
  topOffset?: number;
  to?: RelativePathString | ExternalPathString; // Optional route to navigate to
}

export default function BackButton({ topOffset = 10, to }: BackButtonProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => {
        if (to) {
          router.push(to); // Navigate to specific screen if 'to' is provided
        } else {
          router.back(); // Otherwise, go back one screen
        }
      }}
      style={[styles.backIcon, { top: topOffset }]}
    >
      <Ionicons name="arrow-back" size={28} color="black" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backIcon: {
    position: "absolute",
    left: 15,
    zIndex: 20,
  },
});