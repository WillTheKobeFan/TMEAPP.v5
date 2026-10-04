// app/(tabs)/inbox.tsx

import React from "react";
import { StyleSheet, Text, View } from "react-native";

import ScreenLayout from "@/components/layout/ScreenLayout";
import { AppTheme, useTheme } from "@/theme";

export default function Inbox() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <ScreenLayout title="Inbox" showBackButton>
      <View style={styles.container}>
        <Text style={styles.title}>Inbox</Text>
      </View>
    </ScreenLayout>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.text,
    },
  });
