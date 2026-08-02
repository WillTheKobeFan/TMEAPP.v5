// app/(tabs)/updates/post/[id].tsx

import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import { updates } from "src/data/updates";
import { useTextSize } from "src/context/TextSizeContext";

export default function UpdatePostScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { textScale } = useTextSize();

  const post = updates.find((p) => p.id === id);

  if (!post) {
    return (
      <View style={styles.notFoundContainer}>
        <Text
          style={[
            styles.notFoundText,
            {
              fontSize: 16 * textScale,
            },
          ]}
        >
          Update not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Back Button */}
      <Pressable
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Text
          style={[
            styles.backText,
            {
              fontSize: 15 * textScale,
            },
          ]}
        >
          ← Updates
        </Text>
      </Pressable>

      {/* Important Badge */}
      {post.important && (
        <View style={styles.importantBadge}>
          <Text
            style={[
              styles.importantBadgeText,
              {
                fontSize: 12 * textScale,
              },
            ]}
          >
            IMPORTANT
          </Text>
        </View>
      )}

      {/* League + Category */}
      <Text
        style={[
          styles.metaText,
          {
            fontSize: 12 * textScale,
          },
        ]}
      >
        {post.league?.toUpperCase()} •{" "}
        {post.category?.toUpperCase()}
      </Text>

      {/* Title */}
      <Text
        style={[
          styles.title,
          {
            fontSize: 24 * textScale,
          },
        ]}
      >
        {post.title}
      </Text>

      {/* Summary */}
      {post.summary && (
        <Text
          style={[
            styles.summary,
            {
              fontSize: 16 * textScale,
              lineHeight: 23 * textScale,
            },
          ]}
        >
          {post.summary}
        </Text>
      )}

      {/* Optional Image */}
      {post.image && (
        <Image
          source={{ uri: post.image }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {/* Content */}
      <View style={styles.contentBlock}>
        {post.content?.map((line, index) => (
          <Text
            key={index}
            style={[
              styles.bodyText,
              {
                fontSize: 16 * textScale,
                lineHeight: 24 * textScale,
              },
            ]}
          >
            {line}
          </Text>
        ))}
      </View>

      {/* Dates */}
      {(post.startDate || post.endDate) && (
        <View style={styles.dateBlock}>
          {post.startDate && (
            <Text
              style={[
                styles.dateText,
                {
                  fontSize: 14 * textScale,
                },
              ]}
            >
              Start: {post.startDate}
            </Text>
          )}

          {post.endDate && (
            <Text
              style={[
                styles.dateText,
                {
                  fontSize: 14 * textScale,
                },
              ]}
            >
              End: {post.endDate}
            </Text>
          )}
        </View>
      )}

      <View style={styles.footerSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  notFoundText: {
    fontSize: 16,
    color: "#111",
    fontWeight: "600",
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 100,
  },

  backButton: {
    marginBottom: 16,
  },

  backText: {
    fontSize: 15,
    color: "#250f74",
    fontWeight: "700",
  },

  importantBadge: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginBottom: 12,
  },

  importantBadgeText: {
    fontSize: 12,
    color: "#dc2626",
    fontWeight: "700",
  },

  metaText: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
    fontWeight: "600",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },

  summary: {
    fontSize: 16,
    lineHeight: 23,
    color: "#4b5563",
    marginBottom: 16,
  },

  image: {
    width: "100%",
    height: 192,
    borderRadius: 12,
    marginBottom: 16,
  },

  contentBlock: {
    gap: 12,
    marginBottom: 24,
  },

  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#1f2937",
  },

  dateBlock: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 16,
  },

  dateText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },

  footerSpacer: {
    height: 40,
  },
});