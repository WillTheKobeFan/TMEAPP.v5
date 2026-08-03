import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import SubScreenLayout from "src/components/SubScreenLayout";

const THEME = "#250f74";
const ATTENTION = "#35297e";

type AdminItem = {
  title: string;
  description: string;
  route: string;
  icon: React.ReactNode;
};

type AdminSection = {
  title: string;
  items: AdminItem[];
};

export default function AdminPanel() {
  const router = useRouter();

  const [openSections, setOpenSections] = React.useState<
    Record<string, boolean>
  >({
    "Game Operations": true,
    "Roster Management": false,
    Communication: false,
    "App Content": false,
  });

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleRoute = (route: string) => {
    router.push(route as any);
  };

  const sections: AdminSection[] = [
    {
      title: "Game Operations",
      items: [
        {
          title: "Schedule Generator",
          description:
            "Create season, manage teams, generate schedule, save draft, publish, and lock.",
          route: "/admin/game-operations/schedule-generator",
          icon: <FontAwesome6 name="calendar-plus" size={17} color={THEME} />,
        },
        {
          title: "Edit Games",
          description: "Change time, change venue, swap games, and push week.",
          route: "/admin/game-operations/edit-games",
          icon: <FontAwesome6 name="pen-to-square" size={17} color={THEME} />,
        },
        {
          title: "Game Results",
          description:
            "Enter scores only, view live preview, undo changes, final preview, and save results.",
          route: "/admin/game-operations/game-results",
          icon: <FontAwesome6 name="clipboard-check" size={17} color={THEME} />,
        },
        {
          title: "Playoff Seeding",
          description: "Build playoff matchups and confirm bracket.",
          route: "/admin/game-operations/playoff-seeding",
          icon: <FontAwesome6 name="sitemap" size={17} color={THEME} />,
        },
        {
          title: "Season Picture",
          description:
            "Edit the season preview and confirm each team preview per week.",
          route: "/admin/game-operations/season-picture",
          icon: <FontAwesome6 name="chart-line" size={17} color={THEME} />,
        },
      ],
    },
    {
      title: "Roster Management",
      items: [
        {
          title: "Edit Roster",
          description:
            "Add or remove players from a team, then import/upload Excel files into Firebase.",
          route: "/admin/roster-management/edit-roster",
          icon: <FontAwesome6 name="users-gear" size={17} color={THEME} />,
        },
        {
          title: "Free Agents",
          description: "View available players and inactive roster spots.",
          route: "/admin/roster-management/free-agents",
          icon: <FontAwesome6 name="user-plus" size={17} color={THEME} />,
        },
      ],
    },
    {
      title: "Communication",
      items: [
        {
          title: "Announcements",
          description:
            "Add/edit updates to leagues and send notifications to each league day.",
          route: "/admin/communication/announcements",
          icon: <FontAwesome6 name="bullhorn" size={17} color={THEME} />,
        },
      ],
    },
    {
      title: "App Content",
      items: [
        {
          title: "League Rules",
          description: "Edit rules, FAQ, and league information.",
          route: "/admin/app-content/league-rules",
          icon: <FontAwesome6 name="scale-balanced" size={17} color={THEME} />,
        },
        {
          title: "Champ Photos",
          description: "Upload, delete, and manage championship photos.",
          route: "/admin/app-content/champ-photos",
          icon: <FontAwesome6 name="trophy" size={17} color={THEME} />,
        },
        {
          title: "Legal Info",
          description:
            "Edit terms, privacy, waiver information, and app info.",
          route: "/admin/app-content/legal-info",
          icon: <FontAwesome6 name="file-shield" size={17} color={THEME} />,
        },
      ],
    },
  ];

  return (
    <SubScreenLayout title="League Control Center">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>League Control Center</Text>

          <Text style={styles.headerText}>
            Manage scores, sessions, rosters, standings, playoffs, and app
            content in one place.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.needsAttentionCard}
          onPress={() => handleRoute("/admin/game-operations/edit-games")}
        >
          <View style={styles.needsAttentionIcon}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={24}
              color="#ffffff"
            />
          </View>

          <View style={styles.needsAttentionTextWrap}>
            <Text style={styles.needsAttentionTitle}>Needs Attention</Text>

            <Text style={styles.needsAttentionText}>
              Review unfinished games, playoff setup, and schedule changes
              before publishing updates.
            </Text>

            <Text style={styles.needsAttentionLink}>Go to Edit Games ➜</Text>
          </View>
        </TouchableOpacity>

        {sections.map((section) => {
          const isOpen = openSections[section.title];

          return (
            <View key={section.title} style={styles.dropdownWrap}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.dropdownHeader}
                onPress={() => toggleSection(section.title)}
              >
                <Text style={styles.dropdownTitle}>{section.title}</Text>

                <FontAwesome6
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={14}
                  color={THEME}
                />
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.dropdownBody}>
                  {section.items.map((item) => (
                    <TouchableOpacity
                      key={item.title}
                      activeOpacity={0.85}
                      style={styles.card}
                      onPress={() => handleRoute(item.route)}
                    >
                      <View style={styles.iconBox}>{item.icon}</View>

                      <View style={styles.cardTextWrap}>
                        <Text style={styles.cardTitle}>{item.title}</Text>

                        <Text style={styles.cardDescription}>
                          {item.description}
                        </Text>
                      </View>

                      <FontAwesome6
                        name="chevron-right"
                        size={13}
                        color="#9ca3af"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 28,
  },

  headerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: THEME,
    marginBottom: 6,
  },

  headerText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4b5563",
    fontWeight: "500",
  },

  needsAttentionCard: {
    flexDirection: "row",
    backgroundColor: ATTENTION,
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: ATTENTION,
  },

  needsAttentionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: ATTENTION,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  needsAttentionTextWrap: {
    flex: 1,
  },

  needsAttentionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 4,
  },

  needsAttentionText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#fefeff",
    fontWeight: "500",
  },

  needsAttentionLink: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "900",
    color: "#ffffff",
  },

  dropdownWrap: {
    marginBottom: 12,
  },

  dropdownHeader: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: THEME,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  dropdownBody: {
    marginTop: 10,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#f3f0ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  cardTextWrap: {
    flex: 1,
    paddingRight: 10,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 4,
  },

  cardDescription: {
    fontSize: 12.5,
    lineHeight: 18,
    color: "#6b7280",
    fontWeight: "500",
  },

  bottomSpace: {
    height: 20,
  },
});