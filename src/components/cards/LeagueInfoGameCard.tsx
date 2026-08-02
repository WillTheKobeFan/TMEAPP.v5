// src/components/cards/LeagueInfoGameCard.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useRouter } from "expo-router";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { LeagueInfoCardConfig } from "@/types/leagueCard";
import { useTextSize } from "src/context/TextSizeContext";

const THEME = "#250f74";

type Props = {
  config: LeagueInfoCardConfig;
};

export default function LeagueInfoGameCard({ config }: Props) {
  const router = useRouter();
  const { textScale } = useTextSize();

  const actions = [
    {
      title: "League Rules",
      label: "Click to View Full League Rules",
      icon: (
        <FontAwesome5
          name="clipboard-list"
          size={16 * textScale}
          color={THEME}
        />
      ),
      route: "/league-rules",
    },
    {
      title: "Game Results",
      label: "Click to View Full Game Results",
      icon: (
        <MaterialCommunityIcons
          name="basketball"
          size={18 * textScale}
          color={THEME}
        />
      ),
      route: `/(tabs)/schedule/results/${config.slug}`,
    },
    {
      title: "Standings",
      label: "Click to View Full Standings",
      icon: (
        <Entypo
          name="bar-graph"
          size={18 * textScale}
          color={THEME}
        />
      ),
      route: `/(tabs)/standings/${config.slug}`,
    },
    {
      title: "Rosters",
      label: "Click to View Rosters",
      icon: (
        <FontAwesome6
          name="users"
          size={16 * textScale}
          color={THEME}
        />
      ),
      route: `/rosters/${config.slug}`,
    },
    {
      title: "Possible Off Weeks / Holidays",
      label: "Click to View Possible Off Weeks & Holidays",
      icon: (
        <FontAwesome6
          name="calendar-days"
          size={16 * textScale}
          color={THEME}
        />
      ),
      route: `/league-info/${config.slug}/holidays`,
    },
  ];

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <Text
        style={[
          styles.leagueTitle,
          {
            fontSize: 18 * textScale,
          },
        ]}
      >
        {config.leagueName}
      </Text>

      <Divider />

      {/* SEASON */}
      <Section title="Season Overview" textScale={textScale} />

      <GridRow
        leftLabel="Registration"
        leftValue={config.registrationDates ?? "June – July"}
        rightLabel="Season"
        rightValue={`${config.seasonStart} - ${config.seasonEnd}`}
        textScale={textScale}
      />

      <GridRow
        leftLabel="Game Day"
        leftValue={config.gameNight}
        leftSubValue={config.gameTime}
        rightLabel="Total Weeks"
        rightValue={config.totalWeeks}
        textScale={textScale}
      />

      <Divider />

      {/* LEAGUE TYPE */}
      {config.skillDivision && (
        <>
          <Section title="League Type" textScale={textScale} />

          <View style={styles.rowBlock}>
            <Text
              style={[
                styles.label,
                {
                  fontSize: 12 * textScale,
                },
              ]}
            >
              Description
            </Text>

            <Text
              style={[
                styles.skillTitle,
                {
                  fontSize: 13 * textScale,
                },
              ]}
            >
              {config.skillDivision}
            </Text>

            {!!config.skillDescription && (
              <Text
                style={[
                  styles.skillDescription,
                  {
                    fontSize: 13 * textScale,
                    lineHeight: 20 * textScale,
                  },
                ]}
              >
                {config.skillDescription}
              </Text>
            )}
          </View>

          <Divider />
        </>
      )}

      {/* ABOUT */}
      <Section title="About The League" textScale={textScale} />

      <Row
        label="League Format"
        value={config.leagueFormat}
        textScale={textScale}
      />

      <Divider />

      <Row
        label="Playoff Format"
        value={config.playoffFormat}
        textScale={textScale}
      />

      {/* NAV SECTIONS */}
      {actions.map((item) => (
        <React.Fragment key={item.title}>
          <Divider />

          <IconHeader
            icon={item.icon}
            title={item.title}
            textScale={textScale}
          />

          <NavRow
            label={item.label}
            onPress={() => router.push(item.route as any)}
            textScale={textScale}
          />
        </React.Fragment>
      ))}
    </View>
  );
}

/* ---------- HELPERS ---------- */

function Divider() {
  return <View style={styles.divider} />;
}

function Section({
  title,
  textScale,
}: {
  title: string;
  textScale: number;
}) {
  return (
    <Text
      style={[
        styles.sectionTitle,
        {
          fontSize: 15 * textScale,
        },
      ]}
    >
      {title}
    </Text>
  );
}

function Row({
  label,
  value,
  textScale,
}: {
  label: string;
  value: string;
  textScale: number;
}) {
  return (
    <View style={styles.rowBlock}>
      <Text
        style={[
          styles.label,
          {
            fontSize: 12 * textScale,
          },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.value,
          {
            fontSize: 14 * textScale,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function GridRow({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  leftSubValue,
  textScale,
}: {
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
  leftSubValue?: string;
  textScale: number;
}) {
  return (
    <View style={styles.gridRow}>
      <View style={styles.gridItem}>
        <Text
          style={[
            styles.label,
            {
              fontSize: 12 * textScale,
            },
          ]}
        >
          {leftLabel}
        </Text>

        <Text
          style={[
            styles.value,
            {
              fontSize: 14 * textScale,
            },
          ]}
        >
          {leftValue}
        </Text>

        {!!leftSubValue && (
          <Text
            style={[
              styles.subValue,
              {
                fontSize: 12 * textScale,
              },
            ]}
          >
            {leftSubValue}
          </Text>
        )}
      </View>

      <View style={styles.gridItem}>
        <Text
          style={[
            styles.label,
            {
              fontSize: 12 * textScale,
            },
          ]}
        >
          {rightLabel}
        </Text>

        <Text
          style={[
            styles.value,
            {
              fontSize: 14 * textScale,
            },
          ]}
        >
          {rightValue}
        </Text>
      </View>
    </View>
  );
}

function IconHeader({
  icon,
  title,
  textScale,
}: {
  icon: React.ReactNode;
  title: string;
  textScale: number;
}) {
  return (
    <View style={styles.iconHeader}>
      {icon}

      <Text
        style={[
          styles.iconTitle,
          {
            fontSize: 14 * textScale,
          },
        ]}
      >
        {title}
      </Text>
    </View>
  );
}

function NavRow({
  label,
  onPress,
  textScale,
}: {
  label: string;
  onPress: () => void;
  textScale: number;
}) {
  return (
    <TouchableOpacity
      style={styles.linkRow}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text
        style={[
          styles.linkText,
          {
            fontSize: 13 * textScale,
          },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.arrow,
          {
            fontSize: 16 * textScale,
          },
        ]}
      >
        →
      </Text>
    </TouchableOpacity>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
  },

  leagueTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: THEME,
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME,
    marginBottom: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "#ECECEC",
    marginVertical: 12,
  },

  gridRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },

  gridItem: {
    flex: 1,
  },

  rowBlock: {
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
    marginBottom: 5,
  },

  value: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },

  subValue: {
    marginTop: 4,
    color: "#666",
    fontSize: 12,
  },

  skillTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME,
  },

  skillDescription: {
    marginTop: 6,
    fontSize: 13,
    color: "#111",
    lineHeight: 20,
  },

  iconHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  iconTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME,
  },

  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  linkText: {
    color: THEME,
    fontWeight: "700",
    fontSize: 13,
  },

  arrow: {
    fontSize: 16,
    color: "#888",
  },
});