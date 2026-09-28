// app/(tabs)/progression.tsx

import { StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/theme";

export default function ProgressionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Progression
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },

  title: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: "700",
  },
});