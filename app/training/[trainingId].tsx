// app/(tabs)/training/[trainingId].tsx

import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppTheme, useTheme } from "@/theme";

const HEADER_SIDE_WIDTH = 96;

const TRAINING_BUSINESSES = {
  "develop-now": {
    id: "develop-now",
    name: "Develop Now Basketball",
    shortName: "Develop Now",
    description:
      "Basketball training, development programs, sessions and availability.",
    banner: require("../../assets/logos/develop-now.jpg"),
    facilityType: "multi" as const,
  },
};

type TrainingId = keyof typeof TRAINING_BUSINESSES;

const HUB_ITEMS = [
  {
    id: "directory",
    title: "Training Directory",
    description: "Programs & training offerings",
    icon: "list-outline",
  },
  {
    id: "registration",
    title: "Registration Information",
    description: "How to register & availability",
    icon: "document-text-outline",
  },
  {
    id: "facility",
    title: "Facility Information",
    description: "Locations & facility details",
    icon: "business-outline",
  },
] as const;

function formatHeaderDate(date: Date) {
  return date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    .toUpperCase();
}

function formatHeaderTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function isTrainingId(value: string): value is TrainingId {
  return value in TRAINING_BUSINESSES;
}

export default function TrainingHubRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ trainingId?: string }>();
  const { theme, isDark } = useTheme();

  const styles = useMemo(
    () => createStyles(theme, isDark),
    [theme, isDark]
  );

  const [currentDateTime, setCurrentDateTime] = useState(
    () => new Date()
  );

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentDateTime(new Date()),
      30_000
    );

    return () => clearInterval(interval);
  }, []);

  const requestedId =
    typeof params.trainingId === "string"
      ? params.trainingId
      : "develop-now";

  const trainingId: TrainingId = isTrainingId(requestedId)
    ? requestedId
    : "develop-now";

  const training = TRAINING_BUSINESSES[trainingId];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        {/* CONTEXTUAL HEADER */}
        <View style={styles.header}>
          <View style={styles.leftHeaderSlot}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={8}
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={theme.headerIcon}
              />

              <Text style={styles.backText}>
                Back
              </Text>
            </Pressable>
          </View>

          <View style={styles.titleContainer}>
            <Text
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.62}
              style={styles.headerTitle}
            >
              {training.name}
            </Text>
          </View>

          <View style={styles.rightHeaderSlot}>
            <Text style={styles.headerDate}>
              {formatHeaderDate(currentDateTime)}
            </Text>

            <Text style={styles.headerTime}>
              {formatHeaderTime(currentDateTime)}
            </Text>
          </View>
        </View>

        {/* SCROLLABLE TRAINING CONTENT */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* ADAPTIVE BRANDING — BANNER */}
          <View style={styles.bannerCard}>
            <Image
              source={training.banner}
              resizeMode="contain"
              style={styles.banner}
            />
          </View>

          <Text style={styles.trainingDescription}>
            {training.description}
          </Text>

          {/* TRAINING SEARCH */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Search ${training.name}`}
            style={styles.searchBar}
          >
            <Ionicons
              name="search"
              size={23}
              color={isDark ? "#FFFFFF" : theme.primary}
            />

            <Text
              numberOfLines={1}
              style={styles.searchText}
            >
              Search {training.shortName}
            </Text>
          </Pressable>

          {/* TRAINING DESTINATIONS */}
          <View style={styles.destinationList}>
            {HUB_ITEMS.map((item) => (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={item.title}
                onPress={() => {
                  if (item.id === "directory") {
                    router.push({
                      pathname:
                        "/organization/[organizationId]/offering-directory",
                      params: {
                        organizationId: trainingId,
                      },
                    });
                  }

                  if (item.id === "registration") {
                    router.push({
                      pathname:
                        "/organization/[organizationId]/registration",
                      params: {
                        organizationId: trainingId,
                      },
                    });
                  }
                }}
                style={styles.destinationCard}
              >
                <View style={styles.destinationIcon}>
                  <Ionicons
                    name={item.icon}
                    size={27}
                    color={isDark ? "#FFFFFF" : theme.primary}
                  />
                </View>

                <View style={styles.destinationText}>
                  <Text style={styles.destinationTitle}>
                    {item.title}
                  </Text>

                  <Text style={styles.destinationDescription}>
                    {item.description}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={23}
                  color={theme.textMuted}
                />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: AppTheme, isDark: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.surface,
    },

    screen: {
      flex: 1,
      backgroundColor: theme.background,
    },

    header: {
      minHeight: 106,
      paddingHorizontal: 18,
      paddingTop: 8,
      paddingBottom: 10,

      flexDirection: "row",
      alignItems: "center",

      backgroundColor: theme.surface,

      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.08,
      shadowRadius: 7,
      elevation: 5,

      zIndex: 30,
    },

    leftHeaderSlot: {
      width: HEADER_SIDE_WIDTH,
      alignSelf: "stretch",
      justifyContent: "center",
      alignItems: "flex-start",
    },

    backButton: {
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },

    backText: {
      marginLeft: 1,
      fontSize: 14,
      fontWeight: "800",
      color: theme.headerText,
    },

    titleContainer: {
      flex: 1,
      minWidth: 0,
      paddingHorizontal: 4,
      alignItems: "center",
      justifyContent: "center",
    },

    headerTitle: {
      width: "100%",
      fontSize: 21,
      lineHeight: 23,
      fontWeight: "900",
      textAlign: "center",
      letterSpacing: -0.5,
      color: theme.headerText,
    },

    rightHeaderSlot: {
      width: HEADER_SIDE_WIDTH,
      alignSelf: "stretch",
      alignItems: "center",
      justifyContent: "center",
    },

    headerDate: {
      width: "100%",
      fontSize: 13,
      fontWeight: "800",
      textAlign: "center",
      letterSpacing: 0.3,
      color: theme.headerText,
    },

    headerTime: {
      width: "100%",
      marginTop: 3,
      fontSize: 12,
      fontWeight: "800",
      textAlign: "center",
      color: theme.headerText,
    },

    scroll: {
      flex: 1,
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 32,
    },

    bannerCard: {
      width: "100%",
      marginBottom: 16,
      padding: 8,

      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 20,

      backgroundColor: theme.logoSurface,

      alignItems: "center",
      justifyContent: "center",

      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,

      overflow: "hidden",
    },

    banner: {
      width: "100%",
      height: 116,
      borderRadius: 12,
    },

    trainingDescription: {
      marginBottom: 24,
      paddingHorizontal: 12,

      fontSize: 15,
      lineHeight: 22,
      fontWeight: "700",
      textAlign: "center",

      color: theme.textMuted,
    },

    searchBar: {
      minHeight: 58,
      marginBottom: 26,
      paddingHorizontal: 17,

      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 18,

      backgroundColor: theme.card,

      flexDirection: "row",
      alignItems: "center",
    },

    searchText: {
      flex: 1,
      marginLeft: 12,

      fontSize: 16,
      fontWeight: "700",
      color: theme.text,
    },

    destinationList: {
      width: "100%",
    },

    destinationCard: {
      minHeight: 88,
      marginBottom: 16,
      paddingHorizontal: 15,
      paddingVertical: 14,

      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 20,

      backgroundColor: theme.card,

      flexDirection: "row",
      alignItems: "center",
    },

    destinationIcon: {
      width: 50,
      height: 50,
      marginRight: 14,

      borderRadius: 15,

      backgroundColor: isDark
        ? "#111113"
        : theme.primarySoft,

      alignItems: "center",
      justifyContent: "center",
    },

    destinationText: {
      flex: 1,
      minWidth: 0,
      paddingRight: 8,
    },

    destinationTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: theme.text,
    },

    destinationDescription: {
      marginTop: 4,
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "500",
      color: theme.textMuted,
    },
  });
