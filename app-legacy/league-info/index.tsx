// app/league-info/index.tsx

import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
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
import Ionicons from "@expo/vector-icons/Ionicons";
import { Href, useRouter } from "expo-router";

import ScreenLayout from "../../src/components/ScreenLayout";
import CustomNavBar from "../../src/components/CustomNavBar";
import * as LeagueRegistryModule from "../../src/data/leagues/index";
import type { LeagueKey, LeagueRegistry } from "../../src/types/leagues";
import { useTextSize } from "../../src/context/TextSizeContext";

const PURPLE = "#250F74";
const LIGHT_PURPLE = "#F6F2FF";
const WHITE = "#FFFFFF";
const TEXT = "#1E1B24";
const MUTED = "#66636D";
const BORDER = "#EAE5F2";
const SUCCESS = "#138A4B";
const DANGER = "#B42318";
const MAX_WIDTH = 700;
const SCREEN_PADDING = 16;
const PAGE_GUTTER = 10;

type League = NonNullable<LeagueRegistry[LeagueKey]>;
type LeaguePage = {
  key: LeagueKey;
  league: League;
  leagueName: string;
  gameDay: string;
  gameTime: string;
  season: string;
  competitionLevel: string;
  sessionFormat: string[];
  playoffFormat: string[];
};

const leagueRegistry: Partial<LeagueRegistry> =
  (LeagueRegistryModule as { leagues?: Partial<LeagueRegistry> }).leagues ?? {};

function splitLines(value: string): string[] {
  return value.split("\n").map((part: string) => part.trim()).filter(Boolean);
}

function buildPage(key: LeagueKey, league: League): LeaguePage {
  const gameNight = splitLines(league.info.gameNight);
  return {
    key,
    league,
    leagueName: league.info.leagueName,
    gameDay: gameNight[0] ?? league.info.leagueName,
    gameTime: gameNight.slice(1).join(" ") || "Time TBD",
    season: `${league.info.seasonStart}–${league.info.seasonEnd}`,
    competitionLevel: league.info.skillDivision,
    sessionFormat: splitLines(league.info.totalWeeks),
    playoffFormat: splitLines(league.info.playoffFormat),
  };
}

function getStatus(league: League): "ACTIVE" | "INACTIVE" {
  return (league as League & { active?: boolean }).active === false ? "INACTIVE" : "ACTIVE";
}

