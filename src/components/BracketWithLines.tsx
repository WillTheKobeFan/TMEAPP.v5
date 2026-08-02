// app/(tabs)/playoffs/BracketWithLines.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import BackButton from "../components/BackButton"; // correct relative path

export default function BracketWithLines() {
  const NAV_BAR_HEIGHT = 70;

  return (
    <SafeAreaView style={styles.container}>
      <BackButton topOffset={10} />

      <ScrollView contentContainerStyle={[styles.contentContainer, { paddingTop: NAV_BAR_HEIGHT + 10 }]}>
        <Text style={styles.title}>Playoff Bracket</Text>

        <View style={styles.bracketContainer}>
          <Text>Bracket with lines visualization here...</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15, backgroundColor: "#fff" },
  contentContainer: { paddingBottom: 20, alignItems: "center" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 15, textAlign: "center" },
  bracketContainer: { marginTop: 20, width: "100%", alignItems: "center" },

  bracketButton: {
  marginTop: 25,
  paddingVertical: 12,
  paddingHorizontal: 20,
  backgroundColor: "#2196F3",
  borderRadius: 8,
  alignItems: "center",
},
bracketButtonText: {
  color: "white",
  fontWeight: "bold",
  fontSize: 16,
},
});

