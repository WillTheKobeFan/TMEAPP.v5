// app/(tabs)/settings/about.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const COLORS = {
  purple: "#250F74",
  background: "#F6F5FA",
  card: "#FFFFFF",
  text: "#191724",
  secondaryText: "#6D6878",
  border: "#E6E2EC",
  muted: "#9791A3",
};

type AboutRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  onPress: () => void;
};

function AboutRow({
  icon,
  title,
  description,
  onPress,
}: AboutRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.aboutRow,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.rowIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={COLORS.purple}
        />
      </View>

      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>
          {title}
        </Text>

        {description ? (
          <Text style={styles.rowDescription}>
            {description}
          </Text>
        ) : null}
      </View>

      <Ionicons
        name="chevron-forward"
        size={21}
        color={COLORS.muted}
      />
    </Pressable>
  );
}

export default function AboutScreen() {
  const router = useRouter();

  function openRoute(route: string) {
    router.push(route as never);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={25}
              color={COLORS.purple}
            />

            <Text style={styles.backText}>
              Back
            </Text>
          </Pressable>

          <Text style={styles.headerTitle}>
            About
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.scrollContent
          }
        >
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              About the App
            </Text>

            <Text style={styles.infoDescription}>
              View app information, support and
              league legal documents.
            </Text>
          </View>

          <View style={styles.versionCard}>
            <View style={styles.appIcon}>
              <Ionicons
                name="basketball-outline"
                size={28}
                color={COLORS.purple}
              />
            </View>

            <View style={styles.versionTextBlock}>
              <Text style={styles.appName}>
                League App
              </Text>

              <Text style={styles.versionText}>
                Version 1.0.0
              </Text>
            </View>
          </View>

          <View style={styles.linksCard}>
            <AboutRow
              icon="headset-outline"
              title="Contact Support"
              description="Get help with the app"
              onPress={() =>
                openRoute("/contact")
              }
            />

            <View style={styles.divider} />

            <AboutRow
              icon="shield-checkmark-outline"
              title="Privacy Policy"
              onPress={() =>
                openRoute(
                  "/settings/PrivacyPolicy",
                )
              }
            />

            <View style={styles.divider} />

            <AboutRow
              icon="document-text-outline"
              title="Terms of Service"
              onPress={() =>
                openRoute(
                  "/settings/TermsOfService",
                )
              }
            />

            <View style={styles.divider} />

            <AboutRow
              icon="alert-circle-outline"
              title="League Disclaimer"
              description="League participation and information disclaimer"
              onPress={() =>
                openRoute(
                  "/settings/LeagueDisclaimer",
                )
              }
            />

            <View style={styles.divider} />

            <AboutRow
              icon="ribbon-outline"
              title="Copyright"
              description="Copyright and ownership information"
              onPress={() =>
                openRoute(
                  "/settings/Copyright",
                )
              }
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.card,
  },

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    height: 68,
    paddingHorizontal: 16,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 7,
    elevation: 7,
    zIndex: 20,
  },

  backButton: {
    width: 90,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
  },

  backText: {
    color: COLORS.purple,
    fontSize: 15,
    fontWeight: "700",
  },

  headerTitle: {
    flex: 1,
    color: COLORS.purple,
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },

  headerSpacer: {
    width: 90,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 42,
  },

  infoCard: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    alignItems: "center",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  infoTitle: {
    color: COLORS.purple,
    fontSize: 17,
    fontWeight: "800",
  },

  infoDescription: {
    maxWidth: 310,
    marginTop: 7,
    color: COLORS.secondaryText,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },

  versionCard: {
    marginTop: 16,
    padding: 18,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 4,
  },

  appIcon: {
    width: 52,
    height: 52,
    marginRight: 14,
    borderRadius: 26,
    backgroundColor: "#F0ECF9",
    alignItems: "center",
    justifyContent: "center",
  },

  versionTextBlock: {
    flex: 1,
  },

  appName: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
  },

  versionText: {
    marginTop: 4,
    color: COLORS.secondaryText,
    fontSize: 13,
    fontWeight: "600",
  },

  linksCard: {
    marginTop: 16,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: COLORS.card,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 4,
  },

  aboutRow: {
    minHeight: 84,
    flexDirection: "row",
    alignItems: "center",
  },

  rowIcon: {
    width: 41,
    height: 41,
    marginRight: 13,
    borderRadius: 21,
    backgroundColor: "#F0ECF9",
    alignItems: "center",
    justifyContent: "center",
  },

  rowText: {
    flex: 1,
    paddingRight: 12,
  },

  rowTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
  },

  rowDescription: {
    marginTop: 4,
    color: COLORS.secondaryText,
    fontSize: 12.5,
    lineHeight: 17,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
  },

  pressed: {
    opacity: 0.74,
    transform: [{ scale: 0.992 }],
  },
});