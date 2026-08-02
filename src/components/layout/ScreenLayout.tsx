// src/components/layout/ScreenLayout.tsx

import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, {
  ReactNode,
  useMemo,
  useState,
} from "react";
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

const HEADER_SIDE_WIDTH = 88;
const HEADER_ACTION_HEIGHT = 82;
const HEADER_ICON_AREA_SIZE = 46;
const HEADER_LABEL_SIZE = 12.5;

export type OrganizationId =
  | "tme"
  | "pickup"
  | "taj";

export type BackButtonVariant =
  | "inline"
  | "stacked"
  | "circle";

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

  selectLeague?: (
    organizationId: OrganizationId,
  ) => void;

  setSelectedLeagueId?: (
    organizationId: OrganizationId,
  ) => void;

  setSelectedOrganizationId?: (
    organizationId: OrganizationId,
  ) => void;
};

export type ScreenLayoutProps = {
  title: string;
  children: ReactNode;

  titleFontSize?: number;
  titleStyle?: StyleProp<TextStyle>;

  showBackButton?: boolean;
  backLabel?: string;
  backButtonVariant?: BackButtonVariant;
  onBackPress?: () => void;

  showOrganizationSelector?: boolean;
  onOrganizationChange?: (
    organizationId: OrganizationId,
  ) => void;

  showSettingsShortcut?: boolean;

  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;

  scrollEnabled?: boolean;
  bottomContentPadding?: number;

  showsVerticalScrollIndicator?: boolean;

  keyboardShouldPersistTaps?:
    | "always"
    | "never"
    | "handled";
};

const ORGANIZATIONS: OrganizationOption[] = [
  {
    id: "tme",
    name: "TME Social Sports",
    shortName: "TME",
    logo: require("../../../app/assets/logos/tme.png"),
  },
  {
    id: "pickup",
    name: "Pickup Basketball USA",
    shortName: "Pickup",
    logo: require("../../../app/assets/logos/pickup.png"),
  },
  {
    id: "taj",
    name: "Taj Hill Hoops",
    shortName: "THH",
    logo: require("../../../app/assets/logos/taj.png"),
  },
];

function isOrganizationId(
  value: unknown,
): value is OrganizationId {
  return (
    value === "tme" ||
    value === "pickup" ||
    value === "taj"
  );
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
        style={{
          width: size,
          height: size,
        }}
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
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.65}
        style={[
          styles.fallbackLogoText,
          {
            fontSize: size * 0.28,
          },
        ]}
      >
        {organization.fallbackText ??
          organization.shortName}
      </Text>
    </View>
  );
}

