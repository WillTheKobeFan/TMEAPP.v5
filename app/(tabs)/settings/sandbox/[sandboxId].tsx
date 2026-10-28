import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ScreenLayout from "@/components/layout/ScreenLayout";
import SportSyncColorPicker from "@/components/common/SportSyncColorPicker";
import { useTheme } from "@/theme";
import {
  getSandboxOrganizationById,
  updateSandboxProfileById,
} from "@/features/organizationSetup/sandboxStorage";
import type { SandboxOrganization } from "@/features/organizationSetup/sandboxTypes";

const SECTIONS = [
  {
    title: "Client Profile",
    icon: "business-outline",
    rows: ["Client Information", "Contact & Branding", "Setup Status"],
  },
  {
    title: "Facilities",
    icon: "location-outline",
    rows: ["Facility Model", "Locations", "Operating Arrangements"],
  },
  {
    title: "Offerings",
    icon: "calendar-outline",
    rows: ["Programs & Offerings", "Sessions", "Program Details"],
  },
  {
    title: "Registration",
    icon: "document-text-outline",
    rows: ["Registration Windows", "Eligibility", "Waivers"],
  },
  {
    title: "Staff",
    icon: "people-outline",
    rows: ["Staff Roles", "Permissions", "Assignments"],
  },
  {
    title: "Operations",
    icon: "settings-outline",
    rows: ["Scheduling", "Announcements", "Policies"],
  },
] as const;

const COUNT = SECTIONS.length;
const COPIES = 3;

