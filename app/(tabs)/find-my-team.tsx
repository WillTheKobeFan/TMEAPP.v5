// app/(tabs)/find-my-team.tsx

import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import SubScreenLayout from "src/components/SubScreenLayout";
import SearchTeamCard, { Team } from "src/components/cards/SearchTeamCard";
import { getAllTeams } from "src/data/search/getAllTeams";
import { useTextSize } from "src/context/TextSizeContext";

const PURPLE = "#250f74";

function normalizeText(value: string) {
  return value.toLowerCase().trim();
}

function formatLeagueName(league: string): Team["league"] {
  const lower = league.toLowerCase();

  if (lower === "sunday") return "Sunday";
  if (lower === "monday") return "Monday";
  if (lower === "tuesday") return "Tuesday";
  if (lower === "wednesday") return "Wednesday";

  return "Sunday";
}

function toSearchTeam(team: any): Team {
  const captainName = team.captain ?? team.teamName ?? "Unknown Team";

  return {
    id: team.id,
    captain: captainName,
    league: formatLeagueName(team.league),
    record: team.record ?? "0-0",
    place: team.place ?? "TBD",
    status: team.status ?? "Season info available in standings",
    nextGame: team.nextMatch ?? "Check schedule",
    lastResult: team.lastResult ?? "No recent result",
    schedule: team.schedule ?? "View schedule",
  };
}

export default function FindMyTeamScreen() {
  const { textScale } = useTextSize();

  const [query, setQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const inputSize = 16 * textScale;
  const titleSize = 20 * textScale;
  const bodySize = 15 * textScale;
  const resultTitleSize = 18 * textScale;
  const resultSubtitleSize = 14 * textScale;
  const emptySize = 17 * textScale;

  const allTeams = useMemo(() => {
    return getAllTeams().map(toSearchTeam);
  }, []);

  const searchText = normalizeText(query);

  const teamResults = useMemo(() => {
    if (!searchText) return [];

    return allTeams.filter((team) => {
      const captain = normalizeText(team.captain ?? "");
      const league = normalizeText(team.league ?? "");

      return captain.includes(searchText) || league.includes(searchText);
    });
  }, [allTeams, searchText]);

  const hasSearch = searchText.length > 0;

  return (
    <SubScreenLayout title="Find My Team">
      <View style={styles.screen}>
        <TextInput
          style={[styles.input, { fontSize: inputSize }]}
          placeholder="Search captain, team, or player name..."
          placeholderTextColor="#777"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="words"
          autoCorrect={false}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          {!hasSearch && (
            <View style={styles.infoCard}>
              <Text style={[styles.infoTitle, { fontSize: titleSize }]}>
                Find Your Team Card
              </Text>

              <Text style={[styles.infoText, { fontSize: bodySize }]}>
                Search by captain name, team name, or player name to find your
                team card.
              </Text>

              <Text style={[styles.bullet, { fontSize: bodySize }]}>
                • Tap your team result
              </Text>

              <Text style={[styles.bullet, { fontSize: bodySize }]}>
                • Open the team card
              </Text>

              <Text style={[styles.bullet, { fontSize: bodySize }]}>
                • View roster, game results, schedule, and standings
              </Text>

              <Text style={[styles.noteText, { fontSize: bodySize }]}>
                Player-name search will work once rosters are published by
                league admin.
              </Text>
            </View>
          )}

          {teamResults.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontSize: resultTitleSize }]}>
                Team Cards
              </Text>

              {teamResults.map((team) => (
                <TouchableOpacity
                  key={`${team.league}-${team.id}`}
                  style={styles.resultCard}
                  activeOpacity={0.8}
                  onPress={() => setSelectedTeam(team)}
                >
                  <Text
                    style={[styles.resultTitle, { fontSize: resultTitleSize }]}
                  >
                    {team.captain}
                  </Text>

                  <Text
                    style={[
                      styles.resultSubtitle,
                      { fontSize: resultSubtitleSize },
                    ]}
                  >
                    {team.league} League Team Card
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {hasSearch && teamResults.length === 0 && (
            <Text style={[styles.noResults, { fontSize: emptySize }]}>
              No team found. Try searching by captain name, team name, or league
              night.
            </Text>
          )}
        </ScrollView>

        {selectedTeam && (
          <SearchTeamCard
            team={selectedTeam}
            onClose={() => setSelectedTeam(null)}
          />
        )}
      </View>
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 22,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#111",
    marginBottom: 18,
  },

  container: {
    paddingBottom: 160,
  },

  infoCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
  },

  infoTitle: {
    color: PURPLE,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },

  infoText: {
    color: "#444",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 14,
  },

  bullet: {
    color: "#444",
    lineHeight: 22,
    marginBottom: 8,
  },

  noteText: {
    color: "#666",
    lineHeight: 22,
    marginTop: 8,
    fontStyle: "italic",
  },

  section: {
    marginBottom: 18,
  },

  sectionTitle: {
    color: PURPLE,
    fontWeight: "900",
    marginBottom: 10,
  },

  resultCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d6d6d6",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },

  resultTitle: {
    color: "#111",
    fontWeight: "800",
    marginBottom: 5,
  },

  resultSubtitle: {
    color: "#555",
    lineHeight: 20,
  },

  noResults: {
    textAlign: "center",
    color: "#777",
    marginTop: 28,
    lineHeight: 24,
  },
});