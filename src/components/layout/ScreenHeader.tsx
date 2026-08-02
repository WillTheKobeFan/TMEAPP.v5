// src/components/layout/ScreenHeader.tsx

import React, { ReactNode } from "react";
import {
Pressable,
StyleSheet,
Text,
View,
ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import LeagueSwitcher from "@/components/league/LeagueSwitcher";
import {
colors,
shadows,
spacing,
typography,
} from "@/theme";

type ScreenHeaderProps = {
title: string;
showBackButton?: boolean;
showLeagueSwitcher?: boolean;
onBackPress?: () => void;
rightContent?: ReactNode;
style?: ViewStyle;
backLabel?: string;
};

export default function ScreenHeader({
title,
showBackButton = true,
showLeagueSwitcher = true,
onBackPress,
rightContent,
style,
backLabel = "Back",
}: ScreenHeaderProps) {
const handleBackPress = () => {
if (onBackPress) {
onBackPress();
return;
}

if (router.canGoBack()) {
  router.back();
  return;
}

router.replace("/");

};

const renderedRightContent =
rightContent ??
(showLeagueSwitcher ? <LeagueSwitcher /> : null);

return (
<View style={[styles.container, style]}>
<View style={styles.leftSide}>
{showBackButton ? (
<View style={styles.backControl}>
<Pressable
accessibilityRole="button"
accessibilityLabel="Go back"
onPress={handleBackPress}
hitSlop={10}
style={({ pressed }) => [
styles.backButton,
pressed && styles.pressed,
]}
>
<Ionicons name="arrow-back" size={26} color={colors.primary} />
</Pressable>

        <Text
          numberOfLines={1}
          style={styles.backText}
        >
          {backLabel}
        </Text>
      </View>
    ) : null}
  </View>

  <View style={styles.titleContainer}>
    <Text
      numberOfLines={2}
      adjustsFontSizeToFit
      minimumFontScale={0.62}
      style={styles.title}
    >
      {title}
    </Text>
  </View>

  <View style={styles.rightSide}>
    {renderedRightContent}
  </View>
</View>

);
}

const styles = StyleSheet.create({
container: {
width: "100%",
minHeight: 104,

flexDirection: "row",
alignItems: "flex-start",

paddingHorizontal: spacing.md,
paddingTop: spacing.md,
paddingBottom: spacing.sm,

marginBottom: spacing.lg,

backgroundColor: colors.surface,
borderRadius: 0,

...shadows.header,

},

leftSide: {
width: 104,
minHeight: 76,

alignItems: "flex-start",
justifyContent: "flex-start",

paddingLeft: 16,

},

titleContainer: {
flex: 1,
minWidth: 0,
minHeight: 76,

alignItems: "center",
justifyContent: "center",

paddingHorizontal: spacing.xs,
paddingBottom: 12,

},

title: {
width: "100%",

color: colors.primary,
fontSize: typography.title,
fontWeight: "800",
textAlign: "center",

includeFontPadding: false,

},

rightSide: {
width: 104,
minHeight: 76,

alignItems: "flex-end",
justifyContent: "flex-start",

},

backControl: {
alignItems: "center",
justifyContent: "flex-start",
},

backButton: {
width: 48,
height: 48,
borderRadius: 24,

alignItems: "center",
justifyContent: "center",

backgroundColor: colors.surface,

borderWidth: 1,
borderColor: "#E8E3F0",

shadowColor: "#1C123D",
shadowOffset: {
  width: 0,
  height: 4,
},
shadowOpacity: 0.13,
shadowRadius: 8,

elevation: 6,

},

backText: {
maxWidth: 76,
marginTop: 6,

color: colors.primary,
fontSize: typography.caption,
fontWeight: "700",
textAlign: "center",

includeFontPadding: false,

},

pressed: {
opacity: 0.72,
transform: [{ scale: 0.95 }],
},
});