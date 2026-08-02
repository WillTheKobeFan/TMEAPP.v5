// src/lib/notifications.ts
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const createNotification = async ({
  title,
  message,
  leagueDay,
  recipients = ["ALL"], // default: all users
}: {
  title: string;
  message: string;
  leagueDay: string;
  recipients?: string[];
}) => {
  try {
    await addDoc(collection(db, "notifications"), {
      title,
      message,
      leagueDay,
      createdAt: serverTimestamp(),
      recipients,
      readBy: [],
    });
    console.log("Notification created!");
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};