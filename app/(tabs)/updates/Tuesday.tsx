import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function TuesdayAMScreen() {
  const navigation = useNavigation();

  const notifications = [
    {
      id: "1",
      message: "",
      timestamp: new Date(),
    },
    
  ];

  const formatDate = (date: Date) => {
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Tuesday PM {"\n"} Updates</Text>

        {/* Empty spacer to balance layout */}
        <View style={{ width: 30 }} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.timestamp}>
              {formatDate(item.timestamp)}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 20,
  },

  backButton: {
    width: 30,
  },

  backArrow: {
    fontSize: 24,
    fontWeight: "bold",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  message: {
    fontSize: 16,
    marginBottom: 5,
  },

  timestamp: {
    fontSize: 12,
    color: "gray",
  },
});