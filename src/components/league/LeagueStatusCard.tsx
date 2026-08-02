// src/components/league/LeagueStatusCard.tsx

import { StyleSheet, Text, View } from "react-native";

import ExpandableLeagueCard from "./ExpandableLeagueCard";

import type {
  LeaguePhase,
  LeagueProgram,
} from "src/data/leagueHomeData";

const TEXT = "#1f1f1f";
const RED = "#d92d20";
const BORDER = "#eeeeee";
const MUTED = "#727272";

type Props = {
  programs: LeagueProgram[];
  open: boolean;
  onToggle: () => void;
};

export default function LeagueStatusCard({
  programs,
  open,
  onToggle,
}: Props) {
  return (
    <ExpandableLeagueCard
      title="📊 League Status"
      open={open}
      onToggle={onToggle}
    >
      {programs.length > 0 ? (
        programs.map((program, index) => (
          <LeagueStatusRow
            key={program.id}
            program={program}
            isLast={index === programs.length - 1}
          />
        ))
      ) : (
        <Text style={styles.emptyText}>
          League status coming soon.
        </Text>
      )}
    </ExpandableLeagueCard>
  );
}

type LeagueStatusRowProps = {
  program: LeagueProgram;
  isLast: boolean;
};

function LeagueStatusRow({
  program,
  isLast,
}: LeagueStatusRowProps) {
  const { currentWeek, totalWeeks, phase } = program.leagueStatus;
  const inactive = phase === "inactive";

  return (
    <View
      style={[
        styles.row,
        !isLast && styles.rowBorder,
      ]}
    >
      <Text style={styles.programTitle}>
        {program.title}
      </Text>

      {inactive ? (
        <Text style={styles.inactiveText}>
          🔴 Inactive
        </Text>
      ) : (
        <>
          <Text style={styles.statusLine}>
            🏀 Week {currentWeek} of {totalWeeks}
          </Text>

          <Text style={styles.statusLine}>
            {getPhaseIcon(phase)} {getPhaseLabel(phase)}
          </Text>
        </>
      )}
    </View>
  );
}

function getPhaseIcon(phase: LeaguePhase): string {
  return phase === "regular" ? "📈" : "🏆";
}

function getPhaseLabel(phase: LeaguePhase): string {
  switch (phase) {
    case "regular":
      return "Regular Season";

    case "quarterfinals":
      return "Quarter-Finals";

    case "semifinals":
      return "Semi-Finals";

    case "championship":
      return "Championship";

    case "inactive":
      return "Inactive";

    default:
      return "Season Status";
  }
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 18,
    paddingHorizontal: 20,
  },

  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  programTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 8,
  },

  statusLine: {
    color: TEXT,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 5,
  },

  inactiveText: {
    color: RED,
    fontSize: 15,
    fontWeight: "900",
    marginTop: 5,
  },

  emptyText: {
    color: MUTED,
    fontSize: 15,
    fontWeight: "700",
    padding: 20,
  },
});