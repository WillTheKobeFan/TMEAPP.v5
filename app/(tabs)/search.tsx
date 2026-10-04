// app/(tabs)/search.tsx

import React from "react";
import { StyleSheet, Text, View } from "react-native";

import ScreenLayout from "@/components/layout/ScreenLayout";
import { AppTheme, useTheme } from "@/theme";

export default function Search() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <ScreenLayout title="Search" showBackButton>
      <View style={styles.container}>
        <Text style={styles.title}>Search</Text>
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