export default function ScreenLayout({
  title,
  children,

  titleFontSize = 30,
  titleStyle,

  showBackButton = true,
  backLabel = "Back",
  backButtonVariant = "inline",
  onBackPress,

  showOrganizationSelector = true,
  onOrganizationChange,

  showSettingsShortcut = false,

  style,
  contentStyle,

  scrollEnabled = true,
  bottomContentPadding = 150,

  showsVerticalScrollIndicator = false,
  keyboardShouldPersistTaps = "handled",
}: ScreenLayoutProps) {
  const router = useRouter();
  const { textScale } = useTextSize();

  const rawLeagueContext =
    useLeague() as unknown as CompatibleLeagueContext;

  const [
    organizationModalOpen,
    setOrganizationModalOpen,
  ] = useState(false);

  const contextOrganizationId =
    rawLeagueContext.selectedOrganizationId ??
    rawLeagueContext.selectedLeagueId;

  const selectedOrganizationId:
    OrganizationId =
    isOrganizationId(
      contextOrganizationId,
    )
      ? contextOrganizationId
      : "tme";

  const selectedOrganization =
    useMemo<OrganizationOption>(() => {
      return (
        ORGANIZATIONS.find(
          (organization) =>
            organization.id ===
            selectedOrganizationId,
        ) ?? ORGANIZATIONS[0]
      );
    }, [selectedOrganizationId]);

  /*
   * "circle" remains supported so older screens do not break.
   * It now renders the same plain stacked control.
   */
  const usesStackedBackButton =
    backButtonVariant === "stacked" ||
    backButtonVariant === "circle";

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/");
  };

  const updateOrganization = (
    organizationId: OrganizationId,
  ) => {
    if (
      rawLeagueContext
        .setSelectedOrganizationId
    ) {
      rawLeagueContext.setSelectedOrganizationId(
        organizationId,
      );
    } else if (
      rawLeagueContext.selectLeague
    ) {
      rawLeagueContext.selectLeague(
        organizationId,
      );
    } else {
      rawLeagueContext.setSelectedLeagueId?.(
        organizationId,
      );
    }

    setOrganizationModalOpen(false);

    onOrganizationChange?.(
      organizationId,
    );
  };

  const openSettings = () => {
    router.push(
      "/(tabs)/settings" as never,
    );
  };

  const renderBackControl = () => {
    if (!showBackButton) {
      return (
        <View
          style={styles.headerPlaceholder}
        />
      );
    }

    if (usesStackedBackButton) {
      return (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Return to ${backLabel}`}
          activeOpacity={0.68}
          onPress={handleBackPress}
          style={styles.stackedHeaderAction}
        >
          <View
            style={
              styles.stackedHeaderIconArea
            }
          >
            <Ionicons
              name="arrow-back"
              size={32}
              color={COLORS.purple}
            />
          </View>

          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.72}
            style={[
              styles.stackedHeaderLabel,
              {
                fontSize:
                  HEADER_LABEL_SIZE *
                  textScale,
              },
            ]}
          >
            {backLabel}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Go back"
        activeOpacity={0.68}
        onPress={handleBackPress}
        style={styles.inlineBackButton}
      >
        <Ionicons
          name="chevron-back"
          size={28}
          color={COLORS.purple}
        />

        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.78}
          style={[
            styles.inlineBackText,
            {
              fontSize: 14 * textScale,
            },
          ]}
        >
          {backLabel}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.screen,
          style,
        ]}
      >
        {/* STATIC HEADER */}
        <View style={styles.header}>
          <View
            style={styles.leftHeaderSlot}
          >
            {renderBackControl()}
          </View>

          <View
            style={styles.titleContainer}
          >
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={[
                styles.headerTitle,
                {
                  fontSize:
                    titleFontSize *
                    textScale,

                  lineHeight:
                    titleFontSize *
                    1.06 *
                    textScale,
                },
                titleStyle,
              ]}
            >
              {title}
            </Text>
          </View>

          <View
            style={styles.rightHeaderSlot}
          >
            {showOrganizationSelector ? (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={`Open league selector. Currently ${selectedOrganization.name}`}
                accessibilityHint="Opens the organization selection menu"
                activeOpacity={0.68}
                onPress={() =>
                  setOrganizationModalOpen(
                    true,
                  )
                }
                style={
                  styles.stackedHeaderAction
                }
              >
                <View
                  style={
                    styles.stackedHeaderIconArea
                  }
                >
                  <OrganizationLogo
                    organization={
                      selectedOrganization
                    }
                    size={
                      HEADER_ICON_AREA_SIZE
                    }
                  />
                </View>

                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.62}
                  style={[
                    styles.stackedHeaderLabel,
                    {
                      fontSize:
                        HEADER_LABEL_SIZE *
                        textScale,
                    },
                  ]}
                >
                  League Selector
                </Text>
              </TouchableOpacity>
            ) : (
              <View
                style={
                  styles.headerPlaceholder
                }
              />
            )}
          </View>
        </View>

        {/* DYNAMIC MIDDLE CONTENT */}
        {scrollEnabled ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingBottom:
                  bottomContentPadding,
              },
              contentStyle,
            ]}
            showsVerticalScrollIndicator={
              showsVerticalScrollIndicator
            }
            keyboardShouldPersistTaps={
              keyboardShouldPersistTaps
            }
            contentInsetAdjustmentBehavior="never"
            nestedScrollEnabled
          >
            {children}
          </ScrollView>
        ) : (
          <View
            style={[
              styles.content,
              contentStyle,
            ]}
          >
            {children}
          </View>
        )}

        {showSettingsShortcut ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Open Settings"
            activeOpacity={0.82}
            onPress={openSettings}
            style={
              styles.settingsShortcutShadow
            }
          >
            <View
              style={
                styles.settingsShortcut
              }
            >
              <Ionicons
                name="settings-sharp"
                size={31}
                color={COLORS.white}
              />
            </View>
          </TouchableOpacity>
        ) : null}

        {/* ORGANIZATION SELECTOR MODAL */}
        <Modal
          visible={
            organizationModalOpen
          }
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
              <View
                style={styles.modalHeader}
              >
                <View
                  style={
                    styles.modalHeaderText
                  }
                >
                  <Text
                    style={[
                      styles.modalEyebrow,
                      {
                        fontSize:
                          11.5 *
                          textScale,
                      },
                    ]}
                  >
                    CURRENT ORGANIZATION
                  </Text>

                  <Text
                    style={[
                      styles.modalTitle,
                      {
                        fontSize:
                          20 *
                          textScale,
                      },
                    ]}
                  >
                    {
                      selectedOrganization.name
                    }
                  </Text>
                </View>

                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Close organization selector"
                  activeOpacity={0.75}
                  onPress={() =>
                    setOrganizationModalOpen(
                      false,
                    )
                  }
                  style={
                    styles.closeButton
                  }
                >
                  <Ionicons
                    name="close"
                    size={25}
                    color={COLORS.text}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={
                  styles.modalDivider
                }
              />

              <View
                style={
                  styles.organizationList
                }
              >
                {ORGANIZATIONS.map(
                  (organization) => {
                    const selected =
                      organization.id ===
                      selectedOrganizationId;

                    return (
                      <TouchableOpacity
                        key={
                          organization.id
                        }
                        accessibilityRole="radio"
                        accessibilityState={{
                          checked:
                            selected,
                        }}
                        accessibilityLabel={`Select ${organization.name}`}
                        activeOpacity={0.8}
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
                        <View
                          style={
                            styles.modalLogoContainer
                          }
                        >
                          <OrganizationLogo
                            organization={
                              organization
                            }
                            size={48}
                          />
                        </View>

                        <View
                          style={
                            styles.organizationText
                          }
                        >
                          <Text
                            style={[
                              styles.organizationName,
                              {
                                fontSize:
                                  15 *
                                  textScale,
                              },
                              selected &&
                                styles.selectedOrganizationName,
                            ]}
                          >
                            {
                              organization.name
                            }
                          </Text>

                          <Text
                            style={[
                              styles.organizationShortName,
                              {
                                fontSize:
                                  12 *
                                  textScale,
                              },
                            ]}
                          >
                            {
                              organization.shortName
                            }
                          </Text>
                        </View>

                        {selected ? (
                          <View
                            style={
                              styles.selectedCheck
                            }
                          >
                            <Ionicons
                              name="checkmark"
                              size={21}
                              color={
                                COLORS.white
                              }
                            />
                          </View>
                        ) : (
                          <Ionicons
                            name="chevron-forward"
                            size={22}
                            color={
                              COLORS.muted
                            }
                          />
                        )}
                      </TouchableOpacity>
                    );
                  },
                )}
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
    backgroundColor:
      COLORS.background,
  },

  header: {
    minHeight: 106,

    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: COLORS.white,

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

  /*
   * Equal-width side columns keep the title
   * mathematically centered.
   */
  leftHeaderSlot: {
    width: HEADER_SIDE_WIDTH,

    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },

  rightHeaderSlot: {
    width: HEADER_SIDE_WIDTH,

    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },

  headerPlaceholder: {
    width: HEADER_SIDE_WIDTH,
    height: HEADER_ACTION_HEIGHT,
  },

  titleContainer: {
    flex: 1,
    minWidth: 0,

    paddingHorizontal: 8,

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

  /*
   * Both stacked controls share this exact box.
   * Arrow and logo therefore align vertically.
   */
  stackedHeaderAction: {
    width: HEADER_SIDE_WIDTH,
    minHeight: HEADER_ACTION_HEIGHT,

    alignItems: "center",
    justifyContent: "center",
  },

  /*
   * Both the arrow and organization logo occupy
   * the same 46×46 icon area.
   */
  stackedHeaderIconArea: {
    width: HEADER_ICON_AREA_SIZE,
    height: HEADER_ICON_AREA_SIZE,

    alignItems: "center",
    justifyContent: "center",
  },

  /*
   * Both labels use the same width, top margin,
   * size, weight and center alignment.
   */
  stackedHeaderLabel: {
    width: "100%",

    marginTop: 4,

    color: COLORS.purple,

    fontWeight: "800",
    textAlign: "center",
  },

  inlineBackButton: {
    width: HEADER_SIDE_WIDTH,
    minHeight: 54,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  inlineBackText: {
    flexShrink: 1,

    marginLeft: 1,

    color: COLORS.purple,

    fontWeight: "800",
  },

  fallbackLogo: {
    paddingHorizontal: 4,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      COLORS.lightPurple,
  },

  fallbackLogoText: {
    width: "100%",

    color: COLORS.purple,

    fontWeight: "900",
    textAlign: "center",
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
    shadowOffset: {
      width: 0,
      height: 8,
    },
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

    backgroundColor:
      COLORS.lightPurple,
  },

  modalDivider: {
    height:
      StyleSheet.hairlineWidth,

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
    backgroundColor:
      COLORS.lightPurple,
  },

  modalLogoContainer: {
    width: 55,
    height: 55,

    marginRight: 14,

    alignItems: "center",
    justifyContent: "center",

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