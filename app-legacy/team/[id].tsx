// app/team/[id].tsx

import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { teamsMap } from "src/data/leagues/teamMap";
import type { RawTeam } from "src/data/leagues/teamMap";
import type {
  LeagueKey,
  TeamSnapshot,
} from "src/types/team";

import TeamSnapshotCard from "src/components/cards/TeamSnapshotCard";

function normalizeLeague(
  league: string
): LeagueKey {
  if (
    league === "Sunday" ||
    league === "Monday" ||
    league === "Wednesday"
  ) {
    return league;
  }

  if (league.toLowerCase() === "sunday") {
    return "Sunday";
  }

  if (league.toLowerCase() === "monday") {
    return "Monday";
  }

  if (league.toLowerCase() === "wednesday") {
    return "Wednesday";
  }

  return "Sunday";
}

function toTeamSnapshot(
  team: RawTeam
): TeamSnapshot {
  return {
    id: team.id,
    name: team.teamName,
    league: normalizeLeague(team.league),
    place: 0,
    record: {
      wins: 0,
      losses: 0,
    },
    status: "upcoming",
    nextMatch: null,
    lastResult: null,
    schedule: [],
  };
}

export default function TeamScreen() {
  const { id } =
    useLocalSearchParams<{ id: string }>();

  const rawTeam = useMemo(() => {
    const allTeams =
      Object.values(teamsMap).flat();

    return allTeams.find(
      (team) => team.id === id
    );
  }, [id]);

  const team = useMemo(() => {
    if (!rawTeam) {
      return null;
    }

    return toTeamSnapshot(rawTeam);
  }, [rawTeam]);

  if (!team) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Team not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TeamSnapshotCard team={team} />
    </View>
  );
}