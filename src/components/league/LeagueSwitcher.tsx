// src/components/league/LeagueSwitcher.tsx

import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  leagueIndicatorConfig,
  LeagueIndicatorId,
} from "@/config/leagueIndicatorConfig";
import { useLeague } from "@/context/LeagueContext";
import {
  colors,
  radius,
  shadows,
  sizes,
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

  const availableLeagues = useMemo(
    () => Object.values(leagueIndicatorConfig),
    []
  );

  const fallbackLeague =
    availableLeagues[0];

  const selectedLeague =
    leagueIndicatorConfig[selectedLeagueId] ??
    fallbackLeague;

  const resolvedSelectedLeagueId =
    selectedLeague.id;

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
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Switch organization. Current organization is ${selectedLeague.name}`}
        accessibilityHint="Opens the organization selection menu"
        onPress={openMenu}
        hitSlop={6}
        style={({ pressed }) => [
          styles.trigger,
          pressed && styles.triggerPressed,
        ]}
      >
        <LeagueLogo
          leagueId={resolvedSelectedLeagueId}
          size={sizes.headerLogo}
          imageScale={1.08}
        />

        {showLabel ? (
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
            style={styles.triggerLabel}
          >
            {selectedLeague.shortName}
          </Text>
        ) : null}

        <View style={styles.arrowContainer}>
          <Ionicons
            name="chevron-down"
            size={20}
            color={colors.primary}
          />
        </View>
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeMenu}
      >
        <View style={styles.modalRoot}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close organization selector"
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
                  numberOfLines={2}
                  style={styles.menuTitle}
                >
                  {selectedLeague.name}
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close organization selector"
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
                  league.id ===
                  resolvedSelectedLeagueId;

                return (
                  <Pressable
                    key={league.id}
                    accessibilityRole="radio"
                    accessibilityLabel={`Select ${league.name}`}
                    accessibilityState={{
                      checked: isSelected,
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
                        imageScale={1.2}
                      />
                    </View>

                    <View style={styles.optionTextBlock}>
                      <Text
                        numberOfLines={2}
                        style={[
                          styles.optionName,
                          isSelected &&
                            styles.selectedOptionName,
                        ]}
                      >
                        {league.name}
                      </Text>

                      <Text
                        numberOfLines={1}
                        style={styles.optionShortName}
                      >
                        {league.shortName}
                      </Text>
                    </View>

                    {isSelected ? (
                      <View style={styles.selectedIcon}>
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color={colors.surface}
                        />
                      </View>
                    ) : (
                      <Ionicons
                        name="chevron-forward"
                        size={20}
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
  trigger: {
    minWidth: sizes.headerSideWidth,
    minHeight: sizes.headerHeight - spacing.md,

    alignItems: "center",
    justifyContent: "flex-start",

    paddingTop: spacing.xs,
  },

  triggerLabel: {
    maxWidth: sizes.headerSideWidth,
    marginTop: spacing.xs,

    color: colors.primary,
    fontSize: typography.small,
    fontWeight: "700",
    textAlign: "center",

    includeFontPadding: false,
  },

  arrowContainer: {
    position: "absolute",
    right: 0,
    top: sizes.headerLogo / 2,

    width: 24,
    height: 24,

    alignItems: "center",
    justifyContent: "center",
  },

  triggerPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.97 }],
  },

  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.96 }],
  },

  modalRoot: {
    flex: 1,
    justifyContent: "center",

    paddingHorizontal: spacing.lg,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 10, 30, 0.42)",
  },

  menu: {
    width: "100%",
    maxWidth: 620,
    alignSelf: "center",

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
    minWidth: 0,
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
    width: sizes.touchTarget,
    height: sizes.touchTarget,

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
    minHeight: 76,

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
    width: 52,
    height: 52,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: radius.pill,
    backgroundColor: colors.surface,

    overflow: "hidden",
  },

  optionTextBlock: {
    flex: 1,
    minWidth: 0,
  },

  optionName: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700",
  },

  selectedOptionName: {
    color: colors.primary,
  },

  optionShortName: {
    marginTop: spacing.xs,

    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: "500",
  },

  selectedIcon: {
    width: 30,
    height: 30,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
});