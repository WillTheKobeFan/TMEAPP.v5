// app/organization/[organizationId]/registration/index.tsx

import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { getConfiguredOfferingsForOrganization } from "@/data/offerings";
import { resolveRegistrationStatus } from "@/utils/registrationStatus";
import { offeringHasCapability } from "@/config/offerings";
import StackNavBar from "@/components/navigation/StackNavBar";
import {
  ORGANIZATIONS,
  ORGANIZATION_IDS,
  type OrganizationId,
} from "@/config/organizations";
import { AppTheme, useTheme } from "@/theme";

const HEADER_SIDE_WIDTH = 96;

type RegistrationStatus = "Open" | "Closed";

type RegistrationOffering = {
  id: string;
  title: string;
  leagueType: string;
  level: string;
  status: RegistrationStatus;
  registrationStart: string;
  registrationEnd: string;
  closesInDays: number;
  reopensOn?: string;
  reopensInDays?: number;
};

function formatRegistrationDate(value?: string | null): string {
  if (!value) return "TBD";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "TBD";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "America/New_York",
  });
}

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

export default function RegistrationInformationRoute() {
  const router = useRouter();

  const params =
    useLocalSearchParams<{
      organizationId?: string;
    }>();

  const { theme, isDark } = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const styles = useMemo(
    () => createStyles(theme, isDark),
    [theme, isDark]
  );

  const pagerRef = useRef<ScrollView>(null);

  const [currentDateTime, setCurrentDateTime] = useState(
    () => new Date()
  );

  const [pageIndex, setPageIndex] = useState(0);

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

  const organizationId: OrganizationId = isOrganizationId(
    requestedId
  )
    ? requestedId
    : ORGANIZATION_IDS.TME;

  const organization = ORGANIZATIONS[organizationId];

  const registrations: RegistrationOffering[] =
    getConfiguredOfferingsForOrganization(organizationId)
      .filter((offering) =>
        offeringHasCapability(offering, "registration")
      )
      .map((offering) => {
        const resolved = resolveRegistrationStatus(
          offering.registration,
          currentDateTime
        );

        const subtitle =
          offering.customFields?.registrationSubtitle;

        const competitionLevel =
          offering.customFields?.competitionLevel;

        return {
          id: offering.id,
          title: offering.shortName ?? offering.name,
          leagueType:
            typeof subtitle === "string"
              ? subtitle
              : offering.audience?.label ??
                offering.name,
          level:
            typeof competitionLevel === "string"
              ? competitionLevel
              : "",
          status: resolved.status,
          registrationStart: formatRegistrationDate(
            offering.registration?.opensAt
          ),
          registrationEnd: formatRegistrationDate(
            offering.registration?.closesAt
          ),
          closesInDays: resolved.closesInDays ?? 0,
          reopensOn: resolved.reopensAt
            ? formatRegistrationDate(resolved.reopensAt)
            : undefined,
          reopensInDays:
            resolved.reopensInDays ?? undefined,
        };
      });

  const organizationLogo =
    organizationId === ORGANIZATION_IDS.TME
      ? require("../../../../assets/logos/tme.png")
      : organizationId === ORGANIZATION_IDS.PICKUP
        ? require("../../../../assets/logos/pickup.png")
        : organizationId === ORGANIZATION_IDS.DEVELOP_NOW
          ? require("../../../../assets/logos/develop-now.jpg")
          : require("../../../../assets/logos/taj.png");

  const pageWidth = screenWidth;

  const handleMomentumEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const nextIndex = Math.round(
      event.nativeEvent.contentOffset.x / pageWidth
    );

    const safeIndex = Math.max(
      0,
      Math.min(
        nextIndex,
        Math.max(registrations.length - 1, 0)
      )
    );

    setPageIndex(safeIndex);
  };

  const handleRegister = (
    registration: RegistrationOffering
  ) => {
    // Universal registration form will connect here next.
    console.log(
      `Register: ${organizationId} / ${registration.id}`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        {/* PERMANENT HEADER */}
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
              minimumFontScale={0.68}
              style={styles.headerTitle}
            >
              Registration Information
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

        {/* REGISTRATION INTRO */}
        <View style={styles.intro}>
          <View style={styles.logoCard}>
            <Image
              source={organizationLogo}
              resizeMode="contain"
              style={styles.logo}
            />
          </View>

          <View style={styles.introTextWrap}>
            <Text style={styles.introText}>
              View registration information
              {"\n"}and sign up.
            </Text>
          </View>
        </View>

        {registrations.length > 0 ? (
          <ScrollView
            ref={pagerRef}
            horizontal
            pagingEnabled
            bounces={false}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleMomentumEnd}
            style={styles.pager}
          >
            {registrations.map((registration) => (
              <View
                key={registration.id}
                style={{
                  width: pageWidth,
                }}
              >
                <View style={styles.pageContent}>
                  {/* LEAGUE IDENTITY */}
                  <View style={styles.leagueIdentity}>
                    <Text style={styles.leagueTitle}>
                      {registration.title}
                    </Text>

                    <Text style={styles.leagueType}>
                      {registration.leagueType}
                      {registration.level
                        ? ` • ${registration.level}`
                        : ""}
                    </Text>
                  </View>

                  {/* REGISTRATION DETAILS */}
                  <View style={styles.registrationDetails}>
                    <View style={styles.registrationRow}>
                      <View style={styles.registrationIcon}>
                        <Ionicons
                          name={
                            registration.status === "Open"
                              ? "checkmark-circle-outline"
                              : "close-circle-outline"
                          }
                          size={22}
                          color={
                            registration.status === "Open"
                              ? "#16A34A"
                              : "#DC2626"
                          }
                        />
                      </View>

                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                          Registration Status:
                        </Text>

                        <Text
                          style={[
                            styles.infoValue,
                            registration.status === "Open"
                              ? styles.openStatus
                              : styles.closedStatus,
                          ]}
                        >
                          {registration.status}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.registrationRow}>
                      <View style={styles.registrationIcon}>
                        <Ionicons
                          name="calendar-outline"
                          size={22}
                          color={isDark ? "#FFFFFF" : theme.primary}
                        />
                      </View>

                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                          Registration Period:
                        </Text>

                        <Text style={styles.infoValue}>
                          {registration.registrationStart === "TBD" &&
                          registration.registrationEnd === "TBD"
                            ? "Dates TBD"
                            : `${registration.registrationStart} – ${registration.registrationEnd}`}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.registrationRow}>
                      <View style={styles.registrationIcon}>
                        <Ionicons
                          name="time-outline"
                          size={22}
                          color={
                            registration.status === "Open"
                              ? isDark
                                ? "#FFFFFF"
                                : theme.primary
                              : "#DC2626"
                          }
                        />
                      </View>

                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>
                          {registration.status === "Open"
                            ? "Registration Closes In:"
                            : "Registration Reopens:"}
                        </Text>

                        <Text style={styles.infoValue}>
                          {registration.status === "Open"
                            ? `${registration.closesInDays} Days`
                            : registration.reopensOn
                              ? `${registration.reopensOn}${
                                  registration.reopensInDays != null
                                    ? ` • ${registration.reopensInDays} Days`
                                    : ""
                                }`
                              : "TBD"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* REGISTER BUTTON */}
                  {registration.status === "Open" ? (
                    <View style={styles.registrationAction}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Register for ${registration.title}`}
                      onPress={() =>
                        handleRegister(registration)
                      }
                      style={({ pressed }) => [
                        styles.registerButton,
                        pressed && styles.registerButtonPressed,
                      ]}
                    >
                      <Text style={styles.registerButtonText}>
                        REGISTER
                      </Text>
                    </Pressable>
                  </View>
                ) : (
                  <View style={styles.registrationNotice}>
                    <Ionicons
                      name="information-circle-outline"
                      size={20}
                      color={theme.textMuted}
                    />
                    <Text style={styles.registrationNoticeText}>
                      {registration.reopensOn
                        ? "Registration is currently closed. Check back on the listed reopening date for availability."
                        : "Registration is currently closed. Reopening date: TBD. Check back for updates."}
                    </Text>
                  </View>
                )}

                <View style={styles.registrationNotice}>
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color={theme.textMuted}
                  />
                  <Text style={styles.registrationNoticeText}>
                    Registration does not guarantee a spot.
                    Availability and participation are subject to
                    organization approval.
                  </Text>
                </View>

                  {/* PAGE DOTS */}
                  <View style={styles.pageDots}>
                    {registrations.map((_, dotIndex) => (
                      <View
                        key={dotIndex}
                        style={[
                          styles.pageDot,
                          dotIndex === pageIndex &&
                            styles.activePageDot,
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="document-text-outline"
              size={36}
              color={theme.textMuted}
            />

            <Text style={styles.emptyTitle}>
              No registration available
            </Text>

            <Text style={styles.emptyDescription}>
              Registration information for{" "}
              {organization?.name ?? "this organization"} will
              appear here.
            </Text>
          </View>
        )}
      </View>

      <StackNavBar />
    </SafeAreaView>
  );
}

const createStyles = (
  theme: AppTheme,
  isDark: boolean
) =>
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
      zIndex: 30,

      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.08,
      shadowRadius: 7,
      elevation: 5,
    },

    leftHeaderSlot: {
      width: HEADER_SIDE_WIDTH,
      alignSelf: "stretch",
      justifyContent: "center",
      alignItems: "flex-start",
    },

    rightHeaderSlot: {
      width: HEADER_SIDE_WIDTH,
      alignSelf: "stretch",
      alignItems: "center",
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

    titleContainer: {
      flex: 1,
      minWidth: 0,
      paddingHorizontal: 6,
      alignItems: "center",
      justifyContent: "center",
    },

    headerTitle: {
      width: "100%",
      color: theme.headerText,
      fontSize: 25,
      lineHeight: 28,
      fontWeight: "900",
      textAlign: "center",
      letterSpacing: -0.6,
    },

    headerDate: {
      width: "100%",
      color: theme.headerText,
      fontSize: 13,
      fontWeight: "800",
      textAlign: "center",
      letterSpacing: 0.3,
    },

    headerTime: {
      width: "100%",
      marginTop: 3,
      color: theme.headerText,
      fontSize: 12,
      fontWeight: "800",
      textAlign: "center",
    },

    intro: {
      marginHorizontal: 20,
      marginTop: 20,
      marginBottom: 14,
      flexDirection: "row",
      alignItems: "center",
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

      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.08,
      shadowRadius: 7,
      elevation: 3,
    },

    logo: {
      width: 76,
      height: 76,
    },

    introTextWrap: {
      flex: 1,
      minWidth: 0,
      paddingLeft: 16,
      paddingRight: 4,
    },

    introText: {
      color: theme.textMuted,
      fontSize: 15,
      lineHeight: 21,
      fontWeight: "700",
    },

    pager: {
      flex: 1,
      minHeight: 0,
    },

    pageContent: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 24,
    },

    leagueIdentity: {
      marginBottom: 22,
      paddingBottom: 16,
      borderBottomWidth:
        StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
    },

    leagueTitle: {
      color: isDark
        ? "#FFFFFF"
        : theme.primary,
      fontSize: 26,
      lineHeight: 31,
      fontWeight: "900",
      letterSpacing: -0.5,
    },

    leagueType: {
      marginTop: 4,
      color: theme.textMuted,
      fontSize: 15,
      lineHeight: 20,
      fontWeight: "700",
    },

    registrationDetails: {
      gap: 18,
    },

    registrationRow: {
      minHeight: 30,
      flexDirection: "row",
      alignItems: "center",
    },

    registrationIcon: {
      width: 34,
      alignItems: "flex-start",
      justifyContent: "center",
    },

    infoRow: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 5,
    },

    detailBlock: {
      gap: 4,
    },

    infoLabel: {
      color: isDark
        ? "#FFFFFF"
        : theme.primary,
      fontSize: 15,
      lineHeight: 20,
      fontWeight: "900",
    },

    infoValue: {
      color: theme.text,
      fontSize: 15,
      lineHeight: 20,
      fontWeight: "900",
    },

    detailValue: {
      color: theme.text,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: "800",
    },

    openStatus: {
      color: "#16A34A",
      fontWeight: "900",
    },

    closedStatus: {
      color: "#DC2626",
      fontWeight: "900",
    },

    registrationAction: {
      marginTop: 34,
      alignItems: "center",
    },

    registrationNotice: {
      maxWidth: 350,
      marginTop: 16,
      paddingHorizontal: 8,
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "center",
      gap: 8,
    },

    registrationNoticeText: {
      flex: 1,
      color: theme.textMuted,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "700",
      textAlign: "center",
    },

    registerButton: {
      width: 165,
      minHeight: 46,
      alignSelf: "center",
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,

      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 5,
      elevation: 2,
    },

    registerButtonPressed: {
      opacity: 0.82,
    },

    registerButtonDisabled: {
      opacity: 0.45,
    },

    registerButtonText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "900",
      letterSpacing: 0.5,
    },

    pageDots: {
      minHeight: 28,
      marginTop: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
    },

    pageDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: isDark
        ? "rgba(255,255,255,0.28)"
        : "rgba(0,0,0,0.20)",
    },

    activePageDot: {
      width: 9,
      height: 9,
      borderRadius: 5,
      backgroundColor: theme.primary,
    },

    emptyState: {
      marginHorizontal: 20,
      marginTop: 20,
      paddingHorizontal: 24,
      paddingVertical: 40,
      alignItems: "center",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
    },

    emptyTitle: {
      marginTop: 12,
      color: theme.text,
      fontSize: 18,
      fontWeight: "900",
    },

    emptyDescription: {
      marginTop: 6,
      color: theme.textMuted,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "600",
      textAlign: "center",
    },
  });
