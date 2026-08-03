// app/(tabs)/schedule/[league].tsx

import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

import SubScreenLayout from "@/components/SubScreenLayout";
import GameCard from "@/components/cards/GameCard";
import { db } from "@/lib/firebase";

type LeagueKey = "sun" | "mon" | "tue" | "wed";

type FirestoreGame = {
  id: string;
  time?: string;
  team1Id?: string;
  team2Id?: string;
  team1?: string;
  team2?: string;
  team1Score?: number | null;
  team2Score?: number | null;
  winner?: string | null;
  status?: string;
  type?: string;
  resultType?: string | null;
};

type WeekDoc = {
  id: string;
  week: number;
  date: string;
  games: FirestoreGame[];
  bye?: string[];
  byes?: string[];
  venue?: string;
  location?: string;
  announcements?: any[];
};

const LEAGUES: Record<
  LeagueKey,
  {
    firebaseLeague: string;
    title: string;
    active: boolean;
    seasonId: string;
    defaultLocation: string;
    totalWeeks: number;
    weekLocationOverrides?: Record<number, string>;
  }
> = {
  sun: {
    firebaseLeague: "sunday",
    title: "Sunday League",
    active: true,
    seasonId: "spring2026",
    defaultLocation: "YMCA",
    totalWeeks: 10,
  },
  mon: {
    firebaseLeague: "monday",
    title: "Monday League",
    active: true,
    seasonId: "spring2026",
    defaultLocation: "Berlin",
    totalWeeks: 10,
    weekLocationOverrides: {
      1: "YMCA",
    },
  },
  tue: {
    firebaseLeague: "tuesday",
    title: "Tuesday League",
    active: false,
    seasonId: "spring2026",
    defaultLocation: "YMCA",
    totalWeeks: 10,
  },
  wed: {
    firebaseLeague: "wednesday",
    title: "Wednesday League",
    active: true,
    seasonId: "spring2026",
    defaultLocation: "Berlin",
    totalWeeks: 10,
  },
};

function normalizeLeagueKey(value?: string): LeagueKey {
  const clean = (value || "sun").toLowerCase();

  if (clean === "sunday" || clean === "sun") return "sun";
  if (clean === "monday" || clean === "mon") return "mon";
  if (clean === "tuesday" || clean === "tue") return "tue";
  if (clean === "wednesday" || clean === "wed") return "wed";

  return "sun";
}

function getTeamName(game: FirestoreGame, side: "team1" | "team2") {
  if (side === "team1") return game.team1 ?? game.team1Id ?? "TBD";
  return game.team2 ?? game.team2Id ?? "TBD";
}

function mapGame(game: FirestoreGame) {
  const resultType: "normal" | "forfeit" =
    game.resultType === "forfeit" ? "forfeit" : "normal";

  return {
    id: game.id,
    time: game.time,
    teamA: {
      id: game.team1Id ?? getTeamName(game, "team1"),
      name: getTeamName(game, "team1"),
      score: game.team1Score ?? null,
    },
    teamB: {
      id: game.team2Id ?? getTeamName(game, "team2"),
      name: getTeamName(game, "team2"),
      score: game.team2Score ?? null,
    },
    resultType,
    winner: game.winner ?? null,
    tag: game.type === "championship" ? "championship" : undefined,
  };
}

function getWeekLocation(config: (typeof LEAGUES)[LeagueKey], week: WeekDoc) {
  const weekVenue = week.venue?.trim() || week.location?.trim();

  if (weekVenue) return weekVenue;

  const overrideVenue = config.weekLocationOverrides?.[week.week];

  if (overrideVenue) return overrideVenue;

  return config.defaultLocation;
}

function getAnnouncements(week: WeekDoc) {
  return (week.announcements ?? [])
    .map((item) => (typeof item === "string" ? item : item.message ?? ""))
    .filter(Boolean);
}

export default function LeagueScheduleScreen() {
  const { league } = useLocalSearchParams<{ league: string }>();

  const leagueKey = normalizeLeagueKey(league);
  const config = LEAGUES[leagueKey];

  const [weeks, setWeeks] = useState<WeekDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchedule() {
      setLoading(true);

      try {
        const weeksRef = collection(
          db,
          "leagues",
          config.firebaseLeague,
          "seasons",
          config.seasonId,
          "weeks"
        );

        console.log(
          "Firebase schedule path:",
          `leagues/${config.firebaseLeague}/seasons/${config.seasonId}/weeks`
        );

        const weeksQuery = query(weeksRef, orderBy("week", "asc"));
        const snapshot = await getDocs(weeksQuery);

        const loadedWeeks = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<WeekDoc, "id">),
        }));

        console.log("Weeks loaded:", loadedWeeks.length);
        console.log("First week loaded:", loadedWeeks[0]);

        setWeeks(loadedWeeks);
      } catch (error) {
        console.error("Error loading schedule:", error);
        setWeeks([]);
      } finally {
        setLoading(false);
      }
    }

    loadSchedule();
  }, [config]);

  if (loading) {
    return (
      <SubScreenLayout title={config.title}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator />
          <Text style={{ marginTop: 12 }}>Loading schedule...</Text>
        </View>
      </SubScreenLayout>
    );
  }

  return (
    <SubScreenLayout title={config.title}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {!config.active && (
          <Text
            style={{
              fontWeight: "700",
              color: "orange",
              marginBottom: 16,
            }}
          >
            This league is currently inactive.
          </Text>
        )}

        {weeks.length === 0 ? (
          <Text>No schedule published yet.</Text>
        ) : (
          weeks.map((week) => (
            <View key={week.id} style={{ marginBottom: 26 }}>
              <GameCard
                week={week.week}
                totalWeeks={config.totalWeeks}
                date={week.date}
                games={week.games.map(mapGame)}
                byeTeams={week.bye ?? week.byes ?? []}
                location={getWeekLocation(config, week)}
                announcements={getAnnouncements(week)}
                embedded
              />
            </View>
          ))
        )}
      </ScrollView>
    </SubScreenLayout>
  );
}