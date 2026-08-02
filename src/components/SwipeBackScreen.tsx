// src/components/SwipeBackScreen.tsx

import React from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";
import { useRouter } from "expo-router";

type Props = {
  children: React.ReactNode;
  enabled?: boolean;
};

export default function SwipeBackScreen({
  children,
  enabled = true,
}: Props) {
  const router = useRouter();

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (
          _event: GestureResponderEvent,
          gesture: PanResponderGestureState
        ) => {
          if (!enabled) return false;

          const startedNearLeft =
            gesture.moveX < 80;

          const swipingRight =
            gesture.dx > 35;

          const mostlyHorizontal =
            Math.abs(gesture.dx) >
            Math.abs(gesture.dy) * 1.5;

          return (
            startedNearLeft &&
            swipingRight &&
            mostlyHorizontal
          );
        },

        onPanResponderRelease: (
          _event,
          gesture
        ) => {
          if (gesture.dx > 90) {
            if (router.canGoBack()) {
              router.back();
            }
          }
        },
      }),
    [enabled, router]
  );

  return (
    <View
      style={styles.container}
      {...panResponder.panHandlers}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});