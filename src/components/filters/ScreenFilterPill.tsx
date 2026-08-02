// src/components/filters/ScreenFilterPill.tsx 

// src/components/filters/ScreenFilterPill.tsx

import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const PURPLE = "#250F74";

export type FilterDetail = {
  label: string;
  value: string;
};

type ScreenFilterPillProps = {
  details?: FilterDetail[];
  placeholder?: string;
  onPress: () => void;
  accessibilityLabel?: string;
};

export default function ScreenFilterPill({
  details = [],
  placeholder = "Select filters",
  onPress,
  accessibilityLabel = "Open filters",
}: ScreenFilterPillProps) {
  const hasDetails = details.length > 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>🔽</Text>
          <Text style={styles.title}>Filter</Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </View>

      {hasDetails ? (
        <View style={styles.details}>
          {details.map((detail) => (
            <Text
              key={`${detail.label}-${detail.value}`}
              style={styles.detailText}
            >
              <Text style={styles.detailLabel}>
                {detail.label}:{" "}
              </Text>

              {detail.value}
            </Text>
          ))}
        </View>
      ) : (
        <Text style={styles.placeholder}>
          {placeholder}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 680,
    minHeight: 94,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E1E1E1",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    fontSize: 17,
    marginRight: 8,
  },

  title: {
    color: PURPLE,
    fontSize: 17,
    fontWeight: "800",
  },

  arrow: {
    color: PURPLE,
    fontSize: 28,
    fontWeight: "600",
    lineHeight: 28,
  },

  details: {
    marginTop: 8,
    paddingLeft: 27,
  },

  detailText: {
    color: "#333333",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 21,
  },

  detailLabel: {
    color: "#333333",
    fontWeight: "800",
  },

  placeholder: {
    color: "#666666",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
    paddingLeft: 27,
  },

  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.985 }],
  },
});