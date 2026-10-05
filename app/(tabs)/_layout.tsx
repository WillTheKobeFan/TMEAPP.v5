// app/(tabs)/_layout.tsx

import { Tabs } from "expo-router";

import CustomNavBarV4 from "src/components/navigation/CustomNavBarV4";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => (
        <CustomNavBarV4 {...props} />
      )}
    >
      {/* Page 1 */}
      <Tabs.Screen name="home" />
      <Tabs.Screen name="schedule" />
      <Tabs.Screen name="standings" />
      <Tabs.Screen name="inbox" />
      <Tabs.Screen name="myhub" />

      {/* Page 2 */}
      <Tabs.Screen name="champs" />
      <Tabs.Screen name="progression" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="settings" />

      {/* Organization Hub - hidden from bottom navigation */}
      <Tabs.Screen
        name="organization"
        options={{
          href: null,
        }}
      />

      {/* Development only */}
      <Tabs.Screen
        name="offering-preview"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}