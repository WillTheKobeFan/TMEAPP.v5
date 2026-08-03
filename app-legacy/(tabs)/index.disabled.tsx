// app/(tabs)/index.tsx

import React, { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type LeagueId = "tme" | "pickup" | "taj";

type LeagueOption = {
  id: LeagueId;
  name: string;
  logoText: string;
  logo?: ImageSourcePropType;
};

const leagues: LeagueOption[] = [
  { id: "tme", name: "TME Social Sports", logoText: "TME" },
  { id: "pickup", name: "Pickup Basketball USA", logoText: "PICKUP" },
  { id: "taj", name: "Taj Hill Hoops", logoText: "THH" },
];

const PURPLE = "#250f74";
const GOLD = "#bdaa45";
const WHITE = "#ffffff";
const LIGHT_PURPLE = "#f4f1fa";
const BORDER = "#ddd6f0";
const TEXT = "#1f1f1f";
const MUTED = "#6f6f6f";

export default function LeagueHubScreen() {
  const [leagueDropdownOpen, setLeagueDropdownOpen] = useState(false);

  const handleSelectLeague = (leagueId: LeagueId) => {
    router.push({
      pathname: "/league/[leagueSelection]",
      params: { leagueSelection: leagueId },
    });
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8}>
            <Ionicons name="home" size={24} color={PURPLE} />
          </TouchableOpacity>

          <View style={styles.titleCard}>
            <Text style={styles.title}>League Hub</Text>
          </View>

          <TouchableOpacity
            style={styles.headerIcon}
            activeOpacity={0.8}
            onPress={() => router.push("/settings")}
          >
            <Ionicons name="settings-outline" size={24} color={PURPLE} />
          </TouchableOpacity>
        </View>

        <View style={styles.sloganCard}>
          <Text style={styles.sloganLine}>Stay Connected • Stay Informed</Text>
          <Text style={styles.sloganLineGold}>• Stay Active</Text>
        </View>

        <Text style={styles.sectionTitle}>Select a League</Text>

        <View style={styles.dropdownCard}>
          <TouchableOpacity
            style={styles.dropdownHeader}
            activeOpacity={0.85}
            onPress={() => setLeagueDropdownOpen((prev) => !prev)}
          >
            <Text style={styles.dropdownTitle}>League Selection</Text>
            <Ionicons
              name={leagueDropdownOpen ? "chevron-down" : "chevron-forward"}
              size={22}
              color={PURPLE}
            />
          </TouchableOpacity>

          {leagueDropdownOpen && (
            <View style={styles.dropdownBody}>
              {leagues.map((league) => (
                <TouchableOpacity
                  key={league.id}
                  style={styles.leagueRow}
                  activeOpacity={0.85}
                  onPress={() => handleSelectLeague(league.id)}
                >
                  <View style={styles.logoBox}>
                    {league.logo ? (
                      <Image source={league.logo} style={styles.logo} />
                    ) : (
                      <Text style={styles.logoFallback}>{league.logoText}</Text>
                    )}
                  </View>

                  <Text style={styles.leagueName}>{league.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={PURPLE}
            />
            <Text style={styles.infoTitle}>League Hub Information</Text>
          </View>

          <Text style={styles.infoText}>Select a league above to access:</Text>

          <View style={styles.bulletList}>
            <Text style={styles.bullet}>• Registration Information</Text>
            <Text style={styles.bullet}>• League Status</Text>
            <Text style={styles.bullet}>• League Information</Text>
            <Text style={styles.bullet}>• Latest Champions</Text>
            <Text style={styles.bullet}>• Search & Team Information</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: WHITE,
  },

  scrollContent: {
    paddingTop: 62,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 26,
  },

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: LIGHT_PURPLE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  titleCard: {
    backgroundColor: WHITE,
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    color: PURPLE,
  },

  sloganCard: {
    backgroundColor: WHITE,
    borderRadius: 22,
    paddingVertical: 22,
    paddingHorizontal: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  sloganLine: {
    fontSize: 18,
    fontWeight: "900",
    color: PURPLE,
    textAlign: "center",
    marginBottom: 5,
  },

  sloganLineGold: {
    fontSize: 18,
    fontWeight: "900",
    color: GOLD,
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: PURPLE,
    marginBottom: 12,
  },

  dropdownCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.11,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  dropdownHeader: {
    minHeight: 60,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: PURPLE,
  },

  dropdownBody: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingVertical: 8,
  },

  leagueRow: {
    minHeight: 76,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: LIGHT_PURPLE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },

  logo: {
    width: 46,
    height: 46,
    resizeMode: "contain",
  },

  logoFallback: {
    fontSize: 12,
    fontWeight: "900",
    color: PURPLE,
    textAlign: "center",
  },

  leagueName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "900",
    color: TEXT,
  },

  infoCard: {
    backgroundColor: LIGHT_PURPLE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },

  infoTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: PURPLE,
  },

  infoText: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT,
    marginBottom: 12,
  },

  bulletList: {
    gap: 7,
  },

  bullet: {
    fontSize: 14,
    fontWeight: "700",
    color: MUTED,
    lineHeight: 20,
  },
});