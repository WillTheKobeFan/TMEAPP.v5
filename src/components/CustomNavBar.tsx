// src/components/CustomNavBar.tsx

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  LayoutChangeEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  router,
  useGlobalSearchParams,
  usePathname,
} from "expo-router";

import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useInbox } from "src/context/InboxContext";

type LeagueId =
  | "tme"
  | "pickup"
  | "taj";

type NavItemId =
  | "home"
  | "schedule"
  | "standings"
  | "inbox"
  | "champs"
  | "search"
  | "settings";

type NavItem = {
  id: NavItemId;
  label: string;
  matchRoutes: string[];
  icon: (
    color: string,
    size: number,
  ) => React.ReactNode;
};

type CustomNavBarProps = {
  /**
   * Optional organization ID supplied by a parent
   * component or LeagueContext.
   *
   * Examples:
   * "tme"
   * "pickup"
   * "taj"
   */
  selectedLeagueId?: LeagueId | string;

  /**
   * Main navigation pill background.
   */
  backgroundColor?: string;
};

const VISIBLE_TAB_COUNT = 5;

const NAV_HEIGHT = 74;
const ICON_SIZE = 22;
const ACTIVE_ICON_SIZE = 24;

const DEFAULT_PURPLE = "#250F74";
const ACTIVE_COLOR = "#FFFFFF";
const INACTIVE_COLOR =
  "rgba(255,255,255,0.68)";

const cleanParam = (
  value:
    | string
    | string[]
    | undefined,
): string => {
  if (Array.isArray(value)) {
    return String(value[0] ?? "").trim();
  }

  return String(value ?? "").trim();
};

export default function CustomNavBar({
  selectedLeagueId,
  backgroundColor = DEFAULT_PURPLE,
}: CustomNavBarProps) {
  const pathname = usePathname();
  const { inboxBadgeCount } = useInbox();

  /**
   * Global params are used because the navbar can be
   * rendered from a layout while a nested screen is active.
   */
  const params = useGlobalSearchParams<{
    leagueSelection?:
      | string
      | string[];
    league?: string | string[];
    leagueId?: string | string[];
  }>();

  const scrollViewRef =
    useRef<ScrollView>(null);

  const [containerWidth, setContainerWidth] =
    useState(0);

  /**
   * When currently on /league/tme, recover "tme"
   * directly from the pathname.
   */
  const pathnameLeagueId = useMemo(() => {
    const match = pathname.match(
      /^\/league\/([^/]+)/,
    );

    return match?.[1]
      ? decodeURIComponent(match[1])
      : "";
  }, [pathname]);

  /**
   * Resolve the selected organization in this order:
   *
   * 1. Explicit prop
   * 2. leagueSelection route param
   * 3. league route param
   * 4. leagueId route param
   * 5. Current /league/:id pathname
   */
  const activeLeagueId = useMemo(
    () => {
      const propLeagueId = String(
        selectedLeagueId ?? "",
      ).trim();

      return (
        propLeagueId ||
        cleanParam(
          params.leagueSelection,
        ) ||
        cleanParam(params.league) ||
        cleanParam(params.leagueId) ||
        pathnameLeagueId ||
        ""
      );
    },
    [
      params.league,
      params.leagueId,
      params.leagueSelection,
      pathnameLeagueId,
      selectedLeagueId,
    ],
  );

  const tabWidth =
    containerWidth > 0
      ? containerWidth /
        VISIBLE_TAB_COUNT
      : 72;

  const navItems = useMemo<NavItem[]>(
    () => [
      {
        id: "home",
        label: "Home",
        matchRoutes: ["/league"],
        icon: (color, size) => (
          <Ionicons
            name="home"
            size={size}
            color={color}
          />
        ),
      },
      {
        id: "schedule",
        label: "Schedule",
        matchRoutes: ["/schedule"],
        icon: (color, size) => (
          <Ionicons
            name="calendar"
            size={size}
            color={color}
          />
        ),
      },
      {
        id: "standings",
        label: "Standings",
        matchRoutes: ["/standings"],
        icon: (color, size) => (
          <Entypo
            name="bar-graph"
            size={size}
            color={color}
          />
        ),
      },
      {
        id: "inbox",
        label: "Inbox",
        matchRoutes: [
          "/inbox",
          "/updates",
          "/messages",
        ],
        icon: (color, size) => (
          <MaterialCommunityIcons
            name="inbox"
            size={size}
            color={color}
          />
        ),
      },
      {
        id: "champs",
        label: "Champs",
        matchRoutes: ["/champs"],
        icon: (color, size) => (
          <FontAwesome5
            name="trophy"
            size={size - 2}
            color={color}
          />
        ),
      },
      {
        id: "search",
        label: "Search",
        matchRoutes: ["/search"],
        icon: (color, size) => (
          <FontAwesome5
            name="search"
            size={size}
            color={color}
          />
        ),
      },
      {
        id: "settings",
        label: "Settings",
        matchRoutes: ["/settings"],
        icon: (color, size) => (
          <FontAwesome6
            name="gear"
            size={size}
            color={color}
          />
        ),
      },
    ],
    [],
  );

  const normalizePath = (
    route: string,
  ): string => {
    if (route === "/") {
      return "/";
    }

    return route.replace(/\/+$/, "");
  };

  const isItemActive = (
    item: NavItem,
  ): boolean => {
    const currentPath =
      normalizePath(pathname);

    if (item.id === "home") {
      return (
        currentPath === "/league" ||
        currentPath.startsWith("/league/")
      );
    }

    return item.matchRoutes.some(
      (route) => {
        const normalizedRoute =
          normalizePath(route);

        return (
          currentPath === normalizedRoute ||
          currentPath.startsWith(
            `${normalizedRoute}/`,
          )
        );
      },
    );
  };

  const activeIndex =
    navItems.findIndex(isItemActive);

  useEffect(() => {
    if (
      containerWidth <= 0 ||
      activeIndex < 0
    ) {
      return;
    }

    const maxStartIndex = Math.max(
      navItems.length -
        VISIBLE_TAB_COUNT,
      0,
    );

    const firstVisibleIndex = Math.min(
      Math.max(
        activeIndex -
          (VISIBLE_TAB_COUNT - 1),
        0,
      ),
      maxStartIndex,
    );

    const targetX =
      firstVisibleIndex * tabWidth;

    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo({
        x: targetX,
        animated: true,
      });
    });
  }, [
    activeIndex,
    containerWidth,
    navItems.length,
    tabWidth,
  ]);

  const handleLayout = (
    event: LayoutChangeEvent,
  ) => {
    const nextWidth =
      event.nativeEvent.layout.width;

    setContainerWidth(
      (currentWidth) =>
        currentWidth === nextWidth
          ? currentWidth
          : nextWidth,
    );
  };

  const requireLeagueId =
    (): string | null => {
      if (activeLeagueId) {
        return activeLeagueId;
      }

      console.warn(
        "CustomNavBar: No selected organization was found. Pass selectedLeagueId or preserve leagueSelection in the route.",
      );

      return null;
    };

  /**
   * Each route is handled explicitly.
   *
   * This avoids passing a broad Href union back into
   * router.push(), which caused the TypeScript error.
   */
  const handleNavigate = (
    itemId: NavItemId,
  ) => {
    if (
      isItemActive(
        navItems.find(
          (item) =>
            item.id === itemId,
        )!,
      )
    ) {
      return;
    }

    const leagueId = requireLeagueId();

    if (!leagueId) {
      return;
    }

    switch (itemId) {
      case "home":
        router.replace({
          pathname:
            "/(tabs)/league/[leagueSelection]",
          params: {
            leagueSelection: leagueId,
          },
        });
        return;

      case "schedule":
        router.push({
          pathname: "/(tabs)/schedule",
          params: {
            leagueSelection: leagueId,
          },
        });
        return;

      case "standings":
        router.push({
          pathname:
            "/(tabs)/standings",
          params: {
            leagueSelection: leagueId,
          },
        });
        return;

      case "inbox":
        router.push({
          pathname: "/(tabs)/inbox",
          params: {
            leagueSelection: leagueId,
          },
        });
        return;

      case "champs":
        router.push({
          pathname: "/(tabs)/champs",
          params: {
            leagueSelection: leagueId,
          },
        });
        return;

      case "search":
        router.push({
          pathname: "/(tabs)/search",
          params: {
            leagueSelection: leagueId,
          },
        });
        return;

      case "settings":
        router.push({
          pathname:
            "/(tabs)/settings",
          params: {
            leagueSelection: leagueId,
          },
        });
        return;

      default:
        return;
    }
  };

  const formatBadgeCount = (
    count: number,
  ): string => {
    const safeCount = Math.max(
      0,
      Math.floor(count),
    );

    return safeCount > 99
      ? "99+"
      : String(safeCount);
  };

  return (
    <View style={styles.wrapper}>
      <View
        onLayout={handleLayout}
        style={[
          styles.navPill,
          {
            backgroundColor,
          },
        ]}
      >
        <ScrollView
          ref={scrollViewRef}
          horizontal
          bounces
          alwaysBounceHorizontal={
            false
          }
          showsHorizontalScrollIndicator={
            false
          }
          directionalLockEnabled
          overScrollMode="never"
          keyboardShouldPersistTaps="handled"
          decelerationRate={
            Platform.OS === "ios"
              ? "fast"
              : 0.92
          }
          scrollEventThrottle={16}
          contentContainerStyle={
            styles.scrollContent
          }
        >
          {navItems.map((item) => {
            const active =
              isItemActive(item);

            const iconColor = active
              ? ACTIVE_COLOR
              : INACTIVE_COLOR;

            const iconSize = active
              ? ACTIVE_ICON_SIZE
              : ICON_SIZE;

            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={`Open ${item.label}`}
                accessibilityState={{
                  selected: active,
                }}
                hitSlop={4}
                onPress={() =>
                  handleNavigate(item.id)
                }
                style={({ pressed }) => [
                  styles.navItem,
                  {
                    width: tabWidth,
                    opacity: pressed
                      ? 0.68
                      : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconArea,
                    active &&
                      styles.activeIconArea,
                  ]}
                >
                  {item.icon(
                    iconColor,
                    iconSize,
                  )}

                  {item.id ===
                    "inbox" &&
                    inboxBadgeCount >
                      0 && (
                      <View
                        style={
                          styles.badgeOuter
                        }
                      >
                        <View
                          style={
                            styles.badgeInner
                          }
                        >
                          <Text
                            numberOfLines={
                              1
                            }
                            adjustsFontSizeToFit
                            minimumFontScale={
                              0.65
                            }
                            style={
                              styles.badgeText
                            }
                          >
                            {formatBadgeCount(
                              inboxBadgeCount,
                            )}
                          </Text>
                        </View>
                      </View>
                    )}
                </View>

                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.75}
                  style={[
                    styles.label,
                    {
                      color: active
                        ? ACTIVE_COLOR
                        : INACTIVE_COLOR,
                    },
                    active &&
                      styles.activeLabel,
                  ]}
                >
                  {item.label}
                </Text>

                <View
                  style={[
                    styles.activeIndicator,
                    active &&
                      styles.activeIndicatorVisible,
                  ]}
                />
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom:
      Platform.OS === "ios"
        ? 10
        : 12,
    backgroundColor: "transparent",
  },

  navPill: {
    width: "100%",
    height: NAV_HEIGHT,
    overflow: "hidden",
    borderRadius: NAV_HEIGHT / 2,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.24,
    shadowRadius: 10,

    elevation: 12,
  },

  scrollContent: {
    height: NAV_HEIGHT,
    alignItems: "center",
  },

  navItem: {
    height: NAV_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 7,
    paddingHorizontal: 2,
  },

  iconArea: {
    minWidth: 40,
    height: 35,
    paddingHorizontal: 8,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  activeIconArea: {
    backgroundColor:
      "rgba(255,255,255,0.12)",
  },

  label: {
    maxWidth: "100%",
    marginTop: 1,
    paddingHorizontal: 2,
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },

  activeLabel: {
    fontWeight: "800",
  },

  activeIndicator: {
    width: 22,
    height: 3,
    marginTop: 4,
    borderRadius: 999,
    backgroundColor: "transparent",
  },

  activeIndicatorVisible: {
    backgroundColor: "#FFFFFF",
  },

  badgeOuter: {
    position: "absolute",
    top: -7,
    right: -9,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 2,

    elevation: 3,
  },

  badgeInner: {
    width: 21,
    height: 21,
    paddingHorizontal: 2,
    borderRadius: 11,
    backgroundColor: "#FF3B30",
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "900",
    textAlign: "center",
  },
});