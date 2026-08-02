// src/components/layout/ScreenLayout2.tsx

// *screen layout just covers the League Hub screen* //

import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { ReactNode } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { useTextSize } from "@/context/TextSizeContext";

const COLORS = {
  purple: "#250F74",
  white: "#FFFFFF",
  background: "#F8F7FB",
  text: "#1E1B24",
  muted: "#706B79",
  border: "#E8E4ED",
  lightPurple: "#F4F0FC",
};

type ScreenLayout2Props = {
  children: ReactNode;

  /**
   * Center title shown in the League Hub header.
   */
  title?: string;

  /**
   * Left-side label beneath the Home icon.
   */
  homeLabel?: string;

  /**
   * Right-side label beneath the Settings icon.
   */
  settingsLabel?: string;

  /**
   * Optional custom actions.
   */
  onHomePress?: () => void;
  onSettingsPress?: () => void;

  /**
   * Allows either header shortcut to be hidden.
   */
  showHome?: boolean;
  showSettings?: boolean;

  /**
   * Optional style overrides.
   */
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

export default function ScreenLayout2({
  children,
  title = "League Hub",
  homeLabel = "Home",
  settingsLabel = "Settings",
  onHomePress,
  onSettingsPress,
  showHome = true,
  showSettings = true,
  style,
  contentStyle,
  titleStyle,
}: ScreenLayout2Props) {
  const { textScale } = useTextSize();

  function handleHomePress() {
    if (onHomePress) {
      onHomePress();
      return;
    }

    /*
     * Plain root route displays the League Hub.
     * No leagueSelection parameter is included here.
     */
    router.replace("/");
  }

  function handleSettingsPress() {
    if (onSettingsPress) {
      onSettingsPress();
      return;
    }

    router.push("/(tabs)/settings");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.screen, style]}>
        <View style={styles.header}>
          <View style={styles.headerSide}>
            {showHome ? (
              <HeaderAction
                label={homeLabel}
                icon="home-outline"
                accessibilityLabel="Open League Hub home"
                textScale={textScale}
                onPress={handleHomePress}
              />
            ) : (
              <View style={styles.headerPlaceholder} />
            )}
          </View>

          <View style={styles.titleArea}>
            <View style={styles.titleTile}>
              <Ionicons
                name="grid-outline"
                size={18}
                color={COLORS.purple}
              />

              <Text
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
                style={[
                  styles.title,
                  {
                    fontSize: 19 * textScale,
                    lineHeight: 22 * textScale,
                  },
                  titleStyle,
                ]}
              >
                {title}
              </Text>
            </View>
          </View>

          <View style={styles.headerSide}>
            {showSettings ? (
              <HeaderAction
                label={settingsLabel}
                icon="settings-outline"
                accessibilityLabel="Open settings"
                textScale={textScale}
                onPress={handleSettingsPress}
              />
            ) : (
              <View style={styles.headerPlaceholder} />
            )}
          </View>
        </View>

        <View style={[styles.content, contentStyle]}>
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
}

type HeaderActionProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  accessibilityLabel: string;
  textScale: number;
  onPress: () => void;
};

function HeaderAction({
  label,
  icon,
  accessibilityLabel,
  textScale,
  onPress,
}: HeaderActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [
        styles.headerAction,
        pressed && styles.headerActionPressed,
      ]}
    >
      <View style={styles.iconCircle}>
        <Ionicons
          name={icon}
          size={23}
          color={COLORS.purple}
        />
      </View>

      <Text
        numberOfLines={1}
        style={[
          styles.headerActionLabel,
          {
            fontSize: 11 * textScale,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    minHeight: 94,
    paddingHorizontal: 13,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,

    shadowColor: "#1E1048",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 7,
    elevation: 5,
    zIndex: 10,
  },

  headerSide: {
    width: 74,
    alignItems: "center",
    justifyContent: "center",
  },

  headerPlaceholder: {
    width: 64,
    height: 64,
  },

  headerAction: {
    minWidth: 64,
    minHeight: 68,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  headerActionPressed: {
    opacity: 0.65,
    transform: [
      {
        scale: 0.97,
      },
    ],
  },

  iconCircle: {
    width: 46,
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,

    shadowColor: "#1E1048",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },

  headerActionLabel: {
    marginTop: 5,
    color: COLORS.purple,
    fontWeight: "800",
    textAlign: "center",
  },

  titleArea: {
    flex: 1,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  titleTile: {
    minHeight: 48,
    maxWidth: 210,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: COLORS.lightPurple,

    shadowColor: "#1E1048",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.09,
    shadowRadius: 6,
    elevation: 3,
  },

  title: {
    flexShrink: 1,
    color: COLORS.purple,
    fontWeight: "900",
    textAlign: "center",
  },

  content: {
    flex: 1,
    overflow: "hidden",
  },
});