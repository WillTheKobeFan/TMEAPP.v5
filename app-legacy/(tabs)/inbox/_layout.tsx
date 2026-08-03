// app/(tabs)/inbox/_layout.tsx 

import { Stack } from "expo-router";

export default function InboxLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}