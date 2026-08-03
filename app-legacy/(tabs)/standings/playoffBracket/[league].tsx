import React, { useMemo } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  router,
  useLocalSearchParams,
} from "expo-router";

import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";

import ScreenLayout from "src/components/ScreenLayout";

const SCREEN_WIDTH = Dimensions.get("window").width;

const COLORS = {
  background: "#F7F5FC",
  card: "#FFFFFF",

  purple: "#250F74",
  purpleSoft: "#EEEAFB",

  text: "#17151F",
  mutedText: "#75717F",

  losingText: "#A7A4AD",
  losingBrand: "#C9C7CE",

  divider: "#E8E5EE",
  connector: "#C7C2D6",

  gold: "#D5A826",
  goldDark: "#8A6810",
  goldSoft: "#FFFDF5",
  goldDivider: "#E6D69B",

  liveBackground: "#FDE8E8",
  liveText: "#C63030",
};

type GameStatus =
  | "scheduled"
  | "live"
  | "final";

type TeamBranding = {
  logoUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
};

type BracketTeam = {
  id?: string;
  seed?: number | null;
  name: string;
  score?: number | null;
  branding?: TeamBranding;
};

type BracketGame = {
  id: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  status: GameStatus;
  homeTeam: BracketTeam;
  awayTeam: BracketTeam;
};

type BracketRound = {
  id:
    | "quarterfinals"
    | "semifinals"
    | "championship";
  title: string;
  subtitle: string;
  games: BracketGame[];
};

type NavigationButtonProps = {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
};

const CARD_WIDTH = Math.min(
  SCREEN_WIDTH - 88,
  286,
);

const GAME_CARD_HEIGHT = 156;
const ROUND_HEADER_HEIGHT = 54;
const CONNECTOR_WIDTH = 58;

const QUARTERFINAL_GAME_GAP = 18;

const SEMIFINAL_GAME_GAP =
  GAME_CARD_HEIGHT +
  QUARTERFINAL_GAME_GAP;

const QUARTERFINAL_COLUMN_HEIGHT =
  GAME_CARD_HEIGHT * 4 +
  QUARTERFINAL_GAME_GAP * 3;

const SEMIFINAL_TOP_OFFSET =
  (GAME_CARD_HEIGHT +
    QUARTERFINAL_GAME_GAP) /
  2;

const CHAMPIONSHIP_TOP_OFFSET =
  SEMIFINAL_TOP_OFFSET +
  (GAME_CARD_HEIGHT +
    SEMIFINAL_GAME_GAP) /
    2;

const BRACKET_BODY_HEIGHT =
  QUARTERFINAL_COLUMN_HEIGHT;

/**
 * Temporary bracket data.
 *
 * This can later be replaced by Firestore data
 * based on organization, league and season IDs.
 */
