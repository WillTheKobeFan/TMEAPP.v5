// app/(tabs)/inbox/index.tsx

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";

import ScreenLayout from "@/components/ScreenLayout";
import { useInbox } from "@/context/InboxContext";
import { useLeague } from "@/context/LeagueContext";

type InboxView = "notifications" | "messages";

type NotificationFilter =
  | "all"
  | "unread"
  | "deleted";

type NotificationCategory =
  | "facility"
  | "schedule"
  | "scores"
  | "registration"
  | "general";

type NotificationItem = {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  leagueLabel: string;
  timeLabel: string;
  unread: boolean;
  deleted: boolean;
  deletedAtLabel?: string;
};

type MessageTopicId =
  | "leagueDirector"
  | "appSupport"
  | "gameScoreIssue"
  | "leagueQuestion";

type MessageTopic = {
  id: MessageTopicId;
  label: string;
  description: string;
  starterMessage: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

type ChatMessage = {
  id: string;
  sender: "admin" | "user";
  text: string;
};

const PURPLE = "#250F74";
const WHITE = "#FFFFFF";
const SCREEN = "#F7F7FB";
const TEXT = "#202020";
const MUTED = "#707078";
const BORDER = "#E2DDED";
const DIVIDER = "#ECE8F2";
const LIGHT_PURPLE = "#F3F0FA";
const DISABLED = "#D7D3DE";
const RED = "#E53935";
const GREEN = "#2E9B57";
const GOLD = "#D69E14";

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "gym-closed",
    category: "facility",
    title: "Gym Closed Next Week",
    message:
      "The YMCA will be closed next Sunday for maintenance. Games will resume the following week. Please review the updated schedule before arriving.",
    leagueLabel: "Sunday AM",
    timeLabel: "8 min ago",
    unread: true,
    deleted: false,
  },
  {
    id: "schedule-posted",
    category: "schedule",
    title: "Week 7 Schedule Posted",
    message:
      "The Week 7 schedule is now available for all Sunday teams. Please review your game time before Sunday.",
    leagueLabel: "Sunday AM",
    timeLabel: "45 min ago",
    unread: true,
    deleted: false,
  },
  {
    id: "scores-finalized",
    category: "scores",
    title: "Scores Finalized",
    message:
      "Week 6 scores have been finalized. League standings and season records have been updated.",
    leagueLabel: "Sunday AM",
    timeLabel: "Yesterday",
    unread: false,
    deleted: false,
  },
  {
    id: "registration-open",
    category: "registration",
    title: "Registration Is Open",
    message:
      "Registration for the upcoming session is now available. Register before the deadline to be considered for a team.",
    leagueLabel: "All TME Leagues",
    timeLabel: "2 days ago",
    unread: false,
    deleted: false,
  },
];

const MESSAGE_TOPICS: MessageTopic[] = [
  {
    id: "leagueDirector",
    label: "League Staff",
    description:
      "Ask about scheduling, team placement, league concerns, registration, or general league operations.",
    starterMessage:
      "Hello! Thanks for contacting League Staff. Please tell us how we can help you today.",
    icon: "account-tie-outline",
  },
  {
    id: "appSupport",
    label: "App Support",
    description:
      "Report an app problem or request help using a feature.",
    starterMessage:
      "Hello! Thanks for contacting League Staff. Please describe the app issue or feature you need help with.",
    icon: "headset",
  },
  {
    id: "gameScoreIssue",
    label: "Game / Score Issue",
    description:
      "Report an incorrect score, result, game time, missing game, or standings issue.",
    starterMessage:
      "Hello! Thanks for contacting League Staff. Please include the week, teams, and a brief description of the game or score issue so we can review it as quickly as possible.",
    icon: "scoreboard-outline",
  },
  {
    id: "leagueQuestion",
    label: "League Question",
    description:
      "Ask about rules, registration, rosters, eligibility, or league policies.",
    starterMessage:
      "Hello! Thanks for contacting League Staff. Please enter your league question below.",
    icon: "message-question-outline",
  },
];

const notificationAppearance: Record<
  NotificationCategory,
  {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    color: string;
  }
> = {
  facility: {
    icon: "office-building-marker-outline",
    color: RED,
  },
  schedule: {
    icon: "calendar-month-outline",
    color: PURPLE,
  },
  scores: {
    icon: "scoreboard-outline",
    color: GOLD,
  },
  registration: {
    icon: "account-plus-outline",
    color: GREEN,
  },
  general: {
    icon: "bullhorn-outline",
    color: PURPLE,
  },
};

