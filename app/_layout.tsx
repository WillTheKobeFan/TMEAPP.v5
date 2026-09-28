// app/_layout.tsx

import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { LeagueProvider } from "@/context/LeagueContext";

import { MembershipProvider } from "src/context/MembershipContext";

export default function RootLayout() {
  return (
    <MembershipProvider>
    <SafeAreaProvider>
      <LeagueProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </LeagueProvider>
    </SafeAreaProvider>
    </MembershipProvider>
  );
}