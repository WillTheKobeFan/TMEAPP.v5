// src/components/cards/HomeScreenCard.tsx

import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const PURPLE = "#250f74";

type Props = {
  children?: React.ReactNode;
  onPress?: () => void;
  centered?: boolean;
  styleOverride?: StyleProp<ViewStyle>;
};

export default function HomeScreenCard({
  children,
  onPress,
  centered = false,
  styleOverride,
}: Props) {
  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[styles.card, centered && styles.centered, styleOverride]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {children}
    </CardComponent>
  );
}

export function HomeCardTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.titleWrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function HomeCardRow({
  title,
  subtitle,
  icon,
  expanded,
}: {
  title: string;
  subtitle?: string;
  icon?: string;
  expanded?: boolean;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowTextWrap}>
        <Text style={styles.rowTitle}>
          {icon ? `${icon} ` : ""}
          {title}
        </Text>

        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>

      {expanded !== undefined ? (
        <FontAwesome6
          name={expanded ? "chevron-up" : "chevron-down"}
          size={14}
          color={PURPLE}
        />
      ) : (
        <FontAwesome6 name="chevron-right" size={15} color={PURPLE} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "70%",
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E4E1EE",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 2,
  },

  centered: {
    alignItems: "center",
  },

  titleWrap: {
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: PURPLE,
    textAlign: "center",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13.5,
    fontWeight: "800",
    color: "#777",
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rowTextWrap: {
    flex: 1,
    paddingRight: 12,
  },

  rowTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: PURPLE,
  },

  rowSubtitle: {
    marginTop: 3,
    fontSize: 12.5,
    fontWeight: "700",
    color: "#777",
  },
});