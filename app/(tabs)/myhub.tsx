// app/(tabs)/myhub.tsx

import React from "react";
import { StyleSheet, Text, View } from "react-native";

import ScreenLayout from "@/components/layout/ScreenLayout";
import { AppTheme, useTheme } from "@/theme";

export default function MyHub() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <ScreenLayout title="MyHub">
      <View style={styles.container}>
        <Text style={styles.title}>MyHub</Text>
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
