// src/components/league/ExpandableLeagueCard.tsx

import type { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PURPLE = "#250f74";
const WHITE = "#ffffff";
const BORDER = "#ddd6f0";

type Props = {
  title: string;
  open: boolean;
  onToggle: () => void;
  children?: ReactNode;
};

export default function ExpandableLeagueCard({
  title,
  open,
  onToggle,
  children,
}: Props) {
  return (
    <View style={styles.shadowWrap}>
      <View style={styles.card}>
        <Pressable
          style={({ pressed }) => [
            styles.header,
            pressed && styles.pressed,
          ]}
          onPress={onToggle}
        >
          <Text style={styles.title}>{title}</Text>

          <Ionicons
            name={open ? "chevron-down" : "chevron-forward"}
            size={24}
            color={PURPLE}
          />
        </Pressable>

        {open && (
          <View style={styles.body}>
            {children}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    backgroundColor: WHITE,
    borderRadius: 26,
    marginBottom: 22,

    shadowColor: "#000",
    shadowOpacity: 0.13,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 5,
  },

  card: {
    backgroundColor: WHITE,
    borderRadius: 26,
    overflow: "hidden",
  },

  header: {
    minHeight: 74,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    flex: 1,
    color: PURPLE,
    fontSize: 19,
    fontWeight: "900",
    paddingRight: 12,
  },

  body: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },

  pressed: {
    opacity: 0.72,
  },
});