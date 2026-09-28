// src/components/CustomNavBar2.tsx

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
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useMembership } from "src/context/MembershipContext";

import {
  getAccessibleFeatureIds,
} from "src/config/permissions";

import {
  FEATURE_IDS,
  type FeatureId,
} from "src/config/features";

const COLORS = {
  purple: "#250F74",
  white: "#FFFFFF",
  inactive: "rgba(255, 255, 255, 0.70)",
  selectedCircle: "rgba(255, 255, 255, 0.16)",
  pressed: "rgba(255, 255, 255, 0.10)",
  divider: "rgba(255, 255, 255, 0.12)",
  inactiveDot: "rgba(255, 255, 255, 0.35)",
  badge: "#D92D20",
};

const NAV_HORIZONTAL_MARGIN = 12;
const NAV_TOP_MARGIN = 6;
const NAV_BORDER_RADIUS = 28;
const MORE_SECTION_WIDTH = 62;

/**
 * Number of icons visible at one time
 * to the left of the fixed More section.
 */
const ICONS_PER_PAGE = 5;

/**
 * Number of icons repeated between pages.
 *
 * Current layout:
 *
 * Page 1:
 * Home, Schedule, Standings, Inbox, Champs
 *
 * Page 2:
 * Inbox, Champs, Progression, Search, Settings
 */
const PAGE_OVERLAP = 2;

/**
 * Preferred navbar order.
 *
 * To add another icon later:
 *
 * 1. Add the route to app/(tabs)/_layout.tsx.
 * 2. Add its route name here.
 * 3. Add its icon configuration to TAB_CONFIG.
 * 4. Add its feature mapping to ROUTE_FEATURE_MAP.
 *
 * Routes are only shown when their mapped feature
 * is accessible to the active membership.
 */

const NAV_ROUTE_ORDER = [
  "home",
  "schedule",
  "standings",
  "inbox",
  "champs",
  "progression",
  "search",
  "settings",
] as const;

const ROUTE_FEATURE_MAP: Partial<
  Record<string, FeatureId>
> = {
  home: FEATURE_IDS.HOME,
  schedule: FEATURE_IDS.SCHEDULE,
  standings: FEATURE_IDS.STANDINGS,
  inbox: FEATURE_IDS.INBOX,
  champs: FEATURE_IDS.CHAMPS,
  progression: FEATURE_IDS.PROGRESS,
  search: FEATURE_IDS.SEARCH,
  settings: FEATURE_IDS.SETTINGS,
};

type TabRoute =
  BottomTabBarProps["state"]["routes"][number];

type IoniconsName =
  React.ComponentProps<typeof Ionicons>["name"];

type FontAwesome5Name =
  React.ComponentProps<typeof FontAwesome5>["name"];

type EntypoName =
  React.ComponentProps<typeof Entypo>["name"];

type IconFamily =
  | "ionicons"
  | "fontAwesome5"
  | "entypo";

type TabIconConfig = {
  family: IconFamily;
  activeIcon:
    | IoniconsName
    | FontAwesome5Name
    | EntypoName;
  inactiveIcon:
    | IoniconsName
    | FontAwesome5Name
    | EntypoName;
  label: string;
  size: number;
};

const TAB_CONFIG: Record<
  string,
  TabIconConfig
> = {
  home: {
    family: "ionicons",
    activeIcon: "home",
    inactiveIcon: "home-outline",
    label: "Home",
    size: 21,
  },

  schedule: {
    family: "ionicons",
    activeIcon: "calendar",
    inactiveIcon: "calendar-outline",
    label: "Schedule",
    size: 21,
  },

  standings: {
    family: "entypo",
    activeIcon: "bar-graph",
    inactiveIcon: "bar-graph",
    label: "Standings",
    size: 22,
  },

  inbox: {
    family: "fontAwesome5",
    activeIcon: "inbox",
    inactiveIcon: "inbox",
    label: "Inbox",
    size: 18,
  },

  champs: {
    family: "ionicons",
    activeIcon: "trophy",
    inactiveIcon: "trophy-outline",
    label: "Champs",
    size: 21,
  },

  progression: {
    family: "entypo",
    activeIcon: "progress-two",
    inactiveIcon: "progress-two",
    label: "Progression",
    size: 23,
  },

  search: {
    family: "ionicons",
    activeIcon: "search",
    inactiveIcon: "search-outline",
    label: "Search",
    size: 22,
  },

  settings: {
    family: "ionicons",
    activeIcon: "settings",
    inactiveIcon: "settings-outline",
    label: "Settings",
    size: 21,
  },
};

