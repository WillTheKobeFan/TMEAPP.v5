// app/MyHub.tsx

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

// Adjust this path if your ScreenLayout lives elsewhere.
import ScreenLayout from "@/components/ScreenLayout";

/* =========================================================
   TYPES
========================================================= */

type Role =
  | "Player"
  | "Captain"
  | "Referee"
  | "Scorekeeper"
  | "Trainer"
  | "Trainee"
  | "Camp Director"
  | "Facility Staff"
  | "Admin";

type Day =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

type GameResult = {
  result: "W" | "L";
  score: string;
};

type TimelineItem = {
  week: number;

  // Player / Captain
  opponent?: string;

  // Staff / admin / program roles
  label?: string;

  time?: string;

  // ONLY team-game roles should use this.
  gameResult?: GameResult;
};

type QuickAction = {
  id:
    | "confirm"
    | "room"
    | "details"
    | "contact"
    | "policies"
    | "schedule"
    | "announcement"
    | "scoreEntry";

  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type RoleView = {
  contextLabel: string;
  contextOptions: string[];

  overviewLabel: string;
  overviewTitle: string;
  overviewSubtitle: string;
  overviewSummary: string;

  usePersonIcon: boolean;
  teamColor?: string;

  timelineLabel: string;
  timeline: TimelineItem[];

  yourStatusLabel: string;
  yourStatus: string;

  secondaryStatusLabel: string;
  secondaryStatus: string;

  quickActions: QuickAction[];
};

/* =========================================================
   THEME
========================================================= */

const COLORS = {
  purple: "#2A117A",
  purpleSoft: "#F1ECFF",

  background: "#F8F7FB",
  white: "#FFFFFF",

  text: "#18181C",
  muted: "#74747D",

  border: "#E3E2E8",

  green: "#0DA52C",
  red: "#D93434",
  amber: "#B77900",

  blue: "#0A8CF0",
};

/* =========================================================
   FILTER DATA
========================================================= */

const ROLES: Role[] = [
  "Player",
  "Captain",
  "Referee",
  "Scorekeeper",
  "Trainer",
  "Trainee",
  "Camp Director",
  "Facility Staff",
  "Admin",
];

const DAYS: Day[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/* =========================================================
   SAMPLE 10-WEEK TIMELINES

   These become Firestore data later.
========================================================= */

const PLAYER_WEEKS: TimelineItem[] = [
  {
    week: 1,
    opponent: "Dex",
    time: "9:00 AM",
    gameResult: {
      result: "W",
      score: "75–68",
    },
  },
  {
    week: 2,
    opponent: "Prince",
    time: "12:00 PM",
    gameResult: {
      result: "L",
      score: "64–70",
    },
  },
  {
    week: 3,
    label: "BYE",
  },
  {
    week: 4,
    opponent: "Ziller",
    time: "10:00 AM",
    gameResult: {
      result: "W",
      score: "71–65",
    },
  },
  {
    week: 5,
    opponent: "Rich",
    time: "11:00 AM",
    gameResult: {
      result: "W",
      score: "72–66",
    },
  },
  {
    week: 6,
    opponent: "Prince",
    time: "12:00 PM",
    gameResult: {
      result: "L",
      score: "63–69",
    },
  },
  {
    week: 7,
    opponent: "Rich",
    time: "11:00 AM",
    gameResult: {
      result: "W",
      score: "72–66",
    },
  },
  {
    week: 8,
    opponent: "Ziller",
    time: "10:00 AM",
  },
  {
    week: 9,
    label: "BYE",
  },
  {
    week: 10,
    opponent: "Prince",
    time: "12:00 PM",
  },
];

const REF_WEEKS: TimelineItem[] = [
  {
    week: 1,
    label: "2 Games",
    time: "10 AM • 11 AM",
  },
  {
    week: 2,
    label: "3 Games",
    time: "10 AM • 11 AM • 12 PM",
  },
  {
    week: 3,
    label: "2 Games",
    time: "9 AM • 10 AM",
  },
  {
    week: 4,
    label: "3 Games",
    time: "10 AM • 11 AM • 12 PM",
  },
  {
    week: 5,
    label: "2 Games",
    time: "10 AM • 11 AM",
  },
  {
    week: 6,
    label: "3 Games",
    time: "10 AM • 11 AM • 12 PM",
  },
  {
    week: 7,
    label: "2 Games",
    time: "10 AM • 11 AM",
  },
  {
    week: 8,
    label: "3 Games",
    time: "10 AM • 11 AM • 12 PM",
  },
  {
    week: 9,
    label: "2 Games",
    time: "9 AM • 10 AM",
  },
  {
    week: 10,
    label: "3 Games",
    time: "10 AM • 11 AM • 12 PM",
  },
];

const SCOREKEEPER_WEEKS: TimelineItem[] = [
  {
    week: 1,
    label: "4 Games",
    time: "9 AM – 12 PM",
  },
  {
    week: 2,
    label: "4 Games",
    time: "9 AM – 12 PM",
  },
  {
    week: 3,
    label: "4 Games",
    time: "9 AM – 12 PM",
  },
  {
    week: 4,
    label: "4 Games",
    time: "9 AM – 12 PM",
  },
  {
    week: 5,
    label: "4 Games",
    time: "9 AM – 12 PM",
  },
  {
    week: 6,
    label: "4 Games",
    time: "9 AM – 12 PM",
  },
  {
    week: 7,
    label: "4 Games",
    time: "9 AM – 12 PM",
  },
  {
    week: 8,
    label: "4 Games",
    time: "9 AM – 12 PM",
  },
  {
    week: 9,
    label: "3 Games",
    time: "10 AM – 12 PM",
  },
  {
    week: 10,
    label: "3 Games",
    time: "10 AM – 12 PM",
  },
];

const ADMIN_WEEKS: TimelineItem[] = Array.from(
  { length: 10 },
  (_, index) => ({
    week: index + 1,

    // Intentionally NO SCORE.
    label:
      index >= 8
        ? "3 Games"
        : "4 Games",

    time:
      index >= 8
        ? "10 AM – 12 PM"
        : "9 AM – 12 PM",
  })
);

const TRAINER_WEEKS: TimelineItem[] = [
  {
    week: 1,
    label: "Training",
    time: "9:00 AM",
  },
  {
    week: 2,
    label: "Skills",
    time: "10:00 AM",
  },
  {
    week: 3,
    label: "Training",
    time: "9:00 AM",
  },
  {
    week: 4,
    label: "Training",
    time: "9:00 AM",
  },
  {
    week: 5,
    label: "Training",
    time: "9:00 AM",
  },
  {
    week: 6,
    label: "Training",
    time: "9:00 AM",
  },
  {
    week: 7,
    label: "Skills",
    time: "10:00 AM",
  },
  {
    week: 8,
    label: "Training",
    time: "9:00 AM",
  },
  {
    week: 9,
    label: "Skills",
    time: "10:00 AM",
  },
  {
    week: 10,
    label: "Training",
    time: "9:00 AM",
  },
];

/* =========================================================
   ROLE CONFIGURATION

   One screen.
   Role determines the content.
========================================================= */

const ROLE_VIEWS: Record<Role, RoleView> = {
  Player: {
    contextLabel: "Team",

    contextOptions: [
      "Dale",
      "Ziller",
      "Prince",
      "Rich",
    ],

    overviewLabel: "TEAM",
    overviewTitle: "Dale",
    overviewSubtitle: "Sunday Men's League",
    overviewSummary: "4–2 • 2nd Place",

    usePersonIcon: false,
    teamColor: "#243E92",

    timelineLabel: "NEXT GAME",
    timeline: PLAYER_WEEKS,

    yourStatusLabel: "Your Status",
    yourStatus: "Confirmed Playing",

    secondaryStatusLabel: "Team Status",
    secondaryStatus:
      "6 Playing • 2 Pending • 1 Out",

    quickActions: [
      {
        id: "confirm",
        label: "Confirm Availability",
        icon: "checkmark-circle-outline",
      },
      {
        id: "room",
        label: "Team Room",
        icon: "people-outline",
      },
      {
        id: "contact",
        label: "Contact Admin",
        icon: "mail-outline",
      },
      {
        id: "policies",
        label: "Policies",
        icon: "document-text-outline",
      },
    ],
  },

  Captain: {
    contextLabel: "Team",

    contextOptions: [
      "Dale",
      "Ziller",
      "Prince",
      "Rich",
    ],

    overviewLabel: "TEAM",
    overviewTitle: "Dale",
    overviewSubtitle: "Sunday Men's League",
    overviewSummary: "4–2 • 2nd Place",

    usePersonIcon: false,
    teamColor: "#243E92",

    timelineLabel: "NEXT GAME",
    timeline: PLAYER_WEEKS,

    yourStatusLabel: "Your Status",
    yourStatus: "Team Confirmed",

    secondaryStatusLabel: "Team Status",
    secondaryStatus:
      "6 Playing • 2 Pending • 1 Out",

    quickActions: [
      {
        id: "confirm",
        label: "Confirm Availability",
        icon: "checkmark-circle-outline",
      },
      {
        id: "room",
        label: "Team Room",
        icon: "people-outline",
      },
      {
        id: "contact",
        label: "Contact Admin",
        icon: "mail-outline",
      },
      {
        id: "policies",
        label: "Policies",
        icon: "document-text-outline",
      },
    ],
  },

  Referee: {
    contextLabel: "Assignment",

    contextOptions: [
      "Sunday Assignments",
      "Monday Assignments",
      "Wednesday Assignments",
    ],

    overviewLabel: "ASSIGNMENT",
    overviewTitle: "Sunday Assignments",
    overviewSubtitle: "Sunday Men's League",
    overviewSummary: "3 Games Assigned",

    usePersonIcon: true,

    timelineLabel: "ASSIGNMENTS",
    timeline: REF_WEEKS,

    yourStatusLabel: "Your Status",
    yourStatus: "Confirmed",

    secondaryStatusLabel: "Assignment Status",
    secondaryStatus:
      "3 Assigned • 2 Confirmed • 1 Pending",

    quickActions: [
      {
        id: "confirm",
        label: "Confirm Assignment",
        icon: "checkmark-circle-outline",
      },
      {
        id: "details",
        label: "Assignment Details",
        icon: "people-outline",
      },
      {
        id: "contact",
        label: "Contact Admin",
        icon: "mail-outline",
      },
      {
        id: "policies",
        label: "Policies",
        icon: "document-text-outline",
      },
    ],
  },

  Scorekeeper: {
    contextLabel: "Assignment",

    contextOptions: [
      "Sunday Assignments",
      "Monday Assignments",
      "Wednesday Assignments",
    ],

    overviewLabel: "ASSIGNMENT",
    overviewTitle: "Sunday Assignments",
    overviewSubtitle: "Sunday Men's League",
    overviewSummary: "4 Games Assigned",

    usePersonIcon: true,

    timelineLabel: "ASSIGNMENTS",
    timeline: SCOREKEEPER_WEEKS,

    yourStatusLabel: "Your Status",
    yourStatus: "Confirmed",

    secondaryStatusLabel: "Assignment Status",
    secondaryStatus:
      "4 Assigned • 3 Confirmed • 1 Pending",

    quickActions: [
      {
        id: "confirm",
        label: "Confirm Assignment",
        icon: "checkmark-circle-outline",
      },
      {
        id: "scoreEntry",
        label: "Score Sheet / Entry",
        icon: "create-outline",
      },
      {
        id: "contact",
        label: "Contact Admin",
        icon: "mail-outline",
      },
      {
        id: "policies",
        label: "Policies",
        icon: "document-text-outline",
      },
    ],
  },

  Trainer: {
    contextLabel: "Program",

    contextOptions: [
      "Sunday Training",
      "Skills Clinic",
    ],

    overviewLabel: "PROGRAM",
    overviewTitle: "Sunday Training",
    overviewSubtitle: "TME Basketball",
    overviewSummary: "8 Participants",

    usePersonIcon: true,

    timelineLabel: "SESSIONS",
    timeline: TRAINER_WEEKS,

    yourStatusLabel: "Your Status",
    yourStatus: "Confirmed",

    secondaryStatusLabel: "Session Status",
    secondaryStatus:
      "6 Confirmed • 2 Pending",

    quickActions: [
      {
        id: "confirm",
        label: "Confirm Availability",
        icon: "checkmark-circle-outline",
      },
      {
        id: "details",
        label: "Session Details",
        icon: "people-outline",
      },
      {
        id: "contact",
        label: "Contact Admin",
        icon: "mail-outline",
      },
      {
        id: "policies",
        label: "Policies",
        icon: "document-text-outline",
      },
    ],
  },

  Trainee: {
    contextLabel: "Program",

    contextOptions: [
      "Sunday Training",
      "Skills Clinic",
    ],

    overviewLabel: "PROGRAM",
    overviewTitle: "Sunday Training",
    overviewSubtitle: "TME Basketball",
    overviewSummary: "Training Assignment",

    usePersonIcon: true,

    timelineLabel: "SESSIONS",
    timeline: TRAINER_WEEKS,

    yourStatusLabel: "Your Status",
    yourStatus: "Confirmed",

    secondaryStatusLabel: "Training Status",
    secondaryStatus: "No action needed",

    quickActions: [
      {
        id: "confirm",
        label: "Confirm Availability",
        icon: "checkmark-circle-outline",
      },
      {
        id: "details",
        label: "Training Details",
        icon: "people-outline",
      },
      {
        id: "contact",
        label: "Contact Admin",
        icon: "mail-outline",
      },
      {
        id: "policies",
        label: "Policies",
        icon: "document-text-outline",
      },
    ],
  },

  "Camp Director": {
    contextLabel: "Program",

    contextOptions: [
      "Summer Camp",
      "Youth Clinic",
    ],

    overviewLabel: "PROGRAM",
    overviewTitle: "Summer Camp",
    overviewSubtitle: "TME Basketball",
    overviewSummary: "Program Overview",

    usePersonIcon: true,

    timelineLabel: "SESSIONS",
    timeline: TRAINER_WEEKS,

    yourStatusLabel: "Your Status",
    yourStatus: "Confirmed",

    secondaryStatusLabel: "Program Status",
    secondaryStatus: "Ready",

    quickActions: [
      {
        id: "confirm",
        label: "Confirm Program",
        icon: "checkmark-circle-outline",
      },
      {
        id: "details",
        label: "Program Details",
        icon: "people-outline",
      },
      {
        id: "contact",
        label: "Contact Admin",
        icon: "mail-outline",
      },
      {
        id: "policies",
        label: "Policies",
        icon: "document-text-outline",
      },
    ],
  },

  "Facility Staff": {
    contextLabel: "Facility",

    contextOptions: [
      "YMCA",
      "Berlin",
    ],

    overviewLabel: "FACILITY",
    overviewTitle: "YMCA",
    overviewSubtitle: "Sunday Men's League",
    overviewSummary: "4 Games Scheduled",

    usePersonIcon: true,

    timelineLabel: "EVENTS",
    timeline: ADMIN_WEEKS,

    yourStatusLabel: "Your Status",
    yourStatus: "Confirmed",

    secondaryStatusLabel: "Facility Status",
    secondaryStatus:
      "Court Ready • No Changes",

    quickActions: [
      {
        id: "confirm",
        label: "Confirm Facility",
        icon: "checkmark-circle-outline",
      },
      {
        id: "details",
        label: "Event Details",
        icon: "people-outline",
      },
      {
        id: "contact",
        label: "Contact Admin",
        icon: "mail-outline",
      },
      {
        id: "policies",
        label: "Policies",
        icon: "document-text-outline",
      },
    ],
  },

  Admin: {
    contextLabel: "League",

    contextOptions: [
      "Sunday Men's League",
      "Monday Men's League",
      "Wednesday Men's League",
    ],

    overviewLabel: "LEAGUE OVERVIEW",
    overviewTitle: "Sunday Men's League",
    overviewSubtitle: "Week 8 of 10",
    overviewSummary: "4 Games Scheduled",

    usePersonIcon: true,

    timelineLabel: "WEEKLY GAMES",
    timeline: ADMIN_WEEKS,

    yourStatusLabel: "Games Confirmed",
    yourStatus: "3 of 4 Games Confirmed",

    secondaryStatusLabel: "Needs Attention",
    secondaryStatus:
      "1 Game Needs Staff Confirmation",

    quickActions: [
      {
        id: "confirm",
        label: "View Confirmations",
        icon: "checkmark-circle-outline",
      },
      {
        id: "schedule",
        label: "Manage Schedule",
        icon: "calendar-outline",
      },
      {
        id: "announcement",
        label: "Send Announcement",
        icon: "paper-plane-outline",
      },
      {
        id: "policies",
        label: "Policies",
        icon: "document-text-outline",
      },
    ],
  },
};

/* =========================================================
   SHARED DROPDOWN

   Avoids native Picker visual inconsistencies.
========================================================= */

function PillDropdown({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>
          {label.toUpperCase()}
        </Text>

        <Pressable
          onPress={() => setOpen(true)}
          style={({ pressed }) => [
            styles.sharedPill,
            styles.filterPill,
            pressed && styles.pressed,
          ]}
        >
          <Text
            style={styles.pillValue}
            numberOfLines={1}
          >
            {value}
          </Text>

          <Ionicons
            name="chevron-down"
            size={17}
            color={COLORS.purple}
          />
        </Pressable>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setOpen(false)}
        >
          <Pressable
            style={styles.dropdownMenu}
            onPress={() => {}}
          >
            <Text style={styles.dropdownTitle}>
              {label}
            </Text>

            {options.map((option) => {
              const selected =
                option === value;

              return (
                <Pressable
                  key={option}
                  onPress={() => {
                    onSelect(option);
                    setOpen(false);
                  }}
                  style={[
                    styles.dropdownOption,
                    selected &&
                      styles.dropdownOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      selected &&
                        styles.dropdownOptionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>

                  {selected && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={COLORS.purple}
                    />
                  )}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

/* =========================================================
   OVERVIEW ICON
========================================================= */

function OverviewIcon({
  usePersonIcon,
  teamColor,
}: {
  usePersonIcon: boolean;
  teamColor?: string;
}) {
  if (usePersonIcon) {
    return (
      <View style={styles.personIconWrap}>
        <Ionicons
          name="person-outline"
          size={27}
          color={COLORS.purple}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.teamColorDot,
        {
          backgroundColor:
            teamColor ?? COLORS.purple,
        },
      ]}
    />
  );
}

/* =========================================================
   WEEK CARD
========================================================= */

function WeekCard({
  item,
  selected,
  width,
  showGameResult,
}: {
  item: TimelineItem;
  selected: boolean;
  width: number;
  showGameResult: boolean;
}) {
  const result =
    showGameResult
      ? item.gameResult
      : undefined;

  return (
    <View
      style={[
        styles.weekCard,
        { width },
        selected &&
          styles.weekCardSelected,
      ]}
    >
      <Text
        style={[
          styles.weekLabel,
          selected &&
            styles.weekLabelSelected,
        ]}
      >
        Wk {item.week}
      </Text>

      <Text style={styles.weekMain}>
        {item.opponent
          ? `vs ${item.opponent}`
          : item.label ?? "—"}
      </Text>

      <Text style={styles.weekTime}>
        {item.time ?? "—"}
      </Text>

      {result && (
        <View style={styles.resultRow}>
          <Text
            style={[
              styles.resultLetter,
              result.result === "W"
                ? styles.resultWin
                : styles.resultLoss,
            ]}
          >
            {result.result}
          </Text>

          <Text style={styles.resultScore}>
            {result.score}
          </Text>
        </View>
      )}
    </View>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickActionPill({
  action,
  onPress,
}: {
  action: QuickAction;
  onPress?: () => void;
}) {
  return (
    <View style={styles.quickActionRow}>
      <View style={styles.filterLabelSpacer} />

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.sharedPill,
          styles.actionPill,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.actionLeft}>
          <Ionicons
            name={action.icon}
            size={17}
            color={COLORS.purple}
          />

          <Text
            style={styles.actionText}
            numberOfLines={1}
          >
            {action.label}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={17}
          color={COLORS.purple}
        />
      </Pressable>
    </View>
  );
}

/* =========================================================
   SCREEN
========================================================= */

export default function MyHub() {
  const { width } =
    useWindowDimensions();

  const weekListRef =
    useRef<FlatList<TimelineItem>>(null);

  const [role, setRole] =
    useState<Role>("Player");

  const [day, setDay] =
    useState<Day>("Sunday");

  const [contextByRole, setContextByRole] =
    useState<Record<Role, string>>(() => {
      return ROLES.reduce(
        (result, currentRole) => {
          result[currentRole] =
            ROLE_VIEWS[
              currentRole
            ].contextOptions[0];

          return result;
        },
        {} as Record<Role, string>
      );
    });

  const view =
    ROLE_VIEWS[role];

  const context =
    contextByRole[role] ??
    view.contextOptions[0];

  /*
   * Demo current week.
   * Replace with league.currentWeek from Firestore.
   */
  const currentWeek = 8;

  const currentWeekIndex =
    useMemo(() => {
      const index =
        view.timeline.findIndex(
          (item) =>
            item.week === currentWeek
        );

      return index >= 0
        ? index
        : 0;
    }, [view.timeline]);

  const [
    selectedWeekIndex,
    setSelectedWeekIndex,
  ] = useState(currentWeekIndex);

  /*
   * Three week cards visible.
   *
   * Main content:
   * screen - 56 outer margin
   *
   * timeline internal:
   * - 32 card padding
   * - 72 two arrow buttons
   * - 24 arrow/list breathing room
   * - 16 two gaps between 3 week cards
   */
  const contentCardWidth =
    width - 56;

  const timelineAvailableWidth =
    contentCardWidth -
    32 -
    72 -
    24 -
    16;

  const weekCardWidth =
    Math.max(
      76,
      timelineAvailableWidth / 3
    );

  /*
   * Team-game score information is ONLY
   * meaningful in Player/Captain view.
   */
  const showGameResults =
    role === "Player" ||
    role === "Captain";

  const overviewTitle =
    role === "Player" ||
    role === "Captain" ||
    role === "Facility Staff" ||
    role === "Admin"
      ? context
      : view.overviewTitle;

  /* -----------------------------------------------------
     KEEP CURRENT WEEK CENTERED
  ----------------------------------------------------- */

  useEffect(() => {
    setSelectedWeekIndex(
      currentWeekIndex
    );

    const timeout =
      setTimeout(() => {
        weekListRef.current?.scrollToIndex({
          index: currentWeekIndex,
          animated: false,
          viewPosition: 0.5,
        });
      }, 100);

    return () =>
      clearTimeout(timeout);
  }, [
    currentWeekIndex,
    role,
    day,
    context,
  ]);

  /* -----------------------------------------------------
     HANDLERS
  ----------------------------------------------------- */

  function handleRoleChange(
    value: string
  ) {
    setRole(value as Role);
  }

  function handleDayChange(
    value: string
  ) {
    setDay(value as Day);
  }

  function handleContextChange(
    value: string
  ) {
    setContextByRole(
      (current) => ({
        ...current,
        [role]: value,
      })
    );
  }

  function selectWeek(
    index: number
  ) {
    const safeIndex =
      Math.max(
        0,
        Math.min(
          view.timeline.length - 1,
          index
        )
      );

    setSelectedWeekIndex(
      safeIndex
    );

    weekListRef.current?.scrollToIndex({
      index: safeIndex,
      animated: true,
      viewPosition: 0.5,
    });
  }

  function handleQuickAction(
    action: QuickAction
  ) {
    /*
     * Route these once their screens are wired.
     *
     * Examples:
     *
     * router.push("/confirmAvailability");
     * router.push("/teamRoom");
     * router.push("/contactAdmin");
     * router.push("/policies");
     */
    console.log(
      "MyHub Quick Action:",
      action.id
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <ScreenLayout
      title="MyHub"
      showBack
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* ===============================================
            FILTERS + TOOLS
        =============================================== */}

        <View style={styles.filterArea}>
          <View style={styles.filterStack}>
            <PillDropdown
              label="Role"
              value={role}
              options={ROLES}
              onSelect={
                handleRoleChange
              }
            />

            <PillDropdown
              label="Day"
              value={day}
              options={DAYS}
              onSelect={
                handleDayChange
              }
            />

            <PillDropdown
              label={view.contextLabel}
              value={context}
              options={
                view.contextOptions
              }
              onSelect={
                handleContextChange
              }
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.toolsArea,
              pressed &&
                styles.pressed,
            ]}
          >
            <View
              style={
                styles.toolsCircle
              }
            >
              <Ionicons
                name="settings"
                size={24}
                color="#FFFFFF"
              />
            </View>

            <Text
              style={
                styles.toolsText
              }
            >
              Tools
            </Text>
          </Pressable>
        </View>

        {/* ===============================================
            CURRENTLY VIEWING
        =============================================== */}

        <View
          style={
            styles.currentView
          }
        >
          <Text style={styles.eyebrow}>
            CURRENTLY VIEWING
          </Text>

          <Text
            style={
              styles.currentViewText
            }
          >
            {role} • {day} • {context}
          </Text>
        </View>

        <View
          style={
            styles.sectionDivider
          }
        />

        {/* ===============================================
            CARD 1 — OVERVIEW
        =============================================== */}

        <View
          style={
            styles.contentCard
          }
        >
          <Text style={styles.eyebrow}>
            {view.overviewLabel}
          </Text>

          <View
            style={
              styles.overviewRow
            }
          >
            <OverviewIcon
              usePersonIcon={
                view.usePersonIcon
              }
              teamColor={
                view.teamColor
              }
            />

            <View
              style={
                styles.overviewText
              }
            >
              <Text
                style={
                  styles.overviewTitle
                }
              >
                {overviewTitle}
              </Text>

              <Text
                style={
                  styles.overviewSubtitle
                }
              >
                {view.overviewSubtitle}
              </Text>

              <Text
                style={
                  styles.overviewSummary
                }
              >
                {view.overviewSummary}
              </Text>
            </View>
          </View>
        </View>

        {/* ===============================================
            CARD 2 — 10 WEEK TIMELINE
        =============================================== */}

        <View
          style={
            styles.contentCard
          }
        >
          <Text style={styles.eyebrow}>
            {view.timelineLabel}
          </Text>

          <View
            style={
              styles.timelineRow
            }
          >
            {/* LEFT */}

            <Pressable
              onPress={() =>
                selectWeek(
                  selectedWeekIndex -
                    1
                )
              }
              style={({ pressed }) => [
                styles.timelineArrow,
                pressed &&
                  styles.pressed,
              ]}
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color={
                  COLORS.purple
                }
              />
            </Pressable>

            {/* WEEKS */}

            <FlatList
              ref={weekListRef}
              horizontal
              data={view.timeline}
              keyExtractor={(item) =>
                `${role}-${item.week}`
              }
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.weekListContent
              }
              ItemSeparatorComponent={() => (
                <View
                  style={{ width: 8 }}
                />
              )}
              getItemLayout={(
                _,
                index
              ) => ({
                length:
                  weekCardWidth + 8,

                offset:
                  (weekCardWidth +
                    8) *
                  index,

                index,
              })}
              onScrollToIndexFailed={(
                info
              ) => {
                setTimeout(() => {
                  weekListRef.current?.scrollToIndex(
                    {
                      index:
                        info.index,

                      animated:
                        false,

                      viewPosition:
                        0.5,
                    }
                  );
                }, 100);
              }}
              renderItem={({
                item,
                index,
              }) => (
                <Pressable
                  onPress={() =>
                    selectWeek(index)
                  }
                >
                  <WeekCard
                    item={item}
                    width={
                      weekCardWidth
                    }
                    selected={
                      index ===
                      selectedWeekIndex
                    }
                    showGameResult={
                      showGameResults
                    }
                  />
                </Pressable>
              )}
              style={styles.weekList}
            />

            {/* RIGHT */}

            <Pressable
              onPress={() =>
                selectWeek(
                  selectedWeekIndex +
                    1
                )
              }
              style={({ pressed }) => [
                styles.timelineArrow,
                pressed &&
                  styles.pressed,
              ]}
            >
              <Ionicons
                name="chevron-forward"
                size={20}
                color={
                  COLORS.purple
                }
              />
            </Pressable>
          </View>
        </View>

        {/* ===============================================
            CARD 3 — AVAILABILITY / STATUS
        =============================================== */}

        <View
          style={
            styles.contentCard
          }
        >
          <Text style={styles.eyebrow}>
            {role === "Admin"
              ? "LEAGUE STATUS"
              : "AVAILABILITY / STATUS"}
          </Text>

          <View
            style={
              styles.statusSection
            }
          >
            <Text
              style={
                styles.statusLabel
              }
            >
              {view.yourStatusLabel}
            </Text>

            <View
              style={
                styles.confirmedRow
              }
            >
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={
                  COLORS.green
                }
              />

              <Text
                style={
                  styles.confirmedText
                }
              >
                {view.yourStatus}
              </Text>
            </View>
          </View>

          <View
            style={
              styles.statusDivider
            }
          />

          <View
            style={
              styles.secondaryStatusSection
            }
          >
            <Text
              style={
                styles.statusLabel
              }
            >
              {
                view.secondaryStatusLabel
              }
            </Text>

            <Text
              style={[
                styles.secondaryStatusText,

                role === "Admin" &&
                  styles.adminWarningText,
              ]}
            >
              {view.secondaryStatus}
            </Text>
          </View>
        </View>

        {/* ===============================================
            QUICK ACTIONS

            SAME pill width / height / radius / shadow
            as filters.
        =============================================== */}

        <View
          style={
            styles.quickActionsSection
          }
        >
          <View
            style={
              styles.quickActionHeadingRow
            }
          >
            <View
              style={
                styles.filterLabelSpacer
              }
            />

            <Text
              style={[
                styles.eyebrow,
                styles.quickActionHeading,
              ]}
            >
              QUICK ACTIONS
            </Text>
          </View>

          {view.quickActions.map(
            (action) => (
              <QuickActionPill
                key={action.id}
                action={action}
                onPress={() =>
                  handleQuickAction(
                    action
                  )
                }
              />
            )
          )}
        </View>

        {/* Space above fixed CustomNavBar */}

        <View style={{ height: 110 }} />
      </ScrollView>
    </ScreenLayout>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles =
  StyleSheet.create({
    scrollContent: {
      paddingTop: 18,
      paddingBottom: 6,
      backgroundColor:
        COLORS.background,
    },

    /* =====================================================
       UNIVERSAL TEXT
    ===================================================== */

    eyebrow: {
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 1.2,
      color: COLORS.muted,
    },

    /* =====================================================
       FILTERS
    ===================================================== */

    filterArea: {
      flexDirection: "row",
      alignItems: "center",

      paddingHorizontal: 30,
    },

    filterStack: {
      flex: 1,
      gap: 12,
    },

    filterRow: {
      flexDirection: "row",
      alignItems: "center",

      gap: 14,
    },

    /*
     * Fixed label column.
     *
     * This keeps:
     *
     * ROLE
     * DAY
     * TEAM
     *
     * aligned vertically while all pills
     * begin on exactly the same X position.
     */
    filterLabel: {
      width: 62,

      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 1.15,

      color: COLORS.muted,
    },

    filterLabelSpacer: {
      width: 62,
      marginRight: 14,
    },

    /*
     * THIS IS THE SHARED PILL GEOMETRY.
     *
     * Filter pills + Quick Action pills
     * both inherit this.
     */
    sharedPill: {
      height: 44,

      borderRadius: 22,

      borderWidth: 1,
      borderColor:
        COLORS.border,

      backgroundColor:
        COLORS.white,

      shadowColor: "#000",
      shadowOpacity: 0.065,
      shadowRadius: 7,

      shadowOffset: {
        width: 0,
        height: 3,
      },

      elevation: 3,
    },

    filterPill: {
      flex: 1,

      paddingHorizontal: 14,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    pillValue: {
      flex: 1,

      marginRight: 8,

      fontSize: 13,
      fontWeight: "600",

      color: COLORS.text,
    },

    /* =====================================================
       TOOLS
    ===================================================== */

    toolsArea: {
      width: 62,

      marginLeft: 12,

      alignItems: "center",
    },

    toolsCircle: {
      width: 48,
      height: 48,

      borderRadius: 24,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        COLORS.blue,

      shadowColor: "#000",
      shadowOpacity: 0.16,
      shadowRadius: 8,

      shadowOffset: {
        width: 0,
        height: 4,
      },

      elevation: 5,
    },

    toolsText: {
      marginTop: 5,

      fontSize: 10,

      color: COLORS.muted,
    },

    /* =====================================================
       CURRENT VIEW
    ===================================================== */

    currentView: {
      paddingHorizontal: 30,

      marginTop: 22,
    },

    currentViewText: {
      marginTop: 5,

      fontSize: 14,
      fontWeight: "800",

      color: COLORS.purple,
    },

    sectionDivider: {
      height: 1,

      marginHorizontal: 30,
      marginTop: 17,
      marginBottom: 12,

      backgroundColor:
        COLORS.border,
    },

    /* =====================================================
       SHARED CONTENT CARDS
    ===================================================== */

    contentCard: {
      marginHorizontal: 28,
      marginBottom: 12,

      paddingHorizontal: 15,
      paddingVertical: 13,

      borderRadius: 18,

      borderWidth: 1,
      borderColor:
        COLORS.border,

      backgroundColor:
        COLORS.white,

      shadowColor: "#000",
      shadowOpacity: 0.055,
      shadowRadius: 8,

      shadowOffset: {
        width: 0,
        height: 4,
      },

      elevation: 3,
    },

    /* =====================================================
       OVERVIEW
    ===================================================== */

    overviewRow: {
      marginTop: 9,

      flexDirection: "row",
      alignItems: "center",
    },

    teamColorDot: {
      width: 36,
      height: 36,

      borderRadius: 18,
    },

    personIconWrap: {
      width: 38,
      height: 38,

      borderRadius: 19,

      alignItems: "center",
      justifyContent: "center",
    },

    overviewText: {
      flex: 1,

      marginLeft: 12,
    },

    overviewTitle: {
      fontSize: 16,
      fontWeight: "800",

      color: COLORS.text,
    },

    overviewSubtitle: {
      marginTop: 2,

      fontSize: 11,

      color: COLORS.muted,
    },

    overviewSummary: {
      marginTop: 6,

      fontSize: 12,
      fontWeight: "800",

      color: COLORS.purple,
    },

    /* =====================================================
       TIMELINE
    ===================================================== */

    timelineRow: {
      marginTop: 12,

      flexDirection: "row",
      alignItems: "center",
    },

    weekList: {
      flex: 1,
    },

    weekListContent: {
      paddingHorizontal: 5,
    },

    timelineArrow: {
      width: 34,
      height: 34,

      borderRadius: 17,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor:
        COLORS.white,

      shadowColor: "#000",
      shadowOpacity: 0.075,
      shadowRadius: 5,

      shadowOffset: {
        width: 0,
        height: 2,
      },

      elevation: 2,

      zIndex: 10,
    },

    weekCard: {
      minHeight: 100,

      paddingHorizontal: 6,
      paddingVertical: 9,

      borderRadius: 11,

      borderWidth: 1,
      borderColor:
        COLORS.border,

      backgroundColor:
        COLORS.white,

      alignItems: "center",
    },

    weekCardSelected: {
      backgroundColor:
        COLORS.purpleSoft,

      borderColor:
        "#D8CCFF",
    },

    weekLabel: {
      fontSize: 10,
      fontWeight: "700",

      color: COLORS.muted,
    },

    weekLabelSelected: {
      color: COLORS.purple,
      fontWeight: "800",
    },

    weekMain: {
      marginTop: 8,

      fontSize: 12,
      fontWeight: "800",

      color: COLORS.text,

      textAlign: "center",
    },

    weekTime: {
      marginTop: 5,

      fontSize: 9.5,

      color: COLORS.muted,

      textAlign: "center",
    },

    resultRow: {
      marginTop: 7,

      flexDirection: "row",
      alignItems: "center",

      gap: 5,
    },

    resultLetter: {
      fontSize: 11,
      fontWeight: "900",
    },

    resultWin: {
      color: COLORS.green,
    },

    resultLoss: {
      color: COLORS.red,
    },

    resultScore: {
      fontSize: 10,

      color: COLORS.muted,
    },

    /* =====================================================
       STATUS
    ===================================================== */

    statusSection: {
      marginTop: 11,
    },

    statusLabel: {
      fontSize: 11,

      color: COLORS.muted,
    },

    confirmedRow: {
      marginTop: 6,

      flexDirection: "row",
      alignItems: "center",

      gap: 6,
    },

    confirmedText: {
      fontSize: 12,
      fontWeight: "700",

      color: COLORS.green,
    },

    statusDivider: {
      height: 1,

      marginTop: 12,

      backgroundColor:
        COLORS.border,
    },

    secondaryStatusSection: {
      marginTop: 11,
    },

    secondaryStatusText: {
      marginTop: 5,

      fontSize: 12,
      fontWeight: "600",

      color: COLORS.text,
    },

    adminWarningText: {
      color: COLORS.red,
    },

    /* =====================================================
       QUICK ACTIONS

       Uses EXACT SAME:
       - label column
       - pill width
       - height
       - radius
       - shadow
       - spacing concept

       as filters.
    ===================================================== */

    quickActionsSection: {
      paddingHorizontal: 30,

      gap: 10,
    },

    quickActionHeadingRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    quickActionHeading: {
      flex: 1,
    },

    quickActionRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    actionPill: {
      flex: 1,

      paddingHorizontal: 14,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    actionLeft: {
      flex: 1,

      flexDirection: "row",
      alignItems: "center",

      gap: 9,
    },

    actionText: {
      flex: 1,

      fontSize: 12,
      fontWeight: "600",

      color: COLORS.text,
    },

    /* =====================================================
       DROPDOWN MODAL
    ===================================================== */

    modalBackdrop: {
      flex: 1,

      paddingHorizontal: 30,

      justifyContent: "center",

      backgroundColor:
        "rgba(0,0,0,0.20)",
    },

    dropdownMenu: {
      maxHeight: "70%",

      padding: 8,

      borderRadius: 20,

      backgroundColor:
        COLORS.white,

      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 18,

      shadowOffset: {
        width: 0,
        height: 8,
      },

      elevation: 8,
    },

    dropdownTitle: {
      paddingHorizontal: 12,
      paddingVertical: 10,

      fontSize: 11,
      fontWeight: "800",

      letterSpacing: 1,

      color: COLORS.muted,
    },

    dropdownOption: {
      minHeight: 48,

      paddingHorizontal: 14,

      borderRadius: 14,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    dropdownOptionSelected: {
      backgroundColor:
        COLORS.purpleSoft,
    },

    dropdownOptionText: {
      fontSize: 14,
      fontWeight: "600",

      color: COLORS.text,
    },

    dropdownOptionTextSelected: {
      color: COLORS.purple,
      fontWeight: "800",
    },

    pressed: {
      opacity: 0.65,
    },
  });