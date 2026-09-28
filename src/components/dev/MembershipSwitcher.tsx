// src/components/dev/MembershipSwitcher.tsx

import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useMembership } from "src/context/MembershipContext";

import {
  ORGANIZATIONS,
} from "src/config/organizations";

import {
  ROLES,
} from "src/config/roles";

export default function MembershipSwitcher() {
  const {
    activeMembership,
    setActiveMembership,
    testMemberships,
  } = useMembership();

  if (!__DEV__) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        DEV EXPERIENCE TEST
      </Text>

      <Text style={styles.current}>
        Current:{" "}
        {
          ORGANIZATIONS[
            activeMembership.organizationId
          ].branding.shortName
        }
        {" · "}
        {activeMembership.roles
          .map((roleId) => ROLES[roleId].shortLabel)
          .join(" + ")}
      </Text>

      <View style={styles.buttonContainer}>
        {testMemberships.map((membership) => {
          const isActive =
            membership.id === activeMembership.id;

          const organization =
            ORGANIZATIONS[membership.organizationId];

          const roleLabels = membership.roles
            .map(
              (roleId) =>
                ROLES[roleId].shortLabel
            )
            .join(" + ");

          return (
            <Pressable
              key={membership.id}
              onPress={() =>
                setActiveMembership(membership)
              }
              style={[
                styles.button,
                isActive && styles.activeButton,
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  isActive &&
                    styles.activeButtonText,
                ]}
              >
                {organization.branding.shortName}
                {"\n"}
                {roleLabels}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },

  title: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 6,
  },

  current: {
    fontSize: 13,
    marginBottom: 12,
  },

  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  button: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    backgroundColor: "#FFFFFF",
  },

  activeButton: {
    backgroundColor: "#250F74",
    borderColor: "#250F74",
  },

  buttonText: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },

  activeButtonText: {
    color: "#FFFFFF",
  },
});