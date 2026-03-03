import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import BackButton from "../components/BackButton"; 
import { useRouter } from "expo-router";

type MatchupProps = {
  date?: string;
  time?: string;
  team1: string;
  team2: string;
};

const Matchup = ({ date, time, team1, team2 }: MatchupProps) => (
  <View style={styles.matchupContainer}>
    {date && <Text style={styles.date}>{date}</Text>}
    {time && <Text style={styles.time}>{time}</Text>}
    <View style={styles.matchup}>
      <Text style={styles.team}>{team1}</Text>
      <Text style={styles.team}>{team2}</Text>
    </View>
  </View>
);

export default function Monday4Bracket() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      {/* Back Button */}
      {/* Back Button */}
            <TouchableOpacity onPress={() => router.push("/standings/Monday")} style={styles.backButton}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>

      {/* Title */}
      <Text style={styles.mainTitle}>Monday PM {"\n"} Playoff Bracket</Text>

      <View style={styles.container}>
        {/* Semifinals */}
        <View style={styles.round}>
          <Text style={styles.roundTitle}>Semifinals</Text>
          <Matchup date="March 16th" time="TBD" team1="1. Justin" team2="4. TBD" />
          <Matchup date="March 16th" time="TBD" team1="2. TBD" team2="3. TBD" />
        </View>

        {/* Championship */}
        <View style={styles.round}>
          <Text style={styles.roundTitle}>Championship</Text>
          <Matchup date="March 16th" time="TBD" team1="Semi Winner" team2="Semi Winner" />
        </View>
      </View>
    </ScrollView>
  );
}

// Styles remain the same
const styles = StyleSheet.create({
  screen: { backgroundColor: "#fff", paddingTop: 20, paddingBottom: 30, paddingHorizontal: 10 },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backText: {
    fontSize: 28,
    color: "#000",
    fontWeight: "700",
  },
  mainTitle: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 25 },
  container: { flexDirection: "row", justifyContent: "space-evenly" },
  round: { alignItems: "center", width: 125 },
  roundTitle: { fontSize: 17, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  matchupContainer: { marginBottom: 28, alignItems: "center" },
  date: { fontSize: 12, fontWeight: "600" },
  time: { fontSize: 12, marginBottom: 5 },
  matchup: { backgroundColor: "#f2f2f2", paddingVertical: 10, paddingHorizontal: 6, borderRadius: 8, width: "100%" },
  team: { fontSize: 14, fontWeight: "500", textAlign: "center" },
});