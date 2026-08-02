// src/components/league/LeagueSwitcher.tsx

import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  leagueIndicatorConfig,
  LeagueIndicatorId,
} from "@/config/leagueIndicatorConfig";
import { useLeague } from "@/context/LeagueContext";
import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from "@/theme";

import LeagueLogo from "./LeagueLogo";

type LeagueSwitcherProps = {
  showLabel?: boolean;
};

export default function LeagueSwitcher({
  showLabel = false,
}: LeagueSwitcherProps) {
  const { selectedLeagueId, selectLeague } = useLeague();
  const [isOpen, setIsOpen] = useState(false);

  const selectedLeague =
    leagueIndicatorConfig[selectedLeagueId];

  const availableLeagues = useMemo(
    () => Object.values(leagueIndicatorConfig),
    []
  );

  const openMenu = () => {
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleSelectLeague = (
    leagueId: LeagueIndicatorId
  ) => {
    selectLeague(leagueId);
    closeMenu();
  };

  return (
    <>
      <View style={styles.triggerRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Switch league. Current league is ${selectedLeague.name}`}
          onPress={openMenu}
          style={({ pressed }) => [
            styles.logoButton,
            pressed && styles.pressed,
          ]}
        >
          <LeagueLogo
            leagueId={selectedLeagueId}
            size={52}
            imageScale={1.08}
          />
        </Pressable>

        {showLabel ? (
          <Text
            numberOfLines={1}
            style={styles.triggerLabel}
          >
            {selectedLeague.shortName}
          </Text>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open league menu"
          onPress={openMenu}
          hitSlop={10}
          style={({ pressed }) => [
            styles.arrowButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="chevron-down"
            size={24}
            color={colors.primary}
          />
        </Pressable>
      </View>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={styles.backdrop}
            onPress={closeMenu}
          />

          <View style={styles.menu}>
            <View style={styles.menuHeader}>
              <View style={styles.menuTitleBlock}>
                <Text style={styles.menuEyebrow}>
                  CURRENT ORGANIZATION
                </Text>

                <Text
                  numberOfLines={1}
                  style={styles.menuTitle}
                >
                  {selectedLeague.name}
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close league switcher"
                hitSlop={10}
                onPress={closeMenu}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="close"
                  size={22}
                  color={colors.text}
                />
              </Pressable>
            </View>

            <View style={styles.divider} />

            <View style={styles.options}>
              {availableLeagues.map((league) => {
                const isSelected =
                  league.id === selectedLeagueId;

                return (
                  <Pressable
                    key={league.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${league.name}`}
                    accessibilityState={{
                      selected: isSelected,
                    }}
                    onPress={() =>
                      handleSelectLeague(league.id)
                    }
                    style={({ pressed }) => [
                      styles.option,
                      isSelected &&
                        styles.selectedOption,
                      pressed &&
                        styles.optionPressed,
                    ]}
                  >
                    <View style={styles.optionLogo}>
                      <LeagueLogo
                        leagueId={league.id}
                        size={46}
                        imageScale={1.25}
                      />
                    </View>

                    <View style={styles.optionTextBlock}>
                      <Text style={styles.optionName}>
                        {league.name}
                      </Text>

                      <Text
                        style={styles.optionShortName}
                      >
                        {league.shortName}
                      </Text>
                    </View>

                    {isSelected ? (
                      <View
                        style={styles.selectedIcon}
                      >
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color={colors.surface}
                        />
                      </View>
                    ) : (
                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={colors.textMuted}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  triggerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.sm,
  },

  logoButton: {
    width: 62,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    ...shadows.card,
  },

  arrowButton: {
    width: 30,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  triggerLabel: {
    maxWidth: 76,
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.97 }],
  },

  modalRoot: {
    flex: 1,
    justifyContent: "flex-start",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 10, 30, 0.38)",
  },

  menu: {
    marginTop: 96,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    ...shadows.card,
  },

  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  menuTitleBlock: {
    flex: 1,
  },

  menuEyebrow: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: "700",
    letterSpacing: 0.8,
  },

  menuTitle: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: typography.subheading,
    fontWeight: "800",
  },

  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.lg,
    backgroundColor: colors.border,
  },

  options: {
    gap: spacing.sm,
  },

  option: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },

  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },

  optionPressed: {
    opacity: 0.76,
  },

  optionLogo: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },

  optionTextBlock: {
    flex: 1,
  },

  optionName: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700",
  },

  optionShortName: {
    marginTop: 2,
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "500",
  },

  selectedIcon: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
});