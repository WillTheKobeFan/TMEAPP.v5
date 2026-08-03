// app/(tabs)/league/[leagueSelection]/index.tsx

import Ionicons from "@expo/vector-icons/Ionicons";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import ScreenLayout, {
  OrganizationId,
} from "@/components/layout/ScreenLayout";
import { useLeague } from "@/context/LeagueContext";

const COLORS = {
  purple: "#250F74",
  white: "#FFFFFF",
  text: "#1E1B24",
  muted: "#706B79",
  border: "#E8E4ED",
  lightPurple: "#F4F0FC",
};

type CompatibleLeagueContext = {
  selectedOrganizationId?: string;
  selectedLeagueId?: string;

  setSelectedOrganizationId?: (
    organizationId: OrganizationId,
  ) => void;

  setSelectedLeagueId?: (
    organizationId: OrganizationId,
  ) => void;

  selectLeague?: (
    organizationId: OrganizationId,
  ) => void;
};

type ChampionEntry = {
  id: string;
  leagueName: string;
  winner: string;
};

type OrganizationConfig = {
  id: OrganizationId;
  name: string;
  shortName: string;
  description: string;
  tagline: string;
  logo?: ImageSourcePropType;
  fallbackText: string;
  champions: ChampionEntry[];
};

type NavigationCardProps = {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<
    typeof Ionicons
  >["name"];
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

const ORGANIZATIONS: Record<
  OrganizationId,
  OrganizationConfig
> = {
  tme: {
    id: "tme",
    name: "TME Social Sports",
    shortName: "TME",
    description:
      "Adult recreational sports leagues",
    tagline:
      "Leagues • Training • Camps • Clinics",

    logo: require("../../../assets/logos/tme.png"),

    fallbackText: "TME",

    champions: [
      {
        id: "sunday",
        leagueName: "Sunday • AM",
        winner: "Prince",
      },
      {
        id: "monday",
        leagueName: "Monday • PM",
        winner: "Trifecta",
      },
      {
        id: "wednesday",
        leagueName: "Wednesday • PM",
        winner: "Duffy",
      },
    ],
  },

  pickup: {
    id: "pickup",
    name: "Pickup Basketball USA",
    shortName: "Pickup",
    description:
      "Adult and youth sports programs",
    tagline:
      "Adult • Youth • Camps • Programs",

    logo: require("../../../assets/logos/pickup.png"),

    fallbackText: "Pickup",

    champions: [
      {
        id: "adult-sunday",
        leagueName: "Adult Men • Sunday",
        winner: "Latest Winner",
      },
      {
        id: "high-school",
        leagueName: "Ages 15–18",
        winner: "Latest Winner",
      },
      {
        id: "youth-friday",
        leagueName: "Youth • Friday",
        winner: "Latest Winner",
      },
    ],
  },

  taj: {
    id: "taj",
    name: "Taj Hill Hoops",
    shortName: "THH",
    description:
      "Sports leagues, training and events",
    tagline:
      "Training • Leagues • Events",

    logo: require("../../../assets/logos/taj.png"),

    fallbackText: "THH",

    champions: [
      {
        id: "primary-program",
        leagueName: "Primary Program",
        winner: "Latest Winner",
      },
    ],
  },
};

function isOrganizationId(
  value: unknown,
): value is OrganizationId {
  return (
    value === "tme" ||
    value === "pickup" ||
    value === "taj"
  );
}

export default function LeagueSelectionHomeScreen() {
  const router = useRouter();

  const { leagueSelection } =
    useLocalSearchParams<{
      leagueSelection?: string;
    }>();

  const leagueContext =
    useLeague() as unknown as CompatibleLeagueContext;

  const [
    championsExpanded,
    setChampionsExpanded,
  ] = useState(false);

  const organizationId: OrganizationId =
    isOrganizationId(leagueSelection)
      ? leagueSelection
      : "tme";

  const organization = useMemo(
    () => ORGANIZATIONS[organizationId],
    [organizationId],
  );

  const syncOrganizationContext =
    useCallback(
      (
        nextOrganizationId: OrganizationId,
      ) => {
        /*
         * selectedOrganizationId is preferred.
         * The older methods remain as temporary
         * fallbacks while the context is migrated.
         */
        if (
          leagueContext
            .setSelectedOrganizationId
        ) {
          leagueContext.setSelectedOrganizationId(
            nextOrganizationId,
          );

          return;
        }

        if (leagueContext.selectLeague) {
          leagueContext.selectLeague(
            nextOrganizationId,
          );

          return;
        }

        leagueContext.setSelectedLeagueId?.(
          nextOrganizationId,
        );
      },
      [
        leagueContext
          .setSelectedOrganizationId,
        leagueContext.selectLeague,
        leagueContext.setSelectedLeagueId,
      ],
    );

  useEffect(() => {
    syncOrganizationContext(
      organizationId,
    );
  }, [
    organizationId,
    syncOrganizationContext,
  ]);

  const returnToOrganizationHub = () => {
    router.replace("/");
  };

  const changeOrganization = (
    nextOrganizationId: OrganizationId,
  ) => {
    syncOrganizationContext(
      nextOrganizationId,
    );

    router.replace({
      pathname:
        "/(tabs)/league/[leagueSelection]",

      params: {
        leagueSelection:
          nextOrganizationId,
      },
    });
  };

  const openLeagueDirectory = () => {
    router.push({
      pathname: "/league-info",

      params: {
        organizationId,
      },
    } as never);
  };

  const openRegistrationInfo = () => {
    router.push({
      pathname:
        "/(tabs)/league/[leagueSelection]/registration-info",

      params: {
        leagueSelection:
          organizationId,
      },
    });
  };

  const openLeagueStatus = () => {
    router.push({
      pathname:
        "/(tabs)/league/[leagueSelection]/status",

      params: {
        leagueSelection:
          organizationId,
      },
    });
  };

  const openChampionsHistory = () => {
    router.push({
      pathname: "/(tabs)/champs",

      params: {
        organizationId,
      },
    } as never);
  };

  const openSearch = () => {
    router.push({
      pathname: "/(tabs)/search",

      params: {
        organizationId,
      },
    } as never);
  };

  const toggleChampions = () => {
    setChampionsExpanded(
      (currentValue) => !currentValue,
    );
  };

  return (
    <ScreenLayout
      title={organization.name}
      titleFontSize={22}

      backLabel="Org. Hub"
      backButtonVariant="circle"
      showBackButton
      onBackPress={returnToOrganizationHub}

      showOrganizationSelector
      onOrganizationChange={changeOrganization}

      showSettingsShortcut={false}
      bottomContentPadding={175}
      contentStyle={styles.screenContent}
    >
      <OrganizationHeroCard
        organization={organization}
      />

      <View style={styles.sectionList}>
        <NavigationCard
          title="League Directory"
          subtitle="View leagues, programs, days, locations and competition levels."
          icon="basketball-outline"
          onPress={
            openLeagueDirectory
          }
        />

        <NavigationCard
          title="Registration & League Info"
          subtitle="View registration windows, season dates, locations, formats and requirements."
          icon="document-text-outline"
          onPress={
            openRegistrationInfo
          }
        />

        <NavigationCard
          title="League Status"
          subtitle="View active sessions, current weeks, registration status and important notices."
          icon="stats-chart-outline"
          onPress={openLeagueStatus}
        />

        <ChampionsSummaryCard
          organization={organization}
          expanded={
            championsExpanded
          }
          onToggle={toggleChampions}
          onPressHistory={
            openChampionsHistory
          }
        />
      </View>

      <NavigationCard
        title="Search"
        subtitle="Find teams, players, schedules, results and more."
        icon="search-outline"
        onPress={openSearch}
        style={styles.searchCard}
      />
    </ScreenLayout>
  );
}

function OrganizationHeroCard({
  organization,
}: {
  organization: OrganizationConfig;
}) {
  return (
    <View style={styles.heroCard}>
      <View
        style={
          styles.heroLogoContainer
        }
      >
        {organization.logo ? (
          <Image
            source={organization.logo}
            resizeMode="contain"
            style={styles.heroLogo}
          />
        ) : (
          <View
            style={
              styles.heroFallback
            }
          >
            <Text
              style={
                styles.heroFallbackText
              }
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {
                organization.fallbackText
              }
            </Text>
          </View>
        )}
      </View>

      <View
        style={styles.heroDivider}
      />

      <Text
        style={
          styles.heroOrganizationName
        }
      >
        {organization.name}
      </Text>

      <Text
        style={
          styles.heroDescription
        }
      >
        {organization.description}
      </Text>

      <Text
        style={styles.heroTagline}
      >
        {organization.tagline}
      </Text>
    </View>
  );
}

function NavigationCard({
  title,
  subtitle,
  icon,
  onPress,
  style,
}: NavigationCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={`Opens ${title}`}
      style={({ pressed }) => [
        styles.navigationCard,
        style,
        pressed &&
        styles.cardPressed,
      ]}
    >
      <CardIcon icon={icon} />

      <View
        style={styles.cardTextArea}
      >
        <Text
          style={styles.cardTitle}
        >
          {title}
        </Text>

        <Text
          style={styles.cardSubtitle}
          numberOfLines={2}
        >
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={23}
        color={COLORS.purple}
      />
    </Pressable>
  );
}

