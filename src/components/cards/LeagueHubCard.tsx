// src/components/league/LeagueHubCard.tsx

import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { leagueHomeData } from "src/data/leagueHomeData";

type LeagueHomeId = keyof typeof leagueHomeData;


const PURPLE = "#250f74";
const GOLD = "#bdaa45";
const WHITE = "#ffffff";
const LIGHT_PURPLE = "#f4f1fa";
const BORDER = "#ddd6f0";
const TEXT = "#1f1f1f";
const MUTED = "#6f6f6f";

type Props = {
  id: LeagueHomeId;
  name: string;
  seasonTitle?: string;
  activeLeagueText?: string;
  logo?: any;
  logoText?: string;
  onPress: (leagueId: LeagueHomeId) => void;
};

export default function LeagueHubCard({
  id,
  name,
  seasonTitle,
  activeLeagueText,
  logo,
  logoText,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => onPress(id)}
    >
      <View style={styles.logoBox}>
        {logo ? (
          <Image source={logo} style={styles.logo} />
        ) : (
          <Text style={styles.logoFallback}>{logoText ?? "LOGO"}</Text>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>

        {!!seasonTitle && <Text style={styles.season}>{seasonTitle}</Text>}

        {!!activeLeagueText && (
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{activeLeagueText}</Text>
          </View>
        )}
      </View>

      <View style={styles.arrowBox}>
        <Ionicons name="arrow-forward-circle" size={26} color={GOLD} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  logoBox: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: LIGHT_PURPLE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    overflow: "hidden",
  },

  logo: {
    width: 58,
    height: 58,
    resizeMode: "contain",
  },

  logoFallback: {
    fontSize: 14,
    fontWeight: "900",
    color: PURPLE,
    textAlign: "center",
  },

  content: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "900",
    color: TEXT,
    marginBottom: 4,
  },

  season: {
    fontSize: 13,
    fontWeight: "700",
    color: MUTED,
    marginBottom: 8,
  },

  statusPill: {
    alignSelf: "flex-start",
    backgroundColor: LIGHT_PURPLE,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: BORDER,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "800",
    color: PURPLE,
  },

  arrowBox: {
    marginLeft: 10,
  },
});