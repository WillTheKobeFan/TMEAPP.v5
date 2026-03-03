// Code for Standings; use for ALL

import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function TuesdayStandings() {
  const router = useRouter();

  const standingsData = [
    ["#", "Team", "W", "L"],
    ["1", "ReLeaf", "0", "0"],
    ["2", "Mark", "0", "0"],
    ["3", "Gross", "0", "0"],
    ["4", "Gibson", "0", "0"],
    ["5", "Edwards", "0", "0"],
    ["6", "Will", "0", "0"],
    ["7", "Rob", "0", "0"],
    ["", "", "", ""],
    ["", "", "", ""],
  ];

  // ✅ TIEBREAKER GRID: 4 columns
  const tiebreakerData = [
    ["Week", "Result", "Team", "Pts For"],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push("/standings")}
        style={styles.backIcon}
      >
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>
          Wednesday PM {"\n"} Standings
        </Text>

        <Text style={styles.infoText}>
          (Week 1 of 10) {"\n"}{"\n"}
          Current Session Date: {"\n"}
          Start: March 4th, 2026 {"\n"}{"\n"}
          *Top 4 Make Playoffs* {"\n"}
        </Text>

        {/* ===== STANDINGS GRID ===== */}
        <View style={styles.grid}>
          {standingsData.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cell, cellIndex) => (
                <View
                  key={cellIndex}
                  style={[
                    styles.cell,
                    cellIndex === 0 && styles.rankColumn
                  ]}
                >
                  <Text
                    style={[
                      styles.cellText,
                      rowIndex === 0 && styles.headerText
                    ]}
                  >
                    {cell}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* ===== PLAYOFF BRACKET BUTTON ===== */}
        <TouchableOpacity
          style={styles.bracketButton}
          onPress={() => router.push("/playoffs/wednesday")}
        >
          <Text style={styles.bracketButtonText}>Playoff Bracket</Text>
        </TouchableOpacity>

        {/* ===== TIEBREAKER NOTICE ===== */}
        <Text style={styles.tiebreakerNotice}>
          {"\n"}  {"\n"} Total points for the session WILL determine tiebreaker teams. {"\n"}
          {"\n"} If there is a 3 or 4-way tie between teams: TOTAL points for the session WILL be tallied. {"\n"}
          {"\n"} ANY Forfeits will total 0 points for SPECIFIC tiebreaker teams.
        </Text>

        {/* ===== TIEBREAKERS SECTION ===== */}
        <Text style={styles.sectionTitle}>
          Tiebreakers
        </Text>

        {/* ===== 4-COLUMN TIEBREAKER GRID ===== */}
        <View style={styles.grid}>
          {tiebreakerData.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cell, cellIndex) => (
                <View
                  key={cellIndex}
                  style={[
                    styles.cell,
                    cellIndex === 0 && styles.weekColumn,
                    cellIndex === 3 && styles.pointsColumn,
                  ]}
                >
                  <Text
                    style={[
                      styles.cellText,
                      rowIndex === 0 && styles.headerText
                    ]}
                  >
                    {cell}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 40, 
    paddingHorizontal: 15,
    backgroundColor: "#fff" 
  },

  weekColumn: {
    flex: 0.6,
  },

  pointsColumn: {
    flex: 0.8,
  },

  tiebreakerNotice: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    marginVertical: 8,
    marginHorizontal: 15,
  },

  backIcon: { 
    position: "absolute", 
    top: 40, 
    left: 15, 
    zIndex: 20 
  },

  contentContainer: { 
    paddingTop: 70,
    paddingBottom: 20,
    alignItems: "center"
  },

  title: { 
    fontSize: 20, 
    fontWeight: "700", 
    marginBottom: 10, 
    textAlign: "center" 
  },

  infoText: { 
    fontSize: 15, 
    textAlign: "center",
    marginBottom: 15
  },

  sectionTitle: { 
    fontSize: 17,
    fontWeight: "600",
    marginTop: 60,
    marginBottom: 8,
    textAlign: "center",
  },

  grid: {
    width: "92%",
  },

  row: {
    flexDirection: "row",
  },

  cell: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    paddingHorizontal: 2,
    alignItems: "center",
  },

  rankColumn: {
    flex: 0.5,
  },

  cellText: {
    fontSize: 15,
  },

  headerText: {
    fontWeight: "bold",
  },

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













      






      
