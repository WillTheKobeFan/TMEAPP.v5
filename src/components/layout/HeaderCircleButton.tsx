// src/components/layout/HeaderCircleButton.tsx

import React, { useRef } from "react";
import {
Animated,
Platform,
Pressable,
StyleSheet,
Text,
View,
ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PURPLE = "#250F74";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

type HeaderCircleButtonProps = {
icon: IoniconName;
label: string;
onPress: () => void;
accessibilityLabel?: string;
disabled?: boolean;
circleSize?: number;
iconSize?: number;
style?: ViewStyle;
};

export default function HeaderCircleButton({
icon,
label,
onPress,
accessibilityLabel,
disabled = false,
circleSize = 48,
iconSize = 27,
style,
}: HeaderCircleButtonProps) {
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
<View style={[styles.container, style]}>
<Pressable
accessibilityRole="button"
accessibilityLabel={accessibilityLabel ?? label}
accessibilityState={{ disabled }}
disabled={disabled}
hitSlop={8}
onPress={onPress}
onPressIn={() => animateTo(0.94)}
onPressOut={() => animateTo(1)}
>
<Animated.View
style={[
styles.circle,
{
width: circleSize,
height: circleSize,
borderRadius: circleSize / 2,
transform: [{ scale }],
},
disabled && styles.disabledCircle,
]}
>
<Ionicons
name={icon}
size={iconSize}
color={disabled ? "#A9A4B8" : PURPLE}
/>
</Animated.View>
</Pressable>

  <Text
    numberOfLines={1}
    style={[styles.label, disabled && styles.disabledLabel]}
  >
    {label}
  </Text>
</View>

);
}

const styles = StyleSheet.create({
container: {
width: 76,
alignItems: "center",
justifyContent: "flex-start",
},

circle: {
alignItems: "center",
justifyContent: "center",
backgroundColor: "#FFFFFF",
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

label: {
marginTop: 7,
color: PURPLE,
fontSize: 14,
fontWeight: "700",
textAlign: "center",
includeFontPadding: false,
},

disabledCircle: {
opacity: 0.55,
},

disabledLabel: {
color: "#A9A4B8",
},
});