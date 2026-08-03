// app/league-info/[league].tsx

import React from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
} from "react-native";

import { useLocalSearchParams } from "expo-router";

import SubScreenLayout from "src/components/SubScreenLayout";
import LeagueInfoGameCard from "src/components/cards/LeagueInfoGameCard";

import { leagues } from "src/data/leagues";

import { LeagueKey } from "src/types/leagues";
import { LeagueInfoCardConfig } from "@/types/leagueCard";

import { useTextSize } from "src/context/TextSizeContext";

const THEME = "#250f74";

export default function LeagueInfoScreen() {
  const { league } = useLocalSearchParams();
  const { textScale } = useTextSize();

  const leagueKey = String(league).toLowerCase() as LeagueKey;

  const data = leagues[leagueKey];

  if (!data) {
    return (
      <SubScreenLayout title="League Info">
        <Text
          style={[
            styles.notFound,
            {
              fontSize: 16 * textScale,
            },
          ]}
        >
          League not found
        </Text>
      </SubScreenLayout>
    );
  }

  const config: LeagueInfoCardConfig = {
    slug: data.slug,

    leagueName: data.info.leagueName,

    registrationDates: data.info.registrationDates,

    seasonStart: data.info.seasonStart,

    seasonEnd: data.info.seasonEnd,

    gameNight: data.info.gameNight,

    gameTime: data.info.gameTime,

    totalWeeks: data.info.totalWeeks,

    leagueFormat: data.info.leagueFormat,

    playoffFormat: data.info.playoffFormat,

    skillDivision: data.info.skillDivision,

    skillDescription: data.info.skillDescription,

    gameRules: data.info.gameRules,

    gameResults: data.info.gameResults,

    standingsInfo: data.info.standingsInfo,
  };

  const screenTitle = `${config.leagueName} Info`;

  return (
    <SubScreenLayout title={screenTitle}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <LeagueInfoGameCard config={config} />
      </ScrollView>
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 120,
  },

  notFound: {
    marginTop: 40,
    textAlign: "center",
    color: THEME,
    fontSize: 16,
    fontWeight: "600",
  },
});