// app/(tabs)/settings/notifications.tsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";

import { useNotificationSettings } from "@/context/NotificationSettingsContext";

const COLORS = {
  purple: "#250F74",
  background: "#F6F5FA",
  card: "#FFFFFF",
  text: "#191724",
  secondaryText: "#6D6878",
  border: "#E5E1EB",
  disabled: "#B7B1C0",
  success: "#2E7D32",
  warning: "#A45A00",
};

type PermissionState =
  | "loading"
  | "granted"
  | "denied"
  | "undetermined";

type PreferenceRowProps = {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function PreferenceRow({
  title,
  description,
  value,
  onValueChange,
  disabled = false,
}: PreferenceRowProps) {
  return (
    <View
      style={[
        styles.preferenceRow,
        disabled && styles.disabledRow,
      ]}
    >
      <View style={styles.preferenceText}>
        <Text
          style={[
            styles.preferenceTitle,
            disabled && styles.disabledText,
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.preferenceDescription,
            disabled && styles.disabledText,
          ]}
        >
          {description}
        </Text>
      </View>

      <Switch
        accessibilityLabel={title}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: "#C9C5CF",
          true: "#7F6DB6",
        }}
        thumbColor={
          value ? COLORS.purple : "#F5F4F7"
        }
        ios_backgroundColor="#C9C5CF"
      />
    </View>
  );
}

