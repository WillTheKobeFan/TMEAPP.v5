// app/dev/offering-preview.tsx

import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import OfferingCard from "@/components/cards/OfferingCard";

import {
  getOfferingById,
} from "@/data/offerings";

// =============================================================================
// PREVIEW OFFERINGS
// =============================================================================

const PREVIEW_OFFERING_IDS = [
  "tme-sunday-mens-basketball",
  "pickup-youth-development-league",
  "pickup-summer-camp",
  "pickup-private-training",
  "pickup-membership",
  "pickup-court-rental",
  "pickup-parties",
] as const;

// =============================================================================
// SCREEN
// =============================================================================

export default function OfferingPreviewScreen() {
  const offerings = PREVIEW_OFFERING_IDS
    .map((offeringId) =>
      getOfferingById(offeringId)
    )
    .filter(
      (
        offering
      ): offering is NonNullable<
        ReturnType<typeof getOfferingById>
      > => offering !== undefined
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={
          styles.contentContainer
        }
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            DAY 7 • DEVELOPMENT PREVIEW
          </Text>

          <Text style={styles.title}>
            Universal Offerings
          </Text>

          <Text style={styles.subtitle}>
            One reusable template adapting to
            different organization programs.
          </Text>
        </View>

        {/* LEAGUE */}
        <PreviewSection
          label="League"
          description="Competition-based offering"
        >
          {offerings[0] && (
            <OfferingCard
              offering={offerings[0]}
              onPress={(offering) => {
                console.log(
                  "Pressed:",
                  offering.id
                );
              }}
              onActionPress={(offering) => {
                console.log(
                  "Action:",
                  offering.id
                );
              }}
            />
          )}
        </PreviewSection>

        {/* YOUTH LEAGUE */}
        <PreviewSection
          label="Youth Program"
          description="League + development capabilities"
        >
          {offerings[1] && (
            <OfferingCard
              offering={offerings[1]}
              onActionPress={(offering) => {
                console.log(
                  "Action:",
                  offering.id
                );
              }}
            />
          )}
        </PreviewSection>

        {/* CAMP */}
        <PreviewSection
          label="Camp"
          description="Registration + attendance + media"
        >
          {offerings[2] && (
            <OfferingCard
              offering={offerings[2]}
              onActionPress={(offering) => {
                console.log(
                  "Action:",
                  offering.id
                );
              }}
            />
          )}
        </PreviewSection>

        {/* TRAINING */}
        <PreviewSection
          label="Training"
          description="Bookable development program"
        >
          {offerings[3] && (
            <OfferingCard
              offering={offerings[3]}
              onActionPress={(offering) => {
                console.log(
                  "Action:",
                  offering.id
                );
              }}
            />
          )}
        </PreviewSection>

        {/* MEMBERSHIP */}
        <PreviewSection
          label="Membership"
          description="Organization access offering"
        >
          {offerings[4] && (
            <OfferingCard
              offering={offerings[4]}
              onActionPress={(offering) => {
                console.log(
                  "Action:",
                  offering.id
                );
              }}
            />
          )}
        </PreviewSection>

        {/* RENTAL */}
        <PreviewSection
          label="Rental"
          description="Reservable organization resource"
        >
          {offerings[5] && (
            <OfferingCard
              offering={offerings[5]}
              onActionPress={(offering) => {
                console.log(
                  "Action:",
                  offering.id
                );
              }}
            />
          )}
        </PreviewSection>

        {/* EVENT / PARTY */}
        <PreviewSection
          label="Event / Package"
          description="Bookable special offering"
        >
          {offerings[6] && (
            <OfferingCard
              offering={offerings[6]}
              onActionPress={(offering) => {
                console.log(
                  "Action:",
                  offering.id
                );
              }}
            />
          )}
        </PreviewSection>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

// =============================================================================
// PREVIEW SECTION
// =============================================================================

type PreviewSectionProps = {
  label: string;
  description: string;
  children: React.ReactNode;
};

function PreviewSection({
  label,
  description,
  children,
}: PreviewSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>
          {label}
        </Text>

        <Text style={styles.sectionDescription}>
          {description}
        </Text>
      </View>

      {children}
    </View>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F5FA",
  },

  screen: {
    flex: 1,
    backgroundColor: "#F7F5FA",
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  header: {
    marginBottom: 26,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "800",

    letterSpacing: 0.8,

    color: "#6E6590",

    marginBottom: 7,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",

    color: "#17131F",
  },

  subtitle: {
    marginTop: 7,

    maxWidth: 340,

    fontSize: 14,
    fontWeight: "500",

    lineHeight: 20,

    color: "#716C7A",
  },

  section: {
    marginBottom: 26,
  },

  sectionHeader: {
    marginBottom: 9,
    paddingHorizontal: 2,
  },

  sectionLabel: {
    fontSize: 15,
    fontWeight: "800",

    color: "#2A2630",
  },

  sectionDescription: {
    marginTop: 2,

    fontSize: 12,
    fontWeight: "500",

    color: "#8A8492",
  },

  bottomSpacer: {
    height: 40,
  },
});