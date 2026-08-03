// app/_layout.tsx

import React from "react";
import { Stack } from "expo-router";

import { ThemeProvider } from "@/theme/ThemeProvider";
import { LeagueProvider } from "@/context/LeagueContext";
import { TextSizeProvider } from "@/context/TextSizeContext";
import {
  ScreenDimmerProvider,
} from "@/context/ScreenDimmerContext";
import {
  InboxProvider,
} from "@/context/InboxContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TextSizeProvider>
        <ScreenDimmerProvider>
          <LeagueProvider>
            <InboxProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              />
            </InboxProvider>
          </LeagueProvider>
        </ScreenDimmerProvider>
      </TextSizeProvider>
    </ThemeProvider>
  );
}