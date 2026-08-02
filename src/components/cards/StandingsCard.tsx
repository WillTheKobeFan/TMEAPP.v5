// src/components/cards/StandingsCard.tsx

import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

import { useTextSize } from "src/context/TextSizeContext";

type Team = {
  id: string;
  name: string;
  wins: number;
  losses: number;
  pf: number;
  pa: number;
};

type Props = {
  sessionStartDate: string;
  week: number;
  totalWeeks: number;
  teams: Team[];
  allTeams: string[];
  playoffCutoff: number;
};

export default function StandingsCard({
  sessionStartDate,
  week,
  totalWeeks,
  teams,
  allTeams,
  playoffCutoff,
}: Props) {
  const { textScale } = useTextSize();

  const standings = useMemo(() => {
    const sorted = [...teams].sort((a, b) => {
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }

      const diffA = a.pf - a.pa;
      const diffB = b.pf - b.pa;

      return diffB - diffA;
    });

    const leaderWins = sorted[0]?.wins ?? 0;
    const leaderLosses = sorted[0]?.losses ?? 0;

    return sorted.map((team, index) => {
      const gb =
        ((leaderWins - team.wins) +
          (team.losses - leaderLosses)) /
        2;

      return {
        ...team,
        rank: index + 1,
        gamesBack: gb === 0 ? "-" : gb.toFixed(1),
        pointDiff: team.pf - team.pa,
      };
    });
  }, [teams]);

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.topRow}>
        <View style={styles.headerBlock}>
          <Text
            style={[
              styles.headerTitle,
              {
                fontSize: 13 * textScale,
              },
            ]}
          >
            Regular Season
          </Text>

          <Text
            style={[
              styles.headerSubtext,
              {
                fontSize: 15 * textScale,
              },
            ]}
          >
            Week {week} of {totalWeeks}
          </Text>
        </View>

        <View style={styles.headerBlock}>
          <Text
            style={[
              styles.headerTitle,
              {
                fontSize: 13 * textScale,
              },
            ]}
            numberOfLines={1}
          >
            Current Session Date
          </Text>

          <Text
            style={[
              styles.headerSubtext,
              {
                fontSize: 15 * textScale,
              },
            ]}
          >
            {sessionStartDate}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* TABLE */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <View>
          <View style={styles.headerRow}>
            {["#", "Team", "W", "L", "PF", "PA", "+/-", "GB"].map(
              (label) => (
                <Text
                  key={label}
                  style={[
                    styles.headerText,
                    label === "#" && styles.rankCol,
                    label === "Team" && styles.teamCol,
                    ["W", "L", "PF", "PA", "+/-"].includes(label) &&
                      styles.smallCol,
                    label === "GB" && styles.gbCol,
                    {
                      fontSize: 11 * textScale,
                    },
                  ]}
                >
                  {label}
                </Text>
              )
            )}
          </View>

          {standings.map((team, index) => {
            const isCutLine = index === playoffCutoff - 1;

            return (
              <View key={team.id}>
                <View style={styles.row}>
                  <Text
                    style={[
                      styles.cell,
                      styles.rankCol,
                      styles.rankText,
                      {
                        fontSize: 14 * textScale,
                      },
                    ]}
                  >
                    {team.rank}
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={[
                      styles.cell,
                      styles.teamCol,
                      styles.teamText,
                      {
                        fontSize: 14 * textScale,
                      },
                    ]}
                  >
                    {team.name}
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      styles.smallCol,
                      {
                        fontSize: 14 * textScale,
                      },
                    ]}
                  >
                    {team.wins}
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      styles.smallCol,
                      {
                        fontSize: 14 * textScale,
                      },
                    ]}
                  >
                    {team.losses}
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      styles.smallCol,
                      {
                        fontSize: 14 * textScale,
                      },
                    ]}
                  >
                    {team.pf}
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      styles.smallCol,
                      {
                        fontSize: 14 * textScale,
                      },
                    ]}
                  >
                    {team.pa}
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      styles.smallCol,
                      styles.diffText,
                      {
                        fontSize: 14 * textScale,
                      },
                    ]}
                  >
                    {team.pointDiff > 0 ? "+" : ""}
                    {team.pointDiff}
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      styles.gbCol,
                      {
                        fontSize: 14 * textScale,
                      },
                    ]}
                  >
                    {team.gamesBack}
                  </Text>
                </View>

                {isCutLine && <View style={styles.cutLine} />}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text
          style={[
            styles.footerText,
            {
              fontSize: 11 * textScale,
            },
          ]}
        >
          {playoffCutoff} teams qualify for playoffs
        </Text>

        <Text
          style={[
            styles.footerText,
            {
              fontSize: 11 * textScale,
            },
          ]}
        >
          {allTeams.length} total teams
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  headerBlock: {
    flex: 1,
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },

  headerSubtext: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },

  divider: {
    height: 1,
    backgroundColor: "#E8E8E8",
    marginTop: 16,
    marginBottom: 12,
  },

  headerRow: {
    flexDirection: "row",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
    marginBottom: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  headerText: {
    fontSize: 11,
    fontWeight: "700",
    opacity: 0.55,
    textAlign: "center",
  },

  cell: {
    fontSize: 14,
    color: "#111",
    textAlign: "center",
  },

  rankText: {
    fontWeight: "700",
  },

  teamText: {
    textAlign: "left",
    fontWeight: "500",
    paddingLeft: 10,
  },

  diffText: {
    fontWeight: "600",
  },

  rankCol: {
    width: 34,
  },

  teamCol: {
    width: 130,
  },

  smallCol: {
    width: 58,
  },

  gbCol: {
    width: 62,
  },

  cutLine: {
    height: 1,
    backgroundColor: "#D8D8D8",
    opacity: 0.7,
    marginVertical: 2,
  },

  footer: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  footerText: {
    fontSize: 11,
    opacity: 0.5,
    color: "#111",
  },
});