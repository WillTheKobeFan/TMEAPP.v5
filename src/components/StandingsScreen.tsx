// app/components/StandingsScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { getStandings, updateTeamStanding } from "./services/firebase/firebaseHelpers";

type StandingsScreenProps = {
  day: string; // "monday", "tuesday", etc.
};

export default function StandingsScreen({ day }: StandingsScreenProps) {
  const [standings, setStandingsState] = useState<any[]>([]);

  const loadStandings = async () => {
    const data = await getStandings(day);
    const sorted = Object.entries(data)
      .map(([team, stats]: any) => ({ name: team, ...stats }))
      .sort((a, b) => b.wins - a.wins); // sort by wins
    setStandingsState(sorted);
  };

  useEffect(() => {
    loadStandings();
  }, []);

  const handleIncrementWin = async (team: string) => {
    const teamData = standings.find((t) => t.name === team);
    if (!teamData) return;
    await updateTeamStanding(day, team, { wins: teamData.wins + 1 });
    loadStandings();
  };

  const handleIncrementLoss = async (team: string) => {
    const teamData = standings.find((t) => t.name === team);
    if (!teamData) return;
    await updateTeamStanding(day, team, { losses: teamData.losses + 1 });
    loadStandings();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={{ width: 50 }}>#</Text>
        <Text style={{ width: 150 }}>Team</Text>
        <Text style={{ width: 50 }}>W</Text>
        <Text style={{ width: 50 }}>L</Text>
        <Text style={{ width: 100 }}>Actions</Text>
      </View>

      {standings.map((team, index) => (
        <View key={team.name} style={styles.row}>
          <Text style={{ width: 50 }}>{index + 1}</Text>
          <Text style={{ width: 150 }}>{team.name}</Text>
          <Text style={{ width: 50 }}>{team.wins}</Text>
          <Text style={{ width: 50 }}>{team.losses}</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity onPress={() => handleIncrementWin(team.name)}>
              <Text style={{ color: "blue" }}>+W</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleIncrementLoss(team.name)}>
              <Text style={{ color: "red" }}>+L</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  headerRow: { flexDirection: "row", marginBottom: 10, fontWeight: "bold" },
  row: { flexDirection: "row", marginVertical: 4, alignItems: "center" },
});