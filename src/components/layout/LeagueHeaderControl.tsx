// src/components/layout/LeagueHeaderControl.tsx

import React, { useRef } from "react";
import {
Animated,
Image,
ImageSourcePropType,
Pressable,
StyleSheet,
View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PURPLE = "#250F74";

type LeagueHeaderControlProps = {
logoSource?: ImageSourcePropType | null;
onPress?: () => void;
accessibilityLabel?: string;
disabled?: boolean;
};

export default function LeagueHeaderControl({
logoSource,
onPress,
accessibilityLabel = "Change league",
disabled = false,
}: LeagueHeaderControlProps) {
const scale = useRef(new Animated.Value(1)).current;

const animateTo = (value: number) => {
Animated.spring(scale, {
toValue: value,
useNativeDriver: true,
speed: 35,
bounciness: 0,
}).start();
};

return (
<View style={styles.container}>
<Pressable
accessibilityRole="button"
accessibilityLabel={accessibilityLabel}
accessibilityState={{ disabled }}
disabled={disabled || !onPress}
hitSlop={8}
onPress={onPress}
onPressIn={() => animateTo(0.95)}
onPressOut={() => animateTo(1)}
>
<Animated.View
style={[
styles.pressableContent,
{
transform: [{ scale }],
},
disabled && styles.disabled,
]}
>
<View style={styles.logoCircle}>
{logoSource ? (
<Image source={logoSource} resizeMode="contain" style={styles.logo} />
) : (
<Ionicons name="basketball-outline" size={28} color={PURPLE} />
)}
</View>
      <Ionicons
        name="chevron-down"
        size={22}
        color={PURPLE}
        style={styles.chevron}
      />
    </Animated.View>
  </Pressable>
</View>
);
}

const styles = StyleSheet.create({
container: {
width: 92,
alignItems: "flex-end",
justifyContent: "center",
},

pressableContent: {
flexDirection: "row",
alignItems: "center",
},

logoCircle: {
width: 48,
height: 48,
borderRadius: 24,
alignItems: "center",
justifyContent: "center",
overflow: "hidden",
backgroundColor: "#FFFFFF",
borderWidth: 1,
borderColor: "#E8E3F0",

shadowColor: "#1C123D",
shadowOffset: {
  width: 0,
  height: 4,
},
shadowOpacity: 0.12,
shadowRadius: 8,

elevation: 5,

},

logo: {
width: 40,
height: 40,
},

chevron: {
marginLeft: 8,
},

disabled: {
opacity: 0.5,
},
});