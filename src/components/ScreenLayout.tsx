// src/components/ScreenLayout.tsx

import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { ReactNode, useMemo, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { useLeague } from "@/context/LeagueContext";
import { useTextSize } from "@/context/TextSizeContext";

const COLORS = {
  purple: "#250F74",
  white: "#FFFFFF",
  background: "#F8F7FB",
  text: "#1E1B24",
  muted: "#706B79",
  border: "#E8E4ED",
  lightPurple: "#F4F0FC",
  overlay: "rgba(20, 13, 37, 0.42)",
};

type OrganizationId = "tme" | "pickup" | "taj";

type OrganizationOption = {
  id: OrganizationId;
  name: string;
  shortName: string;
  logo?: ImageSourcePropType;
  fallbackText?: string;
};

type CompatibleLeagueContext = {
  selectedLeagueId?: string;
  selectedOrganizationId?: string;
  selectLeague?: (id: OrganizationId) => void;
  setSelectedLeagueId?: (id: OrganizationId) => void;
  setSelectedOrganizationId?: (id: OrganizationId) => void;
};

export type ScreenLayoutProps = {
  title: string;
  children: ReactNode;

  titleFontSize?: number;
  onBackPress?: () => void;
  showBackButton?: boolean;
  showOrganizationSelector?: boolean;
  showSettingsShortcut?: boolean;

  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;

  /**
   * The middle area scrolls by default.
   * Set false only when the screen directly renders its own
   * FlatList, SectionList, ScrollView, calendar, or gesture view.
   */
  scrollEnabled?: boolean;

  /**
   * Extra bottom room so the fixed CustomNavBar2 never covers
   * the final card or button.
   */
  bottomContentPadding?: number;

  showsVerticalScrollIndicator?: boolean;
  keyboardShouldPersistTaps?: "always" | "never" | "handled";
};

const ORGANIZATIONS: OrganizationOption[] = [
  {
    id: "tme",
    name: "TME Social Sports",
    shortName: "TME",
    logo: require("../../app/assets/logos/tme.png"),
  },
  {
    id: "pickup",
    name: "Pickup Basketball USA",
    shortName: "Pickup",
    logo: require("../../app/assets/logos/pickup.png"),
  },
  {
    id: "taj",
    name: "Taj Hill Hoops",
    shortName: "THH",
    fallbackText: "🏀",
  },
];

function isOrganizationId(value: unknown): value is OrganizationId {
  return value === "tme" || value === "pickup" || value === "taj";
}

function OrganizationLogo({
  organization,
  size,
}: {
  organization: OrganizationOption;
  size: number;
}) {
  if (organization.logo) {
    return (
      <Image
        source={organization.logo}
        resizeMode="contain"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallbackLogo,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text
        style={[
          styles.fallbackLogoText,
          { fontSize: size * 0.4 },
        ]}
      >
        {organization.fallbackText ?? organization.shortName}
      </Text>
    </View>
  );
}

export default function ScreenLayout({
  title,
  children,
  titleFontSize = 28,
  onBackPress,
  showBackButton = true,
  showOrganizationSelector = true,
  showSettingsShortcut = false,
  style,
  contentStyle,
  titleStyle,
  scrollEnabled = true,
  bottomContentPadding = 150,
  showsVerticalScrollIndicator = false,
  keyboardShouldPersistTaps = "handled",
}: ScreenLayoutProps) {
  const router = useRouter();
  const { textScale } = useTextSize();

  const rawLeagueContext =
    useLeague() as unknown as CompatibleLeagueContext;

  const [organizationModalOpen, setOrganizationModalOpen] =
    useState(false);

  const contextOrganizationId =
    rawLeagueContext.selectedOrganizationId ??
    rawLeagueContext.selectedLeagueId;

  const selectedOrganizationId: OrganizationId =
    isOrganizationId(contextOrganizationId)
      ? contextOrganizationId
      : "tme";

  const selectedOrganization = useMemo<OrganizationOption>(
    () =>
      ORGANIZATIONS.find(
        (organization) =>
          organization.id === selectedOrganizationId,
      ) ?? ORGANIZATIONS[0],
    [selectedOrganizationId],
  );

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/" as never);
  };

  const updateOrganization = (
    organizationId: OrganizationId,
  ) => {
    if (rawLeagueContext.setSelectedOrganizationId) {
      rawLeagueContext.setSelectedOrganizationId(organizationId);
    } else if (rawLeagueContext.selectLeague) {
      rawLeagueContext.selectLeague(organizationId);
    } else if (rawLeagueContext.setSelectedLeagueId) {
      rawLeagueContext.setSelectedLeagueId(organizationId);
    }

    setOrganizationModalOpen(false);
  };

  const openSettings = () => {
    router.push("/(tabs)/settings" as never);
  };

  const middleContent = scrollEnabled ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: bottomContentPadding },
        contentStyle,
      ]}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      contentInsetAdjustmentBehavior="never"
      nestedScrollEnabled
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, contentStyle]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.screen, style]}>
        {/* STATIC HEADER */}
        <View style={styles.header}>
          <View style={styles.leftHeaderSlot}>
            {showBackButton ? (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Go back"
                activeOpacity={0.78}
                onPress={handleBackPress}
                style={styles.backButton}
              >
                <Ionicons
                  name="chevron-back"
                  size={29}
                  color={COLORS.purple}
                />

                <Text
                  numberOfLines={1}
                  style={[
                    styles.backText,
                    { fontSize: 15 * textScale },
                  ]}
                >
                  Back
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.headerPlaceholder} />
            )}
          </View>

          <View style={styles.titleContainer}>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={[
                styles.headerTitle,
                {
                  fontSize: titleFontSize * textScale,
                  lineHeight:
                    titleFontSize * 1.06 * textScale,
                },
                titleStyle,
              ]}
            >
              {title}
            </Text>
          </View>

          <View style={styles.rightHeaderSlot}>
            {showOrganizationSelector ? (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={`Change organization. Currently ${selectedOrganization.name}`}
                activeOpacity={0.82}
                onPress={() =>
                  setOrganizationModalOpen(true)
                }
                style={styles.organizationSelector}
              >
                <View style={styles.headerLogoCircle}>
                  <OrganizationLogo
                    organization={selectedOrganization}
                    size={57}
                  />
                </View>

                <Ionicons
                  name="chevron-down"
                  size={25}
                  color={COLORS.purple}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.headerPlaceholder} />
            )}
          </View>
        </View>

        {/* DYNAMIC / SCROLLABLE MIDDLE */}
        {middleContent}

        {showSettingsShortcut ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Open Settings"
            activeOpacity={0.84}
            onPress={openSettings}
            style={styles.settingsShortcutShadow}
          >
            <View style={styles.settingsShortcut}>
              <Ionicons
                name="settings-sharp"
                size={31}
                color={COLORS.white}
              />
            </View>
          </TouchableOpacity>
        ) : null}

        <Modal
          visible={organizationModalOpen}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() =>
            setOrganizationModalOpen(false)
          }
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() =>
              setOrganizationModalOpen(false)
            }
          >
            <Pressable
              style={styles.modalCard}
              onPress={(event) =>
                event.stopPropagation()
              }
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderText}>
                  <Text
                    style={[
                      styles.modalEyebrow,
                      { fontSize: 11.5 * textScale },
                    ]}
                  >
                    CURRENT ORGANIZATION
                  </Text>

                  <Text
                    style={[
                      styles.modalTitle,
                      { fontSize: 20 * textScale },
                    ]}
                  >
                    {selectedOrganization.name}
                  </Text>
                </View>

                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Close organization selector"
                  activeOpacity={0.78}
                  onPress={() =>
                    setOrganizationModalOpen(false)
                  }
                  style={styles.closeButton}
                >
                  <Ionicons
                    name="close"
                    size={25}
                    color={COLORS.text}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.modalDivider} />

              <View style={styles.organizationList}>
                {ORGANIZATIONS.map((organization) => {
                  const selected =
                    organization.id ===
                    selectedOrganizationId;

                  return (
                    <TouchableOpacity
                      key={organization.id}
                      accessibilityRole="radio"
                      accessibilityState={{
                        checked: selected,
                      }}
                      accessibilityLabel={`Select ${organization.name}`}
                      activeOpacity={0.82}
                      onPress={() =>
                        updateOrganization(
                          organization.id,
                        )
                      }
                      style={[
                        styles.organizationRow,
                        selected &&
                          styles.organizationRowSelected,
                      ]}
                    >
                      <View style={styles.modalLogoCircle}>
                        <OrganizationLogo
                          organization={organization}
                          size={48}
                        />
                      </View>

                      <View style={styles.organizationText}>
                        <Text
                          style={[
                            styles.organizationName,
                            {
                              fontSize: 15 * textScale,
                            },
                            selected &&
                              styles.selectedOrganizationName,
                          ]}
                        >
                          {organization.name}
                        </Text>

                        <Text
                          style={[
                            styles.organizationShortName,
                            {
                              fontSize: 12 * textScale,
                            },
                          ]}
                        >
                          {organization.shortName}
                        </Text>
                      </View>

                      {selected ? (
                        <View style={styles.selectedCheck}>
                          <Ionicons
                            name="checkmark"
                            size={21}
                            color={COLORS.white}
                          />
                        </View>
                      ) : (
                        <Ionicons
                          name="chevron-forward"
                          size={22}
                          color={COLORS.muted}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  screen: {
    flex: 1,
    minHeight: 0,
    backgroundColor: COLORS.background,
  },

  header: {
    minHeight: 100,
    paddingHorizontal: 15,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    zIndex: 30,

    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 7,
  },

  leftHeaderSlot: {
    width: 108,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  rightHeaderSlot: {
    width: 108,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  headerPlaceholder: {
    width: 100,
    height: 62,
  },

  backButton: {
    minWidth: 96,
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
  },

  backText: {
    marginLeft: 1,
    color: COLORS.purple,
    fontWeight: "700",
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
    flexShrink: 1,
    color: COLORS.purple,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -0.7,
  },

  organizationSelector: {
    minWidth: 104,
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    columnGap: 8,
  },

  headerLogoCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,

    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 9,
    elevation: 6,
  },

  fallbackLogo: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightPurple,
  },

  fallbackLogoText: {
    color: COLORS.purple,
    fontWeight: "800",
  },

  content: {
    flex: 1,
    minHeight: 0,
  },

  scrollView: {
    flex: 1,
    minHeight: 0,
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: 18,
  },

  settingsShortcutShadow: {
    position: "absolute",
    right: 17,
    bottom: 118,
    zIndex: 40,
    borderRadius: 28,

    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },

  settingsShortcut: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.purple,
  },

  modalBackdrop: {
    flex: 1,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.overlay,
  },

  modalCard: {
    width: "100%",
    maxWidth: 620,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    overflow: "hidden",

    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 14,
  },

  modalHeader: {
    minHeight: 105,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  modalHeaderText: {
    flex: 1,
    paddingRight: 14,
  },

  modalEyebrow: {
    color: COLORS.muted,
    fontWeight: "800",
    letterSpacing: 1.1,
  },

  modalTitle: {
    marginTop: 5,
    color: COLORS.text,
    fontWeight: "900",
  },

  closeButton: {
    width: 51,
    height: 51,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightPurple,
  },

  modalDivider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 20,
    backgroundColor: COLORS.border,
  },

  organizationList: {
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 17,
  },

  organizationRow: {
    minHeight: 84,
    marginBottom: 11,
    paddingHorizontal: 14,
    borderWidth: 1.2,
    borderColor: COLORS.border,
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },

  organizationRowSelected: {
    borderColor: COLORS.purple,
    backgroundColor: COLORS.lightPurple,
  },

  modalLogoCircle: {
    width: 55,
    height: 55,
    marginRight: 14,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    overflow: "hidden",
  },

  organizationText: {
    flex: 1,
    paddingRight: 12,
  },

  organizationName: {
    color: COLORS.text,
    fontWeight: "800",
  },

  selectedOrganizationName: {
    color: COLORS.purple,
  },

  organizationShortName: {
    marginTop: 3,
    color: COLORS.muted,
    fontWeight: "500",
  },

  selectedCheck: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.purple,
  },
});