const bracketRounds: BracketRound[] = [
  {
    id: "quarterfinals",
    title: "Quarterfinals",
    subtitle: "Top 8",
    games: [
      {
        id: "qf-1",
        dateLabel: "July 20",
        timeLabel: "7:00 PM",
        location: "Berlin Borough Gym",
        status: "final",
        homeTeam: {
          id: "team-prince",
          seed: 1,
          name: "Prince",
          score: 82,
          branding: {
            primaryColor: "#111111",
            secondaryColor: "#FFFFFF",
          },
        },
        awayTeam: {
          id: "team-rob",
          seed: 8,
          name: "Rob",
          score: 65,
          branding: {
            primaryColor: "#16894B",
          },
        },
      },
      {
        id: "qf-2",
        dateLabel: "July 20",
        timeLabel: "8:00 PM",
        location: "Berlin Borough Gym",
        status: "final",
        homeTeam: {
          id: "team-neil",
          seed: 4,
          name: "Neil",
          score: 77,
          branding: {
            primaryColor: "#244A91",
          },
        },
        awayTeam: {
          id: "team-tom",
          seed: 5,
          name: "Tom",
          score: 74,
          branding: {
            primaryColor: "#FFFFFF",
            secondaryColor: "#C83535",
          },
        },
      },
      {
        id: "qf-3",
        dateLabel: "July 20",
        timeLabel: "9:00 PM",
        location: "Berlin Borough Gym",
        status: "final",
        homeTeam: {
          id: "team-duffy",
          seed: 2,
          name: "Duffy",
          score: 80,
          branding: {
            primaryColor: "#D7AC25",
          },
        },
        awayTeam: {
          id: "team-mark",
          seed: 7,
          name: "Mark",
          score: 71,
          branding: {
            primaryColor: "#7B2CBF",
          },
        },
      },
      {
        id: "qf-4",
        dateLabel: "July 20",
        timeLabel: "10:00 PM",
        location: "Berlin Borough Gym",
        status: "final",
        homeTeam: {
          id: "team-gross",
          seed: 3,
          name: "Gross",
          score: 75,
          branding: {
            primaryColor: "#C92F36",
          },
        },
        awayTeam: {
          id: "team-gervese",
          seed: 6,
          name: "Gervese",
          score: 69,
          branding: {
            primaryColor: "#F1F1F1",
            secondaryColor: "#111111",
          },
        },
      },
    ],
  },

  {
    id: "semifinals",
    title: "Semifinals",
    subtitle: "Final 4",
    games: [
      {
        id: "sf-1",
        dateLabel: "July 27",
        timeLabel: "7:00 PM",
        location: "Berlin Borough Gym",
        status: "final",
        homeTeam: {
          id: "team-prince",
          seed: 1,
          name: "Prince",
          score: 88,
          branding: {
            primaryColor: "#111111",
            secondaryColor: "#FFFFFF",
          },
        },
        awayTeam: {
          id: "team-neil",
          seed: 4,
          name: "Neil",
          score: 79,
          branding: {
            primaryColor: "#244A91",
          },
        },
      },
      {
        id: "sf-2",
        dateLabel: "July 27",
        timeLabel: "8:00 PM",
        location: "Berlin Borough Gym",
        status: "final",
        homeTeam: {
          id: "team-duffy",
          seed: 2,
          name: "Duffy",
          score: 84,
          branding: {
            primaryColor: "#D7AC25",
          },
        },
        awayTeam: {
          id: "team-gross",
          seed: 3,
          name: "Gross",
          score: 78,
          branding: {
            primaryColor: "#C92F36",
          },
        },
      },
    ],
  },

  {
    id: "championship",
    title: "Championship",
    subtitle: "Final",
    games: [
      {
        id: "championship-1",
        dateLabel: "August 3",
        timeLabel: "8:00 PM",
        location: "Berlin Borough Gym",
        status: "final",
        homeTeam: {
          id: "team-prince",
          seed: 1,
          name: "Prince",
          score: 91,
          branding: {
            primaryColor: "#111111",
            secondaryColor: "#FFFFFF",
          },
        },
        awayTeam: {
          id: "team-duffy",
          seed: 2,
          name: "Duffy",
          score: 86,
          branding: {
            primaryColor: "#D7AC25",
          },
        },
      },
    ],
  },
];

function normalizeParam(
  value?: string | string[],
): string | undefined {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value[0];
  }

  return undefined;
}