export default function SandboxSetupScreen() {
  const router = useRouter();
  const { sandboxId } = useLocalSearchParams<{ sandboxId: string }>();
  const { theme, isDark } = useTheme();
  const { width } = useWindowDimensions();

  const [sandbox, setSandbox] = useState<SandboxOrganization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [publicEmail, setPublicEmail] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const listRef = useRef<FlatList<number>>(null);
  const currentIndex = useRef<number>(COUNT);
  const pageWidth = Math.max(1, width - 40);
  const pages = Array.from({ length: COUNT * COPIES }, (_, i) => i % COUNT);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    if (typeof sandboxId !== "string" || !sandboxId.startsWith("sandbox-")) {
      setError("Invalid sandbox ID.");
      setLoading(false);
      return;
    }

    getSandboxOrganizationById(sandboxId)
      .then((record) => {
        if (!active) return;
        if (!record) {
          setError("Sandbox not found.");
        } else {
          setSandbox(record);
          setDisplayName(record.profile?.displayName ?? record.name);
          setDescription(record.profile?.description ?? "");
          setContactEmail(record.profile?.contactEmail ?? "");
          setContactPhone(record.profile?.contactPhone ?? "");
            setWebsite(record.profile?.website ?? "");
            setPublicEmail(record.profile?.publicEmail ?? "");
            setPrimaryColor(record.profile?.primaryColor ?? "");
            setSecondaryColor(record.profile?.secondaryColor ?? "");
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load sandbox.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [sandboxId]);

  const jumpTo = useCallback((index: number, animated = true) => {
    currentIndex.current = index;
    listRef.current?.scrollToIndex({ index, animated });
    setPage(index % COUNT);
    setExpanded(null);
  }, []);

  const onScrollEnd = useCallback((offset: number) => {
    const index = Math.round(offset / pageWidth);
    const section = ((index % COUNT) + COUNT) % COUNT;

    currentIndex.current = index;
    setPage(section);
    setExpanded(null);

    if (index < COUNT || index >= COUNT * 2) {
      const centered = COUNT + section;
      currentIndex.current = centered;
      listRef.current?.scrollToIndex({ index: centered, animated: false });
    }
  }, [pageWidth]);

  const styles = StyleSheet.create({
    content: { padding: 20, paddingBottom: 40, gap: 16 },
    card: {
      backgroundColor: theme.card,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 16,
      padding: 16,
      gap: 12,
    },
    heading: { color: theme.text, fontSize: 19, fontWeight: "700" },
    detail: { color: theme.textMuted, fontSize: 14, lineHeight: 21 },
    row: {
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 12,
      padding: 14,
      gap: 8,
    },
    rowHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8,
    },
    rowText: { color: theme.text, fontSize: 15, fontWeight: "600", flex: 1 },
    dots: { flexDirection: "row", justifyContent: "center", gap: 8 },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      padding: 12,
      color: theme.text,
      backgroundColor: theme.card,
      fontSize: 15,
    },
    saveButton: {
      backgroundColor: theme.primary,
      padding: 13,
      borderRadius: 10,
      alignItems: "center",
    },
    saveText: {
      color: "#FFFFFF",
      fontWeight: "700",
    },
  });

  const rowDetail = (section: string, row: string) => {
    if (!sandbox) return "";

    if (section === "Client Profile" && row === "Client Information") {
      return `${sandbox.name}\nType: ${sandbox.clientType === "training" ? "Training" : "Organization"}`;
    }
    if (section === "Client Profile" && row === "Setup Status") {
      return `Status: Setup\nEnvironment: Sandbox Only\nID: ${sandbox.id.slice(-8)}`;
    }
    if (section === "Facilities" && row === "Facility Model") {
      return sandbox.facilityModel === "facility-based"
        ? "Facility-Based"
        : "Non-Facility-Based";
    }
    return "Not Set Up — configuration fields will be added in the next development step.";
  };

  const saveProfile = async () => {
    if (!sandbox || savingProfile) return;

    if (!displayName.trim()) {
      Alert.alert("Display Name Required", "Please enter a display name.");
      return;
    }

    const email = publicEmail.trim();
    const url = website.trim();
    const primary = primaryColor.trim();
    const secondary = secondaryColor.trim();

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Invalid Email", "Enter a valid public email address.");
      return;
    }

    if (url && !/^https?:\/\/[^\s]+\.[^\s]+$/i.test(url)) {
      Alert.alert("Invalid Website", "Enter a full website URL starting with https://.");
      return;
    }

    if (primary && !/^#[0-9a-fA-F]{6}$/.test(primary)) {
      Alert.alert("Invalid Primary Color", "Use a six-digit HEX color, such as #663399.");
      return;
    }

    if (secondary && !/^#[0-9a-fA-F]{6}$/.test(secondary)) {
      Alert.alert("Invalid Secondary Color", "Use a six-digit HEX color, such as #16A34A.");
      return;
    }

    setSavingProfile(true);

    try {
      const updated = await updateSandboxProfileById(sandbox.id, {
        displayName: displayName.trim(),
        description: description.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        website: url,
        publicEmail: email,
        primaryColor: primary,
        secondaryColor: secondary,
      });

      setSandbox(updated);
      Alert.alert("Changes Saved!", "Client information updated.");
    } catch (err) {
      Alert.alert(
        "Unable to Save",
        err instanceof Error ? err.message : "Please try again."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <ScreenLayout title="Sandbox Setup" showBackButton>
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator color={theme.primary} />
        ) : error || !sandbox ? (
          <View style={styles.card}>
            <Text style={styles.heading}>Unable to Open Sandbox</Text>
            <Text style={styles.detail}>{error || "Sandbox not found."}</Text>
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.heading}>{sandbox.name}</Text>
              <Text style={styles.detail}>
                {sandbox.clientType === "training" ? "Training" : "Organization"}
                {" • "}
                {sandbox.facilityModel === "facility-based"
                  ? "Facility-Based"
                  : "Non-Facility-Based"}
              </Text>
              <Text style={styles.detail}>Setup in Progress • Sandbox Only</Text>
            </View>

            <Text style={styles.detail}>
              Swipe between setup sections. All sections are available immediately.
            </Text>

            <FlatList
              ref={listRef}
              data={pages}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={COUNT}
              keyExtractor={(_, index) => String(index)}
              getItemLayout={(_, index) => ({
                length: pageWidth,
                offset: pageWidth * index,
                index,
              })}
              onMomentumScrollEnd={(event) =>
                onScrollEnd(event.nativeEvent.contentOffset.x)
              }
              renderItem={({ item: sectionIndex }) => {
                const section = SECTIONS[sectionIndex];
                return (
                  <View style={{ width: pageWidth }}>
                    <View style={styles.card}>
                      <View style={styles.rowHeader}>
                        <Ionicons
                          name={section.icon}
                          size={22}
                          color={isDark ? "#FFFFFF" : theme.primary}
                        />
                        <Text style={[styles.heading, { flex: 1 }]}>
                          {section.title}
                        </Text>
                        <Text style={styles.detail}>
                          {sectionIndex + 1} of {COUNT}
                        </Text>
                      </View>

                      {section.rows.map((row) => {
                        const key = `${section.title}:${row}`;
                        const open = expanded === key;

                        return (
                          <Pressable
                            key={key}
                            accessibilityRole="button"
                            accessibilityState={{ expanded: open }}
                            onPress={() => setExpanded(open ? null : key)}
                            style={styles.row}
                          >
                            <View style={styles.rowHeader}>
                              <Text style={styles.rowText}>{row}</Text>
                              <Ionicons
                                name={open ? "chevron-up" : "chevron-down"}
                                size={18}
                                color={isDark ? "#FFFFFF" : theme.primary}
                              />
                            </View>
                            {open && section.title === "Client Profile" &&
                            row === "Client Information" ? (
                              <View style={{ gap: 10 }}>
                                <Text style={styles.rowText}>Display Name</Text>
                                <TextInput
                                  style={styles.input}
                                  value={displayName}
                                  onChangeText={setDisplayName}
                                  placeholder="Display name"
                                  placeholderTextColor={theme.textMuted}
                                />

                                <Text style={styles.rowText}>Description</Text>
                                <TextInput
                                  style={[styles.input, { minHeight: 80 }]}
                                  value={description}
                                  onChangeText={setDescription}
                                  placeholder="Describe this client"
                                  placeholderTextColor={theme.textMuted}
                                  multiline
                                />

                                <Text style={styles.rowText}>Contact Email</Text>
                                <TextInput
                                  style={styles.input}
                                  value={contactEmail}
                                  onChangeText={setContactEmail}
                                  placeholder="Email address"
                                  placeholderTextColor={theme.textMuted}
                                  keyboardType="email-address"
                                  autoCapitalize="none"
                                />

                                <Text style={styles.rowText}>Contact Phone</Text>
                                <TextInput
                                  style={styles.input}
                                  value={contactPhone}
                                  onChangeText={setContactPhone}
                                  placeholder="Phone number"
                                  placeholderTextColor={theme.textMuted}
                                  keyboardType="phone-pad"
                                />

                                <Pressable
                                  onPress={saveProfile}
                                  disabled={savingProfile}
                                  style={styles.saveButton}
                                >
                                  <Text style={styles.saveText}>
                                    {savingProfile ? "Saving..." : "Save Changes"}
                                  </Text>
                                </Pressable>
                              </View>
                            ) : open && section.title === "Client Profile" &&
                              row === "Contact & Branding" ? (
                                <View style={{ gap: 10 }}>
                                  <Text style={styles.rowText}>Website (Optional)</Text>
                                  <TextInput
                                    style={styles.input}
                                    value={website}
                                    onChangeText={setWebsite}
                                    placeholder="https://example.com"
                                    placeholderTextColor={theme.textMuted}
                                    keyboardType="url"
                                    autoCapitalize="none"
                                  />

                                  <Text style={styles.rowText}>Public Email (Optional)</Text>
                                  <TextInput
                                    style={styles.input}
                                    value={publicEmail}
                                    onChangeText={setPublicEmail}
                                    placeholder="info@example.com"
                                    placeholderTextColor={theme.textMuted}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                  />

                                  <SportSyncColorPicker
                                    label="Primary Color"
                                    value={primaryColor}
                                    onChange={setPrimaryColor}
                                    textColor={theme.text}
                                    borderColor={theme.border}
                                    backgroundColor={isDark ? "#1F1F1F" : "#FFFFFF"}
                                  />
                                  <SportSyncColorPicker
                                    label="Secondary Color"
                                    value={secondaryColor}
                                    onChange={setSecondaryColor}
                                    textColor={theme.text}
                                    borderColor={theme.border}
                                    backgroundColor={isDark ? "#1F1F1F" : "#FFFFFF"}
                                  />
                                  <Text style={styles.detail}>
                                    Logo upload will be added in a future step.
                                  </Text>

                                  <Pressable
                                    onPress={saveProfile}
                                    disabled={savingProfile}
                                    style={styles.saveButton}
                                  >
                                    <Text style={styles.saveText}>
                                      {savingProfile ? "Saving..." : "Save Changes"}
                                    </Text>
                                  </Pressable>
                                </View>
                              ) : open ? (
                              <Text style={styles.detail}>
                                {rowDetail(section.title, row)}
                              </Text>
                            ) : null}
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                );
              }}
            />

            <View style={styles.dots}>
              {SECTIONS.map((section, index) => (
                <Pressable
                  key={section.title}
                  accessibilityRole="button"
                  accessibilityLabel={`Go to ${section.title}`}
                  onPress={() => jumpTo(COUNT + index)}
                  style={{
                    width: page === index ? 22 : 9,
                    height: 9,
                    borderRadius: 6,
                    backgroundColor:
                      page === index ? theme.primary : theme.border,
                  }}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}
