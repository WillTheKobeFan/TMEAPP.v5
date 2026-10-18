// src/components/navigation/StackNavBar.tsx

import { usePathname, useRouter } from "expo-router";
import React from "react";

import CustomNavBarV4 from "./CustomNavBarV4";

const TAB_ROUTES = [
  "home",
  "schedule",
  "standings",
  "inbox",
  "myhub",
  "champs",
  "search",
  "settings",
];

export default function StackNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const state = {
    index: 0,
    routes: TAB_ROUTES.map((name) => ({
      key: name,
      name,
    })),
  };

  const navigation = {
    emit: () => ({
      defaultPrevented: false,
    }),

    navigate: (routeName: string) => {
      router.navigate(`/(tabs)/${routeName}` as never);
    },
  };

  return (
    <CustomNavBarV4
      state={state as never}
      navigation={navigation as never}
      descriptors={{} as never}
      insets={
        {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        } as never
      }
    />
  );
}
