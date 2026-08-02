// src/components/league/LeagueIndicatorCard.tsx

import React, { useMemo } from "react";
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import {
  DEFAULT_LEAGUE_INDICATOR_ID,
  getLeagueIndicatorData,
  isLeagueIndicatorId,
  LeagueIndicatorId,
} from "src/config/leagueIndicatorConfig";

const DEFAULT_SIZE = 58;
const PURPLE = "#250f74";

type LeagueRouteParams = {
  leagueSelection?: string | string[];
  leagueId?: string | string[];
};

type Props = {
  /**
   * Optional manual override.
   *
   * Example:
   * <LeagueIndicatorCard leagueId="pickup" />
   */
  leagueId?: LeagueIndicatorId;

  /**
   * Outer circular card size.
   */
  size?: number;

  /**
   * Optional future action, such as opening a league switcher.
   */
  onPress?: () => void;

  /**
   * Optional outer styling.
   */
  style?: StyleProp<ViewStyle>;
};

function getFirstRouteValue(
  value: string | string[] | undefined
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default function LeagueIndicatorCard({
  leagueId,
  size = DEFAULT_SIZE,
  onPress,
  style,
}: Props) {
  const params = useLocalSearchParams<LeagueRouteParams>();

  const routeLeagueSelection = getFirstRouteValue(
    params.leagueSelection
  );

  const routeLeagueId = getFirstRouteValue(params.leagueId);

  const resolvedLeagueId = useMemo<LeagueIndicatorId>(() => {
    if (leagueId) {
      return leagueId;
    }

    if (isLeagueIndicatorId(routeLeagueSelection)) {
      return routeLeagueSelection;
    }

    if (isLeagueIndicatorId(routeLeagueId)) {
      return routeLeagueId;
    }

    return DEFAULT_LEAGUE_INDICATOR_ID;
  }, [leagueId, routeLeagueSelection, routeLeagueId]);

  const league = getLeagueIndicatorData(resolvedLeagueId);

  const logoSize = Math.round(size * 0.81);

  const cardContent = (
    <View
      style={[
        styles.card,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.logoCircle,
          {
            width: logoSize,
            height: logoSize,
            borderRadius: logoSize / 2,
          },
        ]}
      >
        {league.logo ? (
          <Image
            source={league.logo}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
            style={[
              styles.logo,
              {
                width: logoSize,
                height: logoSize,
                borderRadius: logoSize / 2,
              },
            ]}
          />
        ) : (
          <View style={styles.fallback}>
            <Text style={styles.fallbackIcon}>
              {league.fallbackIcon}
            </Text>

            <Text
              style={[
                styles.fallbackText,
                {
                  color: league.accentColor,
                },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {league.shortName}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  if (!onPress) {
    return (
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Current league: ${league.name}`}
      >
        {cardContent}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Current league: ${league.name}`}
      accessibilityHint="Opens league selection"
      hitSlop={8}
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressed,
      ]}
    >
      {cardContent}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 999,
  },

  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.96 }],
  },

  card: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.14,
    shadowRadius: 5,

    elevation: 5,
  },

  logoCircle: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },

  logo: {
    backgroundColor: "#ffffff",
  },

  fallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  fallbackIcon: {
    fontSize: 14,
    lineHeight: 16,
  },

  fallbackText: {
    maxWidth: 32,
    marginTop: -1,
    color: PURPLE,
    fontSize: 7,
    fontWeight: "900",
    textAlign: "center",
  },
});