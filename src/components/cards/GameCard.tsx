// src/components/cards/GameCard.tsx

import React from "react";

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTextSize } from "src/context/TextSizeContext";

import GameStatusPill, {
  type GameStatus,
} from "src/components/schedule/GameStatusPill";

type TeamBranding = {
  logoUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
};

type Team = TeamBranding & {
  id: string;
  name: string;
  score?: number | null;
};

type ByeTeam = TeamBranding & {
  id: string;
  name: string;
};

type Game = {
  id: string;
  time?: string;

  teamA: Team;
  teamB: Team;

  resultType: "normal" | "forfeit";

  winner?: string | null;
  status?: string | null;
  tag?: string;

  team1Seed?: number | null;
  team2Seed?: number | null;
  seedLabel?: string;
};

type SeasonPhase =
  | "regular"
  | "playoffs";

type PlayoffRound =
  | "Quarter-Finals"
  | "Semi-Finals"
  | "Championship";

type Props = {
  week: number;
  totalWeeks?: number;

  phase?: SeasonPhase;
  playoffRound?: PlayoffRound;

  date: string;
  games: Game[];

  byeTeams?: ByeTeam[];

  location?: string;
  announcements?: string[];

  onTeamPress?: (
    teamIdOrName: string
  ) => void;

  embedded?: boolean;
};

const PURPLE = "#250F74";
const BORDER = "#E5E5EA";
const LOSER = "#9A9AA1";
const TEXT = "#111111";
const MUTED_TEXT = "#333338";
const SURFACE = "#FFFFFF";

const normalizeValue = (
  value?: string | null
) => {
  return (value ?? "")
    .toLowerCase()
    .trim();
};

const isSameTeam = (
  value?: string | null,
  team?: Team
) => {
  if (!value || !team) {
    return false;
  }

  const cleanValue =
    normalizeValue(value);

  return (
    cleanValue ===
    normalizeValue(team.id) ||
    cleanValue ===
    normalizeValue(team.name)
  );
};

const hasRealScore = (
  score?: number | null
) => {
  return (
    typeof score === "number" &&
    !Number.isNaN(score)
  );
};

const isForfeit = (
  game: Game
) => {
  return (
    game.resultType === "forfeit"
  );
};

const isCancelled = (
  game: Game
) => {
  const status =
    normalizeValue(game.status);

  return (
    status === "cancelled" ||
    status === "canceled"
  );
};

const isWinner = (
  game: Game,
  team: Team
) => {
  if (game.winner) {
    return isSameTeam(
      game.winner,
      team
    );
  }

  if (
    !hasRealScore(
      game.teamA.score
    ) ||
    !hasRealScore(
      game.teamB.score
    )
  ) {
    return false;
  }

  const teamAScore =
    game.teamA.score ?? 0;

  const teamBScore =
    game.teamB.score ?? 0;

  if (
    teamAScore === teamBScore
  ) {
    return false;
  }

  return team.id === game.teamA.id
    ? teamAScore > teamBScore
    : teamBScore > teamAScore;
};

const isGamePlayed = (
  game: Game
) => {
  return (
    !isCancelled(game) &&
    (
      isForfeit(game) ||
      Boolean(game.winner) ||
      (
        hasRealScore(
          game.teamA.score
        ) &&
        hasRealScore(
          game.teamB.score
        )
      )
    )
  );
};

const getGameStatus = (
  game: Game
): GameStatus => {
  if (isCancelled(game)) {
    return "cancelled";
  }

  if (isForfeit(game)) {
    return "forfeit";
  }

  const status =
    normalizeValue(game.status);

  if (
    status === "final" ||
    status === "completed" ||
    isGamePlayed(game)
  ) {
    return "final";
  }

  return "scheduled";
};

const isClickableTeam = (
  team: {
    id: string;
    name: string;
  }
) => {
  const value =
    `${team.id} ${team.name}`
      .toLowerCase();

  if (
    !team.id &&
    !team.name
  ) {
    return false;
  }

  return ![
    "tbd",
    "winner",
    "seed",
  ].some((term) =>
    value.includes(term)
  );
};

type TeamBrandMarkProps = {
  team: TeamBranding;
  muted?: boolean;
};

function TeamBrandMark({
  team,
  muted = false,
}: TeamBrandMarkProps) {
  const logoUrl =
    team.logoUrl?.trim();

  const primaryColor =
    team.primaryColor?.trim() ||
    PURPLE;

  const secondaryColor =
    team.secondaryColor?.trim();

  return (
    <View
      style={[
        styles.brandMark,
        muted &&
        styles.brandMarkMuted,
      ]}
    >
      {logoUrl ? (
        <Image
          source={{
            uri: logoUrl,
          }}
          style={styles.brandLogo}
          resizeMode="cover"
        />
      ) : secondaryColor ? (
        <>
          <View
            style={[
              styles.brandHalf,
              {
                backgroundColor:
                  primaryColor,
              },
            ]}
          />

          <View
            style={[
              styles.brandHalf,
              {
                backgroundColor:
                  secondaryColor,
              },
            ]}
          />
        </>
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor:
                primaryColor,
            },
          ]}
        />
      )}
    </View>
  );
}

