// src/components/league/ChampionsCard.tsx

import { StyleSheet, Text, View } from "react-native";

import ExpandableLeagueCard from "./ExpandableLeagueCard";

import type { LeagueChampion } from "src/data/leagueHomeData";

const PURPLE = "#250f74";
const TEXT = "#1f1f1f";
const BORDER = "#eeeeee";
const MUTED = "#727272";

type Props = {
  champions: LeagueChampion[];
  open: boolean;
  onToggle: () => void;
};

export default function ChampionsCard({
  champions,
  open,
  onToggle,
}: Props) {
  return (
    <ExpandableLeagueCard
      title="🏆 Latest Champions"
      open={open}
      onToggle={onToggle}
    >
      {champions.length > 0 ? (
        <View style={styles.body}>
          {champions.map((champion, index) => (
            <View
              key={champion.id}
              style={[
                styles.row,
                index !== champions.length - 1 && styles.rowBorder,
              ]}
            >
              <Text style={styles.label}>{champion.label}</Text>
              <Text style={styles.team}>{champion.team}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>
          Latest champions coming soon.
        </Text>
      )}
    </ExpandableLeagueCard>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },

  row: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  label: {
    color: TEXT,
    fontSize: 15,
    fontWeight: "800",
  },

  team: {
    color: PURPLE,
    fontSize: 15,
    fontWeight: "900",
  },

  emptyText: {
    color: MUTED,
    fontSize: 15,
    fontWeight: "700",
    padding: 20,
  },
});