function ChampionsSummaryCard({
  organization,
  expanded,
  onToggle,
  onPressHistory,
}: {
  organization: OrganizationConfig;
  expanded: boolean;
  onToggle: () => void;
  onPressHistory: () => void;
}) {
  return (
    <View
      style={styles.championsCard}
    >
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel="Latest Champions"
        accessibilityState={{
          expanded,
        }}
        style={({ pressed }) => [
          styles.championsHeader,
          pressed &&
          styles.cardPressed,
        ]}
      >
        <CardIcon
          icon="trophy-outline"
        />

        <View
          style={styles.cardTextArea}
        >
          <Text
            style={styles.cardTitle}
          >
            Latest Champions
          </Text>

          <Text
            style={styles.cardSubtitle}
            numberOfLines={2}
          >
            Most recent winner from each
            league or program.
          </Text>
        </View>

        <Ionicons
          name={
            expanded
              ? "chevron-up"
              : "chevron-down"
          }
          size={23}
          color={COLORS.purple}
        />
      </Pressable>

      {expanded ? (
        <View
          style={
            styles.championsExpandedContent
          }
        >
          <View
            style={
              styles.championsDivider
            }
          />

          <View
            style={
              styles.championRows
            }
          >
            {organization.champions
              .length > 0 ? (
              organization.champions.map(
                (champion) => (
                  <View
                    key={champion.id}
                    style={
                      styles.championRow
                    }
                  >
                    <Text
                      style={
                        styles.championLeague
                      }
                      numberOfLines={1}
                    >
                      {
                        champion.leagueName
                      }
                    </Text>

                    <Text
                      style={
                        styles.championWinner
                      }
                      numberOfLines={1}
                    >
                      {champion.winner}
                    </Text>
                  </View>
                ),
              )
            ) : (
              <Text
                style={
                  styles.emptyChampionsText
                }
              >
                Champion information will
                appear here when available.
              </Text>
            )}
          </View>

          <Pressable
            onPress={
              onPressHistory
            }
            accessibilityRole="button"
            accessibilityLabel="View Championship History"
            style={({ pressed }) => [
              styles.historyButton,

              pressed &&
              styles.cardPressed,
            ]}
          >
            <Text
              style={
                styles.historyButtonText
              }
            >
              View Championship History
            </Text>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.purple}
            />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function CardIcon({
  icon,
}: {
  icon: React.ComponentProps<
    typeof Ionicons
  >["name"];
}) {
  return (
    <View
      style={
        styles.cardIconContainer
      }
    >
      <Ionicons
        name={icon}
        size={26}
        color={COLORS.purple}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: 18,
  },

  heroCard: {
    width: "100%",

    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 20,

    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 29,

    alignItems: "center",

    backgroundColor: COLORS.white,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 7,
  },

  heroLogoContainer: {
    width: "100%",
    minHeight: 190,

    paddingHorizontal: 10,
    paddingVertical: 10,

    borderRadius: 24,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.white,
  },

  heroLogo: {
    width: "91%",
    height: 185,
  },

  heroFallback: {
    width: "82%",
    height: 170,

    paddingHorizontal: 18,

    borderRadius: 26,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      COLORS.lightPurple,
  },

  heroFallbackText: {
    width: "100%",

    color: COLORS.purple,

    fontSize: 38,
    fontWeight: "900",

    textAlign: "center",
  },

  heroDivider: {
    width: "100%",

    height:
      StyleSheet.hairlineWidth,

    marginTop: 10,
    marginBottom: 15,

    backgroundColor: COLORS.border,
  },

  heroOrganizationName: {
    color: COLORS.purple,

    fontSize: 22,
    fontWeight: "900",

    textAlign: "center",
  },

  heroDescription: {
    marginTop: 5,

    color: COLORS.text,

    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",

    textAlign: "center",
  },

  heroTagline: {
    marginTop: 5,

    color: COLORS.muted,

    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: "600",

    textAlign: "center",
  },

  sectionList: {
    marginTop: 18,
    gap: 13,
  },

  navigationCard: {
    width: "100%",
    minHeight: 96,

    paddingHorizontal: 17,
    paddingVertical: 14,

    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 23,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: COLORS.white,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.09,
    shadowRadius: 9,
    elevation: 5,
  },

  cardIconContainer: {
    width: 51,
    height: 51,

    marginRight: 13,

    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      COLORS.lightPurple,
  },

  cardTextArea: {
    flex: 1,
    paddingRight: 10,
  },

  cardTitle: {
    color: COLORS.purple,

    fontSize: 17,
    fontWeight: "900",
  },

  cardSubtitle: {
    marginTop: 5,

    color: COLORS.muted,

    fontSize: 11.5,
    lineHeight: 17,
    fontWeight: "600",
  },

  championsCard: {
    width: "100%",

    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 23,

    backgroundColor: COLORS.white,

    overflow: "hidden",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.09,
    shadowRadius: 9,
    elevation: 5,
  },

  championsHeader: {
    width: "100%",
    minHeight: 96,

    paddingHorizontal: 17,
    paddingVertical: 14,

    flexDirection: "row",
    alignItems: "center",
  },

  championsExpandedContent: {
    paddingHorizontal: 17,
    paddingBottom: 8,
  },

  championsDivider: {
    width: "100%",

    height:
      StyleSheet.hairlineWidth,

    marginBottom: 7,

    backgroundColor: COLORS.border,
  },

  championRows: {
    width: "100%",
  },

  /*
   * No dots and no dividers between league nights.
   */
  championRow: {
    minHeight: 43,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  championLeague: {
    flex: 1.2,

    paddingRight: 12,

    color: COLORS.muted,

    fontSize: 12.5,
    fontWeight: "700",
  },

  championWinner: {
    flex: 0.8,

    color: COLORS.purple,

    fontSize: 12.5,
    fontWeight: "900",

    textAlign: "right",
  },

  emptyChampionsText: {
    paddingVertical: 14,

    color: COLORS.muted,

    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",

    textAlign: "center",
  },

  historyButton: {
    width: "100%",
    minHeight: 46,

    marginTop: 7,

    borderTopWidth:
      StyleSheet.hairlineWidth,

    borderTopColor: COLORS.border,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  historyButtonText: {
    flex: 1,

    paddingRight: 10,

    color: COLORS.purple,

    fontSize: 12,
    fontWeight: "900",

    textAlign: "left",
  },

  searchCard: {
    marginTop: 13,
  },

  cardPressed: {
    opacity: 0.72,
  },
});