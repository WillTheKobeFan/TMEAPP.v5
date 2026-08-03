// app/(tabs)/settings/notification-sources.tsx

import React, { useMemo, useState } from "react";
import {
  Modal,
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

import {
  NotificationSource,
  useNotificationSettings,
} from "src/context/NotificationSettingsContext";

const COLORS = {
  purple: "#250F74",
  background: "#F6F5FA",
  card: "#FFFFFF",
  text: "#191724",
  secondaryText: "#6D6878",
  border: "#E5E1EB",
  muted: "#9791A3",
};

const ALL_FILTER = "All";

type FilterPickerProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function FilterPicker({
  label,
  value,
  options,
  onChange,
}: FilterPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value}`}
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [
          styles.filterControl,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.filterControlText}>
          <Text style={styles.filterControlLabel}>
            {label}
          </Text>

          <Text numberOfLines={1} style={styles.filterValue}>
            {value}
          </Text>
        </View>

        <Ionicons
          name="chevron-down"
          size={18}
          color={COLORS.purple}
        />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
        >
          <Pressable
            style={styles.modalCard}
            onPress={(event) => event.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={() => setIsOpen(false)}
                style={styles.closeButton}
              >
                <Ionicons
                  name="close"
                  size={22}
                  color={COLORS.purple}
                />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.modalOptions}
            >
              {options.map((option) => {
                const selected = option === value;

                return (
                  <Pressable
                    key={option}
                    onPress={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                    style={[
                      styles.modalOption,
                      selected && styles.selectedModalOption,
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        selected &&
                          styles.selectedModalOptionText,
                      ]}
                    >
                      {option}
                    </Text>

                    {selected ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={21}
                        color={COLORS.purple}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function groupSourcesByOrganization(
  sources: NotificationSource[],
) {
  const grouped = new Map<string, NotificationSource[]>();

  for (const source of sources) {
    const existing =
      grouped.get(source.organizationName) ?? [];

    existing.push(source);
    grouped.set(source.organizationName, existing);
  }

  return Array.from(grouped.entries());
}

export default function NotificationSourcesScreen() {
  const router = useRouter();

  const {
    sources,
    setSourceEnabled,
    setAllSourcesEnabled,
    enabledSourceCount,
  } = useNotificationSettings();

  const [organizationFilter, setOrganizationFilter] =
    useState(ALL_FILTER);

  const [leagueTypeFilter, setLeagueTypeFilter] =
    useState(ALL_FILTER);

  const [dayTimeFilter, setDayTimeFilter] =
    useState(ALL_FILTER);

  const organizationOptions = useMemo(
    () => [
      ALL_FILTER,
      ...Array.from(
        new Set(
          sources.map((source) => source.organizationName),
        ),
      ).sort(),
    ],
    [sources],
  );

  const organizationFilteredSources = useMemo(() => {
    if (organizationFilter === ALL_FILTER) {
      return sources;
    }

    return sources.filter(
      (source) =>
        source.organizationName === organizationFilter,
    );
  }, [organizationFilter, sources]);

  const leagueTypeOptions = useMemo(
    () => [
      ALL_FILTER,
      ...Array.from(
        new Set(
          organizationFilteredSources.map(
            (source) => source.leagueType,
          ),
        ),
      ).sort(),
    ],
    [organizationFilteredSources],
  );

  const typeFilteredSources = useMemo(() => {
    if (leagueTypeFilter === ALL_FILTER) {
      return organizationFilteredSources;
    }

    return organizationFilteredSources.filter(
      (source) => source.leagueType === leagueTypeFilter,
    );
  }, [leagueTypeFilter, organizationFilteredSources]);

  const dayTimeOptions = useMemo(
    () => [
      ALL_FILTER,
      ...Array.from(
        new Set(
          typeFilteredSources.map(
            (source) => source.dayTime,
          ),
        ),
      ).sort(),
    ],
    [typeFilteredSources],
  );

  const visibleSources = useMemo(() => {
    return typeFilteredSources.filter((source) => {
      if (
        dayTimeFilter !== ALL_FILTER &&
        source.dayTime !== dayTimeFilter
      ) {
        return false;
      }

      return true;
    });
  }, [dayTimeFilter, typeFilteredSources]);

  const groupedSources = useMemo(
    () => groupSourcesByOrganization(visibleSources),
    [visibleSources],
  );

  const enabledVisibleCount = visibleSources.filter(
    (source) => source.enabled,
  ).length;

  function updateOrganizationFilter(value: string) {
    setOrganizationFilter(value);
    setLeagueTypeFilter(ALL_FILTER);
    setDayTimeFilter(ALL_FILTER);
  }

  function updateLeagueTypeFilter(value: string) {
    setLeagueTypeFilter(value);
    setDayTimeFilter(ALL_FILTER);
  }

  function clearFilters() {
    setOrganizationFilter(ALL_FILTER);
    setLeagueTypeFilter(ALL_FILTER);
    setDayTimeFilter(ALL_FILTER);
  }

  const visibleSourceIds = visibleSources.map(
    (source) => source.id,
  );

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
            Notification Sources
          </Text>

          <View style={styles.headerSide} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              Notification Source Filter
            </Text>

            <Text style={styles.infoDescription}>
              Filter by organization, league type or league
              time without changing your saved selections.
            </Text>
          </View>

          <View style={styles.filtersCard}>
            <FilterPicker
              label="Organization"
              value={organizationFilter}
              options={organizationOptions}
              onChange={updateOrganizationFilter}
            />

            <FilterPicker
              label="League Type"
              value={leagueTypeFilter}
              options={leagueTypeOptions}
              onChange={updateLeagueTypeFilter}
            />

            <FilterPicker
              label="Day / Time"
              value={dayTimeFilter}
              options={dayTimeOptions}
              onChange={setDayTimeFilter}
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear filters"
              onPress={clearFilters}
              style={styles.clearFiltersButton}
            >
              <Ionicons
                name="refresh-outline"
                size={17}
                color={COLORS.purple}
              />

              <Text style={styles.clearFiltersText}>
                Clear Filters
              </Text>
            </Pressable>
          </View>

          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryTitle}>
                Showing {visibleSources.length} of{" "}
                {sources.length} leagues
              </Text>

              <Text style={styles.summaryText}>
                {enabledVisibleCount} visible •{" "}
                {enabledSourceCount} total enabled
              </Text>
            </View>
          </View>

          <View style={styles.bulkActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Select all visible leagues"
              disabled={visibleSources.length === 0}
              onPress={() =>
                setAllSourcesEnabled(true, visibleSourceIds)
              }
              style={({ pressed }) => [
                styles.bulkButton,
                pressed && styles.pressed,
                visibleSources.length === 0 &&
                  styles.disabledButton,
              ]}
            >
              <Ionicons
                name="checkmark-done-outline"
                size={18}
                color={COLORS.purple}
              />

              <Text style={styles.bulkButtonText}>
                Select Visible
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear all visible leagues"
              disabled={visibleSources.length === 0}
              onPress={() =>
                setAllSourcesEnabled(false, visibleSourceIds)
              }
              style={({ pressed }) => [
                styles.bulkButton,
                pressed && styles.pressed,
                visibleSources.length === 0 &&
                  styles.disabledButton,
              ]}
            >
              <Ionicons
                name="close-circle-outline"
                size={18}
                color={COLORS.purple}
              />

              <Text style={styles.bulkButtonText}>
                Clear Visible
              </Text>
            </Pressable>
          </View>

          {groupedSources.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons
                name="search-outline"
                size={30}
                color={COLORS.muted}
              />

              <Text style={styles.emptyTitle}>
                No leagues found
              </Text>

              <Text style={styles.emptyText}>
                Change or clear the filters to view more
                notification sources.
              </Text>
            </View>
          ) : (
            groupedSources.map(
              ([organizationName, organizationSources]) => (
                <View
                  key={organizationName}
                  style={styles.organizationCard}
                >
                  <View style={styles.organizationHeader}>
                    <View style={styles.organizationIcon}>
                      <Ionicons
                        name="business-outline"
                        size={20}
                        color={COLORS.purple}
                      />
                    </View>

                    <View style={styles.organizationTitleBlock}>
                      <Text style={styles.organizationTitle}>
                        {organizationName}
                      </Text>

                      <Text style={styles.organizationCount}>
                        {
                          organizationSources.filter(
                            (source) => source.enabled,
                          ).length
                        }{" "}
                        of {organizationSources.length} enabled
                      </Text>
                    </View>
                  </View>

                  {organizationSources.map(
                    (source, sourceIndex) => (
                      <React.Fragment key={source.id}>
                        {sourceIndex > 0 ? (
                          <View style={styles.divider} />
                        ) : null}

                        <View style={styles.sourceRow}>
                          <View style={styles.sourceDetails}>
                            <Text style={styles.sourceDayTime}>
                              {source.dayTime}
                            </Text>

                            <Text style={styles.sourceLeague}>
                              {source.leagueType} •{" "}
                              {source.leagueName}
                            </Text>
                          </View>

                          <Switch
                            accessibilityLabel={`${source.organizationName}, ${source.leagueName}, ${source.dayTime}`}
                            value={source.enabled}
                            onValueChange={(value) =>
                              setSourceEnabled(
                                source.id,
                                value,
                              )
                            }
                            trackColor={{
                              false: "#C9C5CF",
                              true: "#7F6DB6",
                            }}
                            thumbColor={
                              source.enabled
                                ? COLORS.purple
                                : "#F5F4F7"
                            }
                            ios_backgroundColor="#C9C5CF"
                          />
                        </View>
                      </React.Fragment>
                    ),
                  )}
                </View>
              ),
            )
          )}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Done managing notification sources"
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.doneButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </Pressable>

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
    width: 84,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
  },

  backText: {
    color: COLORS.purple,
    fontSize: 15,
    fontWeight: "700",
  },

  headerTitle: {
    flex: 1,
    paddingHorizontal: 4,
    color: COLORS.purple,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 44,
  },

  infoCard: {
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

  filtersCard: {
    marginTop: 16,
    padding: 15,
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

  filterControl: {
    minHeight: 59,
    marginBottom: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    backgroundColor: "#FBFAFD",
    flexDirection: "row",
    alignItems: "center",
  },

  filterControlText: {
    flex: 1,
    paddingRight: 12,
  },

  filterControlLabel: {
    color: COLORS.secondaryText,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  filterValue: {
    marginTop: 4,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "800",
  },

  clearFiltersButton: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  clearFiltersText: {
    color: COLORS.purple,
    fontSize: 13,
    fontWeight: "800",
  },

  summaryRow: {
    marginTop: 20,
    paddingHorizontal: 4,
  },

  summaryTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
  },

  summaryText: {
    marginTop: 4,
    color: COLORS.secondaryText,
    fontSize: 12.5,
    fontWeight: "600",
  },

  bulkActions: {
    marginTop: 13,
    flexDirection: "row",
    gap: 10,
  },

  bulkButton: {
    flex: 1,
    minHeight: 45,
    paddingHorizontal: 10,
    borderWidth: 1.4,
    borderColor: COLORS.purple,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  bulkButtonText: {
    color: COLORS.purple,
    fontSize: 12.5,
    fontWeight: "800",
  },

  disabledButton: {
    opacity: 0.4,
  },

  organizationCard: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 17,
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

  organizationHeader: {
    paddingBottom: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  organizationIcon: {
    width: 41,
    height: 41,
    marginRight: 12,
    borderRadius: 21,
    backgroundColor: "#F0ECF9",
    alignItems: "center",
    justifyContent: "center",
  },

  organizationTitleBlock: {
    flex: 1,
  },

  organizationTitle: {
    color: COLORS.purple,
    fontSize: 15,
    fontWeight: "800",
  },

  organizationCount: {
    marginTop: 3,
    color: COLORS.secondaryText,
    fontSize: 12,
    fontWeight: "600",
  },

  sourceRow: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sourceDetails: {
    flex: 1,
    paddingRight: 16,
  },

  sourceDayTime: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "800",
  },

  sourceLeague: {
    marginTop: 4,
    color: COLORS.secondaryText,
    fontSize: 12.5,
    lineHeight: 17,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
  },

  emptyCard: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    alignItems: "center",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 4,
  },

  emptyTitle: {
    marginTop: 10,
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
  },

  emptyText: {
    maxWidth: 290,
    marginTop: 6,
    color: COLORS.secondaryText,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },

  doneButton: {
    minHeight: 50,
    marginTop: 20,
    borderRadius: 14,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
  },

  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  savedMessage: {
    marginTop: 15,
    color: COLORS.secondaryText,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },

  pressed: {
    opacity: 0.74,
    transform: [{ scale: 0.992 }],
  },

  modalOverlay: {
    flex: 1,
    paddingHorizontal: 22,
    backgroundColor: "rgba(12, 9, 22, 0.46)",
    alignItems: "center",
    justifyContent: "center",
  },

  modalCard: {
    width: "100%",
    maxHeight: "70%",
    borderRadius: 20,
    backgroundColor: COLORS.card,
    overflow: "hidden",
  },

  modalHeader: {
    minHeight: 62,
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  modalTitle: {
    color: COLORS.purple,
    fontSize: 17,
    fontWeight: "800",
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0ECF9",
    alignItems: "center",
    justifyContent: "center",
  },

  modalOptions: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  modalOption: {
    minHeight: 52,
    paddingHorizontal: 13,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectedModalOption: {
    backgroundColor: "#F0ECF9",
  },

  modalOptionText: {
    flex: 1,
    paddingRight: 12,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },

  selectedModalOptionText: {
    color: COLORS.purple,
    fontWeight: "800",
  },
});