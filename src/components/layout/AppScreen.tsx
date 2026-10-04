// src/components/layout/AppScreen.tsx

import React, { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing, useTheme } from "@/theme";

type AppScreenProps = {
  children: ReactNode;
  scrollable?: boolean;
  keyboardAware?: boolean;
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
};

export default function AppScreen({
  children,
  scrollable = true,
  keyboardAware = false,
  contentContainerStyle,
  style,
}: AppScreenProps) {
  const { theme } = useTheme();

  const content = scrollable ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        styles.scrollContent,
        contentContainerStyle,
      ]}
      style={{
        backgroundColor: theme.background,
      }}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.content,
        {
          backgroundColor: theme.background,
        },
        contentContainerStyle,
      ]}
    >
      {children}
    </View>
  );

  const screen = (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: theme.background,
        },
        style,
      ]}
      edges={["top"]}
    >
      {content}
    </SafeAreaView>
  );

  if (!keyboardAware) {
    return screen;
  }

  return (
    <KeyboardAvoidingView
      style={[
        styles.keyboardContainer,
        {
          backgroundColor: theme.background,
        },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {screen}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xxxl,
  },

  content: {
    flex: 1,
    paddingBottom: spacing.xxxl,
  },
});