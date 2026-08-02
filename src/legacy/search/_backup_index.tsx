// app/(search)/search/[league].tsx

import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import SubScreenLayout from "src/components/SubScreenLayout";
import SearchTeamCard from "src/components/cards/SearchTeamCard";
import { getAllTeams } from "src/data/search/getAllTeams";
import { useTextSize } from "src/context/TextSizeContext";

function formatLeagueName(league: string) {
  return league.charAt(0).toUpperCase() + league.slice(1);
}

export default function SearchScreen() {
  const { textScale } = useTextSize();

  const [query, setQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);

  const TEAMS = getAllTeams();

  
  const results = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) return [];

    return TEAMS.filter((team) =>
      team.teamName.toLowerCase().includes(cleanQuery)
    );
  }, [query, TEAMS]);

  function handleSelect(team: any) {
    setSelectedTeam(team);
    setQuery(team.teamName);
  }

  function closeTeamCard() {
    setSelectedTeam(null);
  }

  return (
    <SubScreenLayout title="Search">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
      >
        <TextInput
          value={query}
          onChangeText={(text) => {
            setQuery(text);

            if (!text.trim()) {
              setSelectedTeam(null);
            }
          }}
          placeholder="Search team..."
          placeholderTextColor="#888"
          style={[
            styles.searchInput,
            {
              fontSize: 16 * textScale,
            },
          ]}
        />

        {!!query && !selectedTeam && (
          <View style={styles.resultsContainer}>
            {results.map((team) => (
              <TouchableOpacity
                key={team.id}
                onPress={() => handleSelect(team)}
                style={styles.resultCard}
              >
                <Text
                  style={[
                    styles.resultName,
                    {
                      fontSize: 17 * textScale,
                    },
                  ]}
                >
                  {team.teamName}
                </Text>

                <Text
                  style={[
                    styles.resultLeague,
                    {
                      fontSize: 14 * textScale,
                    },
                  ]}
                >
                  {formatLeagueName(team.league)} League
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {!!query && !selectedTeam && results.length === 0 && (
          <Text
            style={[
              styles.emptyText,
              {
                fontSize: 15 * textScale,
              },
            ]}
          >
            No teams found.
          </Text>
        )}
      </ScrollView>

      <Modal
        visible={!!selectedTeam}
        transparent
        animationType="fade"
        onRequestClose={closeTeamCard}
      >
        <Pressable style={styles.modalOverlay} onPress={closeTeamCard}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            {selectedTeam && (
              <SearchTeamCard
                team={{
                  id: selectedTeam.id,
                  captain: selectedTeam.teamName,
                  league: selectedTeam.league,
                  record: selectedTeam.record ?? "0-0",
                  place: selectedTeam.place ?? "N/A",
                  status: selectedTeam.status ?? "upcoming",
                  nextMatch: selectedTeam.nextMatch,
                  lastResult: selectedTeam.lastResult,
                  schedule: selectedTeam.schedule ?? [],
                }}
                onClose={closeTeamCard}
                onPressResults={() =>
                  router.push({
                    pathname: "/schedule/results/[league]",
                    params: {
                      league: selectedTeam.league,
                      teamId: selectedTeam.id,
                    },
                  })
                }
                onPressRoster={() =>
                  router.push({
                    pathname: "/team/[id]",
                    params: {
                      id: selectedTeam.id,
                    },
                  })
                }
                onPressStandings={() =>
                  router.push({
                    pathname: "/standings/[league]",
                    params: {
                      league: selectedTeam.league.toLowerCase(),
                    },
                  })
                }
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SubScreenLayout>
  );
}

const PURPLE = "#250f74";

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
  },

  searchInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 14,
    color: "#000",
    marginBottom: 16,
  },

  resultsContainer: {
    marginBottom: 16,
  },

  resultCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  resultName: {
    fontWeight: "700",
    color: "#111",
  },

  resultLeague: {
    color: "#555",
    marginTop: 2,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 24,
    color: "#777",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  modalCard: {
    width: "100%",
    alignItems: "center",
  },
});