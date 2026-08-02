// app/(tabs)/champs/index.tsx

import React, { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import ScreenLayout from "src/components/ScreenLayout";

const COLORS = {
  purple: "#250F74",
  white: "#FFFFFF",
  text: "#222222",
  secondaryText: "#77737F",
  border: "#E4E0ED",
  placeholder: "#EFEDF3",
  disabled: "#D8D5DE",
};

type ChampionData = {
  season: string;
  league: string;
  division?: string;
  sport?: string;
  teamName: string;
  record?: string;
  players: string[];
  captain?: string;
  mvp?: string;
  photo?: ImageSourcePropType;
};

const SAMPLE_CHAMPION: ChampionData = {
  season: "Spring 2026",
  league: "Sunday AM",
  division: "Recreational",
  sport: "Basketball",
  teamName: "Prince",
  record: "9–1",
  captain: "Prince",
  mvp: "Prince",
  players: [
    "Prince",
    "Marcus",
    "Chris",
    "James",
    "Anthony",
    "Devon",
  ],

  /*
   * Add a temporary photo when ready:
   *
   * photo: require("../../../../assets/champions/prince-spring-2026.jpg"),
   */
};

export default function Champs() {
  const router = useRouter();

  /*
   * SAMPLE_CHAMPION keeps the completed design visible.
   *
   * Change this to null when the real filter is connected:
   *
   * const [selectedChampion] =
   *   useState<ChampionData | null>(null);
   */
  const [selectedChampion] = useState<ChampionData | null>(
    SAMPLE_CHAMPION
  );

  const [photoModalVisible, setPhotoModalVisible] =
    useState(false);

  const handleOpenFilter = () => {
    /*
     * Connect to the universal filter modal or bottom sheet.
     *
     * Champs filters:
     * - League
     * - Season
     */
  };

  const handleChampionsHistory = () => {
    router.push("/champs/champions-history" as never);
  };

  const handleSeasonHistory = () => {
    router.push("/champs/season-history" as never);
  };

  return (
    <ScreenLayout title="Champions">
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ChampionsFilterPill
          champion={selectedChampion}
          onPress={handleOpenFilter}
        />

        <ChampionsInformationCard />

        {selectedChampion ? (
          <ChampionCard
            champion={selectedChampion}
            onZoomPhoto={() =>
              setPhotoModalVisible(true)
            }
          />
        ) : (
          <EmptyChampionCard />
        )}

        <View style={styles.bottomButtonRow}>
          <HistoryButton
            icon="trophy"
            label="Champions History"
            accessibilityLabel="View champions history"
            onPress={handleChampionsHistory}
          />

          <HistoryButton
            icon="calendar-days"
            label="Season History"
            accessibilityLabel="View season history"
            onPress={handleSeasonHistory}
          />
        </View>
      </ScrollView>

      <ChampionPhotoModal
        visible={photoModalVisible}
        champion={selectedChampion}
        onClose={() =>
          setPhotoModalVisible(false)
        }
      />
    </ScreenLayout>
  );
}

/* -------------------------------------------------------------------------- */
/*                                FILTER PILL                                 */
/* -------------------------------------------------------------------------- */

type ChampionsFilterPillProps = {
  champion: ChampionData | null;
  onPress: () => void;
};

function ChampionsFilterPill({
  champion,
  onPress,
}: ChampionsFilterPillProps) {
  const filterText = champion
    ? `${champion.season} • ${champion.league}`
    : "Select League • Select Season";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open champions filters"
      onPress={onPress}
      style={({ pressed }) => [
        styles.filterPill,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.filterLeft}>
        <FontAwesome6
          name="sliders"
          size={16}
          color={COLORS.purple}
        />

        <Text
          style={styles.filterText}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.88}
        >
          {filterText}
        </Text>
      </View>

      <FontAwesome6
        name="chevron-down"
        size={15}
        color={COLORS.purple}
      />
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/*                            INFORMATION CARD                                */
/* -------------------------------------------------------------------------- */

function ChampionsInformationCard() {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoIconContainer}>
        <FontAwesome6
          name="trophy"
          size={20}
          color={COLORS.purple}
        />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>
          Champions
        </Text>

        <Text style={styles.infoText}>
          View championship teams from each season. Use the
          filter to switch seasons and leagues.
        </Text>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                              CHAMPION CARD                                 */
/* -------------------------------------------------------------------------- */

type ChampionCardProps = {
  champion: ChampionData;
  onZoomPhoto: () => void;
};

function ChampionCard({
  champion,
  onZoomPhoto,
}: ChampionCardProps) {
  const leagueDescription = [
    champion.division,
    champion.sport,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <View style={styles.championCard}>
      <View style={styles.championHeadingRow}>
        <FontAwesome6
          name="trophy"
          size={18}
          color={COLORS.purple}
        />

        <Text style={styles.championTitle}>
          Champions
        </Text>
      </View>

      <Text style={styles.seasonLeague}>
        {champion.season} • {champion.league}
      </Text>

      {leagueDescription ? (
        <Text style={styles.leagueDescription}>
          {leagueDescription}
        </Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          champion.photo
            ? "Open championship team photo"
            : "Championship team photo unavailable"
        }
        disabled={!champion.photo}
        onPress={onZoomPhoto}
        style={({ pressed }) => [
          styles.photoFrame,
          pressed && Boolean(champion.photo) &&
          styles.photoPressed,
        ]}
      >
        {champion.photo ? (
          <Image
            source={champion.photo}
            resizeMode="cover"
            style={styles.championPhoto}
          />
        ) : (
          <View style={styles.photoPlaceholder}>
            <FontAwesome6
              name="image"
              size={29}
              color={COLORS.secondaryText}
            />

            <Text style={styles.photoPlaceholderText}>
              Championship Team Photo
            </Text>
          </View>
        )}
      </Pressable>

      <View style={styles.teamDetails}>
        <DetailRow
          label="Team"
          value={champion.teamName}
        />

        {champion.record ? (
          <DetailRow
            label="Record"
            value={champion.record}
          />
        ) : null}
      </View>

      <View style={styles.divider} />

      <View style={styles.playersSection}>
        <Text style={styles.sectionTitle}>
          Players
        </Text>

        {champion.players.map((player, index) => {
          const isCaptain =
            player === champion.captain;

          return (
            <Text
              key={`${player}-${index}`}
              style={styles.playerText}
            >
              • {player}
              {isCaptain ? " (Captain)" : ""}
            </Text>
          );
        })}
      </View>

      {champion.mvp ? (
        <>
          <View style={styles.divider} />

          <View style={styles.mvpRow}>
            <FontAwesome6
              name="star"
              size={14}
              color={COLORS.purple}
            />

            <Text style={styles.mvpLabel}>
              MVP:
            </Text>

            <Text style={styles.mvpValue}>
              {champion.mvp}
            </Text>
          </View>
        </>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Zoom championship photo"
        disabled={!champion.photo}
        onPress={onZoomPhoto}
        style={({ pressed }) => [
          styles.zoomButton,
          !champion.photo
            ? styles.zoomButtonDisabled
            : undefined,
          pressed && Boolean(champion.photo)
            ? styles.pressed
            : undefined,
        ]}
      >
        <FontAwesome6
          name="magnifying-glass-plus"
          size={14}
          color={
            champion.photo
              ? COLORS.white
              : COLORS.secondaryText
          }
        />

        <Text
          style={[
            styles.zoomButtonText,
            !champion.photo &&
            styles.zoomButtonTextDisabled,
          ]}
        >
          Zoom Photo
        </Text>
      </Pressable>
    </View>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({
  label,
  value,
}: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>
        {label}:
      </Text>

      <Text style={styles.detailValue}>
        {value}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                EMPTY STATE                                 */
/* -------------------------------------------------------------------------- */

function EmptyChampionCard() {
  return (
    <View style={styles.emptyCard}>
      <FontAwesome6
        name="trophy"
        size={32}
        color={COLORS.purple}
      />

      <Text style={styles.emptyTitle}>
        Select a League
      </Text>

      <Text style={styles.emptyText}>
        Use the filter above to select a league and season
        to view its champion.
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                              HISTORY BUTTONS                               */
/* -------------------------------------------------------------------------- */

type HistoryButtonProps = {
  icon: React.ComponentProps<
    typeof FontAwesome6
  >["name"];
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
};

function HistoryButton({
  icon,
  label,
  accessibilityLabel,
  onPress,
}: HistoryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.historyButton,
        pressed && styles.pressed,
      ]}
    >
      <FontAwesome6
        name={icon}
        size={17}
        color={COLORS.white}
      />

      <Text
        style={styles.historyButtonText}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.78}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/*                               PHOTO MODAL                                  */
/* -------------------------------------------------------------------------- */

type ChampionPhotoModalProps = {
  visible: boolean;
  champion: ChampionData | null;
  onClose: () => void;
};

function ChampionPhotoModal({
  visible,
  champion,
  onClose,
}: ChampionPhotoModalProps) {
  if (!champion?.photo) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalHeader}>
          <View style={styles.modalHeading}>
            <Text style={styles.modalTitle}>
              {champion.teamName}
            </Text>

            <Text style={styles.modalSubtitle}>
              {champion.season} • {champion.league}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close champion photo"
            onPress={onClose}
            style={({ pressed }) => [
              styles.modalCloseButton,
              pressed && styles.pressed,
            ]}
          >
            <FontAwesome6
              name="xmark"
              size={20}
              color={COLORS.purple}
            />
          </Pressable>
        </View>

        <View style={styles.modalPhotoFrame}>
          <Image
            source={champion.photo}
            resizeMode="contain"
            style={styles.modalPhoto}
          />
        </View>
      </View>
    </Modal>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: "100%",
  },

  scrollContent: {
    width: "100%",
    alignItems: "center",
    paddingTop: 16,
    paddingHorizontal: 18,
    paddingBottom: 32,
  },

  /* Filter */

  filterPill: {
    width: "78%",
    maxWidth: 520,
    height: 44,
    alignSelf: "flex-start",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingHorizontal: 13,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.09,
    shadowRadius: 5,
    elevation: 3,
  },

  filterLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
  },

  filterText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "800",
    marginLeft: 10,
  },

  /* Information card */

  infoCard: {
    width: "96%",
    maxWidth: 680,
    minHeight: 82,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: COLORS.white,
    borderRadius: 18,

    paddingVertical: 13,
    paddingHorizontal: 17,

    marginTop: 18,
    marginBottom: 18,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.09,
    shadowRadius: 5,
    elevation: 3,
  },

  infoIconContainer: {
    width: 38,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    color: COLORS.purple,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 3,
  },

  infoText: {
    color: COLORS.secondaryText,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },

  /* Champion card */

  championCard: {
    width: "100%",
    maxWidth: 680,

    backgroundColor: COLORS.white,
    borderRadius: 18,

    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 16,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.11,
    shadowRadius: 7,
    elevation: 4,
  },

  championHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  championTitle: {
    color: COLORS.purple,
    fontSize: 19,
    fontWeight: "900",
    marginLeft: 7,
  },

  seasonLeague: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },

  leagueDescription: {
    color: COLORS.secondaryText,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 3,
    marginBottom: 15,
  },

  /* Photo */

  photoFrame: {
    width: "96%",
    maxWidth: 620,
    aspectRatio: 4 / 3,
    alignSelf: "center",

    backgroundColor: COLORS.white,
    borderWidth: 6,
    borderColor: COLORS.white,
    borderRadius: 9,
    overflow: "hidden",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.14,
    shadowRadius: 5,
    elevation: 4,
  },

  championPhoto: {
    width: "100%",
    height: "100%",
  },

  photoPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.placeholder,
  },

  photoPlaceholderText: {
    color: COLORS.secondaryText,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 9,
  },

  photoPressed: {
    opacity: 0.9,
  },

  /* Team information */

  teamDetails: {
    width: "96%",
    alignSelf: "center",
    marginTop: 17,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  detailLabel: {
    color: COLORS.purple,
    fontSize: 14,
    fontWeight: "800",
    marginRight: 5,
  },

  detailValue: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },

  divider: {
    width: "96%",
    alignSelf: "center",
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 13,
  },

  playersSection: {
    width: "96%",
    alignSelf: "center",
  },

  sectionTitle: {
    color: COLORS.purple,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 7,
  },

  playerText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 21,
  },

  mvpRow: {
    width: "96%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },

  mvpLabel: {
    color: COLORS.purple,
    fontSize: 14,
    fontWeight: "800",
    marginLeft: 7,
    marginRight: 5,
  },

  mvpValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },

  /* Zoom button */

  zoomButton: {
    alignSelf: "center",
    minWidth: 142,
    height: 40,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.purple,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginTop: 17,
  },

  zoomButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },

  zoomButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "800",
    marginLeft: 7,
  },

  zoomButtonTextDisabled: {
    color: COLORS.secondaryText,
  },

  /* Empty state */

  emptyCard: {
    width: "100%",
    maxWidth: 680,
    minHeight: 190,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.white,
    borderRadius: 18,

    paddingHorizontal: 24,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.11,
    shadowRadius: 6,
    elevation: 4,
  },

  emptyTitle: {
    color: COLORS.purple,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 11,
  },

  emptyText: {
    color: COLORS.secondaryText,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    textAlign: "center",
    marginTop: 6,
  },

  /* History buttons */

  bottomButtonRow: {
    width: "100%",
    maxWidth: 680,

    flexDirection: "row",
    columnGap: 12,

    marginTop: 17,
  },

  historyButton: {
    flex: 1,
    height: 48,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.purple,
    borderRadius: 16,
    paddingHorizontal: 8,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 4,
  },

  historyButtonText: {
    flexShrink: 1,
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
    marginLeft: 8,
  },

  /* Photo modal */

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.94)",
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 28,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  modalHeading: {
    flex: 1,
    paddingRight: 12,
  },

  modalTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "900",
  },

  modalSubtitle: {
    color: "#D8D5DF",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 3,
  },

  modalCloseButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderRadius: 21,
  },

  modalPhotoFrame: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 7,
  },

  modalPhoto: {
    width: "100%",
    height: "100%",
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.985 }],
  },
});