// app/(tabs)/home.tsx

import { StyleSheet, Text, View } from "react-native";

export default function HomeRoute() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SportsApp.v1</Text>
      <Text>New route architecture is working.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8,
  },
});