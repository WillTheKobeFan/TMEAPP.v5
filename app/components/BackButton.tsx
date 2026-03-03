// app/components/BackButton.tsx
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface BackButtonProps {
  topOffset?: number; // optional top offset for nav bar
}

export default function BackButton({ topOffset = 10 }: BackButtonProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.back()} // goes back exactly 1 screen
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





