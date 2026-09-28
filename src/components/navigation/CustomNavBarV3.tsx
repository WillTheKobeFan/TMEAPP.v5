// CURRENT CustonNavBar.v3



// src/components/navigation/CustomNavBarV3.tsx

import React, {
  useEffect,
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

import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Ionicons } from "@expo/vector-icons";

import { useSafeAreaInsets } from "react-native-safe-area-context";

type NavPage = 1 | 2;

type IconFamily =
  | "Entypo"
  | "FontAwesome"
  | "FontAwesome5"
  | "FontAwesome6"
  | "Ionicons";

type NavItem = {
  route: string;
  label: string;
  family: IconFamily;
  icon: string;
};

const PAGE_ONE: NavItem[] = [
  {
    route: "home",
    label: "Home",
    family: "Entypo",
    icon: "home",
  },
  {
    route: "schedule",
    label: "Schedule",
    family: "FontAwesome",
    icon: "calendar",
  },
  {
    route: "standings",
    label: "Standings",
    family: "Entypo",
    icon: "bar-graph",
  },
  {
    route: "inbox",
    label: "Inbox",
    family: "FontAwesome5",
    icon: "inbox",
  },
  {
    route: "myhub",
    label: "MyHub",
    family: "Ionicons",
    icon: "person-outline",
  },
];

const PAGE_TWO: NavItem[] = [
  {
    route: "champs",
    label: "Champs",
    family: "FontAwesome6",
    icon: "trophy",
  },
  {
    route: "progression",
    label: "Progress",
    family: "Ionicons",
    icon: "trending-up-outline",
  },
  {
    route: "search",
    label: "Search",
    family: "FontAwesome5",
    icon: "search",
  },
  {
    route: "settings",
    label: "Settings",
    family: "FontAwesome6",
    icon: "gear",
  },
];

const PAGE_ONE_ROUTES = PAGE_ONE.map(
  (item) => item.route
);

const PAGE_TWO_ROUTES = PAGE_TWO.map(
  (item) => item.route
);

const COLORS = {
  nav: "#140452",
  border: "#40218B",

  activeCircle: "#5930C9",

  white: "#FFFFFF",
  inactive: "#D5CFF0",

  divider: "#4D2A94",

  inactiveDot: "#542CAE",

  badge: "#F23842",
};

function NavIcon({
  family,
  name,
  size,
  color,
}: {
  family: IconFamily;
  name: string;
  size: number;
  color: string;
}) {
  switch (family) {
    case "Entypo":
      return (
        <Entypo
          name={
            name as React.ComponentProps<
              typeof Entypo
            >["name"]
          }
          size={size}
          color={color}
        />
      );

    case "FontAwesome":
      return (
        <FontAwesome
          name={
            name as React.ComponentProps<
              typeof FontAwesome
            >["name"]
          }
          size={size}
          color={color}
        />
      );

    case "FontAwesome5":
      return (
        <FontAwesome5
          name={
            name as React.ComponentProps<
              typeof FontAwesome5
            >["name"]
          }
          size={size}
          color={color}
        />
      );

    case "FontAwesome6":
      return (
        <FontAwesome6
          name={
            name as React.ComponentProps<
              typeof FontAwesome6
            >["name"]
          }
          size={size}
          color={color}
        />
      );

    case "Ionicons":
    default:
      return (
        <Ionicons
          name={
            name as React.ComponentProps<
              typeof Ionicons
            >["name"]
          }
          size={size}
          color={color}
        />
      );
  }
}

