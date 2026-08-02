// app/(tabs)/_layout.tsx

// app/(tabs)/_layout.tsx

import React from "react";
import { Tabs } from "expo-router";

import CustomNavBar2 from "src/components/CustomNavBar2";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="league-home"
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: "#F7F7FA",
        },
      }}
      tabBar={(props) => <CustomNavBar2 {...props} />}
    >
      {/* Main CustomNavBar2 routes */}

      <Tabs.Screen
        name="league-home"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="schedule"
        options={{
          title: "Schedule",
        }}
      />

      <Tabs.Screen
        name="standings"
        options={{
          title: "Standings",
        }}
      />

      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
        }}
      />

      <Tabs.Screen
        name="champs"
        options={{
          title: "Champs",
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />

      {/* Routes inside (tabs) that should not appear in CustomNavBar2 */}

      <Tabs.Screen
        name="league"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="league-rules"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="player-hub"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="find-my-team"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="faq"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="SettingsStack"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="updates"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="index.disabled"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}