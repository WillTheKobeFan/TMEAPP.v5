// app/admin/AdminPanel.tsx

import Ionicons from "@expo/vector-icons/Ionicons";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

import CustomNavBar from "@/components/CustomNavBar";
import ScreenLayout from "@/components/ScreenLayout";
import { useLeague } from "@/context/LeagueContext";
import { useTextSize } from "@/context/TextSizeContext";

const COLORS = {
  purple: "#250F74",
  lightPurple: "#F6F2FF",
  background: "#F8F7FB",
  white: "#FFFFFF",
  text: "#1E1B24",
  muted: "#6B6872",
  softMuted: "#97919F",
  border: "#EAE5F2",
  divider: "#F0EDF4",
  success: "#25855A",
};

type OrganizationId = "tme" | "pickup" | "taj";

type AdminSectionId =
  | "game-operations"
  | "teams"
  | "communication-media"
  | "screen-updates";

type IconName =
  React.ComponentProps<typeof Ionicons>["name"];

type CompatibleLeagueContext = {
  selectedLeagueId?: string;
  selectedOrganizationId?: string;
};

type AdminTool = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  route: Href;
};

type AdminSection = {
  id: AdminSectionId;
  title: string;
  description: string;
  icon: IconName;
  tools: AdminTool[];
};

type AdminSectionCardProps = {
  section: AdminSection;
  expanded: boolean;
  onToggle: (
    sectionId: AdminSectionId,
  ) => void;
};

type AdminToolRowProps = {
  tool: AdminTool;
  last?: boolean;
};

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(
    true,
  );
}