export default function CustomNavBarV3({
  state,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const { width: screenWidth } =
    useWindowDimensions();

  const scrollRef = useRef<ScrollView>(null);

  const currentRoute =
    state.routes[state.index]?.name;

  const navWidth = Math.min(
    screenWidth - 24,
    404
  );

  /*
   * Each scroll page is exactly the
   * same width as the visible navbar.
   */
  const pageWidth = navWidth;

  const [page, setPage] =
    useState<NavPage>(() => {
      return PAGE_TWO_ROUTES.includes(
        currentRoute
      )
        ? 2
        : 1;
    });

  const scrollToPage = (
    targetPage: NavPage,
    animated = true
  ) => {
    scrollRef.current?.scrollTo({
      x:
        targetPage === 1
          ? 0
          : pageWidth,
      y: 0,
      animated,
    });

    setPage(targetPage);
  };

  /*
   * If another part of the app sends
   * the user directly to a tab,
   * reveal the corresponding navbar page.
   */
  useEffect(() => {
    if (
      PAGE_ONE_ROUTES.includes(
        currentRoute
      ) &&
      page !== 1
    ) {
      scrollToPage(1);
    }

    if (
      PAGE_TWO_ROUTES.includes(
        currentRoute
      ) &&
      page !== 2
    ) {
      scrollToPage(2);
    }
  }, [currentRoute]);

  /*
   * Re-align if screen dimensions change.
   * Useful for device / emulator changes.
   */
  useEffect(() => {
    requestAnimationFrame(() => {
      scrollToPage(page, false);
    });
  }, [pageWidth]);

  const navigateTo = (
    routeName: string
  ) => {
    const targetRoute =
      state.routes.find(
        (route) =>
          route.name === routeName
      );

    if (!targetRoute) {
      return;
    }

    const event = navigation.emit({
      type: "tabPress",
      target: targetRoute.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  const handleMorePress = (
    currentPage: NavPage
  ) => {
    scrollToPage(
      currentPage === 1 ? 2 : 1
    );
  };

  const handleMomentumEnd = (
    event: NativeSyntheticEvent<
      NativeScrollEvent
    >
  ) => {
    const offsetX =
      event.nativeEvent.contentOffset.x;

    const newPage: NavPage =
      offsetX >= pageWidth / 2
        ? 2
        : 1;

    setPage(newPage);
  };

  const renderNavItem = (
    item: NavItem
  ) => {
    const isActive =
      currentRoute === item.route;

    return (
      <Pressable
        key={item.route}
        onPress={() =>
          navigateTo(item.route)
        }
        style={({ pressed }) => [
          styles.navItem,
          pressed && styles.pressed,
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            isActive &&
              styles.iconContainerActive,
          ]}
        >
          <NavIcon
            family={item.family}
            name={item.icon}
            size={24}
            color={
              isActive
                ? COLORS.white
                : COLORS.inactive
            }
          />

          {item.route === "inbox" && (
            <View style={styles.badge}>
              <Text
                style={styles.badgeText}
              >
                3
              </Text>
            </View>
          )}
        </View>

        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.86}
          style={[
            styles.label,
            isActive &&
              styles.labelActive,
          ]}
        >
          {item.label}
        </Text>

        <View
          style={[
            styles.underline,
            isActive &&
              styles.underlineActive,
          ]}
        />
      </Pressable>
    );
  };

  const renderMoreArea = (
    currentPage: NavPage
  ) => {
    return (
      <>
        <View style={styles.divider} />

        <Pressable
          onPress={() =>
            handleMorePress(
              currentPage
            )
          }
          style={({ pressed }) => [
            styles.moreArea,
            pressed &&
              styles.pressed,
          ]}
        >
          <Text style={styles.moreDots}>
            •••
          </Text>

          <Text
            style={styles.moreLabel}
          >
            More
          </Text>

          <View
            style={styles.pageDots}
          >
            <View
              style={[
                styles.pageDot,
                currentPage === 1 &&
                  styles.pageDotActive,
              ]}
            />

            <View
              style={[
                styles.pageDot,
                currentPage === 2 &&
                  styles.pageDotActive,
              ]}
            />
          </View>
        </Pressable>
      </>
    );
  };

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.shell,
        {
          paddingBottom: Math.max(
            insets.bottom,
            8
          ),
        },
      ]}
    >
      <View
        style={[
          styles.navBar,
          {
            width: navWidth,
          },
        ]}
      >
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          bounces={false}
          overScrollMode="never"
          showsHorizontalScrollIndicator={
            false
          }
          scrollEventThrottle={16}
          onMomentumScrollEnd={
            handleMomentumEnd
          }
          style={styles.scrollView}
          contentContainerStyle={
            styles.scrollContent
          }
        >
          {/* PAGE 1 */}
          <View
            style={[
              styles.page,
              {
                width: pageWidth,
              },
            ]}
          >
            <View
              style={styles.navItems}
            >
              {PAGE_ONE.map(
                renderNavItem
              )}
            </View>

            {renderMoreArea(1)}
          </View>

          {/* PAGE 2 */}
          <View
            style={[
              styles.page,
              {
                width: pageWidth,
              },
            ]}
          >
            <View
              style={[
                styles.navItems,
                styles.pageTwoItems,
              ]}
            >
              {PAGE_TWO.map(
                renderNavItem
              )}
            </View>

            {renderMoreArea(2)}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /*
   * STATIC OUTER SHELL
   */

  shell: {
    backgroundColor: "transparent",

    alignItems: "center",
    justifyContent: "center",

    paddingTop: 6,
  },

  /*
   * STATIC FLOATING CAPSULE
   */

  navBar: {
    height: 82,

    backgroundColor: COLORS.nav,

    borderRadius: 41,

    borderWidth: 1.5,
    borderColor: COLORS.border,

    overflow: "hidden",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.22,
    shadowRadius: 11,

    elevation: 10,
  },

  /*
   * HORIZONTAL PAGE SCROLLER
   */

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    alignItems: "center",
  },

  page: {
    height: "100%",

    flexDirection: "row",
    alignItems: "center",

    paddingLeft: 10,
    paddingRight: 8,
  },

  /*
   * NAVIGATION ITEMS
   */

  navItems: {
    flex: 1,

    height: "100%",

    flexDirection: "row",
    alignItems: "center",

    /*
     * Gives a little extra breathing
     * room between icons.
     */
    columnGap: 3,
  },

  /*
   * Page 2 only has four items.
   * Slightly more internal spacing
   * keeps the visual weight balanced.
   */
  pageTwoItems: {
    paddingHorizontal: 8,
    columnGap: 7,
  },

  navItem: {
    flex: 1,

    minWidth: 0,
    height: "100%",

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 2,
  },

  pressed: {
    opacity: 0.68,
  },

  /*
   * ICON
   */

  iconContainer: {
    width: 38,
    height: 38,

    borderRadius: 19,

    alignItems: "center",
    justifyContent: "center",
  },

  iconContainerActive: {
    backgroundColor:
      COLORS.activeCircle,

    shadowColor:
      COLORS.activeCircle,

    shadowOffset: {
      width: 0,
      height: 0,
    },

    shadowOpacity: 0.65,
    shadowRadius: 8,

    elevation: 7,
  },

  /*
   * LABEL
   */

  label: {
    width: "100%",

    marginTop: 2,

    color: COLORS.inactive,

    fontSize: 10.5,
    fontWeight: "500",

    textAlign: "center",
  },

  labelActive: {
    color: COLORS.white,
    fontWeight: "700",
  },

  /*
   * ACTIVE UNDERLINE
   */

  underline: {
    width: 24,
    height: 3,

    marginTop: 4,

    borderRadius: 999,

    backgroundColor:
      "transparent",
  },

  underlineActive: {
    backgroundColor: COLORS.white,
  },

  /*
   * MORE DIVIDER
   */

  divider: {
    width: 1,
    height: 55,

    marginLeft: 7,
    marginRight: 9,

    backgroundColor:
      COLORS.divider,
  },

  /*
   * MORE
   */

  moreArea: {
    width: 53,
    height: "100%",

    alignItems: "center",
    justifyContent: "center",
  },

  moreDots: {
    color: COLORS.white,

    fontSize: 18,
    fontWeight: "900",

    letterSpacing: 2,

    lineHeight: 18,
  },

  moreLabel: {
    marginTop: 3,

    color: COLORS.inactive,

    fontSize: 10.5,
    fontWeight: "500",

    textAlign: "center",
  },

  /*
   * PAGE DOTS
   */

  pageDots: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    gap: 5,

    marginTop: 4,
  },

  pageDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor:
      COLORS.inactiveDot,
  },

  pageDotActive: {
    backgroundColor: COLORS.white,
  },

  /*
   * INBOX BADGE
   */

  badge: {
    position: "absolute",

    top: -3,
    right: -4,

    minWidth: 20,
    height: 20,

    paddingHorizontal: 4,

    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.badge,

    borderWidth: 1.5,
    borderColor: COLORS.white,
  },

  badgeText: {
    color: COLORS.white,

    fontSize: 10,
    fontWeight: "800",

    lineHeight: 12,
  },
});
