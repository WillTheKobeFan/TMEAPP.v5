import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
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

export default function BracketWithLines() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.screen}>

      {/* Back Button */}
      <TouchableOpacity onPress={() => router.push("/standings/Sunday")} style={styles.backButton}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      {/* Overall Title */}
      <Text style={styles.mainTitle}>Sunday AM {"\n"} Playoff Bracket</Text>

      <View style={styles.container}>

        {/* Quarterfinals */}
        <View style={styles.round}>
          <Text style={styles.roundTitle}>Quarterfinals</Text>

          <Matchup date="May 3rd" time="TBD" team1="1. TBD" team2="8. TBD" />
          <Matchup date="May 3rd" time="TBD" team1="4. TBD" team2="5. TBD" />
          <Matchup date="May 3rd" time="TBD" team1="2. TBD" team2="7. TBD" />
          <Matchup date="May 3rd" time="TBD" team1="3. TBD" team2="6. TBD" />
        </View>

        {/* Semifinals */}
        <View style={styles.round}>
          <Text style={styles.roundTitle}>Semifinals</Text>

          <Matchup date="May 10th" time="TBD" team1="Winner 1/8" team2="Winner 4/5" />
          <Matchup date="May 10th" time="TBD" team1="Winner 2/7" team2="Winner 3/6" />
        </View>

        {/* Championship */}
        <View style={styles.round}>
          <Text style={styles.roundTitle}>Championship</Text>

          <Matchup date="May 17th" time="TBD" team1="Semi Winner" team2="Semi Winner" />
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#ffffff",
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 10,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  backText: {   
    fontSize: 28, // changes arrow size 
    color: "#000",
    fontWeight: "700",
  },

  mainTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    color: "#000",
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  round: {
    alignItems: "center",
    width: 125, // slightly reduced
  },

  roundTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000",
    textAlign: "center",
  },

  matchupContainer: {
    marginBottom: 28,
    alignItems: "center",
  },

  date: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
  },

  time: {
    fontSize: 12,
    marginBottom: 5,
    color: "#000",
  },

  matchup: {
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 8,
    width: "100%",
  },

  team: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
  },
});