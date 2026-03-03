import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SundayStandings() {
  const router = useRouter();

  const NAV_BAR_HEIGHT = 70; // height of your floating CustomNavBar
  const STATUS_BAR_HEIGHT = 40; // adjust if needed

  const standingsData = [
    ["#", "Team", "W", "L"],
    ["1", "Timmy", "2", "0"],
    ["2", "Edwards", "2", "0"], 
    ["3", "Rich", "1", "0"],
    ["4", "TeeJ", "1", "0"],
    ["5", "Tom", "1", "1"],
    ["6", "Prince", "0", "1"], 
    ["7", "Dale", "0", "1"],
    ["8", "Dex", "0", "2"],
    ["9", "Ziller", "0", "2"],
  ];

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

   
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push("/standings")}
        style={[styles.backIcon, { top: STATUS_BAR_HEIGHT }]}
      >
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT + 10 }
        ]}
      >
        <Text style={styles.title}>
          Sunday AM.YMCA {"\n"} Standings
        </Text>

        <Text style={styles.infoText}>
          (Week 2 of 10) {"\n"}{"\n"}
          Current Session Date: {"\n"}
          Start: February 22nd, 2025 {"\n"}{"\n"}
          *Top 8 Make Playoffs* {"\n"}
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
          onPress={() => router.push("/playoffs/sunday")}
        >
          <Text style={styles.bracketButtonText}>Playoff Bracket</Text>
        </TouchableOpacity>

        <Text style={styles.tiebreakerNotice}>
        {"\n"}  {"\n"} Total points for the session WILL determine tiebreaker teams. {"\n"}
        {"\n"} {"\n"} If there is a 3 or 4-way tie between teams: TOTAL points PER TEAM for the session WILL be tallied. {"\n"}
          {"\n"} ANY Forfeits will total 0 points for SPECIFIC tiebreaker teams.
        </Text>

        {/* ===== TIEBREAKERS SECTION ===== */}
        <Text style={styles.sectionTitle}>
          Tiebreakers
        </Text>

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
            rowIndex === 0 && styles.headerText,
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
    left: 15, 
    zIndex: 20 
  },

  contentContainer: { 
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

  // ===== NEW PLAYOFF BUTTON STYLES =====
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
