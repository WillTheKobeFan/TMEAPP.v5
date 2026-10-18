// app/_layout.tsx

import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { LeagueProvider } from "@/context/LeagueContext";
import { MembershipProvider } from "@/context/MembershipContext";
import { TextSizeProvider } from "@/context/TextSizeContext";
import { ThemeProvider } from "@/theme";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TextSizeProvider>
        <MembershipProvider>
          <SafeAreaProvider>
            <LeagueProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  gestureEnabled: true,
                  gestureDirection: "horizontal",
                }}
              >
                <Stack.Screen name="(tabs)" />

                <Stack.Screen
                  name="organization/[organizationId]"
                  options={{
                    gestureEnabled: true,
                    gestureDirection: "horizontal",
                  }}
                />

                <Stack.Screen
                  name="training/[trainingId]"
                  options={{
                    gestureEnabled: true,
                    gestureDirection: "horizontal",
                  }}
                />
              </Stack>
            </LeagueProvider>
          </SafeAreaProvider>
        </MembershipProvider>
      </TextSizeProvider>
    </ThemeProvider>
  );
}
