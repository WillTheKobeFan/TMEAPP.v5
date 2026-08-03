// app/(tabs)/search/index.tsx

import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from
  "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from
  "@expo/vector-icons/FontAwesome6";

import ScreenLayout from "src/components/ScreenLayout";

/* -------------------------------------------------------------------------- */
/*                                   COLORS                                   */
/* -------------------------------------------------------------------------- */

const COLORS = {
  purple: "#250F74",
  white: "#FFFFFF",
  text: "#222222",
  secondaryText: "#77737F",
  border: "#E4E0ED",
  divider: "#ECE8F2",
  placeholder: "#9B97A3",
  lightPurple: "#F3F0FA",
};

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

type SearchResultType =
  | "team"
  | "player"
  | "schedule"
  | "result"
  | "standings"
  | "champion"
  | "update"
  | "rule"
  | "registration"
  | "faq";

type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  description?: string;
  searchTerms: string[];

  /*
   * Team-branding fields.
   *
   * logoAvailable is temporary.
   * Later this can become logoUrl or an ImageSourcePropType.
   */
  logoAvailable?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
};

type PopularSearchItem = {
  id: string;
  emoji: string;
  label: string;
};

/* -------------------------------------------------------------------------- */
/*                           POPULAR SEARCH CONTENT                            */
/* -------------------------------------------------------------------------- */

const POPULAR_SEARCHES: PopularSearchItem[] = [
  {
    id: "teams-players",
    emoji: "🏀",
    label: "Teams & Players",
  },
  {
    id: "schedules-results",
    emoji: "📅",
    label: "Schedules & Game Results",
  },
  {
    id: "standings-playoffs",
    emoji: "📊",
    label: "Standings & Playoff Picture",
  },
  {
    id: "champions",
    emoji: "🏆",
    label: "Champions",
  },
  {
    id: "updates",
    emoji: "📢",
    label: "Updates & Announcements",
  },
  {
    id: "rules",
    emoji: "📖",
    label: "League Rules",
  },
  {
    id: "registration",
    emoji: "📝",
    label: "Registration & Forms",
  },
  {
    id: "faq",
    emoji: "❓",
    label: "FAQ & Common Questions",
  },
];

/* -------------------------------------------------------------------------- */
/*                         TEMPORARY SEARCHABLE DATA                           */
/* -------------------------------------------------------------------------- */

/*
 * This is temporary display data so the full Search experience
 * can be tested before connecting Firestore.
 *
 * Later, this can be built from:
 *
 * - teams
 * - rosters
 * - schedules
 * - results
 * - standings
 * - champions
 * - inbox updates
 * - league rules
 * - registration information
 * - FAQ
 */
const SAMPLE_SEARCH_RESULTS: SearchResult[] = [
  {
    id: "team-tom",
    type: "team",
    title: "Tom",
    subtitle: "Sunday AM • Team",
    description: "Black / White • Captain: Tom",
    primaryColor: "#111111",
    secondaryColor: "#FFFFFF",
    searchTerms: [
      "tom",
      "team tom",
      "captain tom",
      "black",
      "white",
      "black white",
      "dual color",
      "dual jersey",
      "reversible",
      "sunday",
      "sunday am",
      "team",
      "captain",
      "branding",
      "jersey",
    ],
  },
  {
    id: "team-edwards",
    type: "team",
    title: "Edwards",
    subtitle: "Sunday AM • Team",
    description: "Purple • Captain: Edwards",
    primaryColor: "#6F2DBD",
    searchTerms: [
      "edwards",
      "team edwards",
      "captain edwards",
      "purple",
      "sunday",
      "sunday am",
      "team",
      "captain",
      "branding",
      "jersey",
    ],
  },
  {
    id: "team-dale",
    type: "team",
    title: "Dale",
    subtitle: "Sunday AM • Team",
    description: "Dark Blue • Captain: Dale",
    primaryColor: "#173F8A",
    searchTerms: [
      "dale",
      "team dale",
      "captain dale",
      "dark blue",
      "blue",
      "navy",
      "sunday",
      "sunday am",
      "team",
      "captain",
      "branding",
      "jersey",
    ],
  },
  {
    id: "team-ziller",
    type: "team",
    title: "Ziller",
    subtitle: "Sunday AM • Team",
    description: "Red • Captain: Ziller",
    primaryColor: "#D92D20",
    searchTerms: [
      "ziller",
      "team ziller",
      "captain ziller",
      "red",
      "sunday",
      "sunday am",
      "team",
      "captain",
      "branding",
      "jersey",
    ],
  },
  {
    id: "team-prince",
    type: "team",
    title: "Prince",
    subtitle: "Sunday AM • Team",
    description: "Green • Captain: Prince",
    primaryColor: "#2E9B57",
    searchTerms: [
      "prince",
      "team prince",
      "captain prince",
      "green",
      "sunday",
      "sunday am",
      "team",
      "captain",
      "branding",
      "jersey",
    ],
  },
  {
    id: "team-dex",
    type: "team",
    title: "Dex",
    subtitle: "Sunday AM • Team",
    description: "White • Captain: Dex",
    primaryColor: "#FFFFFF",
    searchTerms: [
      "dex",
      "team dex",
      "captain dex",
      "white",
      "sunday",
      "sunday am",
      "team",
      "captain",
      "branding",
      "jersey",
    ],
  },
  {
    id: "team-timmy",
    type: "team",
    title: "Timmy",
    subtitle: "Sunday AM • Team",
    description: "Black • Captain: Timmy",
    primaryColor: "#111111",
    searchTerms: [
      "timmy",
      "team timmy",
      "captain timmy",
      "black",
      "sunday",
      "sunday am",
      "team",
      "captain",
      "branding",
      "jersey",
    ],
  },
  {
    id: "team-teej",
    type: "team",
    title: "TeeJ",
    subtitle: "Sunday AM • Team",
    description: "Yellow • Captain: TeeJ",
    primaryColor: "#F2C94C",
    searchTerms: [
      "teej",
      "tee j",
      "team teej",
      "captain teej",
      "yellow",
      "gold",
      "sunday",
      "sunday am",
      "team",
      "captain",
      "branding",
      "jersey",
    ],
  },
  {
    id: "team-rich",
    type: "team",
    title: "Rich",
    subtitle: "Sunday AM • Team",
    description: "Black / White • Captain: Rich",
    primaryColor: "#111111",
    secondaryColor: "#FFFFFF",
    searchTerms: [
      "rich",
      "team rich",
      "captain rich",
      "black",
      "white",
      "black white",
      "dual color",
      "dual jersey",
      "reversible",
      "sunday",
      "sunday am",
      "team",
      "captain",
      "branding",
      "jersey",
    ],
  },
  {
    id: "player-marcus",
    type: "player",
    title: "Marcus",
    subtitle: "Player • Prince",
    description: "Sunday AM",
    searchTerms: [
      "marcus",
      "player marcus",
      "player",
      "roster",
      "prince",
      "sunday",
      "sunday am",
    ],
  },
  {
    id: "schedule-sunday",
    type: "schedule",
    title: "Sunday AM Schedule",
    subtitle: "Regular Season Schedule",
    description: "Weeks 1–10",
    searchTerms: [
      "schedule",
      "schedules",
      "games",
      "game times",
      "week",
      "regular season",
      "sunday",
      "sunday am",
    ],
  },
  {
    id: "results-week-six",
    type: "result",
    title: "Week 6 Game Results",
    subtitle: "Sunday AM",
    description: "Completed games and final scores",
    searchTerms: [
      "result",
      "results",
      "game result",
      "game results",
      "score",
      "scores",
      "week 6",
      "week six",
      "sunday",
      "sunday am",
    ],
  },
  {
    id: "standings-sunday",
    type: "standings",
    title: "Sunday AM Standings",
    subtitle: "Current Team Records",
    description: "Standings and playoff picture",
    searchTerms: [
      "standings",
      "record",
      "records",
      "playoff",
      "playoffs",
      "playoff picture",
      "seed",
      "seeds",
      "sunday",
      "sunday am",
    ],
  },
  {
    id: "champion-prince",
    type: "champion",
    title: "Prince",
    subtitle: "Spring 2026 Champion",
    description: "Sunday AM",
    searchTerms: [
      "prince",
      "champion",
      "champions",
      "winner",
      "spring 2026",
      "sunday",
      "sunday am",
    ],
  },
  {
    id: "update-week-seven",
    type: "update",
    title: "Week 7 Schedule Posted",
    subtitle: "Schedule Update",
    description: "Sunday AM",
    searchTerms: [
      "week 7",
      "week seven",
      "schedule posted",
      "update",
      "updates",
      "announcement",
      "announcements",
      "sunday",
      "sunday am",
    ],
  },
  {
    id: "rule-forfeit",
    type: "rule",
    title: "Forfeit Notice Policy",
    subtitle: "League Rules",
    description:
      "Captains must provide 24–48 hours notice.",
    searchTerms: [
      "forfeit",
      "forfeits",
      "forfeit notice",
      "24 hours",
      "48 hours",
      "captain",
      "policy",
      "rule",
      "rules",
      "league rules",
    ],
  },
  {
    id: "registration-current",
    type: "registration",
    title: "Registration Information",
    subtitle: "Current Registration Period",
    description:
      "View deadlines, forms, waivers and eligibility.",
    searchTerms: [
      "registration",
      "register",
      "sign up",
      "form",
      "forms",
      "waiver",
      "deadline",
      "eligibility",
    ],
  },
  {
    id: "faq-team-color",
    type: "faq",
    title: "What color jersey should I wear?",
    subtitle: "FAQ",
    description:
      "Search your team or color to view team branding.",
    searchTerms: [
      "what color",
      "team color",
      "jersey",
      "uniform",
      "wear",
      "branding",
      "logo",
      "faq",
      "question",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                                  SCREEN                                    */
/* -------------------------------------------------------------------------- */

export default function SearchScreen() {
  const [searchText, setSearchText] = useState("");

  const normalizedSearch = searchText
    .trim()
    .toLowerCase();

  const filteredResults = useMemo(() => {
    if (!normalizedSearch) {
      return [];
    }

    return SAMPLE_SEARCH_RESULTS.filter((result) => {
      const searchableText = [
        result.title,
        result.subtitle,
        result.description ?? "",
        ...result.searchTerms,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [normalizedSearch]);

  const clearSearch = () => {
    setSearchText("");
  };

  return (
    <ScreenLayout title="Search">
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <SearchPill
          value={searchText}
          onChangeText={setSearchText}
          onClear={clearSearch}
        />

        {normalizedSearch ? (
          <SearchResultsCard
            searchText={searchText}
            results={filteredResults}
          />
        ) : (
          <PopularSearchesCard />
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

/* -------------------------------------------------------------------------- */
/*                                SEARCH PILL                                 */
/* -------------------------------------------------------------------------- */

type SearchPillProps = {
  value: string;
  onChangeText: (value: string) => void;
  onClear: () => void;
};

function SearchPill({
  value,
  onChangeText,
  onClear,
}: SearchPillProps) {
  return (
    <View style={styles.searchPill}>
      <Ionicons
        name="search"
        size={20}
        color={COLORS.purple}
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search teams, players, rules..."
        placeholderTextColor={COLORS.placeholder}
        style={styles.searchInput}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="never"
        accessibilityLabel="Search teams, players, schedules, rules and more"
      />

      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={10}
          onPress={onClear}
          style={({ pressed }) => [
            styles.clearButton,
            pressed
              ? styles.pressed
              : undefined,
          ]}
        >
          <Ionicons
            name="close-circle"
            size={21}
            color={COLORS.secondaryText}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                          POPULAR SEARCHES CARD                              */
/* -------------------------------------------------------------------------- */

function PopularSearchesCard() {
  return (
    <View style={styles.popularCard}>
      <Text style={styles.cardTitle}>
        Popular Searches
      </Text>

      <Text style={styles.cardSubtitle}>
        Enter a name, color, league, topic, or keyword above.
      </Text>

      <View style={styles.popularList}>
        {POPULAR_SEARCHES.map((item) => (
          <View
            key={item.id}
            style={styles.popularRow}
          >
            <Text style={styles.popularEmoji}>
              {item.emoji}
            </Text>

            <Text style={styles.popularLabel}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                              RESULTS CARD                                  */
/* -------------------------------------------------------------------------- */

type SearchResultsCardProps = {
  searchText: string;
  results: SearchResult[];
};

function SearchResultsCard({
  searchText,
  results,
}: SearchResultsCardProps) {
  return (
    <View style={styles.resultsCard}>
      <View style={styles.resultsHeader}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color={COLORS.purple}
        />

        <View style={styles.resultsHeaderText}>
          <Text style={styles.resultsTitle}>
            Search Results
          </Text>

          <Text style={styles.resultsCount}>
            {results.length === 1
              ? "1 result"
              : `${results.length} results`}
          </Text>
        </View>
      </View>

      {results.length > 0 ? (
        <View style={styles.resultsList}>
          {results.map((result, index) => (
            <React.Fragment key={result.id}>
              <SearchResultRow result={result} />

              {index < results.length - 1 ? (
                <View style={styles.divider} />
              ) : null}
            </React.Fragment>
          ))}
        </View>
      ) : (
        <SearchEmptyState searchText={searchText} />
      )}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                               RESULT ROW                                   */
/* -------------------------------------------------------------------------- */

type SearchResultRowProps = {
  result: SearchResult;
};

function SearchResultRow({
  result,
}: SearchResultRowProps) {
  return (
    <View style={styles.resultRow}>
      <SearchResultVisual result={result} />

      <View style={styles.resultTextArea}>
        <Text style={styles.resultTitle}>
          {result.title}
        </Text>

        <Text style={styles.resultSubtitle}>
          {result.subtitle}
        </Text>

        {result.description ? (
          <Text style={styles.resultDescription}>
            {result.description}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                         RESULT ICON / TEAM BRANDING                         */
/* -------------------------------------------------------------------------- */

function SearchResultVisual({
  result,
}: SearchResultRowProps) {
  if (result.type === "team") {
    if (result.logoAvailable) {
      return (
        <View style={styles.standardResultIcon}>
          <FontAwesome6
            name="shield-halved"
            size={21}
            color={COLORS.purple}
          />
        </View>
      );
    }

    return (
      <TeamColorCircle
        primaryColor={
          result.primaryColor ?? COLORS.purple
        }
        secondaryColor={result.secondaryColor}
      />
    );
  }

  return (
    <View style={styles.standardResultIcon}>
      <MaterialCommunityIcons
        name={getResultIcon(result.type)}
        size={22}
        color={COLORS.purple}
      />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                            TEAM COLOR CIRCLE                               */
/* -------------------------------------------------------------------------- */

type TeamColorCircleProps = {
  primaryColor: string;
  secondaryColor?: string;
};

function TeamColorCircle({
  primaryColor,
  secondaryColor,
}: TeamColorCircleProps) {
  const isPrimaryWhite =
    primaryColor.toUpperCase() === "#FFFFFF";

  if (!secondaryColor) {
    return (
      <View
        style={[
          styles.singleColorCircle,
          {
            backgroundColor: primaryColor,
          },
          isPrimaryWhite
            ? styles.whiteCircleBorder
            : undefined,
        ]}
      />
    );
  }

  return (
    <View style={styles.dualColorCircle}>
      <View
        style={[
          styles.dualColorHalf,
          {
            backgroundColor: primaryColor,
          },
        ]}
      />

      <View
        style={[
          styles.dualColorHalf,
          {
            backgroundColor: secondaryColor,
          },
        ]}
      />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                             EMPTY SEARCH STATE                             */
/* -------------------------------------------------------------------------- */

type SearchEmptyStateProps = {
  searchText: string;
};

function SearchEmptyState({
  searchText,
}: SearchEmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons
        name="file-search-outline"
        size={38}
        color={COLORS.purple}
      />

      <Text style={styles.emptyTitle}>
        No Results Found
      </Text>

      <Text style={styles.emptyText}>
        We couldn&apos;t find anything matching{" "}
        <Text style={styles.emptySearchTerm}>
          “{searchText.trim()}”
        </Text>
        .
      </Text>

      <Text style={styles.emptyHint}>
        Try searching for a team, player, color, league,
        schedule, rule, or another keyword.
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                               ICON MAPPING                                 */
/* -------------------------------------------------------------------------- */

function getResultIcon(
  type: SearchResultType,
): React.ComponentProps<
  typeof MaterialCommunityIcons
>["name"] {
  switch (type) {
    case "player":
      return "account-outline";

    case "schedule":
      return "calendar-month-outline";

    case "result":
      return "scoreboard-outline";

    case "standings":
      return "chart-bar";

    case "champion":
      return "trophy-outline";

    case "update":
      return "bullhorn-outline";

    case "rule":
      return "book-open-page-variant-outline";

    case "registration":
      return "clipboard-text-outline";

    case "faq":
      return "help-circle-outline";

    case "team":
    default:
      return "basketball";
  }
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

  /* Search pill */

  searchPill: {
    width: "96%",
    maxWidth: 680,
    height: 48,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: COLORS.white,
    borderRadius: 18,

    paddingHorizontal: 15,

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

  searchInput: {
    flex: 1,
    height: "100%",

    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",

    marginLeft: 10,
    paddingVertical: 0,
  },

  clearButton: {
    width: 30,
    height: 30,

    alignItems: "center",
    justifyContent: "center",

    marginLeft: 5,
  },

  /* Popular searches */

  popularCard: {
    width: "96%",
    maxWidth: 680,

    backgroundColor: COLORS.white,
    borderRadius: 18,

    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 18,

    marginTop: 18,

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

  cardTitle: {
    color: COLORS.purple,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },

  cardSubtitle: {
    color: COLORS.secondaryText,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
    textAlign: "center",

    marginTop: 5,
    marginBottom: 13,
  },

  popularList: {
    width: "100%",
    paddingTop: 2,
  },

  popularRow: {
    minHeight: 43,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 8,
    paddingVertical: 8,
  },

  popularEmoji: {
    width: 34,

    fontSize: 19,
    textAlign: "center",

    marginRight: 11,
  },

  popularLabel: {
    flex: 1,

    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },

  /* Results */

  resultsCard: {
    width: "96%",
    maxWidth: 680,

    backgroundColor: COLORS.white,
    borderRadius: 18,

    paddingTop: 17,
    paddingBottom: 17,
    paddingHorizontal: 16,

    marginTop: 18,

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

  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    marginBottom: 9,
  },

  resultsHeaderText: {
    alignItems: "center",
    marginLeft: 8,
  },

  resultsTitle: {
    color: COLORS.purple,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },

  resultsCount: {
    color: COLORS.secondaryText,
    fontSize: 12,
    fontWeight: "700",

    marginTop: 2,
  },

  resultsList: {
    width: "100%",
  },

  resultRow: {
    minHeight: 76,

    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 12,
    paddingHorizontal: 4,
  },

  standardResultIcon: {
    width: 44,
    height: 44,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.lightPurple,
    borderRadius: 22,

    marginRight: 13,
  },

  resultTextArea: {
    flex: 1,
  },

  resultTitle: {
    color: COLORS.purple,
    fontSize: 15,
    fontWeight: "900",
  },

  resultSubtitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "700",

    marginTop: 3,
  },

  resultDescription: {
    color: COLORS.secondaryText,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 17,

    marginTop: 3,
  },

  divider: {
    width: "100%",
    height: 1,

    backgroundColor: COLORS.divider,
  },

  /* Team branding */

  singleColorCircle: {
    width: 42,
    height: 42,

    borderRadius: 21,
    marginRight: 15,

    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.12)",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,

    elevation: 2,
  },

  whiteCircleBorder: {
    borderWidth: 2,
    borderColor: "#C9C5D0",
  },

  dualColorCircle: {
    width: 42,
    height: 42,

    flexDirection: "row",

    borderRadius: 21,
    overflow: "hidden",

    marginRight: 15,

    borderWidth: 1,
    borderColor: "#C9C5D0",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,

    elevation: 2,
  },

  dualColorHalf: {
    flex: 1,
    height: "100%",
  },

  /* Empty results */

  emptyState: {
    minHeight: 230,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 22,
    paddingVertical: 28,
  },

  emptyTitle: {
    color: COLORS.purple,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",

    marginTop: 12,
  },

  emptyText: {
    color: COLORS.secondaryText,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    textAlign: "center",

    marginTop: 7,
  },

  emptySearchTerm: {
    color: COLORS.text,
    fontWeight: "800",
  },

  emptyHint: {
    color: COLORS.secondaryText,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
    textAlign: "center",

    marginTop: 9,
  },

  pressed: {
    opacity: 0.72,
  },
});