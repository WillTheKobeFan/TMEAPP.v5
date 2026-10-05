// src/components/layout/ScreenLayout.tsx

import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, {
  ReactNode,
  useEffect,
  useState,
} from "react";
import {
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

import { useTextSize } from "@/context/TextSizeContext";
import { useTheme } from "@/theme";

const HEADER_SIDE_WIDTH = 88;
const SHADOW_COLOR = "#000000";

export type ScreenLayoutProps = {
  title: string;
  children: ReactNode;

  titleFontSize?: number;
  titleStyle?: StyleProp<TextStyle>;

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

export default function ScreenLayout({
  title,
  children,

  titleFontSize = 30,
  titleStyle,

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

  const [currentDateTime, setCurrentDateTime] =
    useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  const openSettings = () => {
    router.push("/(tabs)/settings" as never);
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
            backgroundColor: theme.background,
          },
          style,
        ]}
      >
        {/* STATIC MAIN-SCREEN HEADER */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.surface,
            },
          ]}
        >
          {/* LEFT — intentionally blank */}
          <View style={styles.leftHeaderSlot} />

          {/* MIDDLE — screen title */}
          <View style={styles.titleContainer}>
            <Text
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.72}
              style={[
                styles.headerTitle,
                {
                  fontSize:
                    titleFontSize * textScale,

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

          {/* RIGHT — permanent stacked date / time */}
          <View style={styles.rightHeaderSlot}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              style={[
                styles.headerDate,
                {
                  fontSize: 13 * textScale,
                  color: theme.headerText,
                },
              ]}
            >
              {formatHeaderDate(currentDateTime)}
            </Text>

            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              style={[
                styles.headerTime,
                {
                  fontSize: 12 * textScale,
                  color: theme.headerText,
                },
              ]}
            >
              {formatHeaderTime(currentDateTime)}
            </Text>
          </View>
        </View>

        {/* DYNAMIC SCREEN CONTENT */}
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
            style={styles.settingsShortcutShadow}
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
   * Equal left/right columns keep the
   * middle title mathematically centered.
   */
  leftHeaderSlot: {
    width: HEADER_SIDE_WIDTH,
    alignSelf: "stretch",
  },

  rightHeaderSlot: {
    width: HEADER_SIDE_WIDTH,

    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
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

  headerDate: {
    width: "100%",

    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.3,
  },

  headerTime: {
    width: "100%",

    marginTop: 3,

    fontWeight: "800",
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
});
