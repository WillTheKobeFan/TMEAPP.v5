// app/(tabs)/settings.tsx

import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ScreenLayout from "@/components/layout/ScreenLayout";
import { AppTheme, useTheme } from "@/theme";

export default function Settings() {
  const {
    theme,
    themeMode,
    setThemeMode,
  } = useTheme();

  const styles = createStyles(theme);

  return (
    <ScreenLayout
      title="Settings"
      showBackButton
    >
      <View style={styles.container}>
        <Text style={styles.screenTitle}>
          Settings
        </Text>

        <View style={styles.displayCard}>
          <View style={styles.displayText}>
            <Text style={styles.cardTitle}>
              Display Mode
            </Text>

            <Text style={styles.cardSubtitle}>
              Choose how SportSync appears on your device.
            </Text>
          </View>

          <View style={styles.modeButtons}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Use Light Mode"
              accessibilityState={{
                selected: themeMode === "light",
              }}
              onPress={() =>
                setThemeMode("light")
              }
              style={[
                styles.modeButton,
                themeMode === "light" &&
                  styles.modeButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  themeMode === "light" &&
                    styles.modeButtonTextActive,
                ]}
              >
                Light
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Use Dark Mode"
              accessibilityState={{
                selected: themeMode === "dark",
              }}
              onPress={() =>
                setThemeMode("dark")
              }
              style={[
                styles.modeButton,
                themeMode === "dark" &&
                  styles.modeButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  themeMode === "dark" &&
                    styles.modeButtonTextActive,
                ]}
              >
                Dark
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenLayout>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
      paddingTop: 28,
    },

    screenTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.text,
      textAlign: "center",
      marginBottom: 28,
    },

    displayCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      padding: 18,
    },

    displayText: {
      marginBottom: 16,
    },

    cardTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
    },

    cardSubtitle: {
      marginTop: 4,
      fontSize: 14,
      lineHeight: 20,
      color: theme.textMuted,
    },

    modeButtons: {
      flexDirection: "row",
      gap: 10,
    },

    modeButton: {
      flex: 1,
      minHeight: 46,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
    },

    modeButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },

    modeButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.text,
    },

    modeButtonTextActive: {
      color: "#FFFFFF",
    },
  });
