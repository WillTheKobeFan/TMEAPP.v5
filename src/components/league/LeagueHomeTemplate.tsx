// src/components/league/LeagueHomeTemplate.tsx

import { useCallback, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";

import ChampionsCard from "./ChampionsCard";
import LeagueDropdown from "./LeagueDropdown";
import LeagueInformationCard from "./LeagueInformationCard";
import LeagueStatusCard from "./LeagueStatusCard";
import RegistrationCard from "./RegistrationCard";
import SearchCard from "./SearchCard";

import type { LeagueHomeData } from "src/data/leagueHomeData";

const PURPLE = "#250f74";
const WHITE = "#ffffff";
const BACKGROUND = "#f8f8fa";

type Props = {
  data: LeagueHomeData;
};

type OpenCard =
  | "directory"
  | "registration"
  | "status"
  | "information"
  | "champions"
  | null;

export default function LeagueHomeTemplate({ data }: Props) {
  const [openCard, setOpenCard] = useState<OpenCard>(null);

  const programs = data.programs ?? [];
  const champions = data.champions ?? [];

  const closeAllCards = useCallback(() => {
    setOpenCard(null);
  }, []);

  /*
   * When the user leaves this league Home screen,
   * collapse whichever dropdown was open.
   */
  useFocusEffect(
    useCallback(() => {
      return () => {
        closeAllCards();
      };
    }, [closeAllCards]),
  );

  /*
   * Only one dropdown can be open at a time.
   * Tapping the currently open card closes it.
   */
  const toggleCard = (card: Exclude<OpenCard, null>) => {
    setOpenCard((current) => (current === card ? null : card));
  };

  /*
   * Top-left Home emoji:
   * Return to the main League Hub.
   *
   * This is intentionally different from the bottom CustomNavBar Home,
   * which returns to the currently selected league Home.
   */
  const openLeagueHub = () => {
    closeAllCards();
    router.replace({
      pathname: "/",
      params: {
        leagueSelection: data.id,
      },
    });
  };

  const openSettings = () => {
    closeAllCards();
    router.push("/settings");
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Return to League Hub"
            style={({ pressed }) => [
              styles.headerIcon,
              pressed && styles.pressed,
            ]}
            onPress={openLeagueHub}
          >
            <Text style={styles.headerEmoji}>🏠</Text>
          </Pressable>

          <View style={styles.titleCard}>
            <Text
              style={styles.title}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {data.name}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open Settings"
            style={({ pressed }) => [
              styles.headerIcon,
              pressed && styles.pressed,
            ]}
            onPress={openSettings}
          >
            <Text style={styles.headerEmoji}>⚙️</Text>
          </Pressable>
        </View>

        {/* League Logo */}
        <View style={styles.logoWrap}>
          {data.logo ? (
            <Image
              source={data.logo}
              style={styles.logoImage}
              resizeMode="contain"
              accessibilityLabel={`${data.name} logo`}
            />
          ) : (
            <Text style={styles.logoFallback}>{data.logoText}</Text>
          )}
        </View>

        {/* League Directory */}
        <LeagueDropdown
          programs={programs}
          open={openCard === "directory"}
          onToggle={() => toggleCard("directory")}
        />

        {/* Registration Information */}
        <RegistrationCard
          leagueId={data.id}
          programs={programs}
          open={openCard === "registration"}
          onToggle={() => toggleCard("registration")}
        />

        {/* League Status */}
        <LeagueStatusCard
          programs={programs}
          open={openCard === "status"}
          onToggle={() => toggleCard("status")}
        />

        {/* League Information */}
        <LeagueInformationCard
          leagueId={data.id}
          programs={programs}
          open={openCard === "information"}
          onToggle={() => toggleCard("information")}
          onNavigate={closeAllCards}
        />

        {/* Latest Champions */}
        <ChampionsCard
          champions={champions}
          open={openCard === "champions"}
          onToggle={() => toggleCard("champions")}
        />

        {/* Search */}
        <SearchCard
          leagueId={data.id}
          onNavigate={closeAllCards}
        />
      </ScrollView>
    </View>
  );
}

const cardShadow = {
  shadowColor: "#000",
  shadowOpacity: 0.13,
  shadowRadius: 10,
  shadowOffset: {
    width: 0,
    height: 5,
  },
  elevation: 5,
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  scrollContent: {
    paddingTop: 62,
    paddingHorizontal: 20,

    /*
     * Leaves enough room for the shared CustomNavBar
     * rendered by app/(tabs)/_layout.tsx.
     */
    paddingBottom: 170,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    ...cardShadow,
  },

  headerEmoji: {
    fontSize: 28,
  },

  titleCard: {
    flex: 1,
    minHeight: 78,
    marginHorizontal: 18,
    borderRadius: 28,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    ...cardShadow,
  },

  title: {
    color: PURPLE,
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },

  logoWrap: {
    height: 185,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  logoImage: {
    width: "88%",
    height: "88%",
  },

  logoFallback: {
    color: PURPLE,
    fontSize: 44,
    fontWeight: "900",
    textAlign: "center",
  },

  pressed: {
    opacity: 0.72,
  },
});