// src/components/league/LeagueLogo.tsx

import React from "react";
import {
  Image,
  StyleProp,
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
  style?: StyleProp<ViewStyle>;
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

  const fallbackContent =
    league.fallbackIcon ??
    league.shortName?.charAt(0) ??
    "?";

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={`${league.name} logo`}
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
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.65}
          style={[
            styles.fallbackText,
            {
              fontSize: size * 0.56,
            },
          ]}
        >
          {fallbackContent}
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

  fallbackText: {
    color: colors.primary,
    fontWeight: "800",
    textAlign: "center",
    includeFontPadding: false,
  },
});