export default function NotificationPreferencesScreen() {
  const router = useRouter();

  const {
    preferences,
    sources,
    enabledOrganizationCount,
    enabledSourceCount,
    setAllowNotifications,
    setGameReminders,
    setScoreResultAlerts,
    setInboxAlerts,
  } = useNotificationSettings();

  const [permissionState, setPermissionState] =
    useState<PermissionState>("loading");

  const checkPermission = useCallback(async () => {
    try {
      const permission =
        await Notifications.getPermissionsAsync();

      setPermissionState(permission.status);
    } catch (error) {
      console.warn(
        "Unable to read notification permission:",
        error,
      );

      setPermissionState("denied");
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const enabledSourcesByOrganization = useMemo(() => {
    const grouped = new Map<string, string[]>();

    for (const source of sources) {
      if (!source.enabled) {
        continue;
      }

      const existing =
        grouped.get(source.organizationName) ?? [];

      existing.push(source.dayTime);
      grouped.set(source.organizationName, existing);
    }

    return Array.from(grouped.entries());
  }, [sources]);

  async function requestPermission() {
    try {
      const result =
        await Notifications.requestPermissionsAsync();

      setPermissionState(result.status);

      if (result.status !== "granted") {
        Alert.alert(
          "Permission Not Granted",
          "Notifications are disabled for this device. You can enable them in Device Settings.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
            },
          ],
        );
      }
    } catch (error) {
      console.warn(
        "Unable to request notification permission:",
        error,
      );

      Alert.alert(
        "Notification Error",
        "The app could not request notification permission.",
      );
    }
  }

  async function handleAllowNotifications(
    value: boolean,
  ) {
    if (!value) {
      setAllowNotifications(false);
      return;
    }

    let status = permissionState;

    if (status !== "granted") {
      const result =
        await Notifications.requestPermissionsAsync();

      status = result.status;
      setPermissionState(status);
    }

    if (status === "granted") {
      setAllowNotifications(true);
      return;
    }

    setAllowNotifications(false);

    Alert.alert(
      "Device Permission Required",
      "Enable notifications in Device Settings before turning on app notifications.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Open Settings",
          onPress: () => Linking.openSettings(),
        },
      ],
    );
  }

  async function sendTestNotification() {
    if (!preferences.allowNotifications) {
      Alert.alert(
        "Notifications Are Off",
        "Turn on Allow Notifications before sending a test.",
      );
      return;
    }

    let status = permissionState;

    if (status !== "granted") {
      const permission =
        await Notifications.requestPermissionsAsync();

      status = permission.status;
      setPermissionState(status);
    }

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Device notification permission is disabled.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings(),
          },
        ],
      );

      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "TME Test Notification",
          body: "Your notification settings are working correctly.",
          sound: true,
          data: {
            type: "test",
          },
        },
        trigger: null,
      });

      Alert.alert(
        "Test Notification Sent",
        Platform.OS === "ios"
          ? "A local notification should appear on your device."
          : "Your test notification was sent successfully.",
      );
    } catch (error) {
      console.warn(
        "Unable to send test notification:",
        error,
      );

      Alert.alert(
        "Test Failed",
        "The app could not display the test notification.",
      );
    }
  }

  const devicePermissionLabel =
    permissionState === "granted"
      ? "Device Permission Granted"
      : permissionState === "undetermined"
        ? "Permission Not Requested"
        : permissionState === "loading"
          ? "Checking Device Permission"
          : "Device Permission Disabled";

  const permissionSuccessful =
    permissionState === "granted";

  const appNotificationsEnabled =
    preferences.allowNotifications &&
    permissionSuccessful;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={styles.headerSide}
          >
            <Ionicons
              name="chevron-back"
              size={25}
              color={COLORS.purple}
            />

            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <Text
            numberOfLines={1}
            style={styles.headerTitle}
          >
            Notifications
          </Text>

          <View style={[styles.headerSide, styles.headerRight]}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>TME</Text>
            </View>

            <Ionicons
              name="chevron-down"
              size={17}
              color={COLORS.purple}
            />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Pressable style={styles.filterPill}>
            <Ionicons
              name="notifications-outline"
              size={18}
              color={COLORS.purple}
            />

            <Text style={styles.filterText}>
              Notification Preferences
            </Text>

            <Ionicons
              name="chevron-down"
              size={17}
              color={COLORS.purple}
            />
          </Pressable>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              Notification Preferences
            </Text>

            <Text style={styles.infoDescription}>
              Choose which alerts you receive and which
              leagues can send them.
            </Text>
          </View>

          <View style={styles.contentCard}>
            <Text style={styles.cardHeading}>
              Notification Controls
            </Text>

            <PreferenceRow
              title="Allow Notifications"
              description="Master control for all app alerts"
              value={preferences.allowNotifications}
              onValueChange={handleAllowNotifications}
            />

            <View style={styles.divider} />

            <PreferenceRow
              title="Game Reminders"
              description="Upcoming games and schedule changes"
              value={preferences.gameReminders}
              onValueChange={setGameReminders}
              disabled={!preferences.allowNotifications}
            />

            <View style={styles.divider} />

            <PreferenceRow
              title="Score & Result Alerts"
              description="Final scores and game results"
              value={preferences.scoreResultAlerts}
              onValueChange={setScoreResultAlerts}
              disabled={!preferences.allowNotifications}
            />

            <View style={styles.divider} />

            <PreferenceRow
              title="Inbox Alerts"
              description="Announcements, updates and replies"
              value={preferences.inboxAlerts}
              onValueChange={setInboxAlerts}
              disabled={!preferences.allowNotifications}
            />
          </View>

          <View style={styles.contentCard}>
            <View style={styles.cardHeadingRow}>
              <View>
                <Text style={styles.cardHeading}>
                  Notification Sources
                </Text>

                <Text style={styles.cardSubheading}>
                  All Followed Leagues
                </Text>
              </View>

              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>
                  {enabledSourceCount}
                </Text>
              </View>
            </View>

            <Text style={styles.sourceSummary}>
              {enabledOrganizationCount} organizations •{" "}
              {enabledSourceCount} leagues enabled
            </Text>

            {enabledSourcesByOrganization.length > 0 ? (
              enabledSourcesByOrganization
                .slice(0, 3)
                .map(([organizationName, dayTimes]) => (
                  <View
                    key={organizationName}
                    style={styles.organizationSummary}
                  >
                    <Text style={styles.organizationName}>
                      {organizationName}
                    </Text>

                    <Text style={styles.organizationLeagues}>
                      {dayTimes.join(" • ")}
                    </Text>
                  </View>
                ))
            ) : (
              <Text style={styles.emptySources}>
                No notification sources are enabled.
              </Text>
            )}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Manage notification sources"
              onPress={() =>
                router.push(
                  "/settings/notification-sources",
                )
              }
              style={({ pressed }) => [
                styles.outlineButton,
                pressed && styles.pressedButton,
              ]}
            >
              <Text style={styles.outlineButtonText}>
                Manage Notification Sources
              </Text>

              <Ionicons
                name="chevron-forward"
                size={19}
                color={COLORS.purple}
              />
            </Pressable>
          </View>

          <View style={styles.contentCard}>
            <Text style={styles.cardHeading}>
              Notification Status
            </Text>

            <View style={styles.statusRow}>
              <Text style={styles.statusText}>
                App Notifications Enabled
              </Text>

              <Ionicons
                name={
                  appNotificationsEnabled
                    ? "checkmark-circle"
                    : "alert-circle"
                }
                size={22}
                color={
                  appNotificationsEnabled
                    ? COLORS.success
                    : COLORS.warning
                }
              />
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusText}>
                {devicePermissionLabel}
              </Text>

              <Ionicons
                name={
                  permissionSuccessful
                    ? "checkmark-circle"
                    : "alert-circle"
                }
                size={22}
                color={
                  permissionSuccessful
                    ? COLORS.success
                    : COLORS.warning
                }
              />
            </View>

            {!permissionSuccessful ? (
              <Pressable
                onPress={requestPermission}
                style={({ pressed }) => [
                  styles.permissionButton,
                  pressed && styles.pressedButton,
                ]}
              >
                <Text style={styles.permissionButtonText}>
                  Enable Device Permission
                </Text>
              </Pressable>
            ) : null}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Send test notification"
              onPress={sendTestNotification}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressedButton,
              ]}
            >
              <Ionicons
                name="paper-plane-outline"
                size={18}
                color="#FFFFFF"
              />

              <Text style={styles.primaryButtonText}>
                Send Test Notification
              </Text>
            </Pressable>
          </View>

          <Text style={styles.savedMessage}>
            Changes are saved automatically.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.card,
  },

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    height: 68,
    paddingHorizontal: 16,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 7,
    elevation: 7,
    zIndex: 20,
  },

  headerSide: {
    width: 92,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
  },

  headerRight: {
    justifyContent: "flex-end",
    gap: 6,
  },

  backText: {
    color: COLORS.purple,
    fontSize: 15,
    fontWeight: "700",
  },

  headerTitle: {
    flex: 1,
    color: COLORS.purple,
    fontSize: 19,
    fontWeight: "800",
    textAlign: "center",
  },

  logoCircle: {
    width: 39,
    height: 39,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEEAF8",
    borderWidth: 1,
    borderColor: "#DDD5F1",
  },

  logoText: {
    color: COLORS.purple,
    fontSize: 11,
    fontWeight: "900",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 44,
  },

  filterPill: {
    alignSelf: "flex-start",
    minHeight: 44,
    paddingHorizontal: 15,
    borderRadius: 23,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.11,
    shadowRadius: 6,
    elevation: 4,
  },

  filterText: {
    color: COLORS.purple,
    fontSize: 14,
    fontWeight: "800",
  },

  infoCard: {
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    alignItems: "center",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  infoTitle: {
    color: COLORS.purple,
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },

  infoDescription: {
    maxWidth: 320,
    marginTop: 7,
    color: COLORS.secondaryText,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },

  contentCard: {
    marginTop: 16,
    paddingHorizontal: 17,
    paddingVertical: 18,
    borderRadius: 18,
    backgroundColor: COLORS.card,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 4,
  },

  cardHeading: {
    color: COLORS.purple,
    fontSize: 16,
    fontWeight: "800",
  },

  cardHeadingRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  cardSubheading: {
    marginTop: 4,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },

  countBadge: {
    minWidth: 32,
    height: 32,
    paddingHorizontal: 9,
    borderRadius: 16,
    backgroundColor: "#EEEAF8",
    alignItems: "center",
    justifyContent: "center",
  },

  countBadgeText: {
    color: COLORS.purple,
    fontSize: 13,
    fontWeight: "900",
  },

  preferenceRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  preferenceText: {
    flex: 1,
    paddingRight: 18,
  },

  preferenceTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },

  preferenceDescription: {
    marginTop: 4,
    color: COLORS.secondaryText,
    fontSize: 12.5,
    lineHeight: 17,
  },

  disabledRow: {
    opacity: 0.48,
  },

  disabledText: {
    color: COLORS.disabled,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
  },

  sourceSummary: {
    marginTop: 12,
    color: COLORS.secondaryText,
    fontSize: 13,
    fontWeight: "600",
  },

  organizationSummary: {
    marginTop: 15,
  },

  organizationName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "800",
  },

  organizationLeagues: {
    marginTop: 3,
    color: COLORS.secondaryText,
    fontSize: 12.5,
    lineHeight: 18,
  },

  emptySources: {
    marginTop: 16,
    color: COLORS.secondaryText,
    fontSize: 13,
  },

  outlineButton: {
    minHeight: 48,
    marginTop: 20,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    borderColor: COLORS.purple,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  outlineButtonText: {
    color: COLORS.purple,
    fontSize: 14,
    fontWeight: "800",
  },

  statusRow: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  statusText: {
    flex: 1,
    paddingRight: 12,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },

  permissionButton: {
    minHeight: 46,
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: COLORS.purple,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  permissionButtonText: {
    color: COLORS.purple,
    fontSize: 14,
    fontWeight: "800",
  },

  primaryButton: {
    minHeight: 50,
    marginTop: 12,
    borderRadius: 14,
    backgroundColor: COLORS.purple,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  pressedButton: {
    opacity: 0.75,
    transform: [{ scale: 0.992 }],
  },

  savedMessage: {
    marginTop: 20,
    color: COLORS.secondaryText,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});