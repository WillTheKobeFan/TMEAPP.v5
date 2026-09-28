// src/components/layout/ScreenLayout.tsx

import React, { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ScreenHeader from "@/components/layout/ScreenHeader";
import {
  colors,
  sizes,
  spacing,
} from "@/theme";

type KeyboardShouldPersistTaps =
  | "always"
  | "never"
  | "handled";

export type ScreenLayoutProps = {
  title: string;
  children: ReactNode;

  showBackButton?: boolean;
  showLeagueSwitcher?: boolean;

  onBackPress?: () => void;
  backLabel?: string;
  rightContent?: ReactNode;

  scrollEnabled?: boolean;
  keyboardAvoiding?: boolean;
  keyboardShouldPersistTaps?: KeyboardShouldPersistTaps;
  showsVerticalScrollIndicator?: boolean;

  contentStyle?: StyleProp<ViewStyle>;
  screenStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;

  bottomContentPadding?: number;
};

export default function ScreenLayout({
  title,
  children,

  showBackButton = false,
  showLeagueSwitcher = true,

  onBackPress,
  backLabel = "Back",
  rightContent,

  scrollEnabled = true,
  keyboardAvoiding = false,
  keyboardShouldPersistTaps = "handled",
  showsVerticalScrollIndicator = false,

  contentStyle,
  screenStyle,
  headerStyle,

  bottomContentPadding = spacing.xxl,
}: ScreenLayoutProps) {
  const screenContent = scrollEnabled ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingBottom: bottomContentPadding,
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
        styles.nonScrollableContent,
        {
          paddingBottom: bottomContentPadding,
        },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right"]}
    >
      <View style={[styles.screen, screenStyle]}>
        <ScreenHeader
          title={title}
          showBackButton={showBackButton}
          showLeagueSwitcher={showLeagueSwitcher}
          onBackPress={onBackPress}
          backLabel={backLabel}
          rightContent={rightContent}
          style={headerStyle}
        />

        <KeyboardAvoidingView
          style={styles.middle}
          enabled={keyboardAvoiding}
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : undefined
          }
          keyboardVerticalOffset={0}
        >
          {screenContent}
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  screen: {
    flex: 1,
    minHeight: 0,
    backgroundColor: colors.background,
  },

  middle: {
    flex: 1,
    minHeight: 0,
  },

  scrollView: {
    flex: 1,
    minHeight: 0,
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: spacing.lg,
    paddingHorizontal: sizes.screenHorizontalPadding,
  },

  nonScrollableContent: {
    flex: 1,
    minHeight: 0,
    paddingTop: spacing.lg,
    paddingHorizontal: sizes.screenHorizontalPadding,
  },
});