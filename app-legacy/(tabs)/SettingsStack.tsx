// app/(tabs)/SettingsStack.tsx


import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "./settings";
import TermsOfServiceScreen from "app/(tabs)/settings/TermsOfService";
import PrivacyPolicyScreen from "app/(tabs)/settings/PrivacyPolicy";
import CopyrightScreen from "app/(tabs)/settings/Copyright";
import LeagueDisclaimerScreen from "app/(tabs)/settings/LeagueDisclaimer";
import { SettingsStackParamList } from "src/notifications/types";

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="Copyright" component={CopyrightScreen} />
      <Stack.Screen name="LeagueDisclaimer" component={LeagueDisclaimerScreen} />
    </Stack.Navigator>
  );
}