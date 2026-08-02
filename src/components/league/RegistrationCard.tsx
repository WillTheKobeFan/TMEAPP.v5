// src/components/league/RegistrationCard.tsx

import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import ExpandableLeagueCard from "./ExpandableLeagueCard";

import type {
  LeagueHomeId,
  LeagueProgram,
  RegistrationStatus,
} from "src/data/leagueHomeData";

const PURPLE = "#250f74";
const GREEN = "#1f9d55";
const RED = "#d92d20";
const AMBER = "#b7791f";
const TEXT = "#1f1f1f";
const BORDER = "#eeeeee";
const WHITE = "#ffffff";

type Props = {
  leagueId: LeagueHomeId;
  programs: LeagueProgram[];
  open: boolean;
  onToggle: () => void;
};

export default function RegistrationCard({
  leagueId,
  programs,
  open,
  onToggle,
}: Props) {
  const hasOpenRegistration = programs.some(
    (program) => program.registration.status === "open",
  );

  return (
    <ExpandableLeagueCard
      title="📝 Registration Information"
      open={open}
      onToggle={onToggle}
    >
      {programs.map((program, index) => (
        <RegistrationRow
          key={program.id}
          program={program}
          isLast={index === programs.length - 1}
        />
      ))}

      <View style={styles.buttonSection}>
        <Pressable
          style={[
            styles.button,
            !hasOpenRegistration &&
              styles.buttonDisabled,
          ]}
          disabled={!hasOpenRegistration}
          onPress={() =>
            router.push({
              pathname: "/registration",
              params: {
                league: leagueId,
              },
            })
          }
        >
          <Text style={styles.buttonText}>
            {hasOpenRegistration
              ? "Register Now"
              : "Registration Closed"}
          </Text>
        </Pressable>
      </View>
    </ExpandableLeagueCard>
  );
}

type RegistrationRowProps = {
  program: LeagueProgram;
  isLast: boolean;
};

function RegistrationRow({
  program,
  isLast,
}: RegistrationRowProps) {
  const status = program.registration.status;

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

      <Text style={styles.label}>
        Registration Status:
      </Text>

      <Text
        style={[
          styles.status,
          status === "open" &&
            styles.statusOpen,
          status === "closed" &&
            styles.statusClosed,
          status === "comingSoon" &&
            styles.statusComingSoon,
        ]}
      >
        {status === "open"
          ? "OPEN"
          : status === "closed"
            ? "CLOSED"
            : "COMING SOON"}
      </Text>

      <RegistrationCountdown
        status={status}
        closesAt={program.registration.closesAt}
      />
    </View>
  );
}

type CountdownProps = {
  status: RegistrationStatus;
  closesAt?: string;
};

function RegistrationCountdown({
  status,
  closesAt,
}: CountdownProps) {
  if (status === "closed") {
    return (
      <Text style={styles.countdownText}>
        ⏳ Registration Closed
      </Text>
    );
  }

  if (status === "comingSoon") {
    return (
      <Text style={styles.countdownText}>
        ⏳ Registration Coming Soon
      </Text>
    );
  }

  const daysRemaining =
    getDaysRemaining(closesAt);

  return (
    <View style={styles.countdownWrap}>
      <Text style={styles.countdownText}>
        ⏳ Registration closes in
      </Text>

      <Text style={styles.countdownDays}>
        {daysRemaining} Days
      </Text>
    </View>
  );
}

function getDaysRemaining(
  closesAt?: string,
): number {
  if (!closesAt) {
    return 0;
  }

  const closeDate = new Date(
    `${closesAt}T23:59:59`,
  );

  const today = new Date();

  return Math.max(
    0,
    Math.ceil(
      (closeDate.getTime() -
        today.getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );
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

  label: {
    color: TEXT,
    fontSize: 15,
    fontWeight: "700",
  },

  status: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "900",
  },

  statusOpen: {
    color: GREEN,
  },

  statusClosed: {
    color: RED,
  },

  statusComingSoon: {
    color: AMBER,
  },

  countdownWrap: {
    marginTop: 12,
  },

  countdownText: {
    color: TEXT,
    fontSize: 15,
    fontWeight: "700",
  },

  countdownDays: {
    color: PURPLE,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 4,
  },

  buttonSection: {
    padding: 20,
  },

  button: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonDisabled: {
    backgroundColor: "#9b9b9b",
  },

  buttonText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: "900",
  },
});