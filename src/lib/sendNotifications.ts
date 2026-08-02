// src/lib/sendNotification.ts
import fetch from "node-fetch";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Send a push notification to all users for a specific league day
 * @param leagueDay string - the league day (e.g., "sunday")
 * @param message string - the notification message
 */
export const sendNotificationToLeagueDay = async (leagueDay: string, message: string) => {
  try {
    // 1️⃣ Get all users who have a push token
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    const tokens: string[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.expoPushToken) {
        tokens.push(data.expoPushToken);
      }
    });

    if (!tokens.length) {
      console.log("No push tokens found.");
      return;
    }

    // 2️⃣ Send notifications via Expo Push API
    const notifications = tokens.map((token) => ({
      to: token,
      sound: "default",
      title: "League Update",
      body: message,
      data: { leagueDay },
    }));

    const chunks = [];
    const chunkSize = 100; // Expo recommends sending in batches of 100
    for (let i = 0; i < notifications.length; i += chunkSize) {
      chunks.push(notifications.slice(i, i + chunkSize));
    }

    for (const chunk of chunks) {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chunk),
      });
    }

    console.log(`Notifications sent for league day: ${leagueDay}`);
  } catch (err) {
    console.error("Error sending notifications:", err);
  }
};