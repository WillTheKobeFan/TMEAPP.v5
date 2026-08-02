// app/(tabs)/settings/TermsofService.tsx

import Ionicons from "@expo/vector-icons/Ionicons";
import { Href, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ScreenLayout from "@/components/ScreenLayout";
import { useTextSize } from "@/context/TextSizeContext";

const COLORS = {
  purple: "#250F74",
  lightPurple: "#F6F2FF",
  background: "#F8F7FB",
  white: "#FFFFFF",
  text: "#1E1B24",
  muted: "#696570",
  border: "#EAE5F2",
  divider: "#F0EDF4",
};

type Section = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

const SECTIONS: Section[] = [
  {
    title: "Acceptance of Terms",
    paragraphs: [
      "By accessing or using the app, you agree to these terms and to any applicable rules published by the organization operating your league.",
    ],
  },
  {
    title: "Application Purpose",
    paragraphs: [
      "The app provides schedules, standings, scores, announcements, league information, support messaging and related administrative services.",
    ],
  },
  {
    title: "Acceptable Use",
    bullets: [
      "Do not interfere with app operation or attempt unauthorized access.",
      "Do not submit unlawful, abusive, deceptive or harmful content.",
      "Use support and communication tools respectfully.",
    ],
  },
  {
    title: "League Rules & Decisions",
    paragraphs: [
      "Eligibility, registration, scheduling, discipline, forfeits, standings and playoff decisions are controlled by each participating organization.",
    ],
  },
  {
    title: "Content Accuracy",
    paragraphs: [
      "Schedules, scores and other information may be corrected or changed by authorized administrators. Users should review current app notices before games.",
    ],
  },
  {
    title: "Service Changes",
    paragraphs: [
      "Features, content and availability may change as the application and participating leagues evolve.",
    ],
  },
  {
    title: "Limitation of Responsibility",
    paragraphs: [
      "To the extent permitted by law, the app is provided without guarantees that it will always be uninterrupted, error-free or suitable for every purpose.",
    ],
  },
];

export default function TermsOfServiceScreen() {
  const router = useRouter();
  const { textScale } = useTextSize();

  const openSupport = () => {
    router.push({
      pathname: "/(tabs)/inbox",
      params: {
        tab: "messages",
        topic: "app-support",
        compose: "support",
      },
    } as Href);
  };

  return (
    <ScreenLayout
      title="Terms of Service"
      titleFontSize={24}
      titleStyle={{ fontWeight: "800" }}
      showSettingsShortcut={false}
    >
      <View style={styles.screen}>
        <View style={styles.contentArea}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.container}>
              <View style={styles.infoCard}>
                <View style={styles.infoIcon}>
                  <Ionicons
                    name="document-text-outline"
                    size={24}
                    color={COLORS.white}
                  />
                </View>

                <View style={styles.infoText}>
                  <Text
                    style={[
                      styles.infoTitle,
                      { fontSize: 16 * textScale },
                    ]}
                  >
                    "TERMS OF SERVICE"
                  </Text>

                  <Text
                    style={[
                      styles.infoDescription,
                      { fontSize: 12.5 * textScale },
                    ]}
                  >
                    "Review the rules governing access to and use of the league application."
                  </Text>
                </View>
              </View>

              <View style={styles.documentCard}>
                <View style={styles.updatedRow}>
                  <Text style={styles.updatedLabel}>
                    Last updated
                  </Text>
                  <Text style={styles.updatedValue}>
                    July 2026
                  </Text>
                </View>

                {SECTIONS.map((section, index) => (
                  <View
                    key={section.title}
                    style={[
                      styles.section,
                      index === SECTIONS.length - 1 &&
                        styles.lastSection,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sectionTitle,
                        { fontSize: 14.5 * textScale },
                      ]}
                    >
                      {section.title}
                    </Text>

                    {section.paragraphs?.map(
                      (paragraph) => (
                        <Text
                          key={paragraph}
                          style={[
                            styles.paragraph,
                            { fontSize: 12.5 * textScale },
                          ]}
                        >
                          {paragraph}
                        </Text>
                      ),
                    )}

                    {section.bullets?.map((bullet) => (
                      <View
                        key={bullet}
                        style={styles.bulletRow}
                      >
                        <View style={styles.bulletDot} />
                        <Text
                          style={[
                            styles.bulletText,
                            { fontSize: 12.5 * textScale },
                          ]}
                        >
                          {bullet}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}

                
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  activeOpacity={0.82}
                  style={styles.secondaryButton}
                  onPress={openSupport}
                >
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={18}
                    color={COLORS.purple}
                  />
                  <Text style={styles.secondaryButtonText}>
                    Contact Support
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.82}
                  style={styles.primaryButton}
                  onPress={() =>
                    router.push(
                      "/(tabs)/settings/LeagueDisclaimer" as Href,
                    )
                  }
                >
                  <Ionicons
                    name="warning-outline"
                    size={18}
                    color={COLORS.white}
                  />
                  <Text style={styles.primaryButtonText}>
                    Disclaimer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
</View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentArea: {
    flex: 1,
    overflow: "hidden",
  },
  scrollContent: {
    paddingTop: 18,
    paddingBottom: 28,
  },
  container: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  infoCard: {
    minHeight: 108,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    shadowColor: "#1E1048",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.11,
    shadowRadius: 9,
    elevation: 5,
  },
  infoIcon: {
    width: 48,
    height: 48,
    marginRight: 13,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.purple,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    color: COLORS.purple,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  infoDescription: {
    marginTop: 5,
    color: COLORS.muted,
    lineHeight: 18,
    fontWeight: "500",
  },
  documentCard: {
    paddingHorizontal: 17,
    paddingVertical: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    shadowColor: "#1E1048",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.11,
    shadowRadius: 10,
    elevation: 5,
  },
  updatedRow: {
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  updatedLabel: {
    color: COLORS.muted,
    fontSize: 11.5,
    fontWeight: "700",
  },
  updatedValue: {
    color: COLORS.purple,
    fontSize: 11.5,
    fontWeight: "800",
  },
  section: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  lastSection: {
    borderBottomWidth: 0,
  },
  sectionTitle: {
    marginBottom: 7,
    color: COLORS.purple,
    fontWeight: "800",
  },
  paragraph: {
    marginBottom: 8,
    color: COLORS.text,
    lineHeight: 19,
    fontWeight: "500",
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 7,
  },
  bulletDot: {
    width: 6,
    height: 6,
    marginTop: 7,
    marginRight: 9,
    borderRadius: 3,
    backgroundColor: COLORS.purple,
  },
  bulletText: {
    flex: 1,
    color: COLORS.text,
    lineHeight: 19,
    fontWeight: "500",
  },
  buttonRow: {
    marginTop: 16,
    flexDirection: "row",
    columnGap: 10,
  },
  primaryButton: {
    flex: 1,
    minHeight: 50,
    paddingHorizontal: 10,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.purple,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 50,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#D8D0EC",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  primaryButtonText: {
    marginLeft: 7,
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "800",
  },
  secondaryButtonText: {
    marginLeft: 7,
    color: COLORS.purple,
    fontSize: 12,
    fontWeight: "800",
  },
  copyrightFooter: {
    paddingTop: 17,
    alignItems: "center",
  },
  copyrightText: {
    color: COLORS.muted,
    fontSize: 11.5,
    lineHeight: 17,
    textAlign: "center",
    fontWeight: "600",
  },
});