// src/components/cards/LogoCard.tsx

import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
} from "react-native";

type LeagueId = "tme" | "pickup" | "taj";

type LogoCardProps = {
  logo: ImageSourcePropType;
  leagueId: LeagueId;
};

const logoSizes: Record<
  LeagueId,
  {
    width: number;
    height: number;
  }
> = {
  tme: {
    width: 260,
    height: 140,
  },

  pickup: {
    width: 300,
    height: 120,
  },

  taj: {
    width: 260,
    height: 140,
  },
};

export default function LogoCard({
  logo,
  leagueId,
}: LogoCardProps) {
  const size = logoSizes[leagueId];

  return (
    <View style={styles.card}>
      <Image
        source={logo}
        style={{
          width: size.width,
          height: size.height,
        }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 160,

    backgroundColor: "#FFFFFF",
    borderRadius: 22,

    justifyContent: "center",
    alignItems: "center",

    marginTop: 12,
    marginBottom: 18,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,

    elevation: 5,
  },
});