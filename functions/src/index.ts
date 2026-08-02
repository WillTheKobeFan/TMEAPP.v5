import { setGlobalOptions } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import fetch from "node-fetch";

admin.initializeApp();

setGlobalOptions({ maxInstances: 10 });

export const sendLeagueNotification = onDocumentCreated(
  "notifications/{notificationId}",
  async (event) => {
    // ✅ Call .data() to get the actual document data
    const docData = event.data?.data();
    if (!docData) return;

    const { message, leagueDay } = docData;

    try {
      // Get all Expo push tokens
      const tokensSnap = await admin.firestore().collection("pushTokens").get();
      const tokens = tokensSnap.docs
        .map((doc) => doc.data().token)
        .filter(Boolean);

      if (tokens.length === 0) {
        console.log("No push tokens found.");
        return;
      }

      // Send notification to each token
      const sendPromises = tokens.map((token) =>
        fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: token,
            sound: "default",
            title: `League Update - ${leagueDay}`,
            body: message,
            data: { message, leagueDay },
          }),
        })
      );

      await Promise.all(sendPromises);
      console.log("Notifications sent:", tokens.length);
    } catch (err) {
      console.error("Error sending notifications:", err);
    }
  }
);