function getTabConfig(
  routeName: string
): TabIconConfig {
  return (
    TAB_CONFIG[routeName] ?? {
      family: "ionicons",
      activeIcon: "ellipse",
      inactiveIcon: "ellipse-outline",
      label: routeName,
      size: 20,
    }
  );
}

type NavIconProps = {
  routeName: string;
  focused: boolean;
};

function NavIcon({
  routeName,
  focused,
}: NavIconProps) {
  const config = getTabConfig(routeName);

  const iconName = focused
    ? config.activeIcon
    : config.inactiveIcon;

  const iconColor = focused
    ? COLORS.white
    : COLORS.inactive;

  if (config.family === "fontAwesome5") {
    return (
      <FontAwesome5
        name={
          iconName as FontAwesome5Name
        }
        size={config.size}
        color={iconColor}
        solid={focused}
      />
    );
  }

  if (config.family === "entypo") {
    return (
      <Entypo
        name={iconName as EntypoName}
        size={config.size}
        color={iconColor}
      />
    );
  }

  return (
    <Ionicons
      name={iconName as IoniconsName}
      size={config.size}
      color={iconColor}
    />
  );
}

type BadgeProps = {
  value: string | number;
};

function Badge({
  value,
}: BadgeProps) {
  const displayValue =
    typeof value === "number" &&
    value > 99
      ? "99+"
      : String(value);

  return (
    <View style={styles.badge}>
      <Text
        numberOfLines={1}
        style={styles.badgeText}
      >
        {displayValue}
      </Text>
    </View>
  );
}

/**
 * Creates full overlapping pages.
 *
 * Example with eight routes:
 *
 * Page 1:
 * routes 0–4
 *
 * Page 2:
 * routes 3–7
 *
 * Additional routes automatically create more pages.
 */
function createNavigationPages(
  routes: TabRoute[]
): TabRoute[][] {
  if (routes.length === 0) {
    return [];
  }

  if (routes.length <= ICONS_PER_PAGE) {
    return [routes];
  }

  const pages: TabRoute[][] = [];

  const pageStep = Math.max(
    ICONS_PER_PAGE - PAGE_OVERLAP,
    1
  );

  let startIndex = 0;

  while (startIndex < routes.length) {
    let pageRoutes = routes.slice(
      startIndex,
      startIndex + ICONS_PER_PAGE
    );

    /**
     * Shift the final page backward so it remains full.
     */
    if (
      pageRoutes.length < ICONS_PER_PAGE &&
      routes.length >= ICONS_PER_PAGE
    ) {
      pageRoutes = routes.slice(
        routes.length - ICONS_PER_PAGE
      );
    }

    const previousPage =
      pages[pages.length - 1];

    const duplicatePage =
      previousPage?.length ===
        pageRoutes.length &&
      previousPage.every(
        (route, index) =>
          route.key ===
          pageRoutes[index]?.key
      );

    if (!duplicatePage) {
      pages.push(pageRoutes);
    }

    if (
      startIndex + ICONS_PER_PAGE >=
      routes.length
    ) {
      break;
    }

    startIndex += pageStep;
  }

  return pages;
}