const ADMIN_SECTIONS: AdminSection[] = [
  {
    id: "game-operations",
    title: "Game Operations",
    description:
      "Manage schedules, games, results, standings and playoffs.",
    icon: "game-controller-outline",
    tools: [
      {
        id: "schedule-generator",
        title: "Schedule Generator",
        description:
          "Create, validate, preview and publish a season schedule.",
        icon: "flash-outline",
        route:
          "/admin/game-operations/schedule-generator",
      },
      {
        id: "manage-games",
        title: "Manage Games",
        description:
          "Edit, swap, move or update scheduled games.",
        icon: "calendar-outline",
        route: "/admin/game-operations/edit-games",
      },
      {
        id: "scores-results",
        title: "Scores & Results",
        description:
          "Enter scores, forfeits and final game results.",
        icon: "calculator-outline",
        route:
          "/admin/game-operations/game-results",
      },
      {
        id: "season-picture",
        title: "Standings & Season Picture",
        description:
          "Review standings and current playoff positioning.",
        icon: "stats-chart-outline",
        route:
          "/admin/game-operations/season-picture",
      },
      {
        id: "playoff-management",
        title: "Playoff Management",
        description:
          "Manage seeds, matchups and playoff rounds.",
        icon: "trophy-outline",
        route:
          "/admin/game-operations/playoff-seeding",
      },
    ],
  },

  {
    id: "teams",
    title: "Teams",
    description:
      "Manage teams, rosters, free agents, branding and profiles.",
    icon: "people-outline",
    tools: [
      {
        id: "manage-teams",
        title: "Manage Teams",
        description:
          "Add teams and update team information.",
        icon: "basketball-outline",
        route: "/admin/teams-rosters",
      },
      {
        id: "manage-rosters",
        title: "Manage Rosters",
        description:
          "Add, remove and update rostered players.",
        icon: "person-add-outline",
        route:
          "/admin/roster-management/edit-roster",
      },
      {
        id: "free-agents",
        title: "Free Agents",
        description:
          "Review and assign available players.",
        icon: "person-outline",
        route:
          "/admin/roster-management/free-agents",
      },
      {
        id: "team-branding",
        title: "Team Branding",
        description:
          "Manage team logos, primary colors and secondary colors.",
        icon: "color-palette-outline",
        route: {
          pathname: "/admin/editor/[tool]",
          params: {
            tool: "team-branding",
          },
        },
      },
      {
        id: "profiles-stats",
        title: "Profiles & Stats",
        description:
          "Control profiles, player stats, team stats and highlights.",
        icon: "analytics-outline",
        route: {
          pathname: "/admin/editor/[tool]",
          params: {
            tool: "profiles-stats",
          },
        },
      },
    ],
  },

  {
    id: "communication-media",
    title: "Communication & Media",
    description:
      "Publish announcements, notifications, resources and league media.",
    icon: "megaphone-outline",
    tools: [
      {
        id: "announcements",
        title: "Announcements",
        description:
          "Publish league updates, deadlines and schedule notices.",
        icon: "volume-high-outline",
        route:
          "/admin/communication/announcements",
      },
      {
        id: "notifications",
        title: "Notifications",
        description:
          "Send alerts to organizations, leagues, teams or players.",
        icon: "notifications-outline",
        route: {
          pathname: "/admin/editor/[tool]",
          params: {
            tool: "notifications",
          },
        },
      },
      {
        id: "support-requests",
        title: "Support Requests",
        description:
          "Review questions and requests submitted by users.",
        icon: "chatbubbles-outline",
        route: {
          pathname: "/admin/editor/[tool]",
          params: {
            tool: "support-requests",
          },
        },
      },
      {
        id: "resources",
        title: "Resources",
        description:
          "Manage documents, forms, instructions and helpful links.",
        icon: "folder-open-outline",
        route: {
          pathname: "/admin/editor/[tool]",
          params: {
            tool: "resources",
          },
        },
      },
      {
        id: "champions",
        title: "Champions",
        description:
          "Upload champion photos and season information.",
        icon: "trophy-outline",
        route:
          "/admin/app-content/champ-photos",
      },
      {
        id: "highlights-media",
        title: "Highlights & Media",
        description:
          "Manage league photos, videos and game highlights.",
        icon: "videocam-outline",
        route: {
          pathname: "/admin/editor/[tool]",
          params: {
            tool: "highlights-media",
          },
        },
      },
    ],
  },

  {
    id: "screen-updates",
    title: "Screen Updates",
    description:
      "Update public app content, registration, rules and visibility.",
    icon: "desktop-outline",
    tools: [
      {
        id: "home-screen",
        title: "Home Screen",
        description:
          "Update cards and information shown on the league Home screen.",
        icon: "home-outline",
        route: {
          pathname: "/admin/editor/[tool]",
          params: {
            tool: "home-screen",
          },
        },
      },
      {
        id: "league-information",
        title: "League Information",
        description:
          "Update descriptions, locations, levels and league details.",
        icon: "information-circle-outline",
        route: "/admin/league-overview",
      },
      {
        id: "registration",
        title: "Registration",
        description:
          "Manage registration dates, status, grace periods and messages.",
        icon: "document-text-outline",
        route: {
          pathname: "/admin/editor/[tool]",
          params: {
            tool: "registration",
          },
        },
      },
      {
        id: "league-rules",
        title: "League Rules",
        description:
          "Edit and publish league rules.",
        icon: "reader-outline",
        route:
          "/admin/app-content/league-rules",
      },
      {
        id: "features-visibility",
        title: "Features & Visibility",
        description:
          "Show or hide optional screens and league features.",
        icon: "eye-outline",
        route: {
          pathname: "/admin/editor/[tool]",
          params: {
            tool: "features-visibility",
          },
        },
      },
      {
        id: "legal-information",
        title: "Legal & Information",
        description:
          "Manage policies, notices and organization information.",
        icon: "shield-checkmark-outline",
        route:
          "/admin/app-content/legal-info",
      },
      {
        id: "administrator-access",
        title: "Administrator Access",
        description:
          "Manage who can update each league or organization.",
        icon: "lock-closed-outline",
        route: {
          pathname: "/admin/editor/[tool]",
          params: {
            tool: "administrator-access",
          },
        },
      },
    ],
  },
];

function isOrganizationId(
  value: unknown,
): value is OrganizationId {
  return (
    value === "tme" ||
    value === "pickup" ||
    value === "taj"
  );
}

