// components/navigation/CustomNavBar2.tsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import {
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLeague } from "@/context/LeagueContext";

type IconFamily =
  | "ionicons"
  | "fontAwesome5";

type NavItem = {
  routeName: string;
  label: string;
  icon: string;
  iconFamily?: IconFamily;
  badge?: number;
};

const COLORS = {
  purple: "#250F74",
  white: "#FFFFFF",

  inactive: "#B9AFD8",

  activeCircle:
    "rgba(255,255,255,0.15)",

  divider:
    "rgba(255,255,255,0.22)",

  inactiveDot:
    "rgba(255,255,255,0.38)",

  badgeRed: "#E53935",
  shadow: "#000000",
};

const NAV_ITEMS: NavItem[] = [
  {
    routeName: "league-home",
    label: "Home",
    icon: "home-outline",
  },
  {
    routeName: "schedule",
    label: "Schedule",
    icon: "calendar-outline",
  },
  {
    routeName: "standings",
    label: "Standings",
    icon: "stats-chart-outline",
  },
  {
    routeName: "inbox",
    label: "Inbox",

    // Exact Version 1 Inbox icon.
    icon: "inbox",
    iconFamily: "fontAwesome5",

    badge: 3,
  },
  {
    routeName: "champs",
    label: "Champs",
    icon: "trophy-outline",
  },
  {
    routeName: "search",
    label: "Search",
    icon: "search-outline",
  },
  {
    routeName: "settings",
    label: "Settings",
    icon: "settings-outline",
  },
];

const VISIBLE_ITEM_COUNT = 5;

type SupportedOrganizationId =
  | "tme"
  | "pickup"
  | "taj";

function isSupportedOrganizationId(
  value: unknown,
): value is SupportedOrganizationId {
  return (
    value === "tme" ||
    value === "pickup" ||
    value === "taj"
  );
}

