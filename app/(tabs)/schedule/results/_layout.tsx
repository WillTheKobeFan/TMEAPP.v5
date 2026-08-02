// controls navigation for this stack 

// app/(tabs)/results/_layout.tsx
import { Stack } from "expo-router";

export default function ResultsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 🔥 we use ScreenLayout instead
      }}
    />
  );
}