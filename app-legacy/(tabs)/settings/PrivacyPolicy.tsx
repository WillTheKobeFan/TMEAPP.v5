// app/(tabs)/settings/PrivacyPolicy.tsx

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
    title: "Information We Collect",
    paragraphs: [
      "The app may receive information submitted through registration forms, support messages, league administration tools and optional profile or roster features.",
    ],
  },
  {
    title: "How Information Is Used",
    bullets: [
      "Operate schedules, standings, results and league communications.",
      "Respond to support requests and administrative questions.",
      "Maintain app security and improve the user experience.",
    ],
  },
  {
    title: "Information Sharing",
    paragraphs: [
      "Personal information is not sold. Information may be available to authorized organization or league administrators when reasonably required to operate their leagues.",
    ],
  },
  {
    title: "Youth Participants",
    paragraphs: [
      "Organizations that operate youth leagues are responsible for obtaining any consent required from a parent or legal guardian.",
    ],
  },
  {
    title: "Data Retention & Security",
    paragraphs: [
      "Information is retained only as reasonably necessary for league operations, legal obligations and support. Reasonable safeguards are used, but no digital system can guarantee absolute security.",
    ],
  },
  {
    title: "Third-Party Services",
    paragraphs: [
      "The app may rely on hosting, analytics, notification or storage providers. Their handling of information may also be governed by their own policies.",
    ],
  },
  {
    title: "Policy Updates",
    paragraphs: [
      "This policy may be updated as the app and participating organizations evolve. The latest version and effective date will appear on this screen.",
    ],
  },
];

export default function PrivacyPolicyScreen() {
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
      title="Privacy Policy"
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
                    name="shield-checkmark-outline"
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
                    "PRIVACY POLICY"
                  </Text>

                  <Text
                    style={[
                      styles.infoDescription,
                      { fontSize: 12.5 * textScale },
                    ]}
                  >
                    "Learn what information may be collected, how it is used and the choices available to users."
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
                      "/(tabs)/settings/TermsofService" as Href,
                    )
                  }
                >
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color={COLORS.white}
                  />
                  <Text style={styles.primaryButtonText}>
                    View Terms
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