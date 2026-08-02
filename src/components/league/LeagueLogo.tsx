// src/components/league/LeagueLogo.tsx

import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import {
  getLeagueIndicatorData,
  LeagueIndicatorId,
} from "@/config/leagueIndicatorConfig";
import { colors, radius } from "@/theme";

type LeagueLogoProps = {
  leagueId: LeagueIndicatorId;
  size?: number;
  imageScale?: number;
  style?: ViewStyle;
  showBackground?: boolean;
};

export default function LeagueLogo({
  leagueId,
  size = 44,
  imageScale = 1,
  style,
  showBackground = false,
}: LeagueLogoProps) {
  const league = getLeagueIndicatorData(leagueId);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: radius.pill,
          backgroundColor: showBackground
            ? colors.surface
            : colors.transparent,
        },
        style,
      ]}
    >
      {league.logo ? (
        <Image
          source={league.logo}
          resizeMode="contain"
          style={{
            width: size * imageScale,
            height: size * imageScale,
          }}
        />
      ) : (
        <Text
          style={{
            fontSize: size * 0.56,
          }}
        >
          {league.fallbackIcon}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});