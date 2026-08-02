// sendNotification.ts
import fetch from "node-fetch";

const sendNotification = async (token: string, message: string) => {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: token,
      sound: "default",
      title: "League Update",
      body: message,
      data: { message },
    }),
  });
};

// Example usage
const token = "<EXPO_PUSH_TOKEN>";
sendNotification(token, "Game starts at 7 PM!")
  .then(() => console.log("Notification sent"))
  .catch(console.error);