export default function AdminPanel() {
  const { textScale } = useTextSize();

  const rawLeagueContext =
    useLeague() as unknown as CompatibleLeagueContext;

  const contextOrganizationId =
    rawLeagueContext.selectedOrganizationId ??
    rawLeagueContext.selectedLeagueId;

  const selectedOrganizationId: OrganizationId =
    isOrganizationId(contextOrganizationId)
      ? contextOrganizationId
      : "tme";

  const [activeSection, setActiveSection] =
    useState<AdminSectionId | null>(null);

  const sections = useMemo(
    () => ADMIN_SECTIONS,
    [],
  );

  const toggleSection = (
    sectionId: AdminSectionId,
  ) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut,
    );

    setActiveSection((currentSection) =>
      currentSection === sectionId
        ? null
        : sectionId,
    );
  };

  return (
    <ScreenLayout
      title="Admin Panel"
      titleFontSize={22}
      showBackButton
      showOrganizationSelector
      showSettingsShortcut={false}
    >
      <View style={styles.screen}>
        <View style={styles.contentArea}>
          <ScrollView
            directionalLockEnabled
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={
              styles.scrollContent
            }
          >
            <View style={styles.container}>
              <ManagingLeaguePill
                textScale={textScale}
              />

              <InformationCard
                textScale={textScale}
              />

              {sections.map((section) => (
                <AdminSectionCard
                  key={section.id}
                  section={section}
                  expanded={
                    activeSection === section.id
                  }
                  onToggle={toggleSection}
                />
              ))}

              <View style={styles.footerNote}>
                <View
                  style={styles.footerStatusDot}
                />

                <Text
                  style={[
                    styles.footerNoteText,
                    {
                      fontSize:
                        11.5 * textScale,
                    },
                  ]}
                >
                  Changes apply only to the league
                  selected in the Managing filter.
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>

        <CustomNavBar
          selectedLeagueId={
            selectedOrganizationId
          }
        />
      </View>
    </ScreenLayout>
  );
}

function ManagingLeaguePill({
  textScale,
}: {
  textScale: number;
}) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/admin/editor/[tool]",
      params: {
        tool: "league-selector",
      },
    });
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Select the league to manage"
      accessibilityHint="Opens the admin league selector"
      activeOpacity={0.8}
      onPress={handlePress}
      style={styles.leaguePill}
    >
      <View style={styles.leaguePillDot} />

      <View style={styles.leaguePillText}>
        <Text
          style={[
            styles.leaguePillLabel,
            {
              fontSize: 9.5 * textScale,
            },
          ]}
        >
          MANAGING
        </Text>

        <Text
          numberOfLines={1}
          style={[
            styles.leaguePillValue,
            {
              fontSize: 14.5 * textScale,
            },
          ]}
        >
          Select League
        </Text>
      </View>

      <Ionicons
        name="chevron-down"
        size={19}
        color={COLORS.purple}
      />
    </TouchableOpacity>
  );
}

function InformationCard({
  textScale,
}: {
  textScale: number;
}) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoIcon}>
        <Ionicons
          name="construct-outline"
          size={25}
          color={COLORS.white}
        />
      </View>

      <View style={styles.infoText}>
        <Text
          style={[
            styles.infoTitle,
            {
              fontSize: 18 * textScale,
            },
          ]}
        >
          League Administration
        </Text>

        <Text
          style={[
            styles.infoDescription,
            {
              fontSize: 12.5 * textScale,
            },
          ]}
        >
          Select a section below to manage league
          operations, teams, communication or app
          content.
        </Text>
      </View>
    </View>
  );
}

function AdminSectionCard({
  section,
  expanded,
  onToggle,
}: AdminSectionCardProps) {
  const { textScale } = useTextSize();

  return (
    <View style={styles.sectionCard}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={section.title}
        accessibilityHint={
          expanded
            ? "Collapse this admin section"
            : "Expand this admin section"
        }
        accessibilityState={{
          expanded,
        }}
        activeOpacity={0.8}
        onPress={() =>
          onToggle(section.id)
        }
        style={styles.sectionHeader}
      >
        <View style={styles.sectionIcon}>
          <Ionicons
            name={section.icon}
            size={23}
            color={COLORS.purple}
          />
        </View>

        <View
          style={styles.sectionHeaderText}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: 16 * textScale,
              },
            ]}
          >
            {section.title}
          </Text>

          <Text
            style={[
              styles.sectionDescription,
              {
                fontSize:
                  11.5 * textScale,
              },
            ]}
          >
            {section.description}
          </Text>

          <Text
            style={[
              styles.toolCount,
              {
                fontSize:
                  11.5 * textScale,
              },
            ]}
          >
            {section.tools.length}{" "}
            {section.tools.length === 1
              ? "tool"
              : "tools"}
          </Text>
        </View>

        <View
          style={[
            styles.sectionChevronCircle,
            expanded &&
              styles.sectionChevronCircleExpanded,
          ]}
        >
          <Ionicons
            name={
              expanded
                ? "chevron-up"
                : "chevron-down"
            }
            size={20}
            color={
              expanded
                ? COLORS.white
                : COLORS.purple
            }
          />
        </View>
      </TouchableOpacity>

      {expanded ? (
        <View style={styles.sectionBody}>
          {section.tools.map(
            (tool, index) => (
              <AdminToolRow
                key={tool.id}
                tool={tool}
                last={
                  index ===
                  section.tools.length - 1
                }
              />
            ),
          )}
        </View>
      ) : null}
    </View>
  );
}

