// src/screens/ScheduleScreen.tsx

import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

import { listenToSession } from "src/services/leagueService";
import { useTextSize } from "src/context/TextSizeContext";

export default function ScheduleScreen() {
  const { textScale } = useTextSize();

  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = listenToSession((data) => {
      setSession(data);
    });

    return () => unsubscribe();
  }, []);

  const week1 =
    session?.schedule?.wednesday?.week1?.games ?? [];

  const meta =
    session?.schedule?.wednesday?.week1?.meta;

  if (!session) {
    return (
      <View style={styles.loadingContainer}>
        <Text
          style={[
            styles.loadingText,
            {
              fontSize: 16 * textScale,
            },
          ]}
        >
          Loading schedule...
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
      {/* WEEK TITLE */}
      <Text
        style={[
          styles.weekTitle,
          {
            fontSize: 20 * textScale,
          },
        ]}
      >
        {meta?.weekLabel || "Week 1"}
      </Text>

      {/* DATE */}
      <Text
        style={[
          styles.dateText,
          {
            fontSize: 15 * textScale,
          },
        ]}
      >
        {meta?.date || ""}
      </Text>

      {/* GAMES */}
      {week1.map((item: any, index: number) => {
        if (item.type === "spacer") {
          return (
            <View
              key={index}
              style={styles.spacer}
            />
          );
        }

        if (item.type === "bye") {
          return (
            <Text
              key={index}
              style={[
                styles.byeText,
                {
                  fontSize: 16 * textScale,
                },
              ]}
            >
              💤 BYE: {item.team}
            </Text>
          );
        }

        return (
          <View
            key={index}
            style={styles.gameRow}
          >
            <Text
              style={[
                styles.gameText,
                {
                  fontSize: 16 * textScale,
                },
              ]}
            >
              ⏰ {item.time} — {item.team}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    fontSize: 16,
    color: "#111",
    fontWeight: "600",
  },

  container: {
    flex: 1,
    backgroundColor: "#fcf9f9",
  },

  content: {
    padding: 16,
    paddingBottom: 120,
  },

  weekTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#250f74",
    marginBottom: 4,
  },

  dateText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 10,
  },

  spacer: {
    height: 10,
  },

  gameRow: {
    marginBottom: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },

  gameText: {
    fontSize: 16,
    color: "#111",
    fontWeight: "600",
  },

  byeText: {
    fontSize: 16,
    color: "#555",
    fontWeight: "700",
    marginBottom: 8,
  },
});