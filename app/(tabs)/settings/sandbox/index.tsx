import React, { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ScreenLayout from "@/components/layout/ScreenLayout";
import { useTheme } from "@/theme";
import {
  deleteSandboxOrganizationById,
  getSandboxOrganizations,
} from "@/features/organizationSetup/sandboxStorage";
import type { SandboxOrganization } from "@/features/organizationSetup/sandboxTypes";

export default function SandboxListScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();

  const [items, setItems] = useState<SandboxOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const confirmDelete = (item: SandboxOrganization) => {
    if (deletingId) return;

    const created = new Date(item.createdAt).toLocaleString();
    const facility = item.facilityModel === "facility-based"
      ? "Facility-Based"
      : "Non-Facility-Based";

    Alert.alert(
      "Delete Sandbox?",
      `Name: ${item.name}\nCreated: ${created}\nFacility: ${facility}\nSandbox ID: ${item.id.slice(-8)}\n\nThis cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Sandbox",
          style: "destructive",
          onPress: async () => {
            if (deletingId) return;
            setDeletingId(item.id);
            try {
              await deleteSandboxOrganizationById(item.id);
              const records = await getSandboxOrganizations();
              setItems(records);
            } catch (err) {
              Alert.alert(
                "Deletion Failed",
                err instanceof Error ? err.message : "Please try again."
              );
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      let active = true;

      setLoading(true);
      setError("");

      getSandboxOrganizations()
        .then((records) => {
          if (active) setItems(records);
        })
        .catch((err) => {
          if (active) {
            setError(
              err instanceof Error
                ? err.message
                : "Unable to load sandbox records."
            );
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }, [])
  );

  const styles = StyleSheet.create({
    content: {
      padding: 20,
      paddingBottom: 40,
      gap: 14,
    },
    card: {
      backgroundColor: theme.card,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 16,
      padding: 16,
      gap: 8,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 12,
    },
    actionColumn: {
      alignItems: "center",
      gap: 10,
    },
    deleteButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: "center",
      justifyContent: "center",
    },
    deleteText: {
      color: theme.textMuted,
      fontSize: 22,
      lineHeight: 26,
    },
    heading: {
      color: theme.text,
      fontSize: 18,
      fontWeight: "700",
    },
    detail: {
      color: theme.textMuted,
      fontSize: 14,
      lineHeight: 20,
    },
    button: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: 14,
      alignItems: "center",
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "700",
    },
    back: {
      paddingVertical: 8,
      alignSelf: "flex-start",
    },
    backText: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: "600",
    },
  });

  return (
    <ScreenLayout
      title="My Sandboxes"
      showBackButton
      onBackPress={() => router.replace("/(tabs)/settings")}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.detail}>
          Fictional organizations and training clients saved
          locally on this device.
        </Text>

        {loading ? (
          <ActivityIndicator color={theme.primary} />
        ) : error ? (
          <View style={styles.card}>
            <Text style={styles.heading}>Unable to Load</Text>
            <Text style={styles.detail}>{error}</Text>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.heading}>No Sandboxes Yet</Text>
            <Text style={styles.detail}>
              Create a blank organization or training client to begin.
            </Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Open setup for ${item.name}`}
                  disabled={deletingId !== null}
                  onPress={() => {
                    Alert.alert(
                      "Sandbox Tap Detected",
                      `Opening ${item.name}`,
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Open Setup",
                          onPress: () =>
                            router.push({
                              pathname: "/settings/sandbox/[sandboxId]",
                              params: { sandboxId: item.id },
                            }),
                        },
                      ]
                    );
                  }}
                  style={{ flex: 1 }}
                >
                  <Text style={styles.heading}>{item.name}</Text>
                </Pressable>
                <View style={styles.actionColumn}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Delete sandbox ${item.name}, ID ${item.id.slice(-8)}`}
                  disabled={deletingId !== null}
                  onPress={() => confirmDelete(item)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteText}>×</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Edit sandbox ${item.name}`}
                  disabled={deletingId !== null}
                  onPress={() =>
                    router.push({
                      pathname: "/settings/sandbox/create",
                      params: { editId: item.id },
                    })
                  }
                  style={styles.deleteButton}
                >
                  <Ionicons name="pencil" size={18} color={isDark ? "#FFFFFF" : theme.primary} />
                </Pressable>
                </View>
              </View>
              <Text style={styles.detail}>
                Type: {item.clientType === "organization"
                  ? "Organization"
                  : "Training"}
              </Text>
              <Text style={styles.detail}>
                Facility: {item.facilityModel === "facility-based"
                  ? "Facility-Based"
                  : "Non-Facility-Based"}
              </Text>
              <Text style={styles.detail}>
                Status: Setup • Sandbox Only
              </Text>
              <Text style={styles.detail}>
                Created: {new Date(item.createdAt).toLocaleString()}
              </Text>
              <Text style={styles.detail}>
                Sandbox ID: {item.id.slice(-8)}
              </Text>
              {items.filter(
                (other) =>
                  other.name.trim().replace(/\s+/g, " ").toLowerCase() ===
                  item.name.trim().replace(/\s+/g, " ").toLowerCase()
              ).length > 1 && (
                <Text style={[styles.detail, { color: isDark ? "#FFFFFF" : theme.primary }]}>
                  Duplicate Name — Verify before deleting
                </Text>
              )}
            </View>
          ))
        )}

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/settings/sandbox/create")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Create Another Sandbox
          </Text>
        </Pressable>
      </ScrollView>
    </ScreenLayout>
  );
}
