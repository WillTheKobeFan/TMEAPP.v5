// app/(tabs)/home.tsx

import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ScreenLayout from "@/components/layout/ScreenLayout";
import { AppTheme, useTheme } from "@/theme";

type Organization = {
  id: string;
  name: string;
  logo: ImageSourcePropType;
};

const ORGANIZATIONS: Organization[] = [
  {
    id: "tme",
    name: "TME Social Sports",
    logo: require("../../assets/logos/tme.png"),
  },
  {
    id: "pickup",
    name: "Pickup Basketball USA",
    logo: require("../../assets/logos/pickup.png"),
  },
  {
    id: "taj",
    name: "Taj Hill Hoops",
    logo: require("../../assets/logos/taj.png"),
  },
];

export default function HomeRoute() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme, isDark);

  const [organizationsOpen, setOrganizationsOpen] = useState(true);

  return (
    <ScreenLayout title="SportSync" contentStyle={styles.content}>
      {/* WELCOME */}
      <View style={styles.welcomeRow}>
        <View style={styles.logoCard}>
          <Image
            source={require("../../assets/logos/sportsync-ss-silver.png")}
            resizeMode="contain"
            style={styles.sportSyncLogo}
          />
        </View>

        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeTitle}>Welcome!</Text>

          <Text style={styles.welcomeTagline}>
            Stay Active · Stay Informed
          </Text>

          <Text style={styles.welcomeTagline}>
            Stay Connected
          </Text>
        </View>
      </View>

      {/* SEARCH */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Search SportSync"
        style={styles.searchBar}
      >
        <Ionicons
          name="search"
          size={23}
          color={isDark ? "#FFFFFF" : theme.primary}
        />

        <Text style={styles.searchText}>
          Search SportSync
        </Text>
      </Pressable>

      {/* ORGANIZATIONS */}
      <View style={styles.section}>
        <View style={styles.categoryShell}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              organizationsOpen
                ? "Collapse Organizations"
                : "Expand Organizations"
            }
            accessibilityState={{
              expanded: organizationsOpen,
            }}
            onPress={() =>
              setOrganizationsOpen((current) => !current)
            }
            style={styles.categoryHeader}
          >
            <View style={styles.categoryIcon}>
              <Ionicons
                name="people-outline"
                size={27}
                color={isDark ? "#FFFFFF" : theme.primary}
              />
            </View>

            <View style={styles.categoryText}>
              <Text style={styles.categoryTitle}>
                Organizations
              </Text>

              <Text style={styles.categoryDescription}>
                Find your organizations
              </Text>
            </View>

            <Ionicons
              name={
                organizationsOpen
                  ? "chevron-down"
                  : "chevron-forward"
              }
              size={23}
              color={theme.textMuted}
            />
          </Pressable>

          {organizationsOpen ? (
            <View style={styles.organizationList}>
              {ORGANIZATIONS.map((organization) => (
                <View key={organization.id}>
                  <View style={styles.divider} />

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={organization.name}
                    onPress={() =>
                      router.push({
                        pathname: "/organization/[organizationId]",
                        params: {
                          organizationId: organization.id,
                        },
                      })
                    }
                    style={styles.organizationRow}
                  >
                    <View style={styles.organizationLogoBox}>
                      <Image
                        source={organization.logo}
                        resizeMode="contain"
                        style={styles.organizationLogo}
                      />
                    </View>

                    <Text
                      numberOfLines={2}
                      style={styles.organizationName}
                    >
                      {organization.name}
                    </Text>

                    <Ionicons
                      name="chevron-forward"
                      size={21}
                      color={theme.textMuted}
                    />
                  </Pressable>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </View>

      {/* TRAINING & DEVELOPMENT */}
      <View style={styles.section}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Training and Development"
          style={styles.categoryShell}
        >
          <View style={styles.categoryHeader}>
            <View style={styles.categoryIcon}>
              <Ionicons
                name="fitness-outline"
                size={27}
                color={isDark ? "#FFFFFF" : theme.primary}
              />
            </View>

            <View style={styles.categoryText}>
              <Text style={styles.categoryTitle}>
                Training & Development
              </Text>

              <Text style={styles.categoryDescription}>
                Programs, sessions & trainers
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={23}
              color={theme.textMuted}
            />
          </View>
        </Pressable>
      </View>

      {/* RESOURCES & SUPPORT */}
      <View style={styles.section}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Resources and Support"
          style={styles.categoryShell}
        >
          <View style={styles.categoryHeader}>
            <View style={styles.categoryIcon}>
              <Ionicons
                name="help-circle-outline"
                size={29}
                color={isDark ? "#FFFFFF" : theme.primary}
              />
            </View>

            <View style={styles.categoryText}>
              <Text style={styles.categoryTitle}>
                Resources & Support
              </Text>

              <Text style={styles.categoryDescription}>
                Help, information & resources
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={23}
              color={theme.textMuted}
            />
          </View>
        </Pressable>
      </View>
    </ScreenLayout>
  );
}

const createStyles = (theme: AppTheme, isDark: boolean) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: 20,
      paddingTop: 24,
    },

    welcomeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
    },

    logoCard: {
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
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 5,

      overflow: "hidden",
    },

    sportSyncLogo: {
      width: 102,
      height: 88,
    },

    welcomeTextContainer: {
      flex: 1,
      minWidth: 0,
    },

    welcomeTitle: {
      marginBottom: 7,
      fontSize: 27,
      fontWeight: "900",
      color: theme.text,
    },

    welcomeTagline: {
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

    section: {
      marginBottom: 16,
    },

    categoryShell: {
      overflow: "hidden",

      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 20,

      backgroundColor: theme.card,
    },

    categoryHeader: {
      minHeight: 88,

      paddingHorizontal: 15,
      paddingVertical: 14,

      flexDirection: "row",
      alignItems: "center",
    },

    categoryIcon: {
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

    categoryText: {
      flex: 1,
      minWidth: 0,
      paddingRight: 8,
    },

    categoryTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: theme.text,
    },

    categoryDescription: {
      marginTop: 4,

      fontSize: 13,
      lineHeight: 18,
      fontWeight: "500",
      color: theme.textMuted,
    },

    organizationList: {
      width: "100%",
    },

    divider: {
      height: StyleSheet.hairlineWidth,
      marginHorizontal: 15,
      backgroundColor: theme.border,
    },

    organizationRow: {
      minHeight: 74,

      paddingHorizontal: 15,
      paddingVertical: 8,

      flexDirection: "row",
      alignItems: "center",
    },

    organizationLogoBox: {
      width: 48,
      height: 48,
      marginRight: 14,

      borderRadius: 12,
      backgroundColor: theme.logoSurface,

      alignItems: "center",
      justifyContent: "center",

      overflow: "hidden",
    },

    organizationLogo: {
      width: 44,
      height: 44,
    },

    organizationName: {
      flex: 1,
      paddingRight: 8,

      fontSize: 15,
      lineHeight: 20,
      fontWeight: "800",
      color: theme.text,
    },
  });
