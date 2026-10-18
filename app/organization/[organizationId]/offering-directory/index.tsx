import { OFFERING_CATEGORY_IDS, OFFERING_TYPES } from "@/config/offerings";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import StackNavBar from "@/components/navigation/StackNavBar";
import TrainingDirectoryDetails from "@/components/training/TrainingDirectoryDetails";
import {
  ORGANIZATIONS,
  ORGANIZATION_IDS,
  type OrganizationId,
} from "@/config/organizations";
import { getConfiguredOfferingsForOrganization } from "@/data/offerings";
import { AppTheme, useTheme } from "@/theme";
import { toOfferingDirectoryItem } from "@/utils/offeringDirectory";

const HEADER_SIDE_WIDTH = 96;

function isOrganizationId(value: string): value is OrganizationId {
  return Object.values(ORGANIZATION_IDS).includes(
    value as OrganizationId
  );
}

function formatDate(value: string | null) {
  if (!value) return "TBD";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "TBD";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatStatus(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function OfferingDirectoryRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    organizationId?: string;
  }>();

  const { theme, isDark } = useTheme();
  const { width: pageWidth } = useWindowDimensions();

  const styles = useMemo(
    () => createStyles(theme, isDark),
    [theme, isDark]
  );

  const [now, setNow] = useState(() => new Date());
  const [pageIndex, setPageIndex] = useState(0);
  const pagerRef = useRef<ScrollView>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const requestedId =
    typeof params.organizationId === "string"
      ? params.organizationId
      : "";

  const organizationId = isOrganizationId(requestedId)
    ? requestedId
    : null;

  const organization = organizationId
    ? ORGANIZATIONS[organizationId]
    : null;

  const offerings = organizationId
    ? getConfiguredOfferingsForOrganization(organizationId).map(
        toOfferingDirectoryItem
      )
    : [];

  const loopingOfferings =
    offerings.length > 1
      ? [
          offerings[offerings.length - 1],
          ...offerings,
          offerings[0],
        ]
      : offerings;

  const logo =
    organizationId === ORGANIZATION_IDS.TME
      ? require("../../../../assets/logos/tme.png")
      : organizationId === ORGANIZATION_IDS.PICKUP
        ? require("../../../../assets/logos/pickup.png")
        : organizationId === ORGANIZATION_IDS.DEVELOP_NOW
          ? require("../../../../assets/logos/develop-now.jpg")
          : require("../../../../assets/logos/taj.png");

  const headerDate = now
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    .toUpperCase();

  const headerTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.headerSide}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={theme.headerIcon}
              />
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          </View>

          <View style={styles.headerCenter}>
            <Text
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.68}
              style={styles.headerTitle}
            >
              Training Directory
            </Text>
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>{headerDate}</Text>
            <Text style={styles.headerTime}>{headerTime}</Text>
          </View>
        </View>

        {organization && (
          <View style={styles.intro}>
            <View style={styles.logoCard}>
              <Image
                source={logo}
                resizeMode="contain"
                style={styles.logo}
              />
            </View>
            <Text style={styles.introText}>
              Browse programs, schedules{"\n"}and locations.
            </Text>
          </View>
        )}

        {offerings.length > 0 ? (
          <>
            <ScrollView
              ref={pagerRef}
              horizontal
              pagingEnabled
              contentOffset={{
                x: offerings.length > 1 ? pageWidth : 0,
                y: 0,
              }}
              bounces={false}
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / pageWidth
                );

                if (offerings.length <= 1) {
                  setPageIndex(0);
                  return;
                }

                if (index === 0) {
                  setPageIndex(offerings.length - 1);
                  pagerRef.current?.scrollTo({
                    x: offerings.length * pageWidth,
                    animated: false,
                  });
                } else if (index === offerings.length + 1) {
                  setPageIndex(0);
                  pagerRef.current?.scrollTo({
                    x: pageWidth,
                    animated: false,
                  });
                } else {
                  setPageIndex(
                    Math.max(
                      0,
                      Math.min(index - 1, offerings.length - 1)
                    )
                  );
                }
              }}
              style={styles.pager}
            >
              {loopingOfferings.map((offering, loopIndex) => (
                <ScrollView
                  key={`${offering.id}-${loopIndex}`}
                  style={{ width: pageWidth }}
                  contentContainerStyle={styles.pageContent}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.offeringTitle}>
                    {offering.title}
                  </Text>

                  <Text style={styles.description}>
                    {offering.description || formatStatus(offering.type)}
                  </Text>

                  {OFFERING_TYPES[offering.type].category === OFFERING_CATEGORY_IDS.INSTRUCTION ? (
                    <TrainingDirectoryDetails
                      key={offering.id}
                      status={offering.status}
                      details={{
                        sport: offering.sport ?? undefined,
                        format: "To be confirmed",
                        environment: "To be confirmed",
                        focus: offering.trainingFocus ?? undefined,
                        level: "To be confirmed",
                        participants: "To be confirmed",
                        availability: offering.schedule ?? "To be confirmed",
                        location: offering.location ??
                          (offering.multiVenue ? "Multiple Facilities" : "TBD"),
                        description: offering.description,
                      }}
                      onRegistration={
                        offering.hasRegistration && organizationId
                          ? () => router.push({
                              pathname:
                                "/organization/[organizationId]/registration",
                              params: { organizationId },
                            })
                          : undefined
                      }
                    />
                  ) : (
                  <View style={styles.details}>
                    <InfoRow
                      label="Program Status"
                      value={formatStatus(offering.status)}
                      styles={styles}
                    />
                    <InfoRow
                      label="Program Dates"
                      value={
                        offering.startDate || offering.endDate
                          ? `${formatDate(offering.startDate)} – ${formatDate(offering.endDate)}`
                          : "TBD"
                      }
                      styles={styles}
                    />
                    <InfoRow
                      label="Schedule"
                      value={offering.schedule ?? "TBD"}
                      styles={styles}
                    />
                    <InfoRow
                      label="Location"
                      value={
                        offering.location ??
                        (offering.multiVenue
                          ? "Multiple locations • TBD"
                          : "TBD")
                      }
                      styles={styles}
                    />
                  </View>
                  )}

                  {offering.hasRegistration &&
                    OFFERING_TYPES[offering.type].category !== OFFERING_CATEGORY_IDS.INSTRUCTION &&
                    organizationId && (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="View registration information"
                      style={styles.actionCard}
                      onPress={() =>
                        router.push({
                          pathname:
                            "/organization/[organizationId]/registration",
                          params: { organizationId },
                        })
                      }
                    >
                      <Ionicons
                        name="document-text-outline"
                        size={25}
                        color={isDark ? "#FFFFFF" : theme.primary}
                      />
                      <Text style={styles.actionText}>
                        Registration Information
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={22}
                        color={theme.textMuted}
                      />
                    </Pressable>
                  )}
                </ScrollView>
              ))}
            </ScrollView>

            <View style={styles.dots}>
              {offerings.map((offering, index) => (
                <View
                  key={offering.id}
                  style={[
                    styles.dot,
                    index === pageIndex && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          </>
        ) : (
          <Text style={styles.empty}>
            No configured programs available.
          </Text>
        )}

        <StackNavBar />
      </View>
    </SafeAreaView>
  );
}

function InfoRow({
  label,
  value,
  styles,
}: {
  label: string;
  value: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const createStyles = (theme: AppTheme, isDark: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.backgroundSecondary,
    },
    screen: {
      flex: 1,
      minHeight: 0,
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
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 7,
      elevation: 5,
    },
    headerSide: {
      width: HEADER_SIDE_WIDTH,
      justifyContent: "center",
    },
    backButton: {
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
    },
    backText: {
      marginLeft: 2,
      color: theme.headerText,
      fontSize: 15,
      fontWeight: "800",
    },
    headerCenter: {
      flex: 1,
      minWidth: 0,
      paddingHorizontal: 6,
      alignItems: "center",
    },
    headerTitle: {
      width: "100%",
      color: theme.headerText,
      fontSize: 25,
      lineHeight: 28,
      fontWeight: "900",
      textAlign: "center",
    },
    headerRight: {
      width: HEADER_SIDE_WIDTH,
      alignItems: "center",
      justifyContent: "center",
    },
    headerDate: {
      color: theme.headerText,
      fontSize: 13,
      fontWeight: "800",
    },
    headerTime: {
      marginTop: 3,
      color: theme.headerText,
      fontSize: 12,
      fontWeight: "800",
    },
    intro: {
      marginHorizontal: 20,
      marginTop: 20,
      marginBottom: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    logoCard: {
      width: 92,
      height: 92,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.logoSurface,
      alignItems: "center",
      justifyContent: "center",
      padding: 8,
    },
    logo: {
      width: "100%",
      height: "100%",
    },
    introText: {
      flex: 1,
      color: theme.text,
      fontSize: 15,
      textAlign: "center",
    },
    pager: {
      flex: 1,
    },
    pageContent: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 24,
    },
    offeringTitle: {
      color: isDark ? "#FFFFFF" : theme.primary,
      fontSize: 24,
      fontWeight: "800",
      marginBottom: 7,
    },
    description: {
      color: theme.textMuted,
      fontSize: 15,
      marginBottom: 20,
    },
    details: {
      backgroundColor: theme.surface,
      borderRadius: 15,
      padding: 17,
      gap: 18,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 12,
    },
    infoLabel: {
      flex: 1,
      color: isDark ? "#FFFFFF" : theme.primary,
      fontSize: 14,
      fontWeight: "700",
    },
    infoValue: {
      flex: 1,
      color: theme.text,
      fontSize: 14,
      textAlign: "right",
    },
    actionCard: {
      backgroundColor: theme.surface,
      borderRadius: 15,
      padding: 17,
      marginTop: 15,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    actionText: {
      flex: 1,
      color: theme.text,
      fontSize: 15,
      fontWeight: "700",
    },
    dots: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 12,
    },
    dot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: theme.textMuted,
      opacity: 0.35,
    },
    activeDot: {
      backgroundColor: theme.primary,
      opacity: 1,
    },
    empty: {
      marginTop: 40,
      color: theme.textMuted,
      textAlign: "center",
    },
  });
