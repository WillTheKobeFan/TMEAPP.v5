// src/components/league/SearchCard.tsx

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import type { LeagueHomeId } from "src/data/leagueHomeData";

const PURPLE = "#250f74";
const WHITE = "#ffffff";
const TEXT = "#1f1f1f";
const BORDER = "#ddd6f0";

type Props = {
  leagueId: LeagueHomeId;
  onNavigate?: () => void;
};

export default function SearchCard({
  leagueId,
  onNavigate,
}: Props) {
  const openSearch = () => {
    onNavigate?.();

    router.push({
      pathname: "/search",
      params: {
        league: leagueId,
      },
    });
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
      onPress={openSearch}
    >
      <View style={styles.header}>
        <Text style={styles.title}>🔍 Search</Text>

        <Ionicons
          name="chevron-forward"
          size={24}
          color={PURPLE}
        />
      </View>

      <View style={styles.divider} />

      <Text style={styles.description}>
        Search teams, players, schedules, standings, game results,
        champions, league rules, FAQs, and league updates.
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: WHITE,
    borderRadius: 26,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 30,

    shadowColor: "#000",
    shadowOpacity: 0.13,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 5,
  },

  header: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    flex: 1,
    color: PURPLE,
    fontSize: 19,
    fontWeight: "900",
    paddingRight: 12,
  },

  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 14,
  },

  description: {
    color: TEXT,
    fontSize: 15.5,
    fontWeight: "700",
    lineHeight: 23,
  },

  pressed: {
    opacity: 0.72,
  },
});