export default function LeagueDirectoryScreen() {
  const router = useRouter();
  const { textScale } = useTextSize();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<LeaguePage>>(null);
  const pagerWidth = Math.max(1, Math.min(width - SCREEN_PADDING * 2, MAX_WIDTH));

  const pages = useMemo<LeaguePage[]>(() => {
    const result: LeaguePage[] = [];
    (Object.keys(leagueRegistry) as LeagueKey[]).forEach((key) => {
      const league = leagueRegistry[key];
      if (league) result.push(buildPage(key, league));
    });
    return result;
  }, []);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const selected = pages[selectedIndex] ?? null;

  const scrollToIndex = (nextIndex: number, animated = true) => {
    if (!pages.length) return;
    const index = (nextIndex + pages.length) % pages.length;
    setSelectedIndex(index);
    listRef.current?.scrollToOffset({ offset: index * pagerWidth, animated });
  };

  const handleSwipeEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / pagerWidth);
    if (index >= 0 && index < pages.length) setSelectedIndex(index);
  };

  const selectLeague = (key: LeagueKey) => {
    const index = pages.findIndex((page) => page.key === key);
    setSelectorOpen(false);
    if (index >= 0) requestAnimationFrame(() => scrollToIndex(index));
  };

  if (!selected) {
    return (
      <ScreenLayout title="League Directory">
        <View style={styles.screen}>
          <View style={styles.emptyState}>
            <Ionicons name="basketball-outline" size={36} color={PURPLE} />
            <Text style={[styles.emptyTitle, { fontSize: 18 * textScale }]}>No leagues available</Text>
          </View>
          <View style={styles.navSlot}><CustomNavBar /></View>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title="League Directory">
      <View style={styles.screen}>
        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false} nestedScrollEnabled contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            <TouchableOpacity style={styles.filterPill} activeOpacity={0.82} onPress={() => setSelectorOpen(true)}>
              <View style={styles.filterIcon}><Ionicons name="options-outline" size={17} color={PURPLE} /></View>
              <View style={styles.filterText}>
                <Text style={[styles.filterLabel, { fontSize: 9 * textScale }]}>LEAGUE</Text>
                <Text numberOfLines={1} style={[styles.filterValue, { fontSize: 13 * textScale }]}>{selected.gameDay} • {selected.gameTime}</Text>
              </View>
              <Ionicons name="chevron-down" size={18} color={PURPLE} />
            </TouchableOpacity>

            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <View style={styles.infoIcon}><Ionicons name="information-circle" size={22} color={WHITE} /></View>
                <Text style={[styles.infoTitle, { fontSize: 14 * textScale }]}>LEAGUE DIRECTORY</Text>
              </View>
              <Text style={[styles.infoDescription, { fontSize: 13 * textScale }]}>Filter a league, then swipe left or right to view its information.</Text>
            </View>

            <View style={styles.swipeRow}>
              <TouchableOpacity style={styles.swipeArrow} onPress={() => scrollToIndex(selectedIndex - 1)}><Ionicons name="chevron-back" size={18} color={PURPLE} /></TouchableOpacity>
              <View style={styles.swipePill}><Ionicons name="swap-horizontal" size={16} color={PURPLE} /><Text style={[styles.swipeText, { fontSize: 11 * textScale }]}>Swipe League</Text></View>
              <TouchableOpacity style={styles.swipeArrow} onPress={() => scrollToIndex(selectedIndex + 1)}><Ionicons name="chevron-forward" size={18} color={PURPLE} /></TouchableOpacity>
            </View>

            <View style={[styles.pagerViewport, { width: pagerWidth }]}>
              <FlatList
                ref={listRef}
                data={pages}
                horizontal
                pagingEnabled
                bounces={false}
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                keyExtractor={(item) => item.key}
                onMomentumScrollEnd={handleSwipeEnd}
                getItemLayout={(_data, index) => ({ length: pagerWidth, offset: pagerWidth * index, index })}
                renderItem={({ item }) => {
                  const status = getStatus(item.league);
                  return (
                    <View style={[styles.page, { width: pagerWidth }]}>
                      <View style={styles.pageInner}>
                        <View style={styles.overviewCard}>
                          <View style={styles.cardTitleRow}>
                            <Text style={[styles.cardTitle, { fontSize: 18 * textScale }]}>{item.leagueName}</Text>
                            <View style={[styles.statusPill, status === "INACTIVE" && styles.statusPillInactive]}>
                              <Text style={[styles.statusText, status === "INACTIVE" && styles.statusTextInactive, { fontSize: 10 * textScale }]}>{status}</Text>
                            </View>
                          </View>
                          <InfoField label="Game Day & Time" value={`${item.gameDay} • ${item.gameTime}`} textScale={textScale} />
                          <InfoField label="Competition Level" value={item.competitionLevel} textScale={textScale} />
                          <InfoField label="Season" value={item.season} textScale={textScale} />
                          <InfoField label="Session Format" value={item.sessionFormat.join(" • ")} textScale={textScale} />
                          <InfoField label="Playoff Format" value={item.playoffFormat.join(" • ")} textScale={textScale} isLast />
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            </View>

            <View style={styles.pagination}>
              {pages.map((page, index) => <Pressable key={page.key} onPress={() => scrollToIndex(index)} style={[styles.dot, index === selectedIndex && styles.activeDot]} />)}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.primaryButton, styles.leftButton]} onPress={() => router.push(`/registration?league=${selected.key}` as Href)}>
                <Ionicons name="clipboard-outline" size={18} color={WHITE} />
                <Text style={[styles.buttonText, { fontSize: 13 * textScale }]}>Registration</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryButton, styles.rightButton]} onPress={() => router.push(`/league-info/details?league=${selected.key}` as Href)}>
                <Ionicons name="list-outline" size={18} color={WHITE} />
                <Text style={[styles.buttonText, { fontSize: 13 * textScale }]}>League Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View style={styles.navSlot}><CustomNavBar /></View>

        <Modal visible={selectorOpen} transparent animationType="fade" onRequestClose={() => setSelectorOpen(false)}>
          <Pressable style={styles.modalBackdrop} onPress={() => setSelectorOpen(false)}>
            <Pressable style={styles.selectorSheet} onPress={(event) => event.stopPropagation()}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <View style={styles.sheetHeaderText}>
                  <Text style={[styles.sheetTitle, { fontSize: 18 * textScale }]}>Select League</Text>
                  <Text style={[styles.sheetSubtitle, { fontSize: 12 * textScale }]}>Choose where to begin browsing.</Text>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectorOpen(false)}><Ionicons name="close" size={20} color={PURPLE} /></TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                {pages.map((page) => {
                  const isSelected = page.key === selected.key;
                  return (
                    <TouchableOpacity key={page.key} style={[styles.selectorRow, isSelected && styles.selectorRowSelected]} onPress={() => selectLeague(page.key)}>
                      <View style={[styles.selectorIcon, isSelected && styles.selectorIconSelected]}><Ionicons name="basketball" size={19} color={isSelected ? WHITE : PURPLE} /></View>
                      <View style={styles.selectorText}><Text style={[styles.selectorTitle, { fontSize: 14 * textScale }]}>{page.leagueName}</Text><Text numberOfLines={1} style={[styles.selectorSubtitle, { fontSize: 12 * textScale }]}>{page.gameDay} • {page.gameTime}</Text></View>
                      <Ionicons name={isSelected ? "checkmark-circle" : "chevron-forward"} size={isSelected ? 22 : 17} color={isSelected ? PURPLE : MUTED} />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </ScreenLayout>
  );
}

function InfoField({ label, value, textScale, isLast = false }: { label: string; value: string; textScale: number; isLast?: boolean }) {
  return (
    <View style={[styles.infoField, isLast && styles.infoFieldLast]}>
      <Text style={[styles.fieldLabel, { fontSize: 12 * textScale }]}>{label}</Text>
      <Text style={[styles.fieldValue, { fontSize: 14 * textScale }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 }, scrollArea: { flex: 1 }, scrollContent: { paddingTop: 18, paddingBottom: 26 }, navSlot: { flexShrink: 0 },
  container: { width: "100%", alignItems: "center", paddingHorizontal: SCREEN_PADDING },
  filterPill: { width: "82%", maxWidth: 430, minHeight: 52, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", borderRadius: 999, borderWidth: 1, borderColor: BORDER, backgroundColor: WHITE, paddingHorizontal: 10, paddingVertical: 7, marginBottom: 14, shadowColor: "#1E1048", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.13, shadowRadius: 8, elevation: 5 },
  filterIcon: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: LIGHT_PURPLE }, filterText: { flex: 1, marginHorizontal: 9 }, filterLabel: { color: MUTED, fontWeight: "800", letterSpacing: 0.8 }, filterValue: { color: TEXT, fontWeight: "800", marginTop: 1 },
  infoCard: { width: "100%", maxWidth: MAX_WIDTH, borderRadius: 20, borderWidth: 1, borderColor: BORDER, backgroundColor: WHITE, paddingHorizontal: 16, paddingVertical: 15, marginBottom: 16, shadowColor: "#1E1048", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 9, elevation: 5 }, infoHeader: { flexDirection: "row", alignItems: "center" }, infoIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: PURPLE }, infoTitle: { color: PURPLE, fontWeight: "900", letterSpacing: 0.6, marginLeft: 10 }, infoDescription: { color: MUTED, lineHeight: 19, marginTop: 11 },
  swipeRow: { width: "76%", maxWidth: 340, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 13 }, swipeArrow: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: WHITE, borderWidth: 1, borderColor: BORDER, shadowColor: "#1E1048", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 }, swipePill: { minHeight: 32, flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 999, backgroundColor: LIGHT_PURPLE, paddingHorizontal: 13 }, swipeText: { color: PURPLE, fontWeight: "800", marginLeft: 5 },
  pagerViewport: { maxWidth: MAX_WIDTH, overflow: "hidden" }, page: { overflow: "hidden" }, pageInner: { paddingHorizontal: PAGE_GUTTER, paddingVertical: 6 }, overviewCard: { width: "100%", borderRadius: 22, borderWidth: 1, borderColor: BORDER, backgroundColor: WHITE, paddingHorizontal: 17, paddingVertical: 16, shadowColor: "#1E1048", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.16, shadowRadius: 12, elevation: 7 }, cardTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }, cardTitle: { flex: 1, color: PURPLE, fontWeight: "900", paddingRight: 12 }, statusPill: { borderRadius: 999, backgroundColor: "#E9F8EF", paddingHorizontal: 10, paddingVertical: 6 }, statusPillInactive: { backgroundColor: "#FDECEC" }, statusText: { color: SUCCESS, fontWeight: "900", letterSpacing: 0.5 }, statusTextInactive: { color: DANGER },
  infoField: { borderBottomWidth: 1, borderBottomColor: "#F0EDF4", paddingVertical: 12 }, infoFieldLast: { borderBottomWidth: 0, paddingBottom: 2 }, fieldLabel: { color: MUTED, fontWeight: "700", marginBottom: 4 }, fieldValue: { color: TEXT, fontWeight: "700", lineHeight: 20 },
  pagination: { width: "100%", minHeight: 32, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 12, marginBottom: 14 }, dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#D8D2E4", marginHorizontal: 4 }, activeDot: { width: 20, backgroundColor: PURPLE }, buttonRow: { width: "100%", maxWidth: MAX_WIDTH, flexDirection: "row" }, primaryButton: { flex: 1, minHeight: 50, flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: PURPLE, paddingHorizontal: 10, shadowColor: "#18074D", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 7, elevation: 5 }, leftButton: { marginRight: 5 }, rightButton: { marginLeft: 5 }, buttonText: { color: WHITE, fontWeight: "800", marginLeft: 7 },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 }, emptyTitle: { color: PURPLE, fontWeight: "900", marginTop: 12 },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(20, 13, 37, 0.42)" }, selectorSheet: { width: "100%", maxHeight: "76%", borderTopLeftRadius: 26, borderTopRightRadius: 26, backgroundColor: WHITE, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 28 }, sheetHandle: { width: 42, height: 5, borderRadius: 3, alignSelf: "center", backgroundColor: "#D7D1E1", marginBottom: 14 }, sheetHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }, sheetHeaderText: { flex: 1, paddingRight: 12 }, sheetTitle: { color: PURPLE, fontWeight: "900" }, sheetSubtitle: { color: MUTED, marginTop: 2 }, closeButton: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: LIGHT_PURPLE }, selectorRow: { minHeight: 68, flexDirection: "row", alignItems: "center", borderRadius: 17, borderWidth: 1, borderColor: BORDER, backgroundColor: WHITE, paddingHorizontal: 12, paddingVertical: 9, marginBottom: 10 }, selectorRowSelected: { borderColor: "#CFC1F3", shadowColor: "#1E1048", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 8, elevation: 5 }, selectorIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: LIGHT_PURPLE }, selectorIconSelected: { backgroundColor: PURPLE }, selectorText: { flex: 1, marginHorizontal: 11 }, selectorTitle: { color: TEXT, fontWeight: "800" }, selectorSubtitle: { color: MUTED, marginTop: 2 },
});