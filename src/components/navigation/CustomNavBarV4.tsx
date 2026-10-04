// src/components/navigation/CustomNavBarV4.tsx

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
  Platform,
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
import { useTheme } from "@/theme";

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

type Props = BottomTabBarProps & {
  inboxUnreadCount?: number;
};

const ITEMS_PER_PAGE = 4;
const MORE_WIDTH = 68;

const COLORS = {
  nav: "#140452",
  border: "#5A34A8",
  white: "#FFFFFF",
  inactive: "#D5CFF0",
  divider: "#56349B",
  badge: "#F23842",
};

const ITEMS: NavItem[] = [
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
  {
    route: "champs",
    label: "Champs",
    family: "FontAwesome6",
    icon: "trophy",
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

function NavIcon({
  family,
  name,
  color,
}: {
  family: IconFamily;
  name: string;
  color: string;
}) {
  const common = {
    size: 24,
    color,
  };

  switch (family) {
    case "Entypo":
      return (
        <Entypo
          name={
            name as React.ComponentProps<
              typeof Entypo
            >["name"]
          }
          {...common}
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
          {...common}
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
          {...common}
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
          {...common}
        />
      );

    default:
      return (
        <Ionicons
          name={
            name as React.ComponentProps<
              typeof Ionicons
            >["name"]
          }
          {...common}
        />
      );
  }
}

export default function CustomNavBarV4({
  state,
  navigation,
  inboxUnreadCount = 3,
}: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } =
    useWindowDimensions();

  const scrollRef = useRef<ScrollView>(null);

  const currentRoute =
    state.routes[state.index]?.name;

  const pages = useMemo(
    () =>
      Array.from(
        {
          length: Math.ceil(
            ITEMS.length / ITEMS_PER_PAGE
          ),
        },
        (_, i) =>
          ITEMS.slice(
            i * ITEMS_PER_PAGE,
            (i + 1) * ITEMS_PER_PAGE
          )
      ),
    []
  );

  const routeIndex = ITEMS.findIndex(
    (item) => item.route === currentRoute
  );

  const routePage =
    routeIndex < 0
      ? 0
      : Math.floor(
          routeIndex / ITEMS_PER_PAGE
        );

  const [pageIndex, setPageIndex] =
    useState(routePage);

  const navWidth = Math.min(
    screenWidth - 16,
    430
  );

  const pageWidth =
    navWidth -
    MORE_WIDTH -
    StyleSheet.hairlineWidth;

  const scrollToPage = useCallback(
    (
      index: number,
      animated = true
    ) => {
      const next = Math.max(
        0,
        Math.min(
          index,
          pages.length - 1
        )
      );

      scrollRef.current?.scrollTo({
        x: next * pageWidth,
        y: 0,
        animated,
      });

      setPageIndex(next);
    },
    [pageWidth, pages.length]
  );

  /*
   * Reveal the correct navbar page only
   * when navigation selects a different
   * route.
   *
   * Do not depend on pageIndex here.
   */
  useEffect(() => {
    scrollToPage(routePage);

    // eslint-disable-next-line
    // react-hooks/exhaustive-deps
  }, [currentRoute]);

  /*
   * Re-align after orientation or
   * window-size changes.
   */
  useEffect(() => {
    requestAnimationFrame(() =>
      scrollToPage(
        pageIndex,
        false
      )
    );

    // eslint-disable-next-line
    // react-hooks/exhaustive-deps
  }, [pageWidth]);

  const navigateTo = (
    routeName: string
  ) => {
    const target = state.routes.find(
      (route) =>
        route.name === routeName
    );

    if (!target) return;

    const event = navigation.emit({
      type: "tabPress",
      target: target.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  const renderItem = (
    item: NavItem
  ) => {
    const active =
      item.route === currentRoute;

    const badge =
      inboxUnreadCount > 99
        ? "99+"
        : String(
            inboxUnreadCount
          );

    return (
      <Pressable
        key={item.route}
        accessibilityRole="tab"
        accessibilityLabel={
          item.label
        }
        accessibilityState={{
          selected: active,
        }}
        onPress={() =>
          navigateTo(item.route)
        }
        style={({ pressed }) => [
          styles.navItem,
          pressed && styles.pressed,
        ]}
      >
        <View
          style={styles.iconWrap}
        >
          <NavIcon
            family={item.family}
            name={item.icon}
            color={
              active
                ? COLORS.white
                : COLORS.inactive
            }
          />

          {item.route ===
            "inbox" &&
            inboxUnreadCount > 0 && (
              <View
                style={styles.badge}
              >
                <Text
                  style={
                    styles.badgeText
                  }
                >
                  {badge}
                </Text>
              </View>
            )}
        </View>

        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.82}
          style={[
            styles.label,
            active &&
              styles.activeLabel,
          ]}
        >
          {item.label}
        </Text>

        <View
          style={[
            styles.underline,
            active &&
              styles.activeUnderline,
          ]}
        />
      </Pressable>
    );
  };

  const handleMomentumEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const next = Math.round(
      event.nativeEvent
        .contentOffset.x /
        pageWidth
    );

    setPageIndex(
      Math.max(
        0,
        Math.min(
          next,
          pages.length - 1
        )
      )
    );
  };

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.shell,
        {
          paddingBottom:
            Math.max(
              insets.bottom,
              8
            ),

          // Important:
          // The area behind the floating
          // navbar follows Light/Dark Mode.
          backgroundColor:
            theme.background,
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
        <View
          style={[
            styles.viewport,
            {
              width: pageWidth,
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
            onMomentumScrollEnd={
              handleMomentumEnd
            }
          >
            {pages.map(
              (
                page,
                pageNumber
              ) => (
                <View
                  key={
                    pageNumber
                  }
                  style={[
                    styles.page,
                    {
                      width:
                        pageWidth,
                    },
                  ]}
                >
                  {Array.from(
                    {
                      length:
                        ITEMS_PER_PAGE,
                    },
                    (
                      _,
                      itemIndex
                    ) => {
                      const item =
                        page[
                          itemIndex
                        ];

                      return item ? (
                        renderItem(
                          item
                        )
                      ) : (
                        <View
                          key={`empty-${itemIndex}`}
                          style={
                            styles.navItem
                          }
                        />
                      );
                    }
                  )}
                </View>
              )
            )}
          </ScrollView>
        </View>

        <View
          style={styles.divider}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`More. Page ${
            pageIndex + 1
          } of ${pages.length}.`}
          accessibilityHint="Shows the next navigation page"
          onPress={() =>
            scrollToPage(
              (pageIndex + 1) %
                pages.length
            )
          }
          style={({
            pressed,
          }) => [
            styles.more,
            pressed &&
              styles.pressed,
          ]}
        >
          <View
            style={
              styles.moreIconSlot
            }
          >
            <View
              style={
                styles.pageDots
              }
            >
              {pages.map(
                (_, dot) => (
                  <View
                    key={dot}
                    style={[
                      styles.pageDot,
                      dot ===
                        pageIndex &&
                        styles.activeDot,
                    ]}
                  />
                )
              )}
            </View>
          </View>

          <Text
            style={
              styles.moreLabel
            }
          >
            More
          </Text>

          <View
            style={
              styles.moreUnderlineSpace
            }
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    shell: {
      alignItems: "center",
      justifyContent:
        "center",
      paddingTop: 6,
    },

    navBar: {
      height: 82,

      flexDirection: "row",
      overflow: "hidden",

      borderRadius: 999,

      borderWidth: 1.5,
      borderColor:
        COLORS.border,

      backgroundColor:
        COLORS.nav,

      shadowColor: "#000",

      shadowOffset: {
        width: 0,
        height: 7,
      },

      shadowOpacity: 0.22,
      shadowRadius: 11,

      elevation: 10,
    },

    viewport: {
      height: "100%",
      overflow: "hidden",
    },

    page: {
      height: "100%",

      flexDirection: "row",

      paddingHorizontal: 4,
    },

    navItem: {
      flex: 1,
      minWidth: 0,

      height: "100%",

      alignItems: "center",
      justifyContent:
        "center",

      paddingTop: 7,
      paddingHorizontal: 1,
    },

    pressed: {
      opacity: 0.68,
    },

    iconWrap: {
      width: 34,
      height: 28,

      alignItems: "center",
      justifyContent:
        "center",
    },

    label: {
      width: "100%",

      marginTop: 2,

      color:
        COLORS.inactive,

      fontSize:
        Platform.OS ===
        "android"
          ? 10
          : 10.5,

      fontWeight: "500",

      textAlign: "center",
    },

    activeLabel: {
      color: COLORS.white,
      fontWeight: "700",
    },

    underline: {
      width: 20,
      height: 3,

      marginTop: 5,

      borderRadius: 999,

      backgroundColor:
        "transparent",
    },

    activeUnderline: {
      backgroundColor:
        COLORS.white,
    },

    badge: {
      position: "absolute",

      top: -4,
      right: -5,

      minWidth: 20,
      height: 20,

      paddingHorizontal: 4,

      borderRadius: 10,

      alignItems: "center",
      justifyContent:
        "center",

      backgroundColor:
        COLORS.badge,

      borderWidth: 1.5,
      borderColor:
        COLORS.white,
    },

    badgeText: {
      color: COLORS.white,

      fontSize: 10,
      fontWeight: "800",
      lineHeight: 12,
    },

    divider: {
      width:
        StyleSheet.hairlineWidth,

      height: 54,

      alignSelf: "center",

      backgroundColor:
        COLORS.divider,
    },

    more: {
      width: MORE_WIDTH,
      height: "100%",

      alignItems: "center",
      justifyContent:
        "center",

      paddingTop: 7,
    },

    moreIconSlot: {
      width: 34,
      height: 28,

      alignItems: "center",
      justifyContent:
        "center",
    },

    pageDots: {
      flexDirection: "row",
      gap: 5,
    },

    pageDot: {
      width: 5,
      height: 5,

      borderRadius: 3,

      borderWidth: 1,
      borderColor:
        COLORS.white,

      backgroundColor:
        "transparent",
    },

    activeDot: {
      backgroundColor:
        COLORS.white,
    },

    moreLabel: {
      width: "100%",

      marginTop: 2,

      color:
        COLORS.inactive,

      fontSize:
        Platform.OS ===
        "android"
          ? 10
          : 10.5,

      fontWeight: "500",

      textAlign: "center",
    },

    moreUnderlineSpace: {
      width: 20,
      height: 3,

      marginTop: 5,
    },
  });
