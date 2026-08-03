// app/index.tsx

// League Hub screen; changed to Organization Hub

import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type Organization = {
  id: string;
  name: string;
  description: string;
  details: string;
  logo?: ImageSourcePropType;
  logoFallback: string;
};

const organizations: Organization[] = [
  {
    id: "tme",
    name: "TME Social Sports",
    description: "Adult recreational sports leagues",
    details: "Multiple Leagues • Multiple days ",
    logo: require("./assets/logos/tme.png"),
    logoFallback: "TME",
  },
  {
    id: "pickup",
    name: "Pickup Basketball USA",
    description: "Adult and youth sports programs",
    details: "Multiple programs • Multiple days",
    logo: require("./assets/logos/pickup.png"),
    logoFallback: "P",
  },
  {
    id: "taj",
    name: "Taj Hill Hoops",
    description: "Sports leagues, training and events",
    details: "Sports • Leagues • Events",
    logo: require("./assets/logos/taj.png"),
    logoFallback: "THH",
  },
];

export default function LeagueHubScreen() {
  const router = useRouter();

  const openOrganization = (organizationId: string) => {
    router.push({
      pathname: "/(tabs)/league/[leagueSelection]",
      params: {
        leagueSelection: organizationId,
      },
    });
  };

  const openHome = () => {
    router.replace("/");
  };

  const openSettings = () => {
    router.push("/(tabs)/settings");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.screen}>
        {/* Static Header */}
        <View style={styles.header}>
          <Pressable
            onPress={openHome}
            style={({ pressed }) => [
              styles.headerAction,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Go to home"
          >
            <Ionicons
              name="home-outline"
              size={24}
              color={COLORS.textPrimary}
            />

            <Text style={styles.headerActionText}>Home</Text>
          </Pressable>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Organization Hub</Text>
          </View>

          <Pressable
            onPress={openSettings}
            style={({ pressed }) => [
              styles.headerAction,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={COLORS.textPrimary}
            />

            <Text style={styles.headerActionText}>Settings</Text>
          </Pressable>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Slogan */}
          <View style={styles.sloganPill}>
            <Text style={styles.sloganText}>
              Stay Active
              <Text style={styles.sloganDot}> • </Text>
              Stay Informed
              <Text style={styles.sloganDot}> • </Text>
              Stay Connected
            </Text>
          </View>

          {/* Welcome / Information Card */}
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeTopRow}>
              <View style={styles.welcomeIconContainer}>
                <Ionicons
                  name="trophy-outline"
                  size={28}
                  color={COLORS.purple}
                />
              </View>

              <View style={styles.welcomeTextContainer}>
                <Text style={styles.welcomeTitle}>Welcome!</Text>

                <Text style={styles.welcomeDescription}>
                  Your sports league community is all in one place. View
                  schedules, standings, game results, announcements,
                  registration, champions and more.
                </Text>
              </View>
            </View>

            <View style={styles.welcomeDivider} />

            <Text style={styles.welcomeFooter}>
              Everything you need. All in one app.
            </Text>
          </View>

          {/* Organizations Label */}
          <View style={styles.sectionPill}>
            <Text style={styles.sectionPillText}>Organizations</Text>
          </View>

          {/* Organization Tabs */}
          <View style={styles.organizationList}>
            {organizations.map((organization) => (
              <OrganizationCard
                key={organization.id}
                organization={organization}
                onPress={() => openOrganization(organization.id)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

type OrganizationCardProps = {
  organization: Organization;
  onPress: () => void;
};

function OrganizationCard({
  organization,
  onPress,
}: OrganizationCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.organizationCard,
        pressed && styles.organizationCardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Open ${organization.name}`}
      accessibilityHint="Opens this organization's home screen"
    >
      <OrganizationLogo organization={organization} />

      <View style={styles.organizationContent}>
        <Text style={styles.organizationName} numberOfLines={1}>
          {organization.name}
        </Text>

        <Text style={styles.organizationDescription} numberOfLines={2}>
          {organization.description}
        </Text>

        <Text style={styles.organizationDetails} numberOfLines={2}>
          {organization.details}
        </Text>
      </View>

      <View style={styles.chevronContainer}>
        <Ionicons
          name="chevron-forward"
          size={21}
          color={COLORS.chevron}
        />
      </View>
    </Pressable>
  );
}

type OrganizationLogoProps = {
  organization: Organization;
};

function OrganizationLogo({
  organization,
}: OrganizationLogoProps) {
  if (organization.logo) {
    return (
      <View style={styles.organizationLogoContainer}>
        <Image
          source={organization.logo}
          style={styles.organizationLogoImage}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View style={styles.organizationLogoFallback}>
      <Text
        style={styles.organizationLogoFallbackText}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {organization.logoFallback}
      </Text>
    </View>
  );
}

const COLORS = {
  background: "#F7F7FA",
  surface: "#FFFFFF",
  purple: "#250F74",
  lightPurple: "#F1EEFA",
  textPrimary: "#17171C",
  textSecondary: "#65656F",
  border: "#E8E7ED",
  divider: "#ECEBF0",
  chevron: "#A8A5B0",
  shadow: "#000000",
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    minHeight: 82,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: COLORS.surface,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 7,
    elevation: 5,
    zIndex: 10,
  },

  headerAction: {
    width: 68,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },

  headerActionText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: "600",
  },

  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  headerTitle: {
    color: COLORS.purple,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 42,
  },

  sloganPill: {
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 3,
  },

  sloganText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },

  sloganDot: {
    color: COLORS.purple,
  },

  welcomeCard: {
    marginTop: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    elevation: 5,
  },

  welcomeTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  welcomeIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 15,
    backgroundColor: COLORS.lightPurple,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  welcomeTextContainer: {
    flex: 1,
  },

  welcomeTitle: {
    color: COLORS.purple,
    fontSize: 21,
    fontWeight: "800",
  },

  welcomeDescription: {
    marginTop: 6,
    color: COLORS.textSecondary,
    fontSize: 14.5,
    lineHeight: 21,
  },

  welcomeDivider: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.divider,
    marginTop: 18,
    marginBottom: 15,
  },

  welcomeFooter: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  sectionPill: {
    alignSelf: "flex-start",
    marginTop: 24,
    marginBottom: 14,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  sectionPillText: {
    color: COLORS.purple,
    fontSize: 14,
    fontWeight: "800",
  },

  organizationList: {
    gap: 14,
  },

  organizationCard: {
    width: "100%",
    minHeight: 116,
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 9,
    elevation: 4,
  },

  organizationCardPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.985 }],
  },

  organizationLogoContainer: {
    width: 66,
    height: 66,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: 7,
  },

  organizationLogoImage: {
    width: "100%",
    height: "100%",
  },

  organizationLogoFallback: {
    width: 66,
    height: 66,
    borderRadius: 18,
    backgroundColor: COLORS.lightPurple,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  organizationLogoFallbackText: {
    width: "100%",
    color: COLORS.purple,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },

  organizationContent: {
    flex: 1,
    marginLeft: 15,
    paddingRight: 6,
  },

  organizationName: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "800",
  },

  organizationDescription: {
    marginTop: 5,
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 19,
  },

  organizationDetails: {
    marginTop: 7,
    color: COLORS.purple,
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: "700",
  },

  chevronContainer: {
    width: 26,
    minHeight: 66,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  pressed: {
    opacity: 0.55,
  },
});