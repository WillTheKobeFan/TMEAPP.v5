// src/components/league/LeagueDropdown.tsx

import { StyleSheet, Text, View } from "react-native";

import ExpandableLeagueCard from "./ExpandableLeagueCard";

import type { LeagueProgram } from "src/data/leagueHomeData";

const TEXT = "#1f1f1f";
const GREEN = "#1f9d55";
const RED = "#d92d20";

type Props = {
  programs: LeagueProgram[];
  open: boolean;
  onToggle: () => void;
};

export default function LeagueDropdown({
  programs,
  open,
  onToggle,
}: Props) {
  return (
    <ExpandableLeagueCard
      title="🏀 League Directory"
      open={open}
      onToggle={onToggle}
    >
      {programs.length > 0 ? (
        programs.map((program, index) => (
          <ProgramRow
            key={program.id}
            program={program}
            isLast={index === programs.length - 1}
          />
        ))
      ) : (
        <Text style={styles.emptyText}>
          League directory coming soon.
        </Text>
      )}
    </ExpandableLeagueCard>
  );
}

type ProgramRowProps = {
  program: LeagueProgram;
  isLast: boolean;
};

function ProgramRow({
  program,
  isLast,
}: ProgramRowProps) {
  const isActive = program.status === "active";

  return (
    <View
      style={[
        styles.row,
        !isLast && styles.rowBorder,
      ]}
    >
      <Text style={styles.title}>
        {program.title}
      </Text>

      <Text style={styles.detail}>
        📍 {program.location}
      </Text>

      <Text style={styles.detail}>
        League Status:{" "}
        <Text
          style={
            isActive
              ? styles.activeStatus
              : styles.inactiveStatus
          }
        >
          {isActive ? "ACTIVE" : "INACTIVE"}
        </Text>
      </Text>

      <Text style={styles.detail}>
        🏀 {program.level}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 18,
    paddingHorizontal: 20,
  },

  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },

  title: {
    color: TEXT,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 8,
  },

  detail: {
    color: TEXT,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
  },

  activeStatus: {
    color: GREEN,
    fontWeight: "900",
  },

  inactiveStatus: {
    color: RED,
    fontWeight: "900",
  },

  emptyText: {
    padding: 20,
    color: "#727272",
    fontSize: 15,
    fontWeight: "700",
  },
});