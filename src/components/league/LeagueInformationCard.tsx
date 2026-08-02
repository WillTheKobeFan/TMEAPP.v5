// src/components/league/LeagueInformationCard.tsx

import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import ExpandableLeagueCard from "./ExpandableLeagueCard";

import type {
  LeagueHomeId,
  LeagueProgram,
} from "src/data/leagueHomeData";

const PURPLE = "#250f74";
const TEXT = "#1f1f1f";
const MUTED = "#727272";
const BORDER = "#eeeeee";
const LIGHT_PURPLE = "#f4f1fa";

type Props = {
  leagueId: LeagueHomeId;
  programs: LeagueProgram[];
  open: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
};

export default function LeagueInformationCard({
  leagueId,
  programs,
  open,
  onToggle,
  onNavigate,
}: Props) {
  const navigateTo = (
    pathname: "/league-rules" | "/faq" | "/league-policies",
  ) => {
    onNavigate?.();

    router.push({
      pathname,
      params: {
        league: leagueId,
      },
    });
  };

  return (
    <ExpandableLeagueCard
      title="ℹ️ League Information"
      open={open}
      onToggle={onToggle}
    >
      {programs.length > 0 ? (
        programs.map((program, index) => (
          <LeagueInformationRow
            key={program.id}
            program={program}
            isLast={index === programs.length - 1}
          />
        ))
      ) : (
        <Text style={styles.emptyText}>
          League information coming soon.
        </Text>
      )}

      <View style={styles.resourcesSection}>
        <ResourceLink
          icon="book-outline"
          title="League Rules"
          onPress={() => navigateTo("/league-rules")}
        />

        <ResourceLink
          icon="help-circle-outline"
          title="FAQ"
          onPress={() => navigateTo("/faq")}
        />

        <ResourceLink
          icon="clipboard-outline"
          title="League Policies"
          onPress={() => navigateTo("/league-policies")}
          isLast
        />
      </View>
    </ExpandableLeagueCard>
  );
}

type LeagueInformationRowProps = {
  program: LeagueProgram;
  isLast: boolean;
};

function LeagueInformationRow({
  program,
  isLast,
}: LeagueInformationRowProps) {
  return (
    <View
      style={[
        styles.programRow,
        !isLast && styles.programBorder,
      ]}
    >
      <Text style={styles.programTitle}>
        {program.title}
      </Text>

      <Text style={styles.programDetail}>
        📍 {program.location}
      </Text>

      <Text style={styles.programDetail}>
        🏀 {program.level}
      </Text>
    </View>
  );
}

type ResourceLinkProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  isLast?: boolean;
};

function ResourceLink({
  icon,
  title,
  onPress,
  isLast = false,
}: ResourceLinkProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.resourceLink,
        !isLast && styles.resourceBorder,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.resourceLeft}>
        <View style={styles.resourceIconWrap}>
          <Ionicons
            name={icon}
            size={21}
            color={PURPLE}
          />
        </View>

        <Text style={styles.resourceTitle}>
          {title}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={22}
        color={PURPLE}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  programRow: {
    paddingVertical: 18,
    paddingHorizontal: 20,
  },

  programBorder: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  programTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 8,
  },

  programDetail: {
    color: TEXT,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
  },

  resourcesSection: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },

  resourceLink: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  resourceBorder: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  resourceLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
  },

  resourceIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: LIGHT_PURPLE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  resourceTitle: {
    flex: 1,
    color: PURPLE,
    fontSize: 16,
    fontWeight: "900",
  },

  emptyText: {
    color: MUTED,
    fontSize: 15,
    fontWeight: "700",
    padding: 20,
  },

  pressed: {
    opacity: 0.72,
  },
});