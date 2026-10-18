import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/theme";

type TrainingDetails = {
  sport?: string;
  format?: string;
  environment?: string;
  focus?: string;
  level?: string;
  participants?: string;
  availability?: string;
  location?: string;
  description?: string;
};

type Props = {
  details: TrainingDetails;
  status?: string;
  onRegistration?: () => void;
};

type Tab = "Overview" | "Facility" | "Quick Actions";

const clean = (value?: string) =>
  value && value !== "To be confirmed" && value !== "TBD"
    ? value
    : undefined;

const combine = (first?: string, second?: string) =>
  [clean(first), clean(second)].filter(Boolean).join(" • ") || "TBD";

export default function TrainingDirectoryDetails({
  details,
  status = "Active",
  onRegistration,
}: Props) {
  const { theme, isDark } = useTheme();
  const [expanded, setExpanded] = useState<Tab | null>(null);
  const accent = isDark ? "#FFFFFF" : theme.primary;

  const rows = [
    ["Sport:", clean(details.sport) || "TBD"],
    ["Training Focus:", clean(details.focus) || "TBD"],
    ["Sessions:", clean(details.availability) || "TBD"],
  ];

  const tabs: {
    title: Tab;
    subtitle: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    {
      title: "Overview",
      subtitle: "Training details & development focus",
      icon: "people-outline",
    },
    {
      title: "Facility",
      subtitle: clean(details.location) || "Location information",
      icon: "business-outline",
    },
    {
      title: "Quick Actions",
      subtitle: "Registration information",
      icon: "flash-outline",
    },
  ];

  const formattedStatus = status
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <View>
      <View style={styles.information}>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: accent }]}>
            Training Status:
          </Text>
          <Text
            style={[
              styles.value,
              {
                color:
                  status.toLowerCase() === "active"
                    ? "#159447"
                    : status.toLowerCase() === "inactive"
                      ? "#C83D3D"
                      : theme.text,
              },
            ]}
          >
            {formattedStatus}
          </Text>
        </View>

        {rows.map(([label, value]) => (
          <View key={label} style={styles.infoRow}>
            <Text style={[styles.label, { color: accent }]}>
              {label}
            </Text>
            <Text style={[styles.value, { color: theme.text }]}>
              {value}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.cards}>
        {tabs.map((tab) => {
          const open = expanded === tab.title;

          return (
            <View
              key={tab.title}
              style={[
                styles.card,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: open }}
                onPress={() => setExpanded(open ? null : tab.title)}
                style={styles.cardHeader}
              >
                <Ionicons
                  name={tab.icon}
                  size={27}
                  color={accent}
                />

                <View style={styles.cardText}>
                  <Text style={[styles.cardTitle, { color: accent }]}>
                    {tab.title}
                  </Text>
                  <Text style={[styles.subtitle, { color: theme.textMuted }]}>
                    {tab.subtitle}
                  </Text>
                </View>

                <Ionicons
                  name={open ? "chevron-down" : "chevron-forward"}
                  size={23}
                  color={theme.textMuted}
                />
              </Pressable>

              {open && (
                <View
                  style={[
                    styles.expanded,
                    { borderTopColor: theme.border },
                  ]}
                >
                  {tab.title === "Overview" && (
                    <Text style={[styles.body, { color: theme.text }]}>
                      {details.description || "Program information coming soon."}
                    </Text>
                  )}

                  {tab.title === "Facility" && (
                    <View style={styles.expandedRows}>
                      <Text style={[styles.label, { color: accent }]}>
                        Location
                      </Text>
                      <Text style={[styles.body, { color: theme.text }]}>
                        {clean(details.location) || "TBD"}
                      </Text>

                    </View>
                  )}

                  {tab.title === "Quick Actions" && (
                    onRegistration ? (
                      <Pressable
                        accessibilityRole="button"
                        onPress={onRegistration}
                        style={styles.action}
                      >
                        <Ionicons
                          name="document-text-outline"
                          size={22}
                          color={accent}
                        />
                        <Text style={[styles.actionText, { color: accent }]}>
                          Registration Information
                        </Text>
                        <Ionicons
                          name="chevron-forward"
                          size={22}
                          color={theme.textMuted}
                        />
                      </Pressable>
                    ) : (
                      <Text style={[styles.body, { color: theme.text }]}>
                        No registration action currently configured.
                      </Text>
                    )
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  information: {
    marginTop: 8,
    marginBottom: 18,
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    columnGap: 6,
    rowGap: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: "800",
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    flexShrink: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginBottom: 16,
  },
  cards: {
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 19,
    overflow: "hidden",
  },
  cardHeader: {
    minHeight: 78,
    paddingHorizontal: 18,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  cardText: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 19,
  },
  expanded: {
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  expandedRows: {
    gap: 8,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
  },
});
