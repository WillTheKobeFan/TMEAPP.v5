// app/(tabs)/chat.tsx

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  View,
  TextInput,
  Button,
  ScrollView,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Keyboard,
} from "react-native";

import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { db } from "../../src/lib/firebase";
import ScreenLayout from "src/components/ScreenLayout";
import { useTextSize } from "src/context/TextSizeContext";

const userUID = "USER_123";
const TAB_BAR_HEIGHT = 70;
const NAV_BAR_HEIGHT = 70;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HORIZONTAL_PADDING = 20;
const MAX_BUBBLE_WIDTH = SCREEN_WIDTH * 0.75;

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { textScale } = useTextSize();

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const q = query(
      collection(db, "chats", userUID, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: any[] = [];

      snapshot.forEach((doc) =>
        msgs.push({
          id: doc.id,
          ...doc.data(),
        })
      );

      setMessages(msgs);

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({
          animated: true,
        });
      }, 100);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        scrollRef.current?.scrollToEnd({
          animated: true,
        });
      }
    );

    return () => showSub.remove();
  }, []);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    await addDoc(
      collection(db, "chats", userUID, "messages"),
      {
        sender: "admin",
        text: input,
        timestamp: serverTimestamp(),
      }
    );

    setInput("");

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({
        animated: true,
      });
    }, 50);
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "";

    const date = new Date(timestamp.seconds * 1000);

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;

    return `${hour12}:${minutes
      .toString()
      .padStart(2, "0")}${ampm.toLowerCase()}`;
  };

  return (
    <ScreenLayout title="Chat" hideBack>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={
          Platform.OS === "ios" ? "padding" : undefined
        }
        keyboardVerticalOffset={
          Platform.OS === "ios"
            ? NAV_BAR_HEIGHT + TAB_BAR_HEIGHT
            : NAV_BAR_HEIGHT
        }
      >
        <View style={styles.container}>
          {/* Messages */}
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={[
              styles.messagesContent,
              {
                paddingBottom:
                  TAB_BAR_HEIGHT + 60 + insets.bottom,
              },
            ]}
            style={styles.messagesScroll}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((item) => {
              const isAdmin = item.sender === "admin";

              return (
                <View
                  key={item.id}
                  style={styles.messageWrap}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      isAdmin
                        ? styles.adminBubble
                        : styles.userBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        {
                          fontSize: 14 * textScale,
                          color: isAdmin ? "#fff" : "#000",
                        },
                      ]}
                    >
                      {item.text}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.timestampCentered,
                      {
                        fontSize: 12 * textScale,
                      },
                    ]}
                  >
                    {formatTimestamp(item.timestamp)}
                  </Text>
                </View>
              );
            })}
          </ScrollView>

          {/* Input Bar */}
          <View
            style={[
              styles.inputContainer,
              {
                bottom: TAB_BAR_HEIGHT + insets.bottom,
              },
            ]}
          >
            <TextInput
              style={[
                styles.input,
                {
                  fontSize: 15 * textScale,
                },
              ]}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              value={input}
              onChangeText={setInput}
            />

            <Button
              title="Send"
              onPress={sendMessage}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  messagesScroll: {
    flex: 1,
  },

  messagesContent: {
    padding: 20,
  },

  messageWrap: {
    marginVertical: 10,
  },

  messageBubble: {
    padding: 12,
    borderRadius: 8,
    maxWidth: MAX_BUBBLE_WIDTH,
  },

  adminBubble: {
    backgroundColor: "#250f74ff",
    alignSelf: "flex-end",
    marginRight: HORIZONTAL_PADDING + 10,
  },

  userBubble: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-start",
    marginLeft: HORIZONTAL_PADDING,
  },

  messageText: {
    fontSize: 14,
  },

  timestampCentered: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
    textAlign: "center",
  },

  inputContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    backgroundColor: "#fff",
    color: "#111",
  },
});