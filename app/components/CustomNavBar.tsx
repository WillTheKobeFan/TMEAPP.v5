// app/components/CustomNavBar.tsx
import React from "react";
import { View, TouchableOpacity, StyleSheet, Text, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const CustomNavBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const BG_COLOR = "#250f74ff";
  const ACTIVE_COLOR = "#000000ff";
  const INACTIVE_COLOR = "#ffffffff";

  // TEMP TEST NOTIFICATION COUNT — replace with Zustand later
  const updatesCount = 99;

  return (
    <View style={[styles.container, { backgroundColor: BG_COLOR, shadowColor: "#aaa" }]}>
      {/* ------------------------------------------------------------ */}
      {/* Example title showing & character */}
      {/* ------------------------------------------------------------ */}
     
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        let label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        let labelText: string;
        if (typeof label === "function") {
          labelText = label({
            focused: state.index === index,
            color: state.index === index ? ACTIVE_COLOR : INACTIVE_COLOR,
            position: "below-icon",
            children: route.name,
          }) as string;
        } else {
          labelText = label;
        }

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <AnimatedTouchableOpacity
            layout={Layout.springify()}
            key={route.key}
            onPress={onPress}
            style={[
              styles.tabItem,
              isFocused && { backgroundColor: "#e0e0e0" },
            ]}
            activeOpacity={0.8}
          >
            {/* ICON + NOTIFICATION BADGE WRAPPER */}
            <View style={{ position: "relative" }}>
              {getIconByRouteName(route.name, isFocused ? ACTIVE_COLOR : INACTIVE_COLOR)}

              {route.name === "updates" && updatesCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{updatesCount}</Text>
                </View>
              )}
            </View>

            {isFocused && (
              <Animated.Text
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                style={[styles.text, { color: ACTIVE_COLOR }]}
              >
                {labelText}
              </Animated.Text>
            )}
          </AnimatedTouchableOpacity>
        );
      })}
    </View>
  );

  function getIconByRouteName(routeName: string, color: string) {
  switch (routeName) {
    case "index":
      return <Entypo name="home" size={24} color={color} />;
    case "schedule":
      return <FontAwesome name="calendar" size={24} color={color} />;
    case "standings":
      return <Entypo name="bar-graph" size={24} color={color} />;
    case "updates":
      return <FontAwesome name="bell" size={24} color={color} />;
    case "champs":
      return <FontAwesome6 name="trophy" size={24} color={color} />;
    case "chat":
      return <AntDesign name="wechat" size={24} color={color} />;
    default:
      return <Entypo name="circle" size={24} color={color} />; // fallback icon
  }
}
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "98%",
    alignSelf: "center",
    bottom: Platform.OS === "ios" ? 25 : 15,
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 30,
  },
  text: {
    marginLeft: 8,
    fontWeight: "500",
    fontSize: 14,
  },

  badge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "red",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default CustomNavBar;









