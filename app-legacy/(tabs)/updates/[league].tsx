// app/(tabs)/updates/[league].tsx

import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import SubScreenLayout from "src/components/SubScreenLayout";
import { updates } from "src/data/updates";
import { useTextSize } from "src/context/TextSizeContext";

const LEAGUE_MAP: Record<string, string> = {
  Sunday: "sun",
  Monday: "mon",
  Tuesday: "tue",
  Wednesday: "wed",
};

const LEAGUE_TITLES: Record<string, string> = {
  sun: "Sunday Updates",
  mon: "Monday Updates",
  tue: "Tuesday Updates",
  wed: "Wednesday Updates",
};

export default function LeagueUpdatesScreen() {
  const { league } =
    useLocalSearchParams<{ league: string }>();

  const router = useRouter();
  const { textScale } = useTextSize();

  const leagueKey =
    LEAGUE_MAP[league as string] || "sun";

  const filteredUpdates = useMemo(() => {
    return updates
      .filter((post) => post.league === leagueKey)
      .sort((a, b) => {
        if (a.important && !b.important) return -1;
        if (!a.important && b.important) return 1;

        return 0;
      });
  }, [leagueKey]);

  return (
    <SubScreenLayout
      title={LEAGUE_TITLES[leagueKey] || "League Updates"}
      backRoute="/updates"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* EMPTY STATE */}
        {filteredUpdates.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyText,
                {
                  fontSize: 14 * textScale,
                },
              ]}
            >
              No updates posted yet.
            </Text>
          </View>
        ) : (
          filteredUpdates.map((post) => (
            <Pressable
              key={post.id}
              onPress={() =>
                router.push({
                  pathname: "/updates/post/[id]",
                  params: {
                    id: post.id,
                  },
                })
              }
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
            >
              {/* TOP ROW */}
              <View style={styles.topRow}>
                <View style={styles.leftMeta}>
                  {post.important && (
                    <View style={styles.importantBadge}>
                      <Text
                        style={[
                          styles.importantBadgeText,
                          {
                            fontSize: 10 * textScale,
                          },
                        ]}
                      >
                        IMPORTANT
                      </Text>
                    </View>
                  )}

                  {post.category && (
                    <Text
                      style={[
                        styles.categoryText,
                        {
                          fontSize: 11 * textScale,
                        },
                      ]}
                    >
                      {post.category.toUpperCase()}
                    </Text>
                  )}
                </View>

                {post.startDate && (
                  <Text
                    style={[
                      styles.dateText,
                      {
                        fontSize: 11 * textScale,
                      },
                    ]}
                  >
                    {post.startDate}
                  </Text>
                )}
              </View>

              {/* TITLE */}
              <Text
                style={[
                  styles.title,
                  {
                    fontSize: 18 * textScale,
                  },
                ]}
              >
                {post.title}
              </Text>

              {/* SUMMARY */}
              {post.summary && (
                <Text
                  style={[
                    styles.summary,
                    {
                      fontSize: 14 * textScale,
                      lineHeight: 20 * textScale,
                    },
                  ]}
                >
                  {post.summary}
                </Text>
              )}

              {/* FOOTER */}
              <View style={styles.footer}>
                <Text
                  style={[
                    styles.readMore,
                    {
                      fontSize: 12 * textScale,
                    },
                  ]}
                >
                  Tap to read more →
                </Text>
              </View>
            </Pressable>
          ))
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  emptyContainer: {
    marginTop: 40,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 14,
    color: "#6b7280",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  leftMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },

  importantBadge: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },

  importantBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#dc2626",
  },

  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6b7280",
  },

  dateText: {
    fontSize: 11,
    color: "#9ca3af",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  summary: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4b5563",
  },

  footer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },

  readMore: {
    fontSize: 12,
    fontWeight: "600",
    color: "#250f74",
  },

  bottomSpacer: {
    height: 40,
  },
});