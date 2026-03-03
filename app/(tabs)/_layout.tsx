// app/(tabs)/_layout.tsx
import { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import CustomNavBar from "../components/CustomNavBar";
import { NotificationProvider } from "../../src/notifications/NotificationProvider";
import { db, auth } from "@/src/lib/firebase";
import { signInAnonymously } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export default function TabLayout() {
  const [currentUid, setCurrentUid] = useState<string | null>(null);

  const ADMIN_UID = "JOsMmAiup9SwJLECIWOpX891TTJ2";

  useEffect(() => {
    if (!auth.currentUser) {
      signInAnonymously(auth)
        .then((userCredential) => {
          console.log("Anonymous sign-in successful ✅");
          console.log("User UID:", userCredential.user.uid);
          setCurrentUid(userCredential.user.uid);
        })
        .catch(console.error);
    } else {
      setCurrentUid(auth.currentUser.uid);
    }
  }, []);

  return (
    <NotificationProvider>
      <Tabs
        screenOptions={{ headerShown: false }}
        // Correctly type props for TS
        tabBar={(props: BottomTabBarProps) => <CustomNavBar {...props} />}
      >
        <Tabs.Screen name="index" options={{ tabBarLabel: "Home", title: "Home" }} />
        <Tabs.Screen name="schedule" options={{ tabBarLabel: "Schedule", title: "Schedule" }} />
        <Tabs.Screen name="standings" options={{ tabBarLabel: "Standings", title: "Standings" }} />
        <Tabs.Screen name="updates" options={{ tabBarLabel: "Updates", title: "Updates" }} />
        <Tabs.Screen name="champs" options={{ tabBarLabel: "Champs", title: "Champs" }} />
        <Tabs.Screen 
          name="chat" 
          options={{ 
            title: "Chat", 
            headerShown: true, 
            headerRight: () => (
              <Ionicons name="chatbubble-outline" size={24} style={{ marginRight: 15 }} />
            ),
          }}
        />
      </Tabs>
    </NotificationProvider>
  );
}