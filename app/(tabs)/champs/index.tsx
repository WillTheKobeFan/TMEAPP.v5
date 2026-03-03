// ** index.tsx 4 button screen; copy for Standings, Champs, Updates index's 

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, Stack } from "expo-router";

export default function Standings() {
  const router = useRouter();

  return (
    <>
      {/* Navigation header */}
      <Stack.Screen
        options={{
          title: "Standings",
          headerStyle: { backgroundColor: "#000000ff" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
        }}
      />

      <View style={styles.container}>
        {/* Screen header inside the view */}
        <Text style={styles.screenHeader}>Champs</Text>

        {/* Buttons centered below header */}
        <View style={styles.buttonsWrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.push("/champs/Sunday")
            }
          >
            <Text style={styles.buttonText}>Sunday AM.YMCA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.push("/champs/Monday")
            }
          >
            <Text style={styles.buttonText}>Monday PM.Berlin</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.push("/champs/Tuesday")
            }
          >
            <Text style={styles.buttonText}>Tuesday PM.YMCA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.push("/champs/Wednesday")
            }
          >
            <Text style={styles.buttonText}>Wednesday PM.Berlin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  screenHeader: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#250f74ff",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  buttonsWrapper: {
    flex: 1,
    justifyContent: "center", // keeps buttons in middle of remaining space
    alignItems: "center",
  },
  button: {
    backgroundColor: "#250f74ff",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 15,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});



