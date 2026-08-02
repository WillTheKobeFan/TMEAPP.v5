// app/(tabs)/updates/_layout.tsx

import { Stack } from "expo-router";

export default function UpdatesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    />
  );
}