function normalizeLeagueKey(
  value?: string,
): string {
  if (!value) {
    return "sunday";
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace("standings", "")
    .replace("seasonpicture", "")
    .replace("season-picture", "")
    .replace("playoffbracket", "")
    .replace("playoff-bracket", "")
    .replace(/\//g, "")
    .trim();

  return normalized || "sunday";
}

function getWinner(
  game: BracketGame,
): BracketTeam | null {
  if (
    game.status !== "final" ||
    game.homeTeam.score == null ||
    game.awayTeam.score == null
  ) {
    return null;
  }

  if (
    game.homeTeam.score >
    game.awayTeam.score
  ) {
    return game.homeTeam;
  }

  if (
    game.awayTeam.score >
    game.homeTeam.score
  ) {
    return game.awayTeam;
  }

  return null;
}

function isSameTeam(
  firstTeam: BracketTeam,
  secondTeam: BracketTeam,
): boolean {
  if (
    firstTeam.id &&
    secondTeam.id
  ) {
    return firstTeam.id === secondTeam.id;
  }

  return (
    firstTeam.name ===
    secondTeam.name
  );
}

function getIsLosingTeam(
  game: BracketGame,
  team: BracketTeam,
): boolean {
  if (
    game.status !== "final" ||
    game.homeTeam.score == null ||
    game.awayTeam.score == null ||
    game.homeTeam.score ===
      game.awayTeam.score
  ) {
    return false;
  }

  const winner = getWinner(game);

  if (!winner) {
    return false;
  }

  return !isSameTeam(
    winner,
    team,
  );
}

function TeamBrandingIcon({
  branding,
  size = 18,
  muted = false,
}: {
  branding?: TeamBranding;
  size?: number;
  muted?: boolean;
}) {
  const circleDimensions = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (muted) {
    return (
      <View
        style={[
          styles.brandingCircle,
          circleDimensions,
          styles.mutedBrandingCircle,
        ]}
      />
    );
  }

  const primaryColor =
    branding?.primaryColor;

  const secondaryColor =
    branding?.secondaryColor;

  if (!primaryColor) {
    return (
      <View
        style={[
          styles.brandingCircle,
          circleDimensions,
          styles.brandingPlaceholder,
        ]}
      >
        <View
          style={styles.placeholderDot}
        />
      </View>
    );
  }

  if (secondaryColor) {
    return (
      <View
        style={[
          styles.brandingCircle,
          circleDimensions,
        ]}
      >
        <View
          style={[
            styles.brandingHalf,
            styles.brandingLeftHalf,
            {
              backgroundColor:
                primaryColor,
            },
          ]}
        />

        <View
          style={[
            styles.brandingHalf,
            styles.brandingRightHalf,
            {
              backgroundColor:
                secondaryColor,
            },
          ]}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.brandingCircle,
        circleDimensions,
        {
          backgroundColor:
            primaryColor,
        },
      ]}
    />
  );
}

function StatusPill({
  status,
}: {
  status: GameStatus;
}) {
  const label =
    status === "final"
      ? "Final"
      : status === "live"
        ? "Live"
        : "Scheduled";

  return (
    <View
      style={[
        styles.statusPill,
        status === "live" &&
          styles.liveStatusPill,
      ]}
    >
      <Text
        style={[
          styles.statusPillText,
          status === "live" &&
            styles.liveStatusPillText,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function TeamRow({
  team,
  game,
}: {
  team: BracketTeam;
  game: BracketGame;
}) {
  const winner = getWinner(game);

  const isWinner =
    winner != null &&
    isSameTeam(
      winner,
      team,
    );

  const isLoser =
    getIsLosingTeam(
      game,
      team,
    );

  const showScore =
    game.status === "final" ||
    game.status === "live";

  return (
    <View style={styles.teamRow}>
      <View style={styles.teamIdentity}>
        <View
          style={styles.seedContainer}
        >
          <Text
            style={[
              styles.seedText,
              isWinner &&
                styles.winnerText,
              isLoser &&
                styles.loserText,
            ]}
          >
            {team.seed != null
              ? `#${team.seed}`
              : "—"}
          </Text>
        </View>

        <TeamBrandingIcon
          branding={team.branding}
          muted={isLoser}
        />

        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[
            styles.teamName,
            isWinner &&
              styles.winnerText,
            isLoser &&
              styles.loserText,
            !team.id &&
              styles.pendingTeamName,
          ]}
        >
          {team.name}
        </Text>
      </View>

      {showScore &&
      team.score != null ? (
        <Text
          style={[
            styles.teamScore,
            isWinner &&
              styles.winnerText,
            isLoser &&
              styles.loserText,
          ]}
        >
          {team.score}
        </Text>
      ) : null}
    </View>
  );
}

function GameCard({
  game,
}: {
  game: BracketGame;
}) {
  return (
    <View style={styles.gameCard}>
      <View
        style={styles.gameCardHeader}
      >
        <View
          style={styles.dateTimeRow}
        >
          <Text style={styles.dateText}>
            {game.dateLabel}
          </Text>

          <Text
            style={
              styles.dateTimeSeparator
            }
          >
            •
          </Text>

          <Text style={styles.timeText}>
            {game.timeLabel}
          </Text>
        </View>

        <StatusPill
          status={game.status}
        />
      </View>

      <View style={styles.topDivider} />

      <View style={styles.teamsSection}>
        <TeamRow
          team={game.homeTeam}
          game={game}
        />

        <TeamRow
          team={game.awayTeam}
          game={game}
        />
      </View>

      <View
        style={styles.bottomDivider}
      />

      <View
        style={styles.locationFooter}
      >
        <Text
          style={styles.locationEmoji}
        >
          📍
        </Text>

        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.locationText}
        >
          {game.location}
        </Text>
      </View>
    </View>
  );
}

function RoundHeader({
  title,
  subtitle,
  gold = false,
}: {
  title: string;
  subtitle: string;
  gold?: boolean;
}) {
  return (
    <View
      style={[
        styles.roundHeaderCard,
        gold &&
          styles.goldRoundHeaderCard,
      ]}
    >
      <Text
        style={[
          styles.roundTitle,
          gold &&
            styles.goldRoundTitle,
        ]}
      >
        {title}
      </Text>

      <Text
        style={styles.roundSubtitle}
      >
        {subtitle}
      </Text>
    </View>
  );
}

function ConnectorGroup({
  centerY,
  branchHeight,
}: {
  centerY: number;
  branchHeight: number;
}) {
  const top =
    centerY -
    branchHeight / 2;

  return (
    <View
      style={[
        styles.connectorGroup,
        {
          top,
          height: branchHeight,
        },
      ]}
    >
      <View
        style={
          styles.connectorInputTop
        }
      />

      <View
        style={
          styles.connectorInputBottom
        }
      />

      <View
        style={
          styles.connectorVertical
        }
      />

      <View
        style={
          styles.connectorOutput
        }
      />
    </View>
  );
}

function BracketConnector({
  type,
}: {
  type:
    | "quarterfinals"
    | "semifinals"
    | "championship";
}) {
  if (
    type === "championship"
  ) {
    return (
      <View
        style={
          styles.finalConnectorColumn
        }
      >
        <View
          style={
            styles.finalConnectorLine
          }
        />
      </View>
    );
  }

  const isQuarterfinalConnector =
    type === "quarterfinals";

  const firstCenterY =
    isQuarterfinalConnector
      ? SEMIFINAL_TOP_OFFSET +
        GAME_CARD_HEIGHT / 2
      : CHAMPIONSHIP_TOP_OFFSET +
        GAME_CARD_HEIGHT / 2;

  const branchHeight =
    isQuarterfinalConnector
      ? GAME_CARD_HEIGHT +
        QUARTERFINAL_GAME_GAP
      : GAME_CARD_HEIGHT +
        SEMIFINAL_GAME_GAP;

  const secondCenterY =
    isQuarterfinalConnector
      ? firstCenterY +
        branchHeight * 2
      : null;

  return (
    <View
      style={styles.connectorColumn}
    >
      <ConnectorGroup
        centerY={firstCenterY}
        branchHeight={branchHeight}
      />

      {secondCenterY != null ? (
        <ConnectorGroup
          centerY={secondCenterY}
          branchHeight={branchHeight}
        />
      ) : null}
    </View>
  );
}

function QuarterfinalColumn({
  round,
}: {
  round: BracketRound;
}) {
  return (
    <View style={styles.roundColumn}>
      <RoundHeader
        title={round.title}
        subtitle={round.subtitle}
      />

      <View
        style={
          styles.quarterfinalGames
        }
      >
        {round.games.map(
          (game) => (
            <GameCard
              key={game.id}
              game={game}
            />
          ),
        )}
      </View>
    </View>
  );
}

function SemifinalColumn({
  round,
}: {
  round: BracketRound;
}) {
  return (
    <View style={styles.roundColumn}>
      <RoundHeader
        title={round.title}
        subtitle={round.subtitle}
      />

      <View
        style={styles.semifinalGames}
      >
        {round.games.map(
          (game) => (
            <GameCard
              key={game.id}
              game={game}
            />
          ),
        )}
      </View>
    </View>
  );
}

function ChampionshipColumn({
  round,
}: {
  round: BracketRound;
}) {
  return (
    <View style={styles.roundColumn}>
      <RoundHeader
        title={round.title}
        subtitle={round.subtitle}
      />

      <View
        style={
          styles.championshipGames
        }
      >
        {round.games.map(
          (game) => (
            <GameCard
              key={game.id}
              game={game}
            />
          ),
        )}
      </View>
    </View>
  );
}

function ChampionColumn({
  champion,
}: {
  champion: BracketTeam | null;
}) {
  return (
    <View style={styles.roundColumn}>
      <RoundHeader
        title="Champion"
        subtitle="League Winner"
        gold
      />

      <View
        style={
          styles.championCardContainer
        }
      >
        <View
          style={styles.championCard}
        >
          <Text
            style={
              styles.championTrophy
            }
          >
            🏆
          </Text>

          <Text
            style={
              styles.championLabel
            }
          >
            Champion
          </Text>

          <View
            style={
              styles.championDivider
            }
          />

          {champion ? (
            <>
              <View
                style={
                  styles.championTeamRow
                }
              >
                <TeamBrandingIcon
                  branding={
                    champion.branding
                  }
                  size={23}
                />

                <Text
                  numberOfLines={1}
                  style={
                    styles.championName
                  }
                >
                  {champion.name}
                </Text>
              </View>

              <Text
                style={
                  styles.championSeason
                }
              >
                2026 Summer Champions
              </Text>
            </>
          ) : (
            <>
              <Text
                style={
                  styles.championPending
                }
              >
                To Be Determined
              </Text>

              <Text
                style={
                  styles.championSeason
                }
              >
                Championship winner
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

function NavigationButton({
  label,
  icon,
  onPress,
}: NavigationButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.navigationButton,
        pressed &&
          styles.pressed,
      ]}
    >
      <View
        style={
          styles.navigationButtonContent
        }
      >
        {icon}

        <Text
          numberOfLines={1}
          style={
            styles.navigationButtonText
          }
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

export default function PlayoffBracketScreen() {
  const params =
    useLocalSearchParams<{
      league?: string | string[];

      leagueSelection?:
        | string
        | string[];

      organizationSelection?:
        | string
        | string[];

      organizationId?:
        | string
        | string[];

      leagueId?:
        | string
        | string[];

      seasonId?:
        | string
        | string[];
    }>();

  const leagueValue =
    normalizeParam(params.league);

  const leagueKey =
    normalizeLeagueKey(
      leagueValue,
    );

  const quarterfinalRound =
    bracketRounds.find(
      (round) =>
        round.id ===
        "quarterfinals",
    );

  const semifinalRound =
    bracketRounds.find(
      (round) =>
        round.id ===
        "semifinals",
    );

  const championshipRound =
    bracketRounds.find(
      (round) =>
        round.id ===
        "championship",
    );

  const champion =
    useMemo(() => {
      const championshipGame =
        championshipRound
          ?.games[0];

      if (!championshipGame) {
        return null;
      }

      return getWinner(
        championshipGame,
      );
    }, [championshipRound]);

  /**
   * Keep the existing organization and season
   * parameters when navigating between related
   * standings screens.
   */
  const sharedRouteParams = {
    league: leagueKey,

    ...(normalizeParam(
      params.leagueSelection,
    )
      ? {
          leagueSelection:
            normalizeParam(
              params.leagueSelection,
            ),
        }
      : {}),

    ...(normalizeParam(
      params.organizationSelection,
    )
      ? {
          organizationSelection:
            normalizeParam(
              params.organizationSelection,
            ),
        }
      : {}),

    ...(normalizeParam(
      params.organizationId,
    )
      ? {
          organizationId:
            normalizeParam(
              params.organizationId,
            ),
        }
      : {}),

    ...(normalizeParam(
      params.leagueId,
    )
      ? {
          leagueId:
            normalizeParam(
              params.leagueId,
            ),
        }
      : {}),

    ...(normalizeParam(
      params.seasonId,
    )
      ? {
          seasonId:
            normalizeParam(
              params.seasonId,
            ),
        }
      : {}),
  };

  const handleStandingsPress =
    () => {
      router.replace({
        pathname:
          "/(tabs)/standings/[league]",
        params:
          sharedRouteParams,
      });
    };

  const handleSeasonPicturePress =
    () => {
      router.replace({
        pathname:
          "/(tabs)/standings/seasonPicture/[league]",
        params:
          sharedRouteParams,
      });
    };

  if (
    !quarterfinalRound ||
    !semifinalRound ||
    !championshipRound
  ) {
    return (
      <ScreenLayout
        title="Playoff Bracket"
        disableScroll
      >
        <View
          style={styles.errorScreen}
        >
          <Text
            style={styles.errorTitle}
          >
            Playoff bracket unavailable
          </Text>

          <Pressable
            onPress={() =>
              router.back()
            }
            style={({ pressed }) => [
              styles.errorButton,
              pressed &&
                styles.pressed,
            ]}
          >
            <Text
              style={
                styles.errorButtonText
              }
            >
              Go Back
            </Text>
          </Pressable>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      title="Playoff Bracket"
      disableScroll
    >
      <ScrollView
        style={styles.verticalScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.pageContent
        }
      >
        <View
          style={styles.informationCard}
        >
          <View
            style={
              styles.informationHeader
            }
          >
            <Text
              style={
                styles.informationTitle
              }
            >
              Playoff Information
            </Text>

            <Ionicons
              name="information-circle-outline"
              size={21}
              color={COLORS.purple}
            />
          </View>

          <View
            style={
              styles.informationDivider
            }
          />

          <View
            style={styles.bulletRow}
          >
            <Text
              style={styles.bullet}
            >
              •
            </Text>

            <Text
              style={
                styles.informationText
              }
            >
              Playoff seeds are not
              reseeded.
            </Text>
          </View>

          <View
            style={styles.bulletRow}
          >
            <Text
              style={styles.bullet}
            >
              •
            </Text>

            <Text
              style={
                styles.informationText
              }
            >
              Higher seeds are listed
              first.
            </Text>
          </View>

          <View
            style={[
              styles.bulletRow,
              styles.lastBulletRow,
            ]}
          >
            <Text
              style={styles.bullet}
            >
              •
            </Text>

            <Text
              style={
                styles.informationText
              }
            >
              Scroll right to view later
              rounds.
            </Text>
          </View>
        </View>

        <View
          style={styles.scrollHint}
        >
          <Text
            style={
              styles.scrollHintText
            }
          >
            Scroll right
          </Text>

          <Ionicons
            name="arrow-forward"
            size={17}
            color={COLORS.purple}
          />
        </View>

        <ScrollView
          horizontal
          nestedScrollEnabled
          directionalLockEnabled
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.bracketContent
          }
        >
          <QuarterfinalColumn
            round={
              quarterfinalRound
            }
          />

          <BracketConnector
            type="quarterfinals"
          />

          <SemifinalColumn
            round={semifinalRound}
          />

          <BracketConnector
            type="semifinals"
          />

          <ChampionshipColumn
            round={
              championshipRound
            }
          />

          <BracketConnector
            type="championship"
          />

          <ChampionColumn
            champion={champion}
          />
        </ScrollView>

        <View
          style={
            styles.navigationButtonsRow
          }
        >
          <NavigationButton
            label="Standings"
            onPress={
              handleStandingsPress
            }
            icon={
              <Entypo
                name="bar-graph"
                size={23}
                color="#FFFFFF"
              />
            }
          />

          <NavigationButton
            label="Season Picture"
            onPress={
              handleSeasonPicturePress
            }
            icon={
              <FontAwesome5
                name="chart-bar"
                size={22}
                color="#FFFFFF"
                solid
              />
            }
          />
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles =
  StyleSheet.create({
    verticalScroll: {
      flex: 1,
      backgroundColor:
        COLORS.background,
    },

    pageContent: {
      paddingTop: 20,
      paddingBottom: 130,
    },

    informationCard: {
      marginHorizontal: 16,
      padding: 17,
      borderRadius: 20,
      backgroundColor: COLORS.card,

      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 6,
    },

    informationHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    informationTitle: {
      fontSize: 17,
      fontWeight: "800",
      color: COLORS.text,
    },

    informationDivider: {
      height:
        StyleSheet.hairlineWidth,
      marginVertical: 13,
      backgroundColor:
        COLORS.divider,
    },

    bulletRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 8,
    },

    lastBulletRow: {
      marginBottom: 0,
    },

    bullet: {
      width: 17,
      fontSize: 16,
      lineHeight: 20,
      fontWeight: "900",
      color: COLORS.purple,
    },

    informationText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 20,
      color: COLORS.text,
    },

    scrollHint: {
      marginTop: 20,
      marginHorizontal: 18,
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-end",
      gap: 6,
    },

    scrollHintText: {
      fontSize: 13,
      fontWeight: "700",
      color: COLORS.purple,
    },

    bracketContent: {
      minHeight:
        ROUND_HEADER_HEIGHT +
        16 +
        BRACKET_BODY_HEIGHT +
        28,

      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 22,

      alignItems: "flex-start",
    },

    roundColumn: {
      width: CARD_WIDTH,
    },

    roundHeaderCard: {
      height:
        ROUND_HEADER_HEIGHT,

      marginBottom: 16,
      paddingHorizontal: 14,

      borderRadius: 17,
      backgroundColor:
        COLORS.card,

      alignItems: "center",
      justifyContent: "center",

      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 7,
      elevation: 5,
    },

    goldRoundHeaderCard: {
      borderWidth: 1.5,
      borderColor: COLORS.gold,
      backgroundColor:
        COLORS.goldSoft,
    },

    roundTitle: {
      fontSize: 16,
      fontWeight: "900",
      color: COLORS.purple,
    },

    goldRoundTitle: {
      color: COLORS.goldDark,
    },

    roundSubtitle: {
      marginTop: 2,
      fontSize: 11,
      fontWeight: "600",
      color: COLORS.mutedText,
    },

    quarterfinalGames: {
      height:
        BRACKET_BODY_HEIGHT,

      gap:
        QUARTERFINAL_GAME_GAP,
    },

    semifinalGames: {
      height:
        BRACKET_BODY_HEIGHT,

      paddingTop:
        SEMIFINAL_TOP_OFFSET,

      gap:
        SEMIFINAL_GAME_GAP,
    },

    championshipGames: {
      height:
        BRACKET_BODY_HEIGHT,

      paddingTop:
        CHAMPIONSHIP_TOP_OFFSET,
    },

    championCardContainer: {
      height:
        BRACKET_BODY_HEIGHT,

      paddingTop:
        CHAMPIONSHIP_TOP_OFFSET -
        6,
    },

    gameCard: {
      width: CARD_WIDTH,
      height: GAME_CARD_HEIGHT,

      paddingTop: 11,
      paddingHorizontal: 13,
      paddingBottom: 9,

      borderRadius: 18,
      backgroundColor:
        COLORS.card,

      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.11,
      shadowRadius: 8,
      elevation: 6,
    },

    gameCardHeader: {
      height: 24,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    dateTimeRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    dateText: {
      fontSize: 13,
      fontWeight: "800",
      color: COLORS.text,
    },

    dateTimeSeparator: {
      marginHorizontal: 5,
      fontSize: 13,
      fontWeight: "800",
      color: COLORS.mutedText,
    },

    timeText: {
      fontSize: 13,
      fontWeight: "700",
      color: COLORS.text,
    },

    statusPill: {
      paddingHorizontal: 8,
      paddingVertical: 4,

      borderRadius: 999,
      backgroundColor:
        COLORS.purpleSoft,
    },

    statusPillText: {
      fontSize: 9,
      fontWeight: "800",
      color: COLORS.purple,
    },

    liveStatusPill: {
      backgroundColor:
        COLORS.liveBackground,
    },

    liveStatusPillText: {
      color: COLORS.liveText,
    },

    topDivider: {
      height:
        StyleSheet.hairlineWidth,

      marginTop: 6,
      marginBottom: 5,

      backgroundColor:
        COLORS.divider,
    },

    teamsSection: {
      height: 67,
      justifyContent: "center",
    },

    teamRow: {
      height: 31,
      paddingHorizontal: 3,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    teamIdentity: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },

    seedContainer: {
      width: 35,
      alignItems: "flex-start",
      justifyContent: "center",
    },

    seedText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.text,
    },

    brandingCircle: {
      marginRight: 9,

      borderWidth: 1,
      borderColor: "#D7D4DF",

      overflow: "hidden",
      position: "relative",
    },

    mutedBrandingCircle: {
      backgroundColor:
        COLORS.losingBrand,

      borderColor:
        COLORS.losingBrand,
    },

    brandingPlaceholder: {
      backgroundColor:
        "#F0EFF4",

      alignItems: "center",
      justifyContent: "center",
    },

    placeholderDot: {
      width: 4,
      height: 4,
      borderRadius: 2,

      backgroundColor:
        "#AAA6B4",
    },

    brandingHalf: {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: "50%",
    },

    brandingLeftHalf: {
      left: 0,
    },

    brandingRightHalf: {
      right: 0,
    },

    teamName: {
      flex: 1,

      fontSize: 14,
      fontWeight: "700",
      color: COLORS.text,
    },

    pendingTeamName: {
      color: COLORS.mutedText,
      fontWeight: "600",
    },

    winnerText: {
      color: COLORS.text,
      fontWeight: "900",
    },

    loserText: {
      color: COLORS.losingText,
      fontWeight: "700",
    },

    teamScore: {
      minWidth: 30,
      marginLeft: 8,

      textAlign: "right",
      fontSize: 16,
      fontWeight: "800",
      color: COLORS.text,
    },

    bottomDivider: {
      height:
        StyleSheet.hairlineWidth,

      marginTop: 1,
      marginBottom: 4,

      backgroundColor:
        COLORS.divider,
    },

    locationFooter: {
      height: 25,

      flexDirection: "row",
      alignItems: "center",
    },

    locationEmoji: {
      marginRight: 6,
      fontSize: 12,
    },

    locationText: {
      flex: 1,

      fontSize: 12,
      fontWeight: "600",
      color: COLORS.mutedText,
    },

    connectorColumn: {
      width: CONNECTOR_WIDTH,
      height:
        BRACKET_BODY_HEIGHT,

      marginTop:
        ROUND_HEADER_HEIGHT +
        16,

      position: "relative",
    },

    connectorGroup: {
      position: "absolute",
      left: 0,
      width: "100%",
    },

    connectorInputTop: {
      position: "absolute",
      top: 0,
      left: 0,

      width: 28,
      height: 2,
      borderRadius: 1,

      backgroundColor:
        COLORS.connector,
    },

    connectorInputBottom: {
      position: "absolute",
      bottom: 0,
      left: 0,

      width: 28,
      height: 2,
      borderRadius: 1,

      backgroundColor:
        COLORS.connector,
    },

    connectorVertical: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 26,

      width: 2,
      borderRadius: 1,

      backgroundColor:
        COLORS.connector,
    },

    connectorOutput: {
      position: "absolute",
      top: "50%",
      left: 26,
      right: 0,

      height: 2,
      borderRadius: 1,

      backgroundColor:
        COLORS.connector,
    },

    finalConnectorColumn: {
      width: CONNECTOR_WIDTH,
      height:
        BRACKET_BODY_HEIGHT,

      marginTop:
        ROUND_HEADER_HEIGHT +
        16,

      position: "relative",
    },

    finalConnectorLine: {
      position: "absolute",

      top:
        CHAMPIONSHIP_TOP_OFFSET +
        GAME_CARD_HEIGHT / 2,

      left: 0,
      right: 0,

      height: 2,
      borderRadius: 1,

      backgroundColor:
        COLORS.connector,
    },

    championCard: {
      width: CARD_WIDTH,
      height:
        GAME_CARD_HEIGHT + 12,

      padding: 16,

      borderRadius: 19,
      borderWidth: 1.5,
      borderColor: COLORS.gold,

      backgroundColor:
        COLORS.goldSoft,

      alignItems: "center",
      justifyContent: "center",

      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.11,
      shadowRadius: 8,
      elevation: 6,
    },

    championTrophy: {
      fontSize: 30,
    },

    championLabel: {
      marginTop: 5,

      fontSize: 12,
      fontWeight: "900",

      textTransform: "uppercase",
      letterSpacing: 1.1,

      color: COLORS.goldDark,
    },

    championDivider: {
      width: "100%",
      height:
        StyleSheet.hairlineWidth,

      marginVertical: 12,

      backgroundColor:
        COLORS.goldDivider,
    },

    championTeamRow: {
      maxWidth: "100%",

      flexDirection: "row",
      alignItems: "center",
    },

    championName: {
      flexShrink: 1,

      fontSize: 19,
      fontWeight: "900",
      color: COLORS.text,
    },

    championPending: {
      fontSize: 16,
      fontWeight: "800",
      color: COLORS.mutedText,
    },

    championSeason: {
      marginTop: 7,

      fontSize: 12,
      fontWeight: "600",
      color: COLORS.mutedText,
    },

    navigationButtonsRow: {
      marginTop: 8,
      marginHorizontal: 16,

      flexDirection: "row",
      gap: 12,
    },

    navigationButton: {
      flex: 1,
      height: 52,

      paddingHorizontal: 10,

      borderRadius: 14,
      backgroundColor:
        COLORS.purple,

      alignItems: "center",
      justifyContent: "center",

      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.16,
      shadowRadius: 7,
      elevation: 6,
    },

    navigationButtonContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },

    navigationButtonText: {
      flexShrink: 1,

      fontSize: 14,
      fontWeight: "800",
      color: "#FFFFFF",

      textAlign: "center",
    },

    pressed: {
      opacity: 0.72,
      transform: [
        {
          scale: 0.99,
        },
      ],
    },

    errorScreen: {
      flex: 1,
      padding: 24,

      backgroundColor:
        COLORS.background,

      alignItems: "center",
      justifyContent: "center",
    },

    errorTitle: {
      marginBottom: 18,

      fontSize: 18,
      fontWeight: "800",
      color: COLORS.text,
    },

    errorButton: {
      minHeight: 44,
      paddingHorizontal: 20,

      borderRadius: 22,
      backgroundColor:
        COLORS.purple,

      alignItems: "center",
      justifyContent: "center",
    },

    errorButtonText: {
      fontSize: 14,
      fontWeight: "800",
      color: "#FFFFFF",
    },
  });