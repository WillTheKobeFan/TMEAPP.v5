// app/league-info/details.tsx

import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Href,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import CustomNavBar from "@/components/CustomNavBar";
import ScreenLayout from "@/components/ScreenLayout";
import { useTextSize } from "@/context/TextSizeContext";
import { leagues } from "../../src/data/leagues/index";

const COLORS = {
  purple: "#250F74",
  lightPurple: "#F6F2FF",
  background: "#F8F7FB",
  white: "#FFFFFF",
  text: "#1E1B24",
  muted: "#66636D",
  border: "#EAE5F2",
  divider: "#F0EDF4",
  overlay: "rgba(20, 13, 37, 0.42)",
};

const MAX_CONTENT_WIDTH = 700;
const SCREEN_PADDING = 16;
const PAGE_PADDING = 8;

type LeagueDetailsPage = {
  key: string;
  leagueName: string;
  gameDay: string;
  gameTime: string;
  competitionLevel: string;
  divisionDescription: string;
  leagueFormat: string[];
  playoffFormat: string[];
  standings: string;
  gameResults: string;
};

type DetailFieldProps = {
  label: string;
  value?: string;
  values?: string[];
  textScale: number;
  isLast?: boolean;
};

function normalizeText(
  value: unknown,
  fallback = "Information coming soon",
): string {
  if (typeof value === "string") {
    const cleaned = value.trim();

    return cleaned || fallback;
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return fallback;
}

function splitLines(value: unknown): string[] {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split("\n")
    .map((line: string) => line.trim())
    .filter(Boolean);
}

function buildLeagueDetailsPage(
  key: string,
  leagueValue: unknown,
): LeagueDetailsPage | null {
  if (
    !leagueValue ||
    typeof leagueValue !== "object"
  ) {
    return null;
  }

  const league = leagueValue as {
    slug?: string;
    info?: {
      leagueName?: unknown;
      seasonStart?: unknown;
      seasonEnd?: unknown;
      gameNight?: unknown;
      gameTime?: unknown;
      totalWeeks?: unknown;
      skillDivision?: unknown;
      skillDescription?: unknown;
      leagueFormat?: unknown;
      playoffFormat?: unknown;
      gameRules?: unknown;
      gameResults?: unknown;
      standingsInfo?: unknown;
    };
  };

  if (!league.info) {
    return null;
  }

  const info = league.info;

  const leagueName = normalizeText(
    info.leagueName,
    key,
  );

  const gameNightParts = splitLines(
    info.gameNight,
  );

  const separateGameTime =
    typeof info.gameTime === "string"
      ? info.gameTime.trim()
      : "";

  const gameDay =
    gameNightParts[0] || leagueName;

  const gameTime =
    separateGameTime ||
    gameNightParts.slice(1).join(" ") ||
    "Time TBD";

  return {
    key,

    leagueName,

    gameDay,

    gameTime,

    competitionLevel: normalizeText(
      info.skillDivision,
    ),

    divisionDescription: normalizeText(
      info.skillDescription,
    ),

    leagueFormat: splitLines(
      info.leagueFormat,
    ),

    playoffFormat: splitLines(
      info.playoffFormat,
    ),

    standings: normalizeText(
      info.standingsInfo,
    ),

    gameResults: normalizeText(
      info.gameResults,
    ),
  };
}

function DetailField({
  label,
  value,
  values,
  textScale,
  isLast = false,
}: DetailFieldProps) {
  const visibleValues =
    values?.filter(
      (item: string) =>
        item.trim().length > 0,
    ) ?? [];

  return (
    <View
      style={[
        styles.detailField,
        isLast && styles.detailFieldLast,
      ]}
    >
      <Text
        style={[
          styles.detailLabel,
          {
            fontSize: 12 * textScale,
          },
        ]}
      >
        {label}
      </Text>

      {visibleValues.length > 0 ? (
        visibleValues.map(
          (
            item: string,
            index: number,
          ) => (
            <View
              key={`${label}-${index}`}
              style={styles.bulletRow}
            >
              <View style={styles.bulletDot} />

              <Text
                style={[
                  styles.detailValue,
                  {
                    fontSize:
                      14 * textScale,
                  },
                ]}
              >
                {item}
              </Text>
            </View>
          ),
        )
      ) : (
        <Text
          style={[
            styles.detailValue,
            {
              fontSize: 14 * textScale,
            },
          ]}
        >
          {value ||
            "Information coming soon"}
        </Text>
      )}
    </View>
  );
}

export default function LeagueDetailsScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    league?: string | string[];
    leagueIds?: string | string[];
  }>();

  const { textScale } = useTextSize();

  const { width: windowWidth } =
    useWindowDimensions();

  const listRef =
    useRef<FlatList<LeagueDetailsPage>>(
      null,
    );

  const pagerWidth = Math.max(
    1,
    Math.min(
      windowWidth -
      SCREEN_PADDING * 2,
      MAX_CONTENT_WIDTH,
    ),
  );

  const pages =
    useMemo<LeagueDetailsPage[]>(() => {
      const safeLeagues =
        leagues ?? {};

      return Object.entries(safeLeagues)
        .map(
          ([key, leagueValue]) =>
            buildLeagueDetailsPage(
              key,
              leagueValue,
            ),
        )
        .filter(
          (
            page:
              | LeagueDetailsPage
              | null,
          ): page is LeagueDetailsPage =>
            page !== null,
        );
    }, []);

  const requestedLeague =
    useMemo<string | undefined>(() => {
      const leagueParam = Array.isArray(
        params.league,
      )
        ? params.league[0]
        : params.league;

      if (leagueParam) {
        return leagueParam;
      }

      const leagueIdsParam =
        Array.isArray(params.leagueIds)
          ? params.leagueIds[0]
          : params.leagueIds;

      if (!leagueIdsParam) {
        return undefined;
      }

      return leagueIdsParam
        .split(",")
        .map((id: string) => id.trim())
        .filter(Boolean)[0];
    }, [
      params.league,
      params.leagueIds,
    ]);

  const initialIndex = useMemo(() => {
    if (!requestedLeague) {
      return 0;
    }

    const requested =
      requestedLeague.toLowerCase();

    const index = pages.findIndex(
      (page: LeagueDetailsPage) =>
        page.key.toLowerCase() ===
        requested ||
        page.leagueName
          .toLowerCase()
          .includes(requested),
    );

    return index >= 0 ? index : 0;
  }, [pages, requestedLeague]);

  const [
    selectedIndex,
    setSelectedIndex,
  ] = useState<number>(initialIndex);

  const [
    selectorOpen,
    setSelectorOpen,
  ] = useState<boolean>(false);

  const selectedPage =
    pages[selectedIndex] ?? null;

  useEffect(() => {
    if (pages.length === 0) {
      return;
    }

    setSelectedIndex(initialIndex);

    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({
        offset:
          initialIndex * pagerWidth,
        animated: false,
      });
    });
  }, [
    initialIndex,
    pagerWidth,
    pages.length,
  ]);

  function scrollToIndex(
    requestedIndex: number,
    animated = true,
  ) {
    if (pages.length === 0) {
      return;
    }

    const nextIndex =
      (requestedIndex +
        pages.length) %
      pages.length;

    setSelectedIndex(nextIndex);

    listRef.current?.scrollToOffset({
      offset: nextIndex * pagerWidth,
      animated,
    });
  }

  function handleSwipeEnd(
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) {
    const nextIndex = Math.round(
      event.nativeEvent.contentOffset.x /
      pagerWidth,
    );

    if (
      nextIndex >= 0 &&
      nextIndex < pages.length
    ) {
      setSelectedIndex(nextIndex);
    }
  }

  function selectLeague(key: string) {
    const nextIndex =
      pages.findIndex(
        (page: LeagueDetailsPage) =>
          page.key === key,
      );

    setSelectorOpen(false);

    if (nextIndex < 0) {
      return;
    }

    requestAnimationFrame(() => {
      scrollToIndex(nextIndex);
    });
  }

  function openLeagueRules() {
    if (!selectedPage) {
      return;
    }

    router.push(
      `/(tabs)/league-rules?league=${encodeURIComponent(
        selectedPage.key,
      )}` as Href,
    );
  }

  function openGameResults() {
    if (!selectedPage) {
      return;
    }

    router.push(
      `/(tabs)/schedule/results?league=${encodeURIComponent(
        selectedPage.key,
      )}` as Href,
    );
  }

  function renderLeaguePage({
    item,
  }: ListRenderItemInfo<LeagueDetailsPage>) {
    return (
      <View
        style={[
          styles.page,
          {
            width: pagerWidth,
          },
        ]}
      >
        <View style={styles.pageInner}>
          <View style={styles.detailsCard}>
            <View
              style={
                styles.detailsHeader
              }
            >
              <View
                style={
                  styles.detailsIcon
                }
              >
                <Ionicons
                  name="information-circle-outline"
                  size={21}
                  color={COLORS.purple}
                />
              </View>

              <View
                style={
                  styles.detailsHeaderText
                }
              >
                <Text
                  style={[
                    styles.detailsTitle,
                    {
                      fontSize:
                        18 * textScale,
                    },
                  ]}
                >
                  {item.leagueName}
                </Text>

                <Text
                  style={[
                    styles.detailsSubtitle,
                    {
                      fontSize:
                        12.5 *
                        textScale,
                    },
                  ]}
                >
                  {item.gameDay} •{" "}
                  {item.gameTime}
                </Text>
              </View>
            </View>

            <DetailField
              label="Competition Level"
              value={
                item.competitionLevel
              }
              textScale={textScale}
            />

            <DetailField
              label="Division Description"
              value={
                item.divisionDescription
              }
              textScale={textScale}
            />

            <DetailField
              label="League Format"
              values={
                item.leagueFormat
              }
              textScale={textScale}
            />

            <DetailField
              label="Playoff Format"
              values={
                item.playoffFormat
              }
              textScale={textScale}
            />

            <DetailField
              label="Standings"
              value={item.standings}
              textScale={textScale}
            />

            <DetailField
              label="Game Results"
              value={item.gameResults}
              textScale={textScale}
              isLast
            />
          </View>
        </View>
      </View>
    );
  }

  if (!selectedPage) {
    return (
      <ScreenLayout
        title="League Information"
        titleFontSize={24}
        titleStyle={{ fontWeight: "800" }}
        showSettingsShortcut={false}
      >
        <View style={styles.screen}>
          <View style={styles.contentArea}>
            <View style={styles.emptyState}>
              <View
                style={styles.emptyIcon}
              >
                <Ionicons
                  name="document-text-outline"
                  size={34}
                  color={COLORS.purple}
                />
              </View>

              <Text
                style={[
                  styles.emptyTitle,
                  {
                    fontSize:
                      18 * textScale,
                  },
                ]}
              >
                No league information
                available
              </Text>

              <Text
                style={[
                  styles.emptyDescription,
                  {
                    fontSize:
                      13 * textScale,
                  },
                ]}
              >
                No valid league entries were
                found in
                src/data/leagues/index.ts.
              </Text>
            </View>
          </View>

          <View style={styles.navSlot}>
            <CustomNavBar />
          </View>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      title="League Information"
      titleFontSize={24}
      titleStyle={{ fontWeight: "800" }}
      showSettingsShortcut={false}
    >
      <View style={styles.screen}>
        {/* Only this middle area scrolls */}
        <View style={styles.contentArea}>
          <ScrollView
            style={styles.verticalScroll}
            showsVerticalScrollIndicator={
              false
            }
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={
              styles.scrollContent
            }
          >
            <View
              style={
                styles.contentContainer
              }
            >
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={`Select league. Currently ${selectedPage.leagueName}`}
                activeOpacity={0.82}
                style={styles.filterPill}
                onPress={() =>
                  setSelectorOpen(true)
                }
              >
                <View
                  style={styles.filterIcon}
                >
                  <Ionicons
                    name="options-outline"
                    size={17}
                    color={COLORS.purple}
                  />
                </View>

                <View
                  style={styles.filterText}
                >
                  <Text
                    style={[
                      styles.filterLabel,
                      {
                        fontSize:
                          9 *
                          textScale,
                      },
                    ]}
                  >
                    LEAGUE
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={[
                      styles.filterValue,
                      {
                        fontSize:
                          13 *
                          textScale,
                      },
                    ]}
                  >
                    {selectedPage.leagueName}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-down"
                  size={18}
                  color={COLORS.purple}
                />
              </TouchableOpacity>

              <View style={styles.infoCard}>
                <View
                  style={styles.infoHeader}
                >
                  <View
                    style={styles.infoIcon}
                  >
                    <Ionicons
                      name="information-circle"
                      size={22}
                      color={COLORS.white}
                    />
                  </View>

                  <Text
                    style={[
                      styles.infoTitle,
                      {
                        fontSize:
                          14 *
                          textScale,
                      },
                    ]}
                  >
                    LEAGUE INFORMATION
                  </Text>
                </View>

                <Text
                  style={[
                    styles.infoDescription,
                    {
                      fontSize:
                        13 * textScale,
                    },
                  ]}
                >
                  Select a league or swipe
                  left and right to view its
                  competition, format,
                  playoff and results
                  information.
                </Text>
              </View>

              <View style={styles.swipeRow}>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Previous league"
                  activeOpacity={0.78}
                  style={styles.swipeArrow}
                  onPress={() =>
                    scrollToIndex(
                      selectedIndex - 1,
                    )
                  }
                >
                  <Ionicons
                    name="chevron-back"
                    size={18}
                    color={COLORS.purple}
                  />
                </TouchableOpacity>

                <View style={styles.swipePill}>
                  <Ionicons
                    name="swap-horizontal"
                    size={16}
                    color={COLORS.purple}
                  />

                  <Text
                    style={[
                      styles.swipeText,
                      {
                        fontSize:
                          11 *
                          textScale,
                      },
                    ]}
                  >
                    Swipe Leagues
                  </Text>
                </View>

                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Next league"
                  activeOpacity={0.78}
                  style={styles.swipeArrow}
                  onPress={() =>
                    scrollToIndex(
                      selectedIndex + 1,
                    )
                  }
                >
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={COLORS.purple}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.pagerViewport,
                  {
                    width: pagerWidth,
                  },
                ]}
              >
                <FlatList
                  ref={listRef}
                  data={pages}
                  horizontal
                  pagingEnabled
                  bounces={false}
                  nestedScrollEnabled
                  decelerationRate="fast"
                  showsHorizontalScrollIndicator={
                    false
                  }
                  keyExtractor={(
                    item: LeagueDetailsPage,
                  ) => item.key}
                  renderItem={
                    renderLeaguePage
                  }
                  onMomentumScrollEnd={
                    handleSwipeEnd
                  }
                  getItemLayout={(
                    _data,
                    index: number,
                  ) => ({
                    length: pagerWidth,
                    offset:
                      pagerWidth *
                      index,
                    index,
                  })}
                  onScrollToIndexFailed={({
                    index,
                  }) => {
                    listRef.current?.scrollToOffset(
                      {
                        offset:
                          index *
                          pagerWidth,
                        animated: false,
                      },
                    );
                  }}
                />
              </View>

              <View style={styles.pagination}>
                {pages.map(
                  (
                    page:
                      LeagueDetailsPage,
                    index: number,
                  ) => (
                    <Pressable
                      key={page.key}
                      accessibilityRole="button"
                      accessibilityLabel={`Open ${page.leagueName}`}
                      onPress={() =>
                        scrollToIndex(
                          index,
                        )
                      }
                      style={[
                        styles.dot,
                        index ===
                        selectedIndex &&
                        styles.activeDot,
                      ]}
                    />
                  ),
                )}
              </View>

              <Text
                style={[
                  styles.pageCount,
                  {
                    fontSize:
                      11 * textScale,
                  },
                ]}
              >
                League {selectedIndex + 1}{" "}
                of {pages.length}
              </Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  activeOpacity={0.82}
                  style={[
                    styles.primaryButton,
                    styles.leftButton,
                  ]}
                  onPress={
                    openLeagueRules
                  }
                >
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color={COLORS.white}
                  />

                  <Text
                    style={[
                      styles.buttonText,
                      {
                        fontSize:
                          13 *
                          textScale,
                      },
                    ]}
                  >
                    League Rules
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.82}
                  style={[
                    styles.primaryButton,
                    styles.rightButton,
                  ]}
                  onPress={
                    openGameResults
                  }
                >
                  <Ionicons
                    name="trophy-outline"
                    size={18}
                    color={COLORS.white}
                  />

                  <Text
                    style={[
                      styles.buttonText,
                      {
                        fontSize:
                          13 *
                          textScale,
                      },
                    ]}
                  >
                    Game Results
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Static bottom navigation */}
        <View style={styles.navSlot}>
          <CustomNavBar />
        </View>

        <Modal
          visible={selectorOpen}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() =>
            setSelectorOpen(false)
          }
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() =>
              setSelectorOpen(false)
            }
          >
            <Pressable
              style={styles.selectorSheet}
              onPress={(event) =>
                event.stopPropagation()
              }
            >
              <View
                style={styles.sheetHandle}
              />

              <View style={styles.sheetHeader}>
                <View
                  style={
                    styles.sheetHeaderText
                  }
                >
                  <Text
                    style={[
                      styles.sheetTitle,
                      {
                        fontSize:
                          18 *
                          textScale,
                      },
                    ]}
                  >
                    Select League
                  </Text>

                  <Text
                    style={[
                      styles.sheetSubtitle,
                      {
                        fontSize:
                          12 *
                          textScale,
                      },
                    ]}
                  >
                    Choose the league
                    information you want to
                    view.
                  </Text>
                </View>

                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Close league selector"
                  activeOpacity={0.78}
                  style={styles.closeButton}
                  onPress={() =>
                    setSelectorOpen(false)
                  }
                >
                  <Ionicons
                    name="close"
                    size={20}
                    color={COLORS.purple}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={
                  false
                }
                keyboardShouldPersistTaps="handled"
              >
                {pages.map(
                  (
                    page:
                      LeagueDetailsPage,
                  ) => {
                    const isSelected =
                      page.key ===
                      selectedPage.key;

                    return (
                      <TouchableOpacity
                        key={page.key}
                        accessibilityRole="radio"
                        accessibilityState={{
                          checked:
                            isSelected,
                        }}
                        activeOpacity={0.8}
                        style={[
                          styles.selectorRow,
                          isSelected &&
                          styles.selectorRowSelected,
                        ]}
                        onPress={() =>
                          selectLeague(
                            page.key,
                          )
                        }
                      >
                        <View
                          style={[
                            styles.selectorIcon,
                            isSelected &&
                            styles.selectorIconSelected,
                          ]}
                        >
                          <Ionicons
                            name="basketball-outline"
                            size={19}
                            color={
                              isSelected
                                ? COLORS.white
                                : COLORS.purple
                            }
                          />
                        </View>

                        <View
                          style={
                            styles.selectorText
                          }
                        >
                          <Text
                            style={[
                              styles.selectorTitle,
                              {
                                fontSize:
                                  14 *
                                  textScale,
                              },
                              isSelected &&
                              styles.selectorTitleSelected,
                            ]}
                          >
                            {page.leagueName}
                          </Text>

                          <Text
                            numberOfLines={1}
                            style={[
                              styles.selectorSubtitle,
                              {
                                fontSize:
                                  12 *
                                  textScale,
                              },
                            ]}
                          >
                            {page.gameDay} •{" "}
                            {page.gameTime}
                          </Text>
                        </View>

                        <Ionicons
                          name={
                            isSelected
                              ? "checkmark-circle"
                              : "chevron-forward"
                          }
                          size={
                            isSelected
                              ? 22
                              : 17
                          }
                          color={
                            isSelected
                              ? COLORS.purple
                              : COLORS.muted
                          }
                        />
                      </TouchableOpacity>
                    );
                  },
                )}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  contentArea: {
    flex: 1,
    overflow: "hidden",
  },

  verticalScroll: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: 18,
    paddingBottom: 24,
  },

  contentContainer: {
    width: "100%",
    maxWidth:
      MAX_CONTENT_WIDTH +
      SCREEN_PADDING * 2,
    alignSelf: "center",
    alignItems: "center",
    paddingHorizontal: SCREEN_PADDING,
  },

  navSlot: {
    flexShrink: 0,
    backgroundColor: COLORS.white,
    zIndex: 20,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 10,
  },

  filterPill: {
    width: "82%",
    maxWidth: 430,
    minHeight: 52,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 14,

    shadowColor: "#1E1048",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 5,
  },

  filterIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      COLORS.lightPurple,
  },

  filterText: {
    flex: 1,
    marginHorizontal: 9,
  },

  filterLabel: {
    color: COLORS.muted,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  filterValue: {
    color: COLORS.text,
    fontWeight: "800",
    marginTop: 1,
  },

  infoCard: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginBottom: 16,

    shadowColor: "#1E1048",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 9,
    elevation: 5,
  },

  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.purple,
  },

  infoTitle: {
    color: COLORS.purple,
    fontWeight: "900",
    letterSpacing: 0.6,
    marginLeft: 10,
  },

  infoDescription: {
    color: COLORS.muted,
    lineHeight: 19,
    marginTop: 11,
  },

  swipeRow: {
    width: "76%",
    maxWidth: 340,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  swipeArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: "#1E1048",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  swipePill: {
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor:
      COLORS.lightPurple,
    paddingHorizontal: 13,
  },

  swipeText: {
    color: COLORS.purple,
    fontWeight: "800",
    marginLeft: 5,
  },

  pagerViewport: {
    maxWidth: MAX_CONTENT_WIDTH,
    overflow: "hidden",
  },

  page: {
    overflow: "hidden",
  },

  pageInner: {
    paddingHorizontal: PAGE_PADDING,
    paddingVertical: 6,
  },

  detailsCard: {
    width: "100%",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingHorizontal: 17,
    paddingVertical: 16,

    shadowColor: "#1E1048",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.14,
    shadowRadius: 11,
    elevation: 7,
  },

  detailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
  },

  detailsIcon: {
    width: 42,
    height: 42,
    marginRight: 12,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      COLORS.lightPurple,
  },

  detailsHeaderText: {
    flex: 1,
  },

  detailsTitle: {
    color: COLORS.purple,
    fontWeight: "900",
  },

  detailsSubtitle: {
    color: COLORS.muted,
    fontWeight: "600",
    marginTop: 3,
  },

  detailField: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    paddingVertical: 12,
  },

  detailFieldLast: {
    borderBottomWidth: 0,
    paddingBottom: 2,
  },

  detailLabel: {
    color: COLORS.muted,
    fontWeight: "700",
    marginBottom: 5,
  },

  detailValue: {
    flex: 1,
    color: COLORS.text,
    fontWeight: "600",
    lineHeight: 20,
  },

  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },

  bulletDot: {
    width: 6,
    height: 6,
    marginTop: 7,
    marginRight: 9,
    borderRadius: 3,
    backgroundColor: COLORS.purple,
  },

  pagination: {
    width: "100%",
    minHeight: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  dot: {
    width: 8,
    height: 8,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: "#D8D2E4",
  },

  activeDot: {
    width: 20,
    backgroundColor: COLORS.purple,
  },

  pageCount: {
    color: COLORS.muted,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 14,
  },

  buttonRow: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    flexDirection: "row",
  },

  primaryButton: {
    flex: 1,
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: COLORS.purple,
    paddingHorizontal: 10,

    shadowColor: "#18074D",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
  },

  leftButton: {
    marginRight: 5,
  },

  rightButton: {
    marginLeft: 5,
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: "800",
    marginLeft: 7,
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      COLORS.lightPurple,
  },

  emptyTitle: {
    color: COLORS.purple,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 14,
  },

  emptyDescription: {
    maxWidth: 310,
    color: COLORS.muted,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 7,
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: COLORS.overlay,
  },

  selectorSheet: {
    width: "100%",
    maxHeight: "76%",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 28,
  },

  sheetHandle: {
    width: 42,
    height: 5,
    borderRadius: 3,
    alignSelf: "center",
    backgroundColor: "#D7D1E1",
    marginBottom: 14,
  },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sheetHeaderText: {
    flex: 1,
    paddingRight: 12,
  },

  sheetTitle: {
    color: COLORS.purple,
    fontWeight: "900",
  },

  sheetSubtitle: {
    color: COLORS.muted,
    lineHeight: 17,
    marginTop: 3,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      COLORS.lightPurple,
  },

  selectorRow: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 10,
  },

  selectorRowSelected: {
    borderColor: "#CFC1F3",
    backgroundColor: "#FBF9FF",

    shadowColor: "#1E1048",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },

  selectorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      COLORS.lightPurple,
  },

  selectorIconSelected: {
    backgroundColor: COLORS.purple,
  },

  selectorText: {
    flex: 1,
    marginHorizontal: 11,
  },

  selectorTitle: {
    color: COLORS.text,
    fontWeight: "800",
  },

  selectorTitleSelected: {
    color: COLORS.purple,
  },

  selectorSubtitle: {
    color: COLORS.muted,
    marginTop: 2,
  },
});