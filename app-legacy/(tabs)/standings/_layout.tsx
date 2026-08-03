import { Stack } from "expo-router";

export default function StandingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Sunday" />
      <Stack.Screen name="Monday" />
      <Stack.Screen name="Tuesday" />
      <Stack.Screen name="Wednesday" />
    </Stack>
  );
}