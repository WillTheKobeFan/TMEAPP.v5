import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import ScreenLayout from "@/components/layout/ScreenLayout";
import { useTheme } from "@/theme";
import {
  createSandboxOrganization,
  getSandboxOrganizationById,
  updateSandboxOrganizationById,
} from "@/features/organizationSetup/sandboxStorage";
import type {
  SandboxClientType,
  SandboxFacilityModel,
  SandboxOrganization,
} from "@/features/organizationSetup/sandboxTypes";

export default function CreateSandboxScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const isEditing = typeof editId === "string" && editId.length > 0;
  const [loadingRecord, setLoadingRecord] = useState(isEditing);
  const [loadError, setLoadError] = useState("");
  const { theme } = useTheme();

  const [clientType, setClientType] =
    useState<SandboxClientType>("organization");
  const [facilityModel, setFacilityModel] =
    useState<SandboxFacilityModel>("non-facility-based");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [created, setCreated] =
    useState<SandboxOrganization | null>(null);

  useEffect(() => {
    if (!isEditing) return;

    let active = true;

    getSandboxOrganizationById(editId!)
      .then((record) => {
        if (!active) return;

        if (!record) {
          setLoadError("Sandbox not found.");
          return;
        }

        setName(record.name);
        setClientType(record.clientType);
        setFacilityModel(record.facilityModel);
      })
      .catch((error) => {
        if (active) {
          setLoadError(
            error instanceof Error ? error.message : "Unable to load sandbox."
          );
        }
      })
      .finally(() => {
        if (active) setLoadingRecord(false);
      });

    return () => {
      active = false;
    };
  }, [editId, isEditing]);

  const styles = StyleSheet.create({
    content: { padding: 20, paddingBottom: 40, gap: 18 },
    card: {
      backgroundColor: theme.card,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 16,
      padding: 16,
      gap: 12,
    },
    heading: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
    },
    muted: {
      color: theme.textMuted,
      fontSize: 14,
      lineHeight: 20,
    },
    option: {
      padding: 13,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
    },
    selected: {
      borderColor: theme.primary,
      borderWidth: 2,
    },
    optionText: {
      color: theme.text,
      fontSize: 15,
      fontWeight: "600",
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 14,
      color: theme.text,
      backgroundColor: theme.background,
      fontSize: 16,
    },
    button: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: 15,
      alignItems: "center",
    },
    buttonText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 16,
    },
  });

  const save = async () => {
    if (saving || created || !name.trim()) return;

    setSaving(true);

    try {
      const input = { name, clientType, facilityModel };

      const result = isEditing
        ? await updateSandboxOrganizationById(editId!, input)
        : await createSandboxOrganization(input);
      setCreated(result);
    } catch (error) {
      Alert.alert(
        isEditing ? "Unable to Save Changes" : "Unable to Create Sandbox",
        error instanceof Error ? error.message : "Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenLayout title={isEditing ? "Edit Sandbox" : "Create Sandbox"} showBackButton>
      <ScrollView contentContainerStyle={styles.content}>
        {loadingRecord ? (
          <ActivityIndicator color={theme.primary} />
        ) : loadError ? (
          <View style={styles.card}>
            <Text style={styles.heading}>Unable to Load Sandbox</Text>
            <Text style={styles.muted}>{loadError}</Text>
          </View>
        ) : created ? (
          <View style={styles.card}>
            <Text style={styles.heading}>{isEditing ? "Changes Saved!" : "Sandbox Created!"}</Text>
            <Text style={styles.optionText}>{created.name}</Text>
            <Text style={styles.muted}>
              Type: {created.clientType}
            </Text>
            <Text style={styles.muted}>
              Facility: {created.facilityModel}
            </Text>
            <Text style={styles.muted}>
              Status: Setup • Sandbox Only
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace("/settings/sandbox")}
              style={styles.button}
            >
              <Text style={styles.buttonText}>View My Sandboxes</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={styles.muted}>
              Create a fictional client for testing.
              Records are saved locally, not to Firebase.
            </Text>

            <View style={styles.card}>
              <Text style={styles.heading}>1. Client Type</Text>
              {(["organization", "training"] as const).map((value) => (
                <Pressable
                  key={value}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: clientType === value }}
                  onPress={() => setClientType(value)}
                  style={[
                    styles.option,
                    clientType === value && styles.selected,
                  ]}
                >
                  <Text style={styles.optionText}>
                    {value === "organization"
                      ? "Organization"
                      : "Training"}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.heading}>2. Facility Model</Text>
              {(["facility-based", "non-facility-based"] as const).map(
                (value) => (
                  <Pressable
                    key={value}
                    accessibilityRole="radio"
                    accessibilityState={{
                      checked: facilityModel === value,
                    }}
                    onPress={() => setFacilityModel(value)}
                    style={[
                      styles.option,
                      facilityModel === value && styles.selected,
                    ]}
                  >
                    <Text style={styles.optionText}>
                      {value === "facility-based"
                        ? "Facility-Based"
                        : "Non-Facility-Based"}
                    </Text>
                  </Pressable>
                )
              )}
            </View>

            <View style={styles.card}>
              <Text style={styles.heading}>3. Sandbox Name</Text>
              <TextInput
                accessibilityLabel="Sandbox name"
                placeholder="Enter fictional client name"
                placeholderTextColor={theme.textMuted}
                value={name}
                onChangeText={setName}
                maxLength={100}
                style={styles.input}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              disabled={saving || !name.trim()}
              accessibilityState={{
                disabled: saving || !name.trim(),
              }}
              onPress={save}
              style={[
                styles.button,
                (saving || !name.trim()) && { opacity: 0.5 },
              ]}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>
                  {isEditing ? "Save Changes" : "Create Blank Sandbox"}
                </Text>
              )}
            </Pressable>
          </>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}
