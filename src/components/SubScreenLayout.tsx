// src/components/SubScreenLayout.tsx

import { Href, useRouter } from "expo-router";
import React from "react";

import ScreenLayout, {
  ScreenLayoutProps,
} from "@/components/layout/ScreenLayout";

export type SubScreenLayoutProps = Omit<
  ScreenLayoutProps,
  "onBackPress"
> & {
  backRoute?: Href;
  onBackPress?: () => void;
};

/**
 * SubScreenLayout shares the same static-header / scrollable-middle
 * architecture as ScreenLayout while adding optional backRoute support.
 *
 * The fixed CustomNavBar2 remains owned by app/(tabs)/_layout.tsx.
 */
export default function SubScreenLayout({
  backRoute,
  onBackPress,
  titleFontSize = 22,
  showBackButton = true,
  showOrganizationSelector = true,
  scrollEnabled = true,
  bottomContentPadding = 150,
  ...rest
}: SubScreenLayoutProps) {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (backRoute) {
      router.replace(backRoute);
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(tabs)/league-home" as never);
  };

  return (
    <ScreenLayout
      {...rest}
      titleFontSize={titleFontSize}
      showBackButton={showBackButton}
      showOrganizationSelector={showOrganizationSelector}
      scrollEnabled={scrollEnabled}
      bottomContentPadding={bottomContentPadding}
      onBackPress={handleBackPress}
    />
  );
}
