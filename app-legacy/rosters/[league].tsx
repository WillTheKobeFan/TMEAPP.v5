import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import SubScreenLayout from "src/components/SubScreenLayout";

const THEME = "#250f74";

type LeagueKey = "sunday" | "monday" | "tuesday" | "wednesday";

type Player = {
  id: string;
  name: string;
  captain?: boolean;
};

type TeamRoster = {
  id: string;
  teamName: string;
  captain: string;
  players: Player[];
};

const LEAGUES: { key: LeagueKey; label: string }[] = [
  { key: "sunday", label: "Sunday League" },
  { key: "monday", label: "Monday League" },
  { key: "tuesday", label: "Tuesday League" },
  { key: "wednesday", label: "Wednesday League" },
];

const rosterData: Record<LeagueKey, TeamRoster[]> = {
  sunday: [
    {
      id: "sun_tA",
      teamName: "Ziller",
      captain: "Ziller",
      players: [
        { id: "sun_tA_p1", name: "Ziller", captain: true },
        { id: "sun_tA_p2", name: "Player Name" },
        { id: "sun_tA_p3", name: "Player Name" },
      ],
    },
    {
      id: "sun_tB",
      teamName: "Tom",
      captain: "Tom",
      players: [
        { id: "sun_tB_p1", name: "Tom", captain: true },
        { id: "sun_tB_p2", name: "Player Name" },
        { id: "sun_tB_p3", name: "Player Name" },
      ],
    },
    {
      id: "sun_tC",
      teamName: "Edwards",
      captain: "Edwards",
      players: [
        { id: "sun_tC_p1", name: "Edwards", captain: true },
        { id: "sun_tC_p2", name: "Player Name" },
      ],
    },
    {
      id: "sun_tE",
      teamName: "Timmy",
      captain: "Timmy",
      players: [
        { id: "sun_tE_p1", name: "Timmy", captain: true },
        { id: "sun_tE_p2", name: "Player Name" },
      ],
    },
  ],

  monday: [
    {
      id: "mon_tA",
      teamName: "Trifecta",
      captain: "Trifecta",
      players: [
        { id: "mon_tA_p1", name: "Trifecta", captain: true },
        { id: "mon_tA_p2", name: "Player Name" },
      ],
    },
    {
      id: "mon_tB",
      teamName: "Beans",
      captain: "Beans",
      players: [
        { id: "mon_tB_p1", name: "Beans", captain: true },
        { id: "mon_tB_p2", name: "Player Name" },
      ],
    },
  ],

  tuesday: [],

  wednesday: [
    {
      id: "wed_tA",
      teamName: "Duffy",
      captain: "Duffy",
      players: [
        { id: "wed_tA_p1", name: "Duffy", captain: true },
        { id: "wed_tA_p2", name: "Player Name" },
      ],
    },
    {
      id: "wed_tC",
      teamName: "Tom",
      captain: "Tom",
      players: [
        { id: "wed_tC_p1", name: "Tom", captain: true },
        { id: "wed_tC_p2", name: "Player Name" },
      ],
    },
  ],
};