export default function GameCard({
  phase = "regular",
  games,
  byeTeams = [],
  location,
  announcements = [],
  onTeamPress,
  embedded = false,
}: Props) {
  const { textScale } =
    useTextSize();

  const cleanLocation =
    location?.trim() ?? "";

  const getDisplayScore = (
    game: Game,
    team: Team
  ) => {
    if (isCancelled(game)) {
      return "—";
    }

    if (isForfeit(game)) {
      return isWinner(game, team)
        ? "W (F)"
        : "L";
    }

    return hasRealScore(
      team.score
    )
      ? String(team.score)
      : "—";
  };

  const renderTeam = (
    game: Game,
    team: Team,
    seed?: number | null
  ) => {
    const played =
      isGamePlayed(game);

    const winner =
      isWinner(game, team);

    const loser =
      played && !winner;

    const clickable =
      Boolean(onTeamPress) &&
      isClickableTeam(team);

    const row = (
      <View
        style={styles.teamRow}
      >
        <View
          style={
            styles.teamIdentityColumn
          }
        >
          <Text
            style={[
              styles.seed,
              {
                fontSize:
                  13 * textScale,
              },
              loser &&
              styles.loserText,
            ]}
          >
            {phase ===
              "playoffs" &&
              seed
              ? `#${seed}`
              : ""}
          </Text>

          <TeamBrandMark
            team={team}
            muted={loser}
          />

          <Text
            numberOfLines={1}
            style={[
              styles.teamName,
              {
                fontSize:
                  15 * textScale,
              },
              winner &&
              styles.winnerText,
              loser &&
              styles.loserText,
            ]}
          >
            {team.name}
          </Text>
        </View>

        <Text
          numberOfLines={1}
          style={[
            styles.score,
            {
              fontSize:
                16 * textScale,
            },
            winner &&
            styles.winnerText,
            loser &&
            styles.loserText,
          ]}
        >
          {getDisplayScore(
            game,
            team
          )}
        </Text>
      </View>
    );

    if (!clickable) {
      return (
        <View
          key={`${game.id}-${team.id}-${team.name}`}
        >
          {row}
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={`${game.id}-${team.id}-${team.name}`}
        activeOpacity={0.7}
        onPress={() =>
          onTeamPress?.(
            team.id ||
            team.name
          )
        }
      >
        {row}
      </TouchableOpacity>
    );
  };

  const renderByeTeam = (
    team: ByeTeam
  ) => {
    const clickable =
      Boolean(onTeamPress) &&
      isClickableTeam(team);

    const row = (
      <View
        style={styles.teamRow}
      >
        <View
          style={
            styles.teamIdentityColumn
          }
        >
          <Text
            style={[
              styles.seed,
              {
                fontSize:
                  13 * textScale,
              },
            ]}
          >
            {""}
          </Text>

          <TeamBrandMark
            team={team}
          />

          <Text
            numberOfLines={1}
            style={[
              styles.teamName,
              styles.byeTeamName,
              {
                fontSize:
                  15 * textScale,
              },
            ]}
          >
            {team.name}
          </Text>
        </View>

        <View
          style={
            styles.scoreSpacer
          }
        />
      </View>
    );

    if (!clickable) {
      return (
        <View
          key={team.id}
        >
          {row}
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={team.id}
        activeOpacity={0.7}
        onPress={() =>
          onTeamPress?.(
            team.id ||
            team.name
          )
        }
      >
        {row}
      </TouchableOpacity>
    );
  };

  const content = (
    <View
      style={[
        styles.card,
        embedded &&
        styles.embeddedCard,
      ]}
    >
      {games.map(
        (game, index) => (
          <View
            key={game.id}
            style={[
              styles.gameBlock,

              index ===
              games.length - 1 &&
              styles.lastGameBlock,
            ]}
          >
            <View
              style={
                styles.gameHeaderRow
              }
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.time,
                  {
                    fontSize:
                      15 *
                      textScale,
                  },
                ]}
              >
                {game.time ??
                  "TBD"}
              </Text>

              <GameStatusPill
                status={getGameStatus(
                  game
                )}
              />
            </View>

            <View
              style={
                styles.teamsWrap
              }
            >
              {renderTeam(
                game,
                game.teamA,
                game.team1Seed
              )}

              {renderTeam(
                game,
                game.teamB,
                game.team2Seed
              )}
            </View>
          </View>
        )
      )}

      {byeTeams.length > 0 && (
        <View
          style={styles.section}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize:
                  15 * textScale,
              },
            ]}
          >
            BYE
          </Text>

          <View
            style={styles.byeTeamsWrap}
          >
            {byeTeams.map(
              renderByeTeam
            )}
          </View>
        </View>
      )}

      {Boolean(cleanLocation) && (
        <View
          style={
            styles.locationSection
          }
        >
          <Text
            numberOfLines={2}
            style={[
              styles.locationText,
              {
                fontSize:
                  15 * textScale,
              },
            ]}
          >
            📍 {cleanLocation}
          </Text>
        </View>
      )}

      {announcements.length >
        0 && (
          <View
            style={
              styles.announcementSection
            }
          >
            <Text
              style={[
                styles.announcementTitle,
                {
                  fontSize:
                    15 * textScale,
                },
              ]}
            >
              📢 Announcements
            </Text>

            {announcements.map(
              (
                announcement,
                index
              ) => (
                <Text
                  key={`${announcement}-${index}`}
                  style={[
                    styles.announcementText,
                    {
                      fontSize:
                        14 *
                        textScale,
                    },
                  ]}
                >
                  • {announcement}
                </Text>
              )
            )}
          </View>
        )}
    </View>
  );

  if (embedded) {
    return content;
  }

  return (
    <ScrollView
      contentContainerStyle={
        styles.scrollContent
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      {content}
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    scrollContent: {
      paddingBottom: 120,
    },

    card: {
      width: "100%",

      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 18,

      borderRadius: 18,
      borderWidth: 1,
      borderColor: "#ECECF1",

      backgroundColor:
        SURFACE,

      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.12,
      shadowRadius: 8,

      elevation: 4,
    },

    embeddedCard: {
      shadowOpacity: 0,
      elevation: 0,
    },

    gameBlock: {
      paddingVertical: 16,

      borderBottomWidth:
        StyleSheet.hairlineWidth,

      borderBottomColor:
        BORDER,
    },

    lastGameBlock: {
      borderBottomWidth:
        StyleSheet.hairlineWidth,
    },

    gameHeaderRow: {
      minHeight: 28,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    time: {
      color: TEXT,
      fontWeight: "900",
    },

    teamsWrap: {
      marginTop: 10,
      gap: 7,
    },

    teamRow: {
      minHeight: 25,

      flexDirection: "row",
      alignItems: "center",
    },

    teamIdentityColumn: {
      flex: 1,
      minWidth: 0,

      flexDirection: "row",
      alignItems: "center",
    },

    seed: {
      width: 30,

      color: "#595960",
      fontWeight: "700",
    },

    brandMark: {
      width: 16,
      height: 16,

      marginRight: 9,

      borderRadius: 8,
      overflow: "hidden",

      flexDirection: "row",

      borderWidth:
        StyleSheet.hairlineWidth,

      borderColor:
        "rgba(0,0,0,0.18)",

      backgroundColor:
        "#F2F2F4",
    },

    brandLogo: {
      width: "100%",
      height: "100%",
    },

    brandHalf: {
      flex: 1,
    },

    brandMarkMuted: {
      opacity: 0.46,
    },

    teamName: {
      flex: 1,

      color: TEXT,
      fontWeight: "600",
    },

    byeTeamName: {
      fontWeight: "700",
    },

    score: {
      width: 92,

      color: TEXT,
      fontWeight: "700",
      textAlign: "center",
    },

    scoreSpacer: {
      width: 92,
    },

    winnerText: {
      color: TEXT,
      fontWeight: "900",
    },

    loserText: {
      color: LOSER,
      fontWeight: "500",
    },

    section: {
      paddingTop: 16,
      paddingBottom: 8,

      borderBottomWidth:
        StyleSheet.hairlineWidth,

      borderBottomColor:
        BORDER,
    },

    sectionTitle: {
      marginBottom: 9,

      color: TEXT,
      fontWeight: "900",
    },

    byeTeamsWrap: {
      gap: 7,
    },

    locationSection: {
      paddingTop: 16,
    },

    locationText: {
      color: PURPLE,
      fontWeight: "900",
    },

    announcementSection: {
      marginTop: 14,
      paddingTop: 14,
    },

    announcementTitle: {
      marginBottom: 8,

      color: TEXT,
      fontWeight: "900",
    },

    announcementText: {
      marginBottom: 5,

      color: MUTED_TEXT,
      fontWeight: "500",
      lineHeight: 21,
    },
  });