import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../src/lib/firebase";

const userUID = "USER_123";
const NAV_BAR_HEIGHT = 70; // height of your floating nav bar

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HORIZONTAL_PADDING = 20; // distance from screen edges
const MAX_BUBBLE_WIDTH = SCREEN_WIDTH * 0.75; // bubble max width

export default function ChatScreen() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const q = query(
      collection(db, "chats", userUID, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: any[] = [];
      snapshot.forEach((doc) => msgs.push({ id: doc.id, ...doc.data() }));
      setMessages(msgs);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    await addDoc(collection(db, "chats", userUID, "messages"), {
      sender: "admin",
      text: input,
      timestamp: serverTimestamp(),
    });

    setInput("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? NAV_BAR_HEIGHT + 20 : NAV_BAR_HEIGHT}
    >
      <View style={{ flex: 1, paddingBottom: NAV_BAR_HEIGHT }}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === "admin" ? styles.adminBubble : styles.userBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.sender === "admin" ? { color: "#fff" } : { color: "#000" },
                ]}
              >
                {item.text}
              </Text>
            </View>
          )}
          contentContainerStyle={{ paddingVertical: 10 }}
          style={{ flex: 1 }}
        />

        <View style={[styles.inputContainer, { marginBottom: 20 }]}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={input}
            onChangeText={setInput}
          />
          <Button title="Send" onPress={sendMessage} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  messageBubble: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    maxWidth: MAX_BUBBLE_WIDTH,
  },
  adminBubble: {
    backgroundColor: "#250f74ff",
    alignSelf: "flex-end",
    marginRight: HORIZONTAL_PADDING + 10, // inset admin bubble from right
  },
  userBubble: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-start",
    marginLeft: HORIZONTAL_PADDING, // inset user bubble from left
  },
  messageText: { color: "#000" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
});