export default function CustomNavBar2({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const { activeMembership } = useMembership();

  const { width: screenWidth } =
    useWindowDimensions();

  const scrollRef =
    useRef<ScrollView>(null);

  const activePageRef =
    useRef(0);

  const previousRouteNameRef =
    useRef<string | undefined>(
      undefined
    );

  const [activePage, setActivePage] =
    useState(0);

  const navWidth = Math.max(
    screenWidth -
      NAV_HORIZONTAL_MARGIN * 2,
    0
  );

  const slidingSectionWidth =
    Math.max(
      navWidth - MORE_SECTION_WIDTH,
      0
    );

  const iconSlotWidth =
    slidingSectionWidth /
    ICONS_PER_PAGE;

  const accessibleFeatureIds = useMemo(
  () =>
    new Set(
      getAccessibleFeatureIds(
        activeMembership
      )
    ),
  [activeMembership]
);

  const orderedRoutes = useMemo(() => {
  /**
   * Only keep routes connected to features the
   * active membership can access.
   */
  const accessibleRoutes =
    state.routes.filter((route) => {
      const featureId =
        ROUTE_FEATURE_MAP[route.name];

      /**
       * Routes without a feature mapping are not
       * automatically exposed in the navbar.
       *
       * This prevents future/internal routes from
       * accidentally appearing for users.
       */
      if (!featureId) {
        return false;
      }

      return accessibleFeatureIds.has(
        featureId
      );
    });

  const routeMap = new Map(
    accessibleRoutes.map((route) => [
      route.name,
      route,
    ])
  );

  const configuredRoutes =
    NAV_ROUTE_ORDER.map(
      (routeName) =>
        routeMap.get(routeName)
    ).filter(
      (
        route
      ): route is TabRoute =>
        route !== undefined
    );

  const configuredRouteNames =
    new Set(
      configuredRoutes.map(
        (route) => route.name
      )
    );

  /**
   * Accessible future routes may still be
   * appended automatically, but only if they
   * have an explicit feature mapping above.
   */
  const additionalRoutes =
    accessibleRoutes.filter(
      (route) =>
        !configuredRouteNames.has(
          route.name
        )
    );

  return [
    ...configuredRoutes,
    ...additionalRoutes,
  ];
}, [
  accessibleFeatureIds,
  state.routes,
]);

  const navigationPages =
    useMemo(
      () =>
        createNavigationPages(
          orderedRoutes
        ),
      [orderedRoutes]
    );

  const activeRoute =
    state.routes[state.index];

  const activeRouteName =
    activeRoute?.name;

  /**
   * Shared page method used by:
   *
   * - More
   * - Swipe gestures
   * - Route changes
   */
  const goToPage = useCallback(
    (
      pageIndex: number,
      animated = true
    ) => {
      if (
        navigationPages.length === 0 ||
        slidingSectionWidth <= 0
      ) {
        return;
      }

      const safePageIndex =
        Math.max(
          0,
          Math.min(
            pageIndex,
            navigationPages.length - 1
          )
        );

      activePageRef.current =
        safePageIndex;

      setActivePage(safePageIndex);

      scrollRef.current?.scrollTo({
        x:
          safePageIndex *
          slidingSectionWidth,
        y: 0,
        animated,
      });
    },
    [
      navigationPages.length,
      slidingSectionWidth,
    ]
  );

  const getPageFromOffset =
    useCallback(
      (offsetX: number) => {
        if (
          navigationPages.length === 0 ||
          slidingSectionWidth <= 0
        ) {
          return 0;
        }

        const calculatedPage =
          Math.round(
            offsetX /
              slidingSectionWidth
          );

        return Math.max(
          0,
          Math.min(
            calculatedPage,
            navigationPages.length - 1
          )
        );
      },
      [
        navigationPages.length,
        slidingSectionWidth,
      ]
    );

  /**
   * Reveal a newly selected route when it is not
   * visible on the current navigation page.
   *
   * Manual swiping and More presses do not cause
   * the navbar to snap back.
   */
  useEffect(() => {
    if (!activeRouteName) {
      return;
    }

    const previousRouteName =
      previousRouteNameRef.current;

    const routeChanged =
      previousRouteName !==
      activeRouteName;

    previousRouteNameRef.current =
      activeRouteName;

    if (!routeChanged) {
      return;
    }

    const currentPage =
      activePageRef.current;

    const currentPageContainsRoute =
      navigationPages[
        currentPage
      ]?.some(
        (route) =>
          route.name ===
          activeRouteName
      );

    if (currentPageContainsRoute) {
      return;
    }

    const matchingPageIndex =
      navigationPages.findIndex(
        (page) =>
          page.some(
            (route) =>
              route.name ===
              activeRouteName
          )
      );

    if (matchingPageIndex >= 0) {
      goToPage(
        matchingPageIndex,
        true
      );
    }
  }, [
    activeRouteName,
    goToPage,
    navigationPages,
  ]);

  /**
   * Preserve the active navbar page after
   * rotation or screen-width changes.
   */
  useEffect(() => {
    if (
      slidingSectionWidth <= 0 ||
      navigationPages.length === 0
    ) {
      return;
    }

    const safePage = Math.min(
      activePageRef.current,
      navigationPages.length - 1
    );

    activePageRef.current =
      safePage;

    setActivePage(safePage);

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        x:
          safePage *
          slidingSectionWidth,
        y: 0,
        animated: false,
      });
    });
  }, [
    navigationPages.length,
    slidingSectionWidth,
  ]);

  const handleRoutePress = (
    route: TabRoute
  ) => {
    const routeIndex =
      state.routes.findIndex(
        (item) =>
          item.key === route.key
      );

    const isFocused =
      routeIndex === state.index;

    const event =
      navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

    if (
      !isFocused &&
      !event.defaultPrevented
    ) {
      navigation.navigate(
        route.name,
        route.params
      );
    }
  };

  const handleRouteLongPress = (
    route: TabRoute
  ) => {
    navigation.emit({
      type: "tabLongPress",
      target: route.key,
    });
  };

  const handleMorePress = () => {
    if (
      navigationPages.length <= 1
    ) {
      return;
    }

    const currentPage =
      activePageRef.current;

    const nextPage =
      currentPage >=
      navigationPages.length - 1
        ? 0
        : currentPage + 1;

    goToPage(nextPage, true);
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX =
      event.nativeEvent
        .contentOffset.x;

    const settledPage =
      getPageFromOffset(offsetX);

    goToPage(
      settledPage,
      false
    );
  };

  const handleScrollEndDrag = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX =
      event.nativeEvent
        .contentOffset.x;

    const velocityX =
      event.nativeEvent.velocity?.x ??
      0;

    /**
     * Faster gestures will finish through
     * onMomentumScrollEnd.
     */
    if (Math.abs(velocityX) > 0.05) {
      return;
    }

    const settledPage =
      getPageFromOffset(offsetX);

    goToPage(
      settledPage,
      true
    );
  };

  const renderRouteButton = (
    route: TabRoute,
    pageIndex: number
  ) => {
    const routeIndex =
      state.routes.findIndex(
        (item) =>
          item.key === route.key
      );

    const focused =
      routeIndex === state.index;

    const descriptor =
      descriptors[route.key];

    const options =
      descriptor.options;

    const config =
      getTabConfig(route.name);

    const badgeValue =
      options.tabBarBadge;

    return (
      <Pressable
        key={`${pageIndex}-${route.key}`}
        accessibilityRole="tab"
        accessibilityState={
          focused
            ? { selected: true }
            : {}
        }
        accessibilityLabel={
          options.tabBarAccessibilityLabel ??
          config.label
        }
        testID={
          options.tabBarButtonTestID
        }
        onPress={() =>
          handleRoutePress(route)
        }
        onLongPress={() =>
          handleRouteLongPress(route)
        }
        style={({ pressed }) => [
          styles.tabButton,
          {
            width: iconSlotWidth,
          },
          pressed &&
            styles.tabButtonPressed,
        ]}
      >
        <View style={styles.iconArea}>
          <View
            style={[
              styles.iconCircle,
              focused &&
                styles.iconCircleFocused,
            ]}
          >
            <NavIcon
              routeName={route.name}
              focused={focused}
            />
          </View>

          {badgeValue !== undefined &&
            badgeValue !== null && (
              <Badge
                value={badgeValue}
              />
            )}
        </View>

        <Text
          numberOfLines={1}
          style={[
            styles.tabLabel,
            focused &&
              styles.tabLabelFocused,
          ]}
        >
          {config.label}
        </Text>

        <View
          style={[
            styles.selectionLine,
            focused &&
              styles.selectionLineFocused,
          ]}
        />
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.outerContainer,
        {
          paddingBottom: Math.max(
            insets.bottom,
            8
          ),
        },
      ]}
    >
      <View style={styles.navContainer}>
        <View
          style={[
            styles.slidingSection,
            {
              width:
                slidingSectionWidth,
            },
          ]}
        >
          <ScrollView
            ref={scrollRef}
            horizontal
            bounces={false}
            overScrollMode="never"
            showsHorizontalScrollIndicator={
              false
            }
            scrollEventThrottle={16}
            decelerationRate="fast"
            disableIntervalMomentum
            snapToInterval={
              slidingSectionWidth
            }
            snapToAlignment="start"
            onScrollEndDrag={
              handleScrollEndDrag
            }
            onMomentumScrollEnd={
              handleMomentumScrollEnd
            }
          >
            {navigationPages.map(
              (
                pageRoutes,
                pageIndex
              ) => (
                <View
                  key={`nav-page-${pageIndex}`}
                  style={[
                    styles.page,
                    {
                      width:
                        slidingSectionWidth,
                    },
                  ]}
                >
                  {pageRoutes.map(
                    (route) =>
                      renderRouteButton(
                        route,
                        pageIndex
                      )
                  )}
                </View>
              )
            )}
          </ScrollView>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Show more navigation options"
          accessibilityHint="Switches between navigation pages"
          onPress={handleMorePress}
          disabled={
            navigationPages.length <= 1
          }
          style={({ pressed }) => [
            styles.moreSection,
            {
              width:
                MORE_SECTION_WIDTH,
            },
            pressed &&
              styles.moreSectionPressed,
          ]}
        >
          <View
            style={
              styles.moreIconCircle
            }
          >
            <Ionicons
              name="ellipsis-horizontal"
              size={23}
              color={COLORS.white}
            />
          </View>

          <Text style={styles.moreLabel}>
            More
          </Text>

          <View style={styles.dotRow}>
            {navigationPages.map(
              (_, pageIndex) => (
                <View
                  key={`nav-dot-${pageIndex}`}
                  style={[
                    styles.dot,
                    pageIndex ===
                      activePage &&
                      styles.dotActive,
                  ]}
                />
              )
            )}
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal:
      NAV_HORIZONTAL_MARGIN,
    paddingTop: NAV_TOP_MARGIN,
    backgroundColor: "transparent",
  },

  navContainer: {
    minHeight: 72,
    flexDirection: "row",
    overflow: "hidden",
    borderRadius:
      NAV_BORDER_RADIUS,
    backgroundColor:
      COLORS.purple,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,

    elevation: 7,
  },

  slidingSection: {
    minHeight: 72,
    overflow: "hidden",
  },

  page: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "flex-start",
  },

  tabButton: {
    minHeight: 68,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
    paddingBottom: 3,
  },

  tabButtonPressed: {
    opacity: 0.76,
  },

  iconArea: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  iconCircleFocused: {
    backgroundColor:
      COLORS.selectedCircle,
  },

  tabLabel: {
    maxWidth: 58,
    marginTop: 1,
    color: COLORS.inactive,
    fontSize: 9,
    lineHeight: 11,
    fontWeight: "600",
    textAlign: "center",
  },

  tabLabelFocused: {
    color: COLORS.white,
    fontWeight: "700",
  },

  selectionLine: {
    width: 19,
    height: 3,
    marginTop: 3,
    borderRadius: 2,
    backgroundColor:
      "transparent",
  },

  selectionLineFocused: {
    backgroundColor:
      COLORS.white,
  },

  moreSection: {
    minHeight: 72,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
    paddingBottom: 3,
    borderLeftWidth:
      StyleSheet.hairlineWidth,
    borderLeftColor:
      COLORS.divider,
    backgroundColor:
      COLORS.purple,
  },

  moreSectionPressed: {
    backgroundColor:
      COLORS.pressed,
  },

  moreIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  moreLabel: {
    marginTop: 1,
    color: COLORS.white,
    fontSize: 9,
    lineHeight: 11,
    fontWeight: "700",
    textAlign: "center",
  },

  dotRow: {
    minHeight: 7,
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor:
      COLORS.inactiveDot,
  },

  dotActive: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor:
      COLORS.white,
  },

  badge: {
    position: "absolute",
    top: -5,
    right: -9,
    minWidth: 19,
    height: 19,
    paddingHorizontal: 4,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      COLORS.badge,
    borderWidth: 2,
    borderColor:
      COLORS.white,
  },

  badgeText: {
    color: COLORS.white,
    fontSize: 9,
    lineHeight: 11,
    fontWeight: "800",
    textAlign: "center",
  },
});