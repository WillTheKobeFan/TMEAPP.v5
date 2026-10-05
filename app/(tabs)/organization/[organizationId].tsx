// app/organization/[organizationId].tsx

import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  ORGANIZATIONS,
  ORGANIZATION_IDS,
  type OrganizationId,
} from "@/config/organizations";
import { AppTheme, useTheme } from "@/theme";

const HEADER_SIDE_WIDTH = 96;

const ORGANIZATION_LOGOS: Record<OrganizationId, ImageSourcePropType> = {
  [ORGANIZATION_IDS.TME]: require("../../../assets/logos/tme.png"),
  [ORGANIZATION_IDS.PICKUP]: require("../../../assets/logos/pickup.png"),
  [ORGANIZATION_IDS.TAJ]: require("../../../assets/logos/taj.png"),
};

const HUB_ITEMS = [
  {
    id: "directory",
    title: "League Directory",
    description: "Leagues, schedules & locations",
    icon: "list-outline",
  },
  {
    id: "registration",
    title: "Registration Information",
    description: "Registration, fees & requirements",
    icon: "document-text-outline",
  },
  {
    id: "league-information",
    title: "League Information & Status",
    description: "League details & current updates",
    icon: "stats-chart-outline",
  },
  {
    id: "facility",
    title: "Facility Information",
    description: "Locations & facility information",
    icon: "business-outline",
  },
  {
    id: "recognition",
    title: "Organization Recognition",
    description: "Awards, achievements & recognition",
    icon: "ribbon-outline",
  },
  {
    id: "champions-highlights",
    title: "Champions & Highlights",
    description: "Champions, photos & highlights",
    icon: "trophy-outline",
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

function isOrganizationId(value: string): value is OrganizationId {
  return Object.values(ORGANIZATION_IDS).includes(
    value as OrganizationId
  );
}

export default function OrganizationHubRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ organizationId?: string }>();
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
    typeof params.organizationId === "string"
      ? params.organizationId
      : ORGANIZATION_IDS.TME;

  const organizationId: OrganizationId = isOrganizationId(requestedId)
    ? requestedId
    : ORGANIZATION_IDS.TME;

  const organization = ORGANIZATIONS[organizationId];
  const organizationLogo = ORGANIZATION_LOGOS[organizationId];

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
              {organization.name}
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

        {/* SCROLLABLE ORGANIZATION CONTENT */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* ORGANIZATION INTRO */}
          <View style={styles.organizationIntro}>
            <View style={styles.organizationLogoCard}>
              <Image
                source={organizationLogo}
                resizeMode="contain"
                style={styles.organizationLogo}
              />
            </View>

            <View style={styles.organizationDescriptionContainer}>
              <Text style={styles.organizationDescription}>
                {organization.description}
              </Text>
            </View>
          </View>

          {/* ORGANIZATION SEARCH */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Search ${organization.name}`}
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
              Search {organization.branding.shortName}
            </Text>
          </Pressable>

          {/* ORGANIZATION DESTINATIONS */}
          <View style={styles.destinationList}>
            {HUB_ITEMS.map((item) => (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={item.title}
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

    organizationIntro: {
      marginBottom: 24,
      flexDirection: "row",
      alignItems: "center",
    },

    organizationLogoCard: {
      width: 104,
      height: 104,
      marginRight: 20,

      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 24,

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

    organizationLogo: {
      width: 88,
      height: 88,
    },

    organizationDescriptionContainer: {
      flex: 1,
      minWidth: 0,
    },

    organizationDescription: {
      fontSize: 15,
      lineHeight: 22,
      fontWeight: "700",
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
