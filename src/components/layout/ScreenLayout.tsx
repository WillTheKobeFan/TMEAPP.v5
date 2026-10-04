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
import { useTheme } from "@/theme";

const HEADER_SIDE_WIDTH = 88;
const HEADER_ACTION_HEIGHT = 82;
const HEADER_ICON_AREA_SIZE = 46;
const HEADER_LABEL_SIZE = 12.5;

const OVERLAY_COLOR = "rgba(0, 0, 0, 0.48)";
const SHADOW_COLOR = "#000000";

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
    logo: require("../../../assets/logos/tme.png"),
  },
  {
    id: "pickup",
    name: "Pickup Basketball USA",
    shortName: "Pickup",
    logo: require("../../../assets/logos/pickup.png"),
  },
  {
    id: "taj",
    name: "Taj Hill Hoops",
    shortName: "THH",
    logo: require("../../../assets/logos/taj.png"),
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

type OrganizationLogoProps = {
  organization: OrganizationOption;
  size: number;
  fallbackBackgroundColor: string;
  fallbackTextColor: string;
};

function OrganizationLogo({
  organization,
  size,
  fallbackBackgroundColor,
  fallbackTextColor,
}: OrganizationLogoProps) {
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
          backgroundColor:
            fallbackBackgroundColor,
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
            color: fallbackTextColor,
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
  const { theme } = useTheme();

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
   * "circle" remains supported for compatibility
   * with older V1 screens.
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
              color={theme.headerIcon}
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
                color: theme.headerText,
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
          color={theme.headerIcon}
        />

        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.78}
          style={[
            styles.inlineBackText,
            {
              fontSize: 14 * textScale,
              color: theme.headerText,
            },
          ]}
        >
          {backLabel}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor:
            theme.backgroundSecondary,
        },
      ]}
    >
      <View
        style={[
          styles.screen,
          {
            backgroundColor:
              theme.background,
          },
          style,
        ]}
      >
        {/* STATIC HEADER */}
        <View
          style={[
            styles.header,
            {
              backgroundColor:
                theme.surface,
            },
          ]}
        >
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

                  color: theme.headerText,
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
                  <View
                    style={[
                      styles.logoSafeArea,
                      {
                        backgroundColor:
                          theme.logoSurface,
                        borderColor:
                          theme.logoBorder,
                      },
                    ]}
                  >
                    <OrganizationLogo
                      organization={
                        selectedOrganization
                      }
                      size={
                        HEADER_ICON_AREA_SIZE - 8
                      }
                      fallbackBackgroundColor={
                        theme.primarySoft
                      }
                      fallbackTextColor={
                        theme.primary
                      }
                    />
                  </View>
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
                      color: theme.headerText,
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
            style={[
              styles.scrollView,
              {
                backgroundColor:
                  theme.background,
              },
            ]}
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
              {
                backgroundColor:
                  theme.background,
              },
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
              style={[
                styles.settingsShortcut,
                {
                  backgroundColor:
                    theme.buttonBackground,
                },
              ]}
            >
              <Ionicons
                name="settings-sharp"
                size={31}
                color={theme.buttonText}
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
            style={[
              styles.modalBackdrop,
              {
                backgroundColor:
                  OVERLAY_COLOR,
              },
            ]}
            onPress={() =>
              setOrganizationModalOpen(false)
            }
          >
            <Pressable
              style={[
                styles.modalCard,
                {
                  backgroundColor:
                    theme.card,
                },
              ]}
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
                        color:
                          theme.textMuted,
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
                        color: theme.text,
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
                  style={[
                    styles.closeButton,
                    {
                      backgroundColor:
                        theme.primarySoft,
                    },
                  ]}
                >
                  <Ionicons
                    name="close"
                    size={25}
                    color={theme.text}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.modalDivider,
                  {
                    backgroundColor:
                      theme.border,
                  },
                ]}
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
                          {
                            borderColor:
                              selected
                                ? theme.primary
                                : theme.border,

                            backgroundColor:
                              selected
                                ? theme.primarySoft
                                : theme.surface,
                          },
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
                            fallbackBackgroundColor={
                              theme.primarySoft
                            }
                            fallbackTextColor={
                              theme.primary
                            }
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

                                color:
                                  selected
                                    ? theme.primary
                                    : theme.text,
                              },
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

                                color:
                                  theme.textMuted,
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
                            style={[
                              styles.selectedCheck,
                              {
                                backgroundColor:
                                  theme.primary,
                              },
                            ]}
                          >
                            <Ionicons
                              name="checkmark"
                              size={21}
                              color={
                                theme.buttonText
                              }
                            />
                          </View>
                        ) : (
                          <Ionicons
                            name="chevron-forward"
                            size={22}
                            color={
                              theme.textMuted
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
  },

  screen: {
    flex: 1,
    minHeight: 0,
  },

  header: {
    minHeight: 106,

    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,

    flexDirection: "row",
    alignItems: "center",

    zIndex: 30,

    shadowColor: SHADOW_COLOR,
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

    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -0.7,
  },

  stackedHeaderAction: {
    width: HEADER_SIDE_WIDTH,
    minHeight: HEADER_ACTION_HEIGHT,

    alignItems: "center",
    justifyContent: "center",
  },

  stackedHeaderIconArea: {
    width: HEADER_ICON_AREA_SIZE,
    height: HEADER_ICON_AREA_SIZE,

    alignItems: "center",
    justifyContent: "center",
  },

  stackedHeaderLabel: {
    width: "100%",

    marginTop: 4,

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

    fontWeight: "800",
  },

  logoSafeArea: {
    width: HEADER_ICON_AREA_SIZE,
    height: HEADER_ICON_AREA_SIZE,

    borderWidth: 1,
    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",

    overflow: "hidden",
  },

  fallbackLogo: {
    paddingHorizontal: 4,

    alignItems: "center",
    justifyContent: "center",
  },

  fallbackLogoText: {
    width: "100%",

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

    shadowColor: SHADOW_COLOR,
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
  },

  modalBackdrop: {
    flex: 1,

    paddingHorizontal: 18,

    alignItems: "center",
    justifyContent: "center",
  },

  modalCard: {
    width: "100%",
    maxWidth: 620,

    borderRadius: 25,

    overflow: "hidden",

    shadowColor: SHADOW_COLOR,
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
    fontWeight: "800",
    letterSpacing: 1.1,
  },

  modalTitle: {
    marginTop: 5,

    fontWeight: "900",
  },

  closeButton: {
    width: 51,
    height: 51,

    borderRadius: 26,

    alignItems: "center",
    justifyContent: "center",
  },

  modalDivider: {
    height:
      StyleSheet.hairlineWidth,

    marginHorizontal: 20,
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
    borderRadius: 19,

    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "800",
  },

  organizationShortName: {
    marginTop: 3,

    fontWeight: "500",
  },

  selectedCheck: {
    width: 40,
    height: 40,

    borderRadius: 20,

    alignItems: "center",
    justifyContent: "center",
  },
});