export default function CustomNavBar2({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const router = useRouter();

  const {
    width: screenWidth,
  } = useWindowDimensions();

  const insets = useSafeAreaInsets();

  const scrollRef =
    useRef<ScrollView>(null);

  const [isAtEnd, setIsAtEnd] =
    useState(false);

  /*
   * LeagueContext currently stores the selected
   * organization through selectedLeagueId.
   */
  const leagueContext = useLeague();

  const rawSelectedLeagueId =
    leagueContext.selectedLeagueId;

  const selectedOrganizationId:
    SupportedOrganizationId =
    isSupportedOrganizationId(
      rawSelectedLeagueId,
    )
      ? rawSelectedLeagueId
      : "tme";

  /*
   * Wide, compact navigation pill.
   *
   * This leaves approximately 10 points on each
   * side on a standard iPhone simulator.
   */
  const navWidth = Math.min(
    screenWidth - 20,
    420,
  );

  const navHeight = 66;

  /*
   * Fixed More section.
   */
  const moreWidth = 56;

  const iconsViewportWidth =
    navWidth - moreWidth;

  /*
   * Five navigation icons remain visible.
   */
  const itemWidth =
    iconsViewportWidth /
    VISIBLE_ITEM_COUNT;

  const activeRouteName =
    state.routes[state.index]?.name;

  /*
   * Only show navigation destinations that are
   * registered in the current Tabs navigator.
   */
  const availableItems = useMemo(
    () =>
      NAV_ITEMS.filter((item) =>
        state.routes.some(
          (route) =>
            route.name ===
            item.routeName,
        ),
      ),
    [state.routes],
  );

  const maximumScrollOffset =
    Math.max(
      0,
      itemWidth *
        (availableItems.length -
          VISIBLE_ITEM_COUNT),
    );

  const getRoute = useCallback(
    (routeName: string) =>
      state.routes.find(
        (route) =>
          route.name === routeName,
      ),
    [state.routes],
  );

  /*
   * Home is visually registered as league-home,
   * but pressing it opens the real dynamic
   * organization Home screen:
   *
   * app/(tabs)/league/[leagueSelection].tsx
   */
  const navigateToRoute = useCallback(
    (routeName: string) => {
      if (routeName === "league-home") {
        router.replace({
          pathname:
            "/(tabs)/league/[leagueSelection]",

          params: {
            leagueSelection:
              selectedOrganizationId,
          },
        });

        return;
      }

      const route = getRoute(routeName);

      if (!route) {
        console.warn(
          `CustomNavBar2: route "${routeName}" was not found.`,
        );

        return;
      }

      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (event.defaultPrevented) {
        return;
      }

      navigation.navigate(
        route.name,
        route.params,
      );
    },
    [
      getRoute,
      navigation,
      router,
      selectedOrganizationId,
    ],
  );

  const scrollToStart = useCallback(
    (animated = true) => {
      scrollRef.current?.scrollTo({
        x: 0,
        animated,
      });

      setIsAtEnd(false);
    },
    [],
  );

  const scrollToEnd = useCallback(
    (animated = true) => {
      scrollRef.current?.scrollTo({
        x: maximumScrollOffset,
        animated,
      });

      setIsAtEnd(true);
    },
    [maximumScrollOffset],
  );

  /*
   * Search and Settings automatically display
   * the final navigation position.
   *
   * Home and all primary tabs return to the
   * starting position.
   */
  useEffect(() => {
    const shouldShowEnd =
      activeRouteName === "search" ||
      activeRouteName === "settings";

    if (shouldShowEnd) {
      scrollToEnd(false);
      return;
    }

    scrollToStart(false);
  }, [
    activeRouteName,
    scrollToEnd,
    scrollToStart,
  ]);

  const settleScrollPosition =
    useCallback(
      (offsetX: number) => {
        const shouldShowEnd =
          offsetX >=
          maximumScrollOffset / 2;

        if (shouldShowEnd) {
          scrollToEnd();
          return;
        }

        scrollToStart();
      },
      [
        maximumScrollOffset,
        scrollToEnd,
        scrollToStart,
      ],
    );

  const handleMomentumScrollEnd =
    useCallback(
      (
        event: NativeSyntheticEvent<
          NativeScrollEvent
        >,
      ) => {
        settleScrollPosition(
          event.nativeEvent
            .contentOffset.x,
        );
      },
      [settleScrollPosition],
    );

  const toggleNavigationPosition =
    useCallback(() => {
      if (isAtEnd) {
        scrollToStart();
        return;
      }

      scrollToEnd();
    }, [
      isAtEnd,
      scrollToEnd,
      scrollToStart,
    ]);

  const renderItemIcon = (
    item: NavItem,
    isFocused: boolean,
  ) => {
    const color = isFocused
      ? COLORS.white
      : COLORS.inactive;

    if (
      item.iconFamily ===
      "fontAwesome5"
    ) {
      return (
        <FontAwesome5
          name={
            item.icon as React.ComponentProps<
              typeof FontAwesome5
            >["name"]
          }
          size={18}
          color={color}
        />
      );
    }

    return (
      <Ionicons
        name={
          item.icon as React.ComponentProps<
            typeof Ionicons
          >["name"]
        }
        size={20}
        color={color}
      />
    );
  };

  /*
   * Raised above the iPhone home indicator.
   */
  const bottomPosition = Math.max(
    insets.bottom + 8,
    28,
  );

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.outerContainer,
        {
          bottom: bottomPosition,
        },
      ]}
    >
      <View
        style={[
          styles.navContainer,
          {
            width: navWidth,
            height: navHeight,
            borderRadius:
              navHeight / 2,
          },
        ]}
      >
        {/* Continuous scrolling icon row */}
        <View
          style={[
            styles.iconsViewport,
            {
              width:
                iconsViewportWidth,

              height: navHeight,
            },
          ]}
        >
          <ScrollView
            ref={scrollRef}
            horizontal
            bounces={false}
            showsHorizontalScrollIndicator={
              false
            }
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToOffsets={[
              0,
              maximumScrollOffset,
            ]}
            onMomentumScrollEnd={
              handleMomentumScrollEnd
            }
            contentContainerStyle={[
              styles.scrollContent,
              {
                width:
                  itemWidth *
                  availableItems.length,
              },
            ]}
          >
            {availableItems.map(
              (item) => {
                const route = getRoute(
                  item.routeName,
                );

                if (!route) {
                  return null;
                }

                const descriptor =
                  descriptors[route.key];

                /*
                 * Home should remain selected when
                 * users are viewing either:
                 *
                 * league-home
                 * league/[leagueSelection]
                 */
                const isHomeFocused =
                  item.routeName ===
                    "league-home" &&
                  (activeRouteName ===
                    "league-home" ||
                    activeRouteName ===
                      "league");

                const isFocused =
                  isHomeFocused ||
                  activeRouteName ===
                    item.routeName;

                return (
                  <Pressable
                    key={item.routeName}
                    onPress={() =>
                      navigateToRoute(
                        item.routeName,
                      )
                    }
                    accessibilityRole="button"
                    accessibilityState={
                      isFocused
                        ? {
                            selected:
                              true,
                          }
                        : {}
                    }
                    accessibilityLabel={
                      descriptor
                        ?.options
                        .tabBarAccessibilityLabel ??
                      item.label
                    }
                    style={({
                      pressed,
                    }) => [
                      styles.navItem,

                      {
                        width:
                          itemWidth,

                        height:
                          navHeight,
                      },

                      pressed &&
                        styles.pressed,
                    ]}
                  >
                    <View
                      style={[
                        styles.iconContainer,

                        isFocused &&
                          styles.activeIconContainer,
                      ]}
                    >
                      <View
                        style={
                          styles.iconBadgeAnchor
                        }
                      >
                        {renderItemIcon(
                          item,
                          isFocused,
                        )}

                        {!!item.badge &&
                          item.badge >
                            0 && (
                            <View
                              style={
                                styles.badge
                              }
                            >
                              <Text
                                style={
                                  styles.badgeText
                                }
                              >
                                {item.badge >
                                9
                                  ? "9+"
                                  : item.badge}
                              </Text>
                            </View>
                          )}
                      </View>
                    </View>

                    <Text
                      style={[
                        styles.navLabel,

                        isFocused &&
                          styles.activeNavLabel,
                      ]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {item.label}
                    </Text>

                    {isFocused && (
                      <View
                        style={
                          styles.activeUnderline
                        }
                      />
                    )}
                  </Pressable>
                );
              },
            )}
          </ScrollView>
        </View>

        {/* Fixed More section */}
        <View
          style={[
            styles.moreSection,
            {
              width: moreWidth,
              height: navHeight,
            },
          ]}
        >
          <View
            style={
              styles.moreDivider
            }
          />

          <Pressable
            onPress={
              toggleNavigationPosition
            }
            accessibilityRole="button"
            accessibilityLabel={
              isAtEnd
                ? "Show Home and primary navigation"
                : "Show Search and Settings"
            }
            style={({ pressed }) => [
              styles.moreButton,

              pressed &&
                styles.pressed,
            ]}
          >
            <View
              style={
                styles.moreIconContainer
              }
            >
              <Ionicons
                name="ellipsis-horizontal"
                size={20}
                color={COLORS.white}
              />
            </View>

            <Text
              style={styles.moreLabel}
            >
              More
            </Text>

            <View
              style={
                styles.pageIndicators
              }
            >
              <View
                style={[
                  styles.pageDot,

                  !isAtEnd
                    ? styles.activePageDot
                    : styles.inactivePageDot,
                ]}
              />

              <View
                style={[
                  styles.pageDot,

                  isAtEnd
                    ? styles.activePageDot
                    : styles.inactivePageDot,
                ]}
              />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    outerContainer: {
      position: "absolute",
      left: 0,
      right: 0,

      alignItems: "center",

      zIndex: 100,
    },

    navContainer: {
      flexDirection: "row",

      overflow: "hidden",

      backgroundColor:
        COLORS.purple,

      shadowColor:
        COLORS.shadow,

      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity: 0.2,
      shadowRadius: 8,

      elevation: 10,
    },

    iconsViewport: {
      overflow: "hidden",
    },

    scrollContent: {
      flexDirection: "row",
      alignItems: "center",
    },

    navItem: {
      alignItems: "center",
      justifyContent: "center",

      paddingTop: 1,
      paddingBottom: 1,
    },

    iconContainer: {
      width: 35,
      height: 30,

      borderRadius: 18,

      alignItems: "center",
      justifyContent: "center",
    },

    activeIconContainer: {
      backgroundColor:
        COLORS.activeCircle,
    },

    iconBadgeAnchor: {
      position: "relative",

      alignItems: "center",
      justifyContent: "center",
    },

    navLabel: {
      marginTop: 1,
      paddingHorizontal: 1,

      color: COLORS.inactive,

      fontSize: 8.5,
      lineHeight: 11,

      fontWeight: "700",
      textAlign: "center",
    },

    activeNavLabel: {
      color: COLORS.white,
    },

    activeUnderline: {
      width: 21,
      height: 3,

      marginTop: 3,

      borderRadius: 999,

      backgroundColor:
        COLORS.white,
    },

    /*
     * Version 1 badge:
     *
     * Red background
     * White outline
     * White number
     */
    badge: {
      position: "absolute",

      top: -9,
      right: -12,

      minWidth: 19,
      height: 19,

      paddingHorizontal: 4,

      borderRadius: 10,

      backgroundColor:
        COLORS.badgeRed,

      borderWidth: 2,
      borderColor:
        COLORS.white,

      alignItems: "center",
      justifyContent: "center",

      zIndex: 5,
    },

    badgeText: {
      color: COLORS.white,

      fontSize: 9,
      lineHeight: 11,

      fontWeight: "900",
      textAlign: "center",
    },

    moreSection: {
      flexDirection: "row",
      alignItems: "center",
    },

    moreDivider: {
      width:
        StyleSheet.hairlineWidth,

      height: 39,

      backgroundColor:
        COLORS.divider,
    },

    moreButton: {
      flex: 1,
      height: "100%",

      alignItems: "center",
      justifyContent: "center",

      paddingTop: 1,
      paddingBottom: 1,
    },

    moreIconContainer: {
      width: 35,
      height: 30,

      alignItems: "center",
      justifyContent: "center",
    },

    moreLabel: {
      marginTop: 1,

      color: COLORS.white,

      fontSize: 8.5,
      lineHeight: 11,

      fontWeight: "700",
      textAlign: "center",
    },

    pageIndicators: {
      height: 6,
      marginTop: 3,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      gap: 4,
    },

    pageDot: {
      width: 6,
      height: 6,

      borderRadius: 3,
    },

    activePageDot: {
      backgroundColor:
        COLORS.white,
    },

    inactivePageDot: {
      backgroundColor:
        COLORS.inactiveDot,
    },

    pressed: {
      opacity: 0.58,
    },
  });