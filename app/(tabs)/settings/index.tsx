// app/(tabs)/settings/index.tsx

import Ionicons from "@expo/vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
import { Href, useRouter } from "expo-router";
import React, { ReactNode, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

import ScreenLayout from "@/components/ScreenLayout";
import { useScreenDimmer } from "@/context/ScreenDimmerContext";
import { useTextSize } from "@/context/TextSizeContext";

const COLORS = {
  purple: "#250F74",
  lightPurple: "#F6F2FF",
  background: "#F8F7FB",
  white: "#FFFFFF",
  text: "#1E1B24",
  muted: "#6B6872",
  border: "#EAE5F2",
  divider: "#F0EDF4",
  track: "#D7D5DC",
};

type SectionId =
  | "notifications"
  | "display"
  | "preferences"
  | "scorekeeper"
  | "legal"
  | "admin";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type SectionCardProps = {
  id: SectionId;
  title: string;
  subtitle: string;
  icon: IconName;
  activeId: SectionId | null;
  onToggle: (id: SectionId) => void;
  children: ReactNode;
};

type RowProps = {
  title: string;
  subtitle?: string;
  icon: IconName;
  onPress: () => void;
  last?: boolean;
};

type ToggleRowProps = {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  last?: boolean;
};

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SettingsScreen() {
  const router = useRouter();
  const { textScale, setTextScale } = useTextSize();
  const { dimAmount, setDimAmount } = useScreenDimmer();

  const [activeSection, setActiveSection] =
    useState<SectionId | null>("legal");

  const [notificationsEnabled, setNotificationsEnabled] =
    useState(true);
  const [gameReminders, setGameReminders] = useState(true);
  const [scoreAlerts, setScoreAlerts] = useState(true);
  const [inboxAlerts, setInboxAlerts] = useState(true);

  const [rememberFilters, setRememberFilters] = useState(true);
  const [teamBranding, setTeamBranding] = useState(true);
  const [showInactive, setShowInactive] = useState(false);

  const toggleSection = (id: SectionId) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut,
    );

    setActiveSection((current) =>
      current === id ? null : id,
    );
  };

  const push = (href: Href) => router.push(href);

  const openContactSupport = () => {
    router.push({
      pathname: "/inbox",
      params: {
        tab: "messages",
        topic: "app-support",
        compose: "support",
      },
    } as Href);
  };

  const textSizeLabel =
    textScale <= 0.9
      ? "Small"
      : textScale <= 1.05
        ? "Default"
        : textScale <= 1.15
          ? "Large"
          : "Extra Large";

  return (
    <ScreenLayout
      title="Settings"
      showOrganizationSelector={true}
      showSettingsShortcut={false}
    >
      <View style={styles.screen}>
        <View style={styles.contentArea}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.container}>
              <View style={styles.infoCard}>
                <View style={styles.infoIcon}>
                  <Ionicons
                    name="settings-outline"
                    size={25}
                    color={COLORS.white}
                  />
                </View>

                <View style={styles.infoText}>
                  <Text
                    style={[
                      styles.infoTitle,
                      { fontSize: 18 * textScale },
                    ]}
                  >
                    App Settings
                  </Text>

                  <Text
                    style={[
                      styles.infoDescription,
                      { fontSize: 12.5 * textScale },
                    ]}
                  >
                    Customize alerts, display options, saved
                    preferences, support and legal information.
                  </Text>
                </View>
              </View>

              <SectionCard
                id="notifications"
                title="Notifications"
                subtitle="Manage game, score and Inbox alerts."
                icon="notifications-outline"
                activeId={activeSection}
                onToggle={toggleSection}
              >
                <ToggleRow
                  title="Allow Notifications"
                  subtitle="Receive announcements and league updates."
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                />

                <ToggleRow
                  title="Game Reminders"
                  subtitle="Receive reminders before upcoming games."
                  value={gameReminders}
                  onValueChange={setGameReminders}
                  disabled={!notificationsEnabled}
                />

                <ToggleRow
                  title="Score & Result Alerts"
                  subtitle="Receive final score and result updates."
                  value={scoreAlerts}
                  onValueChange={setScoreAlerts}
                  disabled={!notificationsEnabled}
                />

                <ToggleRow
                  title="Inbox Alerts"
                  subtitle="Show badges for unread notifications and messages."
                  value={inboxAlerts}
                  onValueChange={setInboxAlerts}
                  disabled={!notificationsEnabled}
                  last
                />
              </SectionCard>

              <SectionCard
                id="display"
                title="Display & Accessibility"
                subtitle="Adjust text size and screen brightness."
                icon="eye-outline"
                activeId={activeSection}
                onToggle={toggleSection}
              >
                <View style={styles.controlBlock}>
                  <View style={styles.controlHeader}>
                    <Text
                      style={[
                        styles.controlTitle,
                        { fontSize: 14.5 * textScale },
                      ]}
                    >
                      Text Size
                    </Text>

                    <View style={styles.valuePill}>
                      <Text
                        style={[
                          styles.valuePillText,
                          { fontSize: 10.5 * textScale },
                        ]}
                      >
                        {textSizeLabel}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.controlDescription,
                      { fontSize: 12 * textScale },
                    ]}
                  >
                    Adjust text throughout the application.
                  </Text>

                  <Slider
                    minimumValue={0.85}
                    maximumValue={1.25}
                    step={0.05}
                    value={textScale}
                    onValueChange={setTextScale}
                    minimumTrackTintColor={COLORS.purple}
                    maximumTrackTintColor={COLORS.track}
                    thumbTintColor={COLORS.purple}
                  />
                </View>

                <View style={[styles.controlBlock, styles.lastBlock]}>
                  <View style={styles.controlHeader}>
                    <Text
                      style={[
                        styles.controlTitle,
                        { fontSize: 14.5 * textScale },
                      ]}
                    >
                      Screen Dimmer
                    </Text>

                    <View style={styles.valuePill}>
                      <Text
                        style={[
                          styles.valuePillText,
                          { fontSize: 10.5 * textScale },
                        ]}
                      >
                        {Math.round(dimAmount * 100)}%
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.controlDescription,
                      { fontSize: 12 * textScale },
                    ]}
                  >
                    Reduce screen brightness inside the app.
                  </Text>

                  <Slider
                    minimumValue={0}
                    maximumValue={0.65}
                    step={0.05}
                    value={dimAmount}
                    onValueChange={setDimAmount}
                    minimumTrackTintColor={COLORS.purple}
                    maximumTrackTintColor={COLORS.track}
                    thumbTintColor={COLORS.purple}
                  />
                </View>
              </SectionCard>

              <SectionCard
                id="preferences"
                title="App Preferences"
                subtitle="Control saved filters and league visuals."
                icon="options-outline"
                activeId={activeSection}
                onToggle={toggleSection}
              >
                <ToggleRow
                  title="Remember Screen Filters"
                  subtitle="Keep each screen's most recent filter selection."
                  value={rememberFilters}
                  onValueChange={setRememberFilters}
                />

                <ToggleRow
                  title="Show Team Branding"
                  subtitle="Display team colors and uploaded logos."
                  value={teamBranding}
                  onValueChange={setTeamBranding}
                />

                <ToggleRow
                  title="Show Inactive Leagues"
                  subtitle="Include inactive leagues in selectors."
                  value={showInactive}
                  onValueChange={setShowInactive}
                  last
                />
              </SectionCard>


              <SectionCard
                id="scorekeeper"
                title="Scorekeeper Tools"
                subtitle="Enter scores and manage active game results."
                icon="calculator-outline"
                activeId={activeSection}
                onToggle={toggleSection}
              >
                <Row
                  title="Open Scorekeeper"
                  subtitle="Enter scores for scheduled games."
                  icon="basketball-outline"
                  onPress={() =>
                    push("/scorekeeper" as Href)
                  }
                />

                <Row
                  title="Scorekeeper Instructions"
                  subtitle="Review scoring controls and the save/finalize process."
                  icon="reader-outline"
                  onPress={() =>
                    push(
                      "/settings/ScorekeeperInstructions" as Href,
                    )
                  }
                  last
                />
              </SectionCard>

              <SectionCard
                id="legal"
                title="Legal, Support & Information"
                subtitle="Support, policies and ownership information."
                icon="information-circle-outline"
                activeId={activeSection}
                onToggle={toggleSection}
              >
                <Row
                  title="Contact Support"
                  subtitle="Open the Messages section in Inbox."
                  icon="chatbubble-ellipses-outline"
                  onPress={openContactSupport}
                />

                <Row
                  title="League Information"
                  subtitle="View format, playoffs and results information."
                  icon="basketball-outline"
                  onPress={() =>
                    push("/league-info/details" as Href)
                  }
                />

                <Row
                  title="Privacy Policy"
                  subtitle="Learn how information is collected and used."
                  icon="shield-checkmark-outline"
                  onPress={() =>
                    push("/settings/PrivacyPolicy" as Href)
                  }
                />

                <Row
                  title="Terms of Service"
                  subtitle="Review the terms governing use of the app."
                  icon="document-text-outline"
                  onPress={() =>
                    push("/settings/TermsOfService" as Href)
                  }
                />

                <Row
                  title="Legal Disclaimer"
                  subtitle="Review important limitations and notices."
                  icon="warning-outline"
                  onPress={() =>
                    push("/settings/LeagueDisclaimer" as Href)
                  }
                />

                <Row
                  title="Copyright Information"
                  subtitle="View ownership and permitted-use information."
                  icon="copy-outline"
                  onPress={() =>
                    push("/settings/Copyright" as Href)
                  }
                  last
                />
              </SectionCard>

              <SectionCard
                id="admin"
                title="Administration"
                subtitle="Open tools for managing leagues and app content."
                icon="construct-outline"
                activeId={activeSection}
                onToggle={toggleSection}
              >
                <Row
                  title="Admin Panel"
                  subtitle="Manage seasons, teams, schedules, scores and content."
                  icon="shield-outline"
                  onPress={() => push("/admin/AdminPanel" as Href)}
                  last
                />
              </SectionCard>
            </View>
          </ScrollView>
        </View>
      </View>
    </ScreenLayout>
  );
}

function SectionCard({
  id,
  title,
  subtitle,
  icon,
  activeId,
  onToggle,
  children,
}: SectionCardProps) {
  const expanded = activeId === id;

  return (
    <View style={styles.sectionCard}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        activeOpacity={0.8}
        style={styles.sectionHeader}
        onPress={() => onToggle(id)}
      >
        <View style={styles.sectionIcon}>
          <Ionicons
            name={icon}
            size={22}
            color={COLORS.purple}
          />
        </View>

        <View style={styles.sectionHeaderText}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        </View>

        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={21}
          color={COLORS.purple}
        />
      </TouchableOpacity>

      {expanded ? (
        <View style={styles.sectionBody}>{children}</View>
      ) : null}
    </View>
  );
}

function Row({
  title,
  subtitle,
  icon,
  onPress,
  last = false,
}: RowProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.78}
      onPress={onPress}
      style={[
        styles.row,
        last && styles.rowLast,
      ]}
    >
      <View style={styles.rowIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={COLORS.purple}
        />
      </View>

      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? (
          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        ) : null}
      </View>

      <Ionicons
        name="chevron-forward"
        size={19}
        color={COLORS.muted}
      />
    </TouchableOpacity>
  );
}

function ToggleRow({
  title,
  subtitle,
  value,
  onValueChange,
  disabled = false,
  last = false,
}: ToggleRowProps) {
  return (
    <View
      style={[
        styles.row,
        last && styles.rowLast,
        disabled && styles.disabledRow,
      ]}
    >
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>

      <Switch
        value={value}
        disabled={disabled}
        onValueChange={onValueChange}
        trackColor={{
          false: COLORS.track,
          true: "#B9ACE6",
        }}
        thumbColor={
          value ? COLORS.purple : COLORS.white
        }
        ios_backgroundColor={COLORS.track}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentArea: {
    flex: 1,
    overflow: "hidden",
  },
  scrollContent: {
    paddingTop: 18,
    paddingBottom: 28,
  },
  container: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  infoCard: {
    minHeight: 104,
    paddingHorizontal: 17,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    shadowColor: "#1E1048",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.11,
    shadowRadius: 9,
    elevation: 5,
  },
  infoIcon: {
    width: 48,
    height: 48,
    marginRight: 13,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.purple,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    color: COLORS.purple,
    fontWeight: "800",
  },
  infoDescription: {
    marginTop: 4,
    color: COLORS.muted,
    fontWeight: "500",
    lineHeight: 18,
  },
  sectionCard: {
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 21,
    backgroundColor: COLORS.white,
    overflow: "hidden",
    shadowColor: "#1E1048",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    minHeight: 84,
    paddingHorizontal: 15,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    width: 42,
    height: 42,
    marginRight: 12,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightPurple,
  },
  sectionHeaderText: {
    flex: 1,
    paddingRight: 10,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
  },
  sectionSubtitle: {
    marginTop: 3,
    color: COLORS.muted,
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: "500",
  },
  sectionBody: {
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  row: {
    minHeight: 72,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    flexDirection: "row",
    alignItems: "center",
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowIcon: {
    width: 38,
    height: 38,
    marginRight: 11,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightPurple,
  },
  rowText: {
    flex: 1,
    paddingRight: 10,
  },
  rowTitle: {
    color: COLORS.text,
    fontSize: 13.5,
    fontWeight: "800",
  },
  rowSubtitle: {
    marginTop: 3,
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "500",
  },
  disabledRow: {
    opacity: 0.45,
  },
  controlBlock: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  lastBlock: {
    borderBottomWidth: 0,
  },
  controlHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  controlTitle: {
    color: COLORS.text,
    fontWeight: "800",
  },
  controlDescription: {
    marginTop: 5,
    marginBottom: 7,
    color: COLORS.muted,
    lineHeight: 17,
  },
  valuePill: {
    minHeight: 27,
    paddingHorizontal: 10,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightPurple,
  },
  valuePillText: {
    color: COLORS.purple,
    fontWeight: "800",
  },
});