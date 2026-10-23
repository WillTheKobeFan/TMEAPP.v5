// app/(tabs)/settings.tsx

import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ScreenLayout from "@/components/layout/ScreenLayout";
import { AppTheme, useTheme } from "@/theme";

export default function Settings() {
  const router = useRouter();
  const {
    theme,
    themeMode,
    setThemeMode,
  } = useTheme();

  const styles = createStyles(theme, themeMode);
  const [demoExpanded, setDemoExpanded] = useState(false);

  return (
    <ScreenLayout
      title="Settings"
    >
      <View style={styles.container}>
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

        <View style={styles.demoCard}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Demo and Testing"
            accessibilityState={{ expanded: demoExpanded }}
            onPress={() => setDemoExpanded(!demoExpanded)}
            style={styles.demoHeader}
          >
            <View style={styles.displayText}>
              <Text style={styles.cardTitle}>Demo & Testing</Text>
              <Text style={styles.cardSubtitle}>
                Create and explore sandbox organizations.
              </Text>
            </View>
            <Text style={styles.demoArrow}>
              {demoExpanded ? "⌄" : "›"}
            </Text>
          </Pressable>

          {demoExpanded && (
            <View style={styles.demoOptions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Create Blank Organization or Training"
                onPress={() => router.push("/settings/sandbox/create")}
                style={styles.demoOption}
              >
                <Text style={styles.cardTitle}>
                  Create Blank Organization / Training
                </Text>
                <Text style={styles.cardSubtitle}>
                  Start with an empty sandbox organization or training client.
                </Text>
              </Pressable>

              <Pressable accessibilityRole="button" accessibilityLabel="My Sandbox Organizations and Training" onPress={() => router.push("/settings/sandbox")} style={styles.demoOption}>
                <Text style={styles.cardTitle}>My Sandbox Organizations / Training</Text>
                <Text style={styles.cardSubtitle}>View your saved fictional clients.</Text>
              </Pressable>

              <View style={styles.demoOption}>
                <Text style={styles.cardTitle}>
                  Create Prepopulated Demo
                </Text>
                <Text style={styles.cardSubtitle}>
                  Explore a fictional organization with sample data.
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScreenLayout>
  );
}

const createStyles = (theme: AppTheme, themeMode: "light" | "dark") =>
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

    demoCard: {
      marginTop: 16,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      padding: 18,
    },

    demoHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    demoArrow: {
      fontSize: 28,
      fontWeight: "700",
      color: themeMode === "dark" ? "#FFFFFF" : theme.primary,
    },

    demoOptions: {
      marginTop: 8,
      gap: 12,
    },

    demoOption: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
      padding: 14,
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