export default function LeagueRosterScreen() {
  const params = useLocalSearchParams<{ league?: string }>();

  const initialLeague: LeagueKey =
    params.league === "monday" ||
    params.league === "tuesday" ||
    params.league === "wednesday" ||
    params.league === "sunday"
      ? params.league
      : "sunday";

  const [selectedLeague, setSelectedLeague] =
    useState<LeagueKey>(initialLeague);

  const [leagueDropdownOpen, setLeagueDropdownOpen] = useState(false);
  const [openTeams, setOpenTeams] = useState<Record<string, boolean>>({});

  const teams = rosterData[selectedLeague];

  const selectedLeagueLabel =
    LEAGUES.find((league) => league.key === selectedLeague)?.label ??
    "Sunday League";

  const changeLeague = (league: LeagueKey) => {
    setSelectedLeague(league);
    setLeagueDropdownOpen(false);
    setOpenTeams({});
    router.setParams({ league });
  };

  const toggleTeam = (teamId: string) => {
    setOpenTeams((prev) => ({
      ...prev,
      [teamId]: !prev[teamId],
    }));
  };

  return (
    <SubScreenLayout title="Current Full Rosters">
      <View style={styles.dropdownCard}>
        <Text style={styles.label}>League</Text>

        <TouchableOpacity
          style={styles.dropdownButton}
          activeOpacity={0.8}
          onPress={() => setLeagueDropdownOpen((prev) => !prev)}
        >
          <Text style={styles.dropdownText}>{selectedLeagueLabel}</Text>

          <FontAwesome6
            name={leagueDropdownOpen ? "chevron-up" : "chevron-down"}
            size={14}
            color={THEME}
          />
        </TouchableOpacity>

        {leagueDropdownOpen && (
          <View style={styles.dropdownMenu}>
            {LEAGUES.map((league) => (
              <TouchableOpacity
                key={league.key}
                style={styles.dropdownItem}
                activeOpacity={0.8}
                onPress={() => changeLeague(league.key)}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedLeague === league.key && styles.selectedDropdownText,
                  ]}
                >
                  {league.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>{selectedLeagueLabel}</Text>
      <Text style={styles.sectionSubtitle}>Team rosters for the current session</Text>

      {teams.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No roster available</Text>
          <Text style={styles.emptyText}>
            This league is currently inactive or does not have a roster posted yet.
          </Text>
        </View>
      ) : (
        teams.map((team) => {
          const isOpen = openTeams[team.id];

          return (
            <View key={team.id} style={styles.teamCard}>
              <TouchableOpacity
                style={styles.teamHeader}
                activeOpacity={0.8}
                onPress={() => toggleTeam(team.id)}
              >
                <View style={styles.teamHeaderText}>
                  <Text style={styles.teamName}>{team.teamName}</Text>
                  <Text style={styles.captainText}>Captain: {team.captain}</Text>
                </View>

                <FontAwesome6
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={15}
                  color={THEME}
                />
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.playersBox}>
                  {team.players.map((player) => (
                    <View key={player.id} style={styles.playerRow}>
                      <Text style={styles.playerName}>{player.name}</Text>

                      {player.captain && (
                        <View style={styles.captainBadge}>
                          <Text style={styles.captainBadgeText}>C</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })
      )}
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  dropdownCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e3dcff",
  },
  label: {
    color: THEME,
    fontWeight: "900",
    marginBottom: 8,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#d8cef8",
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    color: "#24184f",
    fontWeight: "800",
  },
  dropdownMenu: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#e3dcff",
    borderRadius: 14,
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 13,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee9ff",
  },
  dropdownItemText: {
    color: "#2c2450",
    fontWeight: "700",
  },
  selectedDropdownText: {
    color: THEME,
    fontWeight: "900",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: THEME,
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: "#6d6685",
    fontWeight: "600",
    marginBottom: 14,
  },
  teamCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e3dcff",
  },
  teamHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  teamHeaderText: {
    flex: 1,
    paddingRight: 12,
  },
  teamName: {
    fontSize: 19,
    fontWeight: "900",
    color: THEME,
  },
  captainText: {
    marginTop: 4,
    color: "#625b7c",
    fontWeight: "700",
  },
  playersBox: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee9ff",
  },
  playerRow: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f2efff",
  },
  playerName: {
    color: "#24184f",
    fontWeight: "800",
    fontSize: 15,
  },
  captainBadge: {
    backgroundColor: THEME,
    borderRadius: 999,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  captainBadgeText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 12,
  },
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e3dcff",
  },
  emptyTitle: {
    color: THEME,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6,
  },
  emptyText: {
    color: "#625b7c",
    fontWeight: "600",
    lineHeight: 21,
  },
});