export default function InboxScreen() {
  const { width } = useWindowDimensions();
  const { selectedLeagueId } = useLeague();

  const {
    setUnreadNotificationCount,
    setUnreadMessageCount,
  } = useInbox();

  const [activeView, setActiveView] =
    useState<InboxView>("notifications");

  const [notificationFilter, setNotificationFilter] =
    useState<NotificationFilter>("all");

  const [filterVisible, setFilterVisible] =
    useState(false);

  const [topicVisible, setTopicVisible] =
    useState(false);

  const [selectedTopicId, setSelectedTopicId] =
    useState<MessageTopicId | null>(null);

  const [messageDraft, setMessageDraft] =
    useState("");

  const [chatMessages, setChatMessages] =
    useState<Partial<Record<MessageTopicId, ChatMessage[]>>>(
      {},
    );

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(
      INITIAL_NOTIFICATIONS,
    );

  const leagueId =
    selectedLeagueId === "pickup" ||
    selectedLeagueId === "taj" ||
    selectedLeagueId === "tme"
      ? selectedLeagueId
      : "tme";

  const filterWidth = Math.min(
    Math.max(width * 0.72, 270),
    315,
  );

  const topicFilterWidth = Math.min(
    Math.max(width * 0.72, 270),
    315,
  );

  const selectedTopic = useMemo(
    () =>
      MESSAGE_TOPICS.find(
        (topic) => topic.id === selectedTopicId,
      ) ?? null,
    [selectedTopicId],
  );

  const visibleNotifications = useMemo(() => {
    if (notificationFilter === "deleted") {
      return notifications.filter(
        (notification) =>
          notification.deleted,
      );
    }

    if (notificationFilter === "unread") {
      return notifications.filter(
        (notification) =>
          !notification.deleted &&
          notification.unread,
      );
    }

    return notifications.filter(
      (notification) =>
        !notification.deleted,
    );
  }, [notificationFilter, notifications]);

  const unreadNotificationCount =
    notifications.filter(
      (notification) =>
        !notification.deleted &&
        notification.unread,
    ).length;

  const [unreadMessageCount] =
    useState(1);

  useEffect(() => {
    setUnreadNotificationCount(
      unreadNotificationCount,
    );
  }, [
    setUnreadNotificationCount,
    unreadNotificationCount,
  ]);

  useEffect(() => {
    setUnreadMessageCount(
      unreadMessageCount,
    );
  }, [
    setUnreadMessageCount,
    unreadMessageCount,
  ]);

  const filterLabel = useMemo(() => {
    if (activeView === "messages") {
      return "Sunday AM • All Messages";
    }

    switch (notificationFilter) {
      case "unread":
        return "Sunday AM • Unread Notifications";

      case "deleted":
        return "Sunday AM • Recently Deleted";

      case "all":
      default:
        return "Sunday AM • All Notifications";
    }
  }, [activeView, notificationFilter]);

  const currentChatMessages = selectedTopicId
    ? chatMessages[selectedTopicId] ?? []
    : [];

  const markNotificationRead = (
    notificationId: string,
  ) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              unread: false,
            }
          : notification,
      ),
    );
  };

  const deleteNotification = (
    notification: NotificationItem,
  ) => {
    Alert.alert(
      "Delete notification?",
      "Are you sure you want to delete this notification?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setNotifications((current) =>
              current.map((item) =>
                item.id === notification.id
                  ? {
                      ...item,
                      deleted: true,
                      unread: false,
                      deletedAtLabel:
                        "Deleted today",
                    }
                  : item,
              ),
            );

            Alert.alert(
              "Notification deleted",
              "This notification was moved to Recently Deleted.",
              [
                {
                  text: "Undo",
                  onPress: () =>
                    restoreNotification(
                      notification.id,
                    ),
                },
                {
                  text: "OK",
                },
              ],
            );
          },
        },
      ],
    );
  };

  const restoreNotification = (
    notificationId: string,
  ) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              deleted: false,
              deletedAtLabel: undefined,
            }
          : notification,
      ),
    );
  };

  const permanentlyDeleteNotification = (
    notification: NotificationItem,
  ) => {
    Alert.alert(
      "Delete permanently?",
      "This notification cannot be recovered after it is permanently deleted.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete Permanently",
          style: "destructive",
          onPress: () => {
            setNotifications((current) =>
              current.filter(
                (item) =>
                  item.id !== notification.id,
              ),
            );
          },
        },
      ],
    );
  };

  const selectMessageTopic = (
    topicId: MessageTopicId,
  ) => {
    setSelectedTopicId(topicId);
    setMessageDraft("");
    setTopicVisible(false);

    setChatMessages((current) => {
      if (current[topicId]) {
        return current;
      }

      const topic = MESSAGE_TOPICS.find(
        (item) => item.id === topicId,
      );

      return {
        ...current,
        [topicId]: topic
          ? [
              {
                id: `${topicId}-welcome`,
                sender: "admin",
                text: topic.starterMessage,
              },
            ]
          : [],
      };
    });
  };

  const sendMessage = () => {
    const trimmedMessage = messageDraft.trim();

    if (!selectedTopicId || !trimmedMessage) {
      return;
    }

    const nextMessage: ChatMessage = {
      id: `${selectedTopicId}-${Date.now()}`,
      sender: "user",
      text: trimmedMessage,
    };

    setChatMessages((current) => ({
      ...current,
      [selectedTopicId]: [
        ...(current[selectedTopicId] ?? []),
        nextMessage,
      ],
    }));

    setMessageDraft("");
  };

  const openSupport = () => {
    router.push({
      pathname:
        "/inbox/support",
      params: {
        leagueSelection: leagueId,
      },
    });
  };

  const openResources = () => {
    router.push({
      pathname:
        "/inbox/resources",
      params: {
        leagueSelection: leagueId,
      },
    });
  };

  return (
    <ScreenLayout
      title="Inbox">
      {/* Primary Inbox filter */}
      <View style={styles.filterArea}>
        <TouchableOpacity
          style={[
            styles.filterPill,
            {
              width: filterWidth,
            },
          ]}
          activeOpacity={0.84}
          onPress={() =>
            setFilterVisible(true)
          }
          accessibilityRole="button"
          accessibilityLabel="Open inbox filters"
        >
          <Ionicons
            name="options-outline"
            size={17}
            color={PURPLE}
          />

          <Text
            style={styles.filterText}
            numberOfLines={1}
          >
            {filterLabel}
          </Text>

          <Ionicons
            name="chevron-down"
            size={16}
            color={PURPLE}
          />
        </TouchableOpacity>
      </View>

      {/* Main Inbox information card */}
      <View style={styles.infoCardWrapper}>
        <View style={styles.infoCard}>
          <MaterialCommunityIcons
            name={
              activeView === "notifications"
                ? "inbox-outline"
                : "message-text-outline"
            }
            size={22}
            color={PURPLE}
          />

          <View style={styles.infoTextArea}>
            <Text style={styles.infoTitle}>
              {notificationFilter === "deleted" &&
              activeView === "notifications"
                ? "Recently Deleted"
                : activeView === "notifications"
                  ? "Inbox"
                  : "Messages"}
            </Text>

            <Text style={styles.infoText}>
              {notificationFilter === "deleted" &&
              activeView === "notifications"
                ? "Restore notifications or permanently remove them."
                : activeView === "notifications"
                  ? "League updates and direct messages in one place."
                  : "Select a topic and message league staff directly."}
            </Text>
          </View>
        </View>
      </View>

      {/* Notifications / Messages tabs */}
      <View style={styles.tabRow}>
        <InboxTab
          label="Notifications"
          icon="notifications-outline"
          count={unreadNotificationCount}
          selected={
            activeView === "notifications"
          }
          onPress={() => {
            setActiveView("notifications");

            if (
              notificationFilter ===
              "deleted"
            ) {
              setNotificationFilter("all");
            }
          }}
        />

        <InboxTab
          label="Messages"
          icon="chatbubble-outline"
          count={unreadMessageCount}
          selected={activeView === "messages"}
          onPress={() => {
            setActiveView("messages");
            setNotificationFilter("all");
          }}
        />
      </View>

      {activeView === "notifications" ? (
        /* Notifications remain unchanged */
        <View style={styles.contentOuter}>
          <View style={styles.listCard}>
            {visibleNotifications.length > 0 ? (
              visibleNotifications.map(
                (notification, index) => (
                  <React.Fragment
                    key={notification.id}
                  >
                    {notificationFilter ===
                    "deleted" ? (
                      <DeletedNotificationRow
                        notification={
                          notification
                        }
                        onRestore={() =>
                          restoreNotification(
                            notification.id,
                          )
                        }
                        onDeletePermanently={() =>
                          permanentlyDeleteNotification(
                            notification,
                          )
                        }
                      />
                    ) : (
                      <NotificationRow
                        notification={
                          notification
                        }
                        onRead={() =>
                          markNotificationRead(
                            notification.id,
                          )
                        }
                        onDelete={() =>
                          deleteNotification(
                            notification,
                          )
                        }
                      />
                    )}

                    {index <
                      visibleNotifications.length -
                        1 && (
                      <View
                        style={styles.divider}
                      />
                    )}
                  </React.Fragment>
                ),
              )
            ) : (
              <EmptyState
                icon={
                  notificationFilter ===
                  "deleted"
                    ? "trash-outline"
                    : "notifications-off-outline"
                }
                title={
                  notificationFilter ===
                  "deleted"
                    ? "No deleted notifications"
                    : "No notifications"
                }
                message={
                  notificationFilter ===
                  "deleted"
                    ? "Deleted notifications will appear here."
                    : "You're all caught up."
                }
              />
            )}
          </View>
        </View>
      ) : (
        /* New Messages experience */
        <>
          <View style={styles.topicFilterArea}>
            <TouchableOpacity
              style={[
                styles.topicFilterPill,
                {
                  width: topicFilterWidth,
                },
              ]}
              activeOpacity={0.84}
              onPress={() =>
                setTopicVisible(true)
              }
              accessibilityRole="button"
              accessibilityLabel="Select message topic"
            >
              <MaterialCommunityIcons
                name={
                  selectedTopic?.icon ??
                  "message-processing-outline"
                }
                size={18}
                color={PURPLE}
              />

              <Text
                style={styles.topicFilterText}
                numberOfLines={1}
              >
                {selectedTopic?.label ??
                  "Select Message Topic"}
              </Text>

              <Ionicons
                name="chevron-down"
                size={16}
                color={PURPLE}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.topicInfoWrapper}>
            <View style={styles.topicInfoCard}>
              <View style={styles.topicInfoIcon}>
                <MaterialCommunityIcons
                  name={
                    selectedTopic?.icon ??
                    "message-question-outline"
                  }
                  size={23}
                  color={PURPLE}
                />
              </View>

              <View style={styles.topicInfoTextArea}>
                <Text style={styles.topicInfoTitle}>
                  {selectedTopic?.label ??
                    "Select What You Need Help With"}
                </Text>

                <Text style={styles.topicInfoText}>
                  {selectedTopic?.description ??
                    "Choose a message topic above to begin a conversation with the appropriate league staff member."}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.chatCardWrapper}>
            <View
              style={[
                styles.chatCard,
                !selectedTopic &&
                  styles.chatCardDisabled,
              ]}
            >
              <View style={styles.chatHeader}>
                <View style={styles.chatHeaderTextArea}>
                  <Text style={styles.chatTitle}>
                    {selectedTopic?.label ??
                      "Messages"}
                  </Text>

                  <Text style={styles.chatSubtitle}>
                    {selectedTopic
                      ? "Sunday AM • League Staff"
                      : "Select a topic to begin"}
                  </Text>
                </View>

                <View
                  style={[
                    styles.chatStatusDot,
                    !selectedTopic &&
                      styles.chatStatusDotDisabled,
                  ]}
                />
              </View>

              <View style={styles.chatBody}>
                {!selectedTopic ? (
                  <View style={styles.chatEmptyState}>
                    <MaterialCommunityIcons
                      name="message-lock-outline"
                      size={32}
                      color="#AAA5B5"
                    />

                    <Text style={styles.chatEmptyTitle}>
                      Select a Message Topic
                    </Text>

                    <Text style={styles.chatEmptyText}>
                      Choose a topic above to begin chatting with League Staff.
                    </Text>
                  </View>
                ) : (
                  currentChatMessages.map(
                    (message) => (
                      <View
                        key={message.id}
                        style={[
                          styles.chatBubble,
                          message.sender === "user"
                            ? styles.userBubble
                            : styles.adminBubble,
                        ]}
                      >
                        <Text
                          style={[
                            styles.chatSender,
                            message.sender === "user" &&
                              styles.userBubbleText,
                          ]}
                        >
                          {message.sender === "user"
                            ? "You"
                            : "League Staff"}
                        </Text>

                        <Text
                          style={[
                            styles.chatMessageText,
                            message.sender === "user" &&
                              styles.userBubbleText,
                          ]}
                        >
                          {message.text}
                        </Text>
                      </View>
                    ),
                  )
                )}
              </View>

              <View style={styles.chatInputRow}>
                <TextInput
                  value={messageDraft}
                  onChangeText={setMessageDraft}
                  placeholder={
                    selectedTopic
                      ? "Type your message..."
                      : "Select a topic first..."
                  }
                  placeholderTextColor="#9B97A3"
                  editable={Boolean(selectedTopic)}
                  multiline
                  maxLength={1000}
                  style={[
                    styles.chatInput,
                    !selectedTopic &&
                      styles.chatInputDisabled,
                  ]}
                  accessibilityLabel="Message input"
                />

                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    (!selectedTopic ||
                      !messageDraft.trim()) &&
                      styles.sendButtonDisabled,
                  ]}
                  activeOpacity={0.84}
                  disabled={
                    !selectedTopic ||
                    !messageDraft.trim()
                  }
                  onPress={sendMessage}
                  accessibilityRole="button"
                  accessibilityLabel="Send message"
                >
                  <Ionicons
                    name="send"
                    size={18}
                    color={WHITE}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      )}

      {/* Purple action buttons */}
      <View style={styles.bottomButtonRow}>
        <TouchableOpacity
          style={styles.bottomButton}
          activeOpacity={0.84}
          onPress={openSupport}
        >
          <MaterialCommunityIcons
            name="headset"
            size={20}
            color={WHITE}
          />

          <Text style={styles.bottomButtonText}>
            Support
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomButton}
          activeOpacity={0.84}
          onPress={openResources}
        >
          <Ionicons
            name="folder-open-outline"
            size={20}
            color={WHITE}
          />

          <Text style={styles.bottomButtonText}>
            Resources
          </Text>
        </TouchableOpacity>
      </View>

      {/* Primary Inbox filter sheet */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setFilterVisible(false)
        }
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() =>
            setFilterVisible(false)
          }
        >
          <Pressable
            style={styles.filterSheet}
            onPress={(event) =>
              event.stopPropagation()
            }
          >
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                Inbox Filter
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setFilterVisible(false)
                }
              >
                <Ionicons
                  name="close"
                  size={25}
                  color={PURPLE}
                />
              </TouchableOpacity>
            </View>

            {activeView === "notifications" ? (
              <>
                <FilterRow
                  label="All Notifications"
                  selected={
                    notificationFilter ===
                    "all"
                  }
                  onPress={() =>
                    setNotificationFilter(
                      "all",
                    )
                  }
                />

                <FilterRow
                  label="Unread Notifications"
                  selected={
                    notificationFilter ===
                    "unread"
                  }
                  onPress={() =>
                    setNotificationFilter(
                      "unread",
                    )
                  }
                />

                <View
                  style={
                    styles.filterSectionDivider
                  }
                />

                <FilterRow
                  label="Recently Deleted"
                  selected={
                    notificationFilter ===
                    "deleted"
                  }
                  destructive
                  icon="trash-outline"
                  onPress={() =>
                    setNotificationFilter(
                      "deleted",
                    )
                  }
                />
              </>
            ) : (
              <FilterRow
                label="All Messages"
                selected
                onPress={() => undefined}
              />
            )}

            <TouchableOpacity
              style={styles.applyButton}
              activeOpacity={0.84}
              onPress={() =>
                setFilterVisible(false)
              }
            >
              <Text style={styles.applyButtonText}>
                Apply
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Message topic filter sheet */}
      <Modal
        visible={topicVisible}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setTopicVisible(false)
        }
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() =>
            setTopicVisible(false)
          }
        >
          <Pressable
            style={styles.filterSheet}
            onPress={(event) =>
              event.stopPropagation()
            }
          >
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                Message Topic
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setTopicVisible(false)
                }
              >
                <Ionicons
                  name="close"
                  size={25}
                  color={PURPLE}
                />
              </TouchableOpacity>
            </View>

            {MESSAGE_TOPICS.map((topic) => (
              <TouchableOpacity
                key={topic.id}
                style={styles.topicOption}
                activeOpacity={0.8}
                onPress={() =>
                  selectMessageTopic(topic.id)
                }
              >
                <View style={styles.topicOptionLeft}>
                  <View
                    style={
                      styles.topicOptionIcon
                    }
                  >
                    <MaterialCommunityIcons
                      name={topic.icon}
                      size={21}
                      color={PURPLE}
                    />
                  </View>

                  <View
                    style={
                      styles.topicOptionTextArea
                    }
                  >
                    <Text
                      style={
                        styles.topicOptionTitle
                      }
                    >
                      {topic.label}
                    </Text>

                    <Text
                      style={
                        styles.topicOptionDescription
                      }
                      numberOfLines={2}
                    >
                      {topic.description}
                    </Text>
                  </View>
                </View>

                <Ionicons
                  name={
                    selectedTopicId === topic.id
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={22}
                  color={
                    selectedTopicId === topic.id
                      ? PURPLE
                      : "#A9A5B0"
                  }
                />
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenLayout>
  );
}

type InboxTabProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  count: number;
  selected: boolean;
  onPress: () => void;
};

function InboxTab({
  label,
  icon,
  count,
  selected,
  onPress,
}: InboxTabProps) {
  return (
    <TouchableOpacity
      style={[
        styles.inboxTab,
        selected &&
          styles.inboxTabSelected,
      ]}
      activeOpacity={0.82}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={17}
        color={PURPLE}
      />

      <Text
        style={[
          styles.inboxTabText,
          selected &&
            styles.inboxTabTextSelected,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>

      {count > 0 && (
        <View style={styles.tabBadge}>
          <Text style={styles.tabBadgeText}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

type NotificationRowProps = {
  notification: NotificationItem;
  onRead: () => void;
  onDelete: () => void;
};

function NotificationRow({
  notification,
  onRead,
  onDelete,
}: NotificationRowProps) {
  const appearance =
    notificationAppearance[
      notification.category
    ];

  return (
    <Pressable
      style={styles.notificationRow}
      onPress={onRead}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationTitleArea}>
          <MaterialCommunityIcons
            name={appearance.icon}
            size={21}
            color={appearance.color}
          />

          <Text
            style={[
              styles.notificationTitle,
              notification.unread &&
                styles.notificationTitleUnread,
            ]}
          >
            {notification.title}
          </Text>

          {notification.unread && (
            <View style={styles.unreadDot} />
          )}
        </View>
      </View>

      <Text style={styles.notificationMessage}>
        {notification.message}
      </Text>

      <View style={styles.notificationFooter}>
        <Text style={styles.notificationMeta}>
          {notification.leagueLabel}
          {"  •  "}
          {notification.timeLabel}
        </Text>

        <TouchableOpacity
          style={styles.deleteButton}
          activeOpacity={0.7}
          onPress={onDelete}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${notification.title}`}
        >
          <Ionicons
            name="trash-outline"
            size={19}
            color={PURPLE}
          />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

type DeletedNotificationRowProps = {
  notification: NotificationItem;
  onRestore: () => void;
  onDeletePermanently: () => void;
};

function DeletedNotificationRow({
  notification,
  onRestore,
  onDeletePermanently,
}: DeletedNotificationRowProps) {
  const appearance =
    notificationAppearance[
      notification.category
    ];

  return (
    <View style={styles.deletedRow}>
      <View style={styles.notificationTitleArea}>
        <MaterialCommunityIcons
          name={appearance.icon}
          size={21}
          color={appearance.color}
        />

        <Text style={styles.notificationTitle}>
          {notification.title}
        </Text>
      </View>

      <Text
        style={styles.deletedMessage}
        numberOfLines={2}
      >
        {notification.message}
      </Text>

      <Text style={styles.deletedDate}>
        {notification.deletedAtLabel ??
          "Recently deleted"}
      </Text>

      <View style={styles.deletedActionRow}>
        <TouchableOpacity
          style={styles.restoreButton}
          activeOpacity={0.8}
          onPress={onRestore}
        >
          <Ionicons
            name="refresh-outline"
            size={17}
            color={PURPLE}
          />

          <Text style={styles.restoreButtonText}>
            Restore
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.permanentDeleteButton}
          activeOpacity={0.8}
          onPress={onDeletePermanently}
        >
          <Ionicons
            name="trash-outline"
            size={17}
            color={WHITE}
          />

          <Text
            style={
              styles.permanentDeleteButtonText
            }
          >
            Delete Forever
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

type EmptyStateProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
};

function EmptyState({
  icon,
  title,
  message,
}: EmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <Ionicons
        name={icon}
        size={30}
        color={PURPLE}
      />

      <Text style={styles.emptyTitle}>
        {title}
      </Text>

      <Text style={styles.emptyText}>
        {message}
      </Text>
    </View>
  );
}

type FilterRowProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  destructive?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
};

function FilterRow({
  label,
  selected,
  onPress,
  destructive = false,
  icon,
}: FilterRowProps) {
  const rowColor = destructive
    ? RED
    : PURPLE;

  return (
    <TouchableOpacity
      style={[
        styles.filterRow,
        destructive &&
          styles.filterRowDestructive,
      ]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.filterRowLabelArea}>
        {icon && (
          <Ionicons
            name={icon}
            size={19}
            color={rowColor}
          />
        )}

        <Text
          style={[
            styles.filterRowText,
            selected &&
              styles.filterRowTextSelected,
            destructive &&
              styles.filterRowTextDestructive,
          ]}
        >
          {label}
        </Text>
      </View>

      <Ionicons
        name={
          selected
            ? "radio-button-on"
            : "radio-button-off"
        }
        size={22}
        color={
          selected
            ? rowColor
            : "#A9A5B0"
        }
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  filterArea: {
    width: "100%",
    alignItems: "flex-start",
    paddingLeft: 8,
    marginBottom: 16,
  },

  filterPill: {
    minHeight: 43,
    paddingHorizontal: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: WHITE,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,

    shadowColor: "#000000",
    shadowOpacity: 0.11,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 4,
  },

  filterText: {
    flex: 1,
    color: TEXT,
    fontSize: 12,
    fontWeight: "800",
  },

  infoCardWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },

  infoCard: {
    width: "82%",
    minHeight: 72,
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: WHITE,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,

    shadowColor: "#000000",
    shadowOpacity: 0.13,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 5,
  },

  infoTextArea: {
    flex: 1,
  },

  infoTitle: {
    marginBottom: 3,
    color: PURPLE,
    fontSize: 16,
    fontWeight: "900",
  },

  infoText: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "600",
  },

  tabRow: {
    width: "88%",
    alignSelf: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  inboxTab: {
    flex: 1,
    minHeight: 42,
    paddingHorizontal: 9,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: LIGHT_PURPLE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,

    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 3,
  },

  inboxTabSelected: {
    backgroundColor: WHITE,
    borderColor: "#D2C9E6",

    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 6,
  },

  inboxTabText: {
    color: PURPLE,
    fontSize: 11,
    fontWeight: "700",
  },

  inboxTabTextSelected: {
    fontWeight: "900",
  },

  tabBadge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    backgroundColor: RED,
    alignItems: "center",
    justifyContent: "center",
  },

  tabBadgeText: {
    color: WHITE,
    fontSize: 9,
    fontWeight: "900",
  },

  contentOuter: {
    width: "100%",
    alignItems: "center",
  },

  listCard: {
    width: "91%",
    marginBottom: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: WHITE,
    overflow: "hidden",

    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 4,
  },

  notificationRow: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  notificationHeader: {
    marginBottom: 9,
  },

  notificationTitleArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  notificationTitle: {
    flex: 1,
    color: TEXT,
    fontSize: 13,
    fontWeight: "800",
  },

  notificationTitleUnread: {
    fontWeight: "900",
  },

  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: RED,
  },

  notificationMessage: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },

  notificationFooter: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  notificationMeta: {
    flex: 1,
    marginRight: 12,
    color: PURPLE,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
  },

  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: LIGHT_PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },

  deletedRow: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  deletedMessage: {
    marginTop: 9,
    color: MUTED,
    fontSize: 11,
    lineHeight: 17,
    fontWeight: "600",
  },

  deletedDate: {
    marginTop: 8,
    color: RED,
    fontSize: 10,
    fontWeight: "800",
  },

  deletedActionRow: {
    marginTop: 13,
    flexDirection: "row",
    gap: 9,
  },

  restoreButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: WHITE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  restoreButtonText: {
    color: PURPLE,
    fontSize: 11,
    fontWeight: "900",
  },

  permanentDeleteButton: {
    flex: 1.25,
    minHeight: 40,
    borderRadius: 15,
    backgroundColor: RED,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  permanentDeleteButtonText: {
    color: WHITE,
    fontSize: 10,
    fontWeight: "900",
  },

  divider: {
    height: 1,
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: DIVIDER,
  },

  emptyState: {
    minHeight: 165,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    marginTop: 9,
    color: PURPLE,
    fontSize: 14,
    fontWeight: "900",
  },

  emptyText: {
    marginTop: 4,
    color: MUTED,
    fontSize: 11,
    fontWeight: "600",
  },

  topicFilterArea: {
    width: "100%",
    alignItems: "flex-start",
    paddingLeft: 8,
    marginBottom: 15,
  },

  topicFilterPill: {
    minHeight: 43,
    paddingHorizontal: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: WHITE,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,

    shadowColor: "#000000",
    shadowOpacity: 0.11,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 4,
  },

  topicFilterText: {
    flex: 1,
    color: TEXT,
    fontSize: 12,
    fontWeight: "800",
  },

  topicInfoWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },

  topicInfoCard: {
    width: "91%",
    minHeight: 82,
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: WHITE,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 4,
  },

  topicInfoIcon: {
    width: 42,
    height: 42,
    marginRight: 12,
    borderRadius: 21,
    backgroundColor: LIGHT_PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },

  topicInfoTextArea: {
    flex: 1,
  },

  topicInfoTitle: {
    marginBottom: 4,
    color: PURPLE,
    fontSize: 14,
    fontWeight: "900",
  },

  topicInfoText: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 17,
    fontWeight: "600",
  },

  chatCardWrapper: {
    width: "100%",
    alignItems: "center",
  },

  chatCard: {
    width: "91%",
    minHeight: 320,
    marginBottom: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: WHITE,
    overflow: "hidden",

    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 4,
  },

  chatCardDisabled: {
    opacity: 0.78,
  },

  chatHeader: {
    minHeight: 62,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: DIVIDER,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  chatHeaderTextArea: {
    flex: 1,
    marginRight: 12,
  },

  chatTitle: {
    color: PURPLE,
    fontSize: 16,
    fontWeight: "900",
  },

  chatSubtitle: {
    marginTop: 4,
    color: MUTED,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
  },

  chatStatusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: GREEN,
  },

  chatStatusDotDisabled: {
    backgroundColor: "#AAA5B5",
  },

  chatBody: {
    minHeight: 210,
    padding: 15,
    justifyContent: "flex-start",
  },

  chatEmptyState: {
    minHeight: 160,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  chatEmptyTitle: {
    marginTop: 10,
    color: PURPLE,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900",
  },

  chatEmptyText: {
    marginTop: 6,
    color: MUTED,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
    textAlign: "center",
  },

  chatBubble: {
    maxWidth: "88%",
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 17,
  },

  adminBubble: {
    alignSelf: "flex-start",
    backgroundColor: LIGHT_PURPLE,
    borderBottomLeftRadius: 5,
  },

  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: PURPLE,
    borderBottomRightRadius: 5,
  },

  chatSender: {
    marginBottom: 4,
    color: PURPLE,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "900",
  },

  chatMessageText: {
    color: TEXT,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
  },

  userBubbleText: {
    color: WHITE,
  },

  chatInputRow: {
    minHeight: 70,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: DIVIDER,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },

  chatInput: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SCREEN,
    color: TEXT,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },

  chatInputDisabled: {
    backgroundColor: "#F0EEF3",
    color: MUTED,
  },

  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000000",
    shadowOpacity: 0.14,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 3,
  },

  sendButtonDisabled: {
    backgroundColor: DISABLED,
    shadowOpacity: 0,
    elevation: 0,
  },

  bottomButtonRow: {
    width: "91%",
    alignSelf: "center",
    flexDirection: "row",
    gap: 12,
  },

  bottomButton: {
    flex: 1,
    minHeight: 47,
    paddingHorizontal: 12,
    borderRadius: 17,
    backgroundColor: PURPLE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,

    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 5,
  },

  bottomButtonText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: "900",
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.36)",
    justifyContent: "flex-end",
  },

  filterSheet: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 34,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: WHITE,
  },

  sheetHandle: {
    width: 44,
    height: 5,
    marginBottom: 18,
    borderRadius: 3,
    backgroundColor: "#D6D2DD",
    alignSelf: "center",
  },

  sheetHeader: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sheetTitle: {
    color: PURPLE,
    fontSize: 20,
    fontWeight: "900",
  },

  filterRow: {
    minHeight: 52,
    paddingHorizontal: 14,
    marginBottom: 9,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SCREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  filterRowDestructive: {
    borderColor: "#F3C8C5",
    backgroundColor: "#FFF5F4",
  },

  filterRowLabelArea: {
    flex: 1,
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  filterRowText: {
    color: TEXT,
    fontSize: 14,
    fontWeight: "700",
  },

  filterRowTextSelected: {
    color: PURPLE,
    fontWeight: "900",
  },

  filterRowTextDestructive: {
    color: RED,
  },

  filterSectionDivider: {
    height: 1,
    marginVertical: 8,
    backgroundColor: DIVIDER,
  },

  applyButton: {
    minHeight: 50,
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000000",
    shadowOpacity: 0.18,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 4,
  },

  applyButtonText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "900",
  },

  topicOption: {
    minHeight: 72,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 9,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SCREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  topicOptionLeft: {
    flex: 1,
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  topicOptionIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: LIGHT_PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },

  topicOptionTextArea: {
    flex: 1,
  },

  topicOptionTitle: {
    color: PURPLE,
    fontSize: 13,
    fontWeight: "900",
  },

  topicOptionDescription: {
    marginTop: 3,
    color: MUTED,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "600",
  },
});