function AdminToolRow({
  tool,
  last = false,
}: AdminToolRowProps) {
  const router = useRouter();
  const { textScale } = useTextSize();

  const handlePress = () => {
    router.push(tool.route);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={tool.title}
      accessibilityHint={`Open ${tool.title}`}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.toolRow,
        last && styles.toolRowLast,
        pressed && styles.toolRowPressed,
      ]}
    >
      <View style={styles.toolIcon}>
        <Ionicons
          name={tool.icon}
          size={20}
          color={COLORS.purple}
        />
      </View>

      <View style={styles.toolText}>
        <Text
          style={[
            styles.toolTitle,
            {
              fontSize:
                13.5 * textScale,
            },
          ]}
        >
          {tool.title}
        </Text>

        <Text
          style={[
            styles.toolDescription,
            {
              fontSize: 11 * textScale,
            },
          ]}
        >
          {tool.description}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={19}
        color={COLORS.muted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: 0,
    backgroundColor: COLORS.background,
  },

  contentArea: {
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
  },

  scrollContent: {
    paddingTop: 18,
    paddingBottom: 30,
  },

  container: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    paddingHorizontal: 16,
  },

  leaguePill: {
    alignSelf: "flex-start",
    minHeight: 52,
    maxWidth: "82%",
    marginBottom: 16,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,

    shadowColor: "#1E1048",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  leaguePillDot: {
    width: 13,
    height: 13,
    marginRight: 11,
    borderRadius: 7,
    backgroundColor: COLORS.purple,
  },

  leaguePillText: {
    flexShrink: 1,
    marginRight: 13,
  },

  leaguePillLabel: {
    marginBottom: 1,
    color: COLORS.softMuted,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  leaguePillValue: {
    color: COLORS.purple,
    fontWeight: "900",
  },

  infoCard: {
    minHeight: 104,
    marginBottom: 16,
    paddingHorizontal: 17,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,

    shadowColor: "#1E1048",
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 21,
    backgroundColor: COLORS.white,

    shadowColor: "#1E1048",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  sectionHeader: {
    minHeight: 104,
    paddingHorizontal: 15,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  sectionIcon: {
    width: 48,
    height: 48,
    marginRight: 13,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightPurple,
  },

  sectionHeaderText: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },

  sectionTitle: {
    color: COLORS.text,
    fontWeight: "900",
  },

  sectionDescription: {
    marginTop: 4,
    color: COLORS.muted,
    lineHeight: 16,
    fontWeight: "500",
  },

  toolCount: {
    marginTop: 7,
    color: COLORS.purple,
    fontWeight: "900",
  },

  sectionChevronCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightPurple,
  },

  sectionChevronCircleExpanded: {
    backgroundColor: COLORS.purple,
  },

  sectionBody: {
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    backgroundColor: "#FDFCFE",
  },

  toolRow: {
    minHeight: 78,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    flexDirection: "row",
    alignItems: "center",
  },

  toolRowLast: {
    borderBottomWidth: 0,
  },

  toolRowPressed: {
    opacity: 0.62,
  },

  toolIcon: {
    width: 40,
    height: 40,
    marginRight: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },

  toolText: {
    flex: 1,
    minWidth: 0,
    paddingRight: 9,
  },

  toolTitle: {
    color: COLORS.text,
    fontWeight: "800",
  },

  toolDescription: {
    marginTop: 3,
    color: COLORS.muted,
    lineHeight: 15,
    fontWeight: "500",
  },

  footerNote: {
    paddingHorizontal: 4,
    paddingTop: 4,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  footerStatusDot: {
    width: 8,
    height: 8,
    marginTop: 5,
    marginRight: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },

  footerNoteText: {
    flex: 1,
    color: COLORS.softMuted,
    lineHeight: 17,
    fontWeight: "500",
  },
});