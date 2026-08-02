// src/components/services/firebase/gameServices

import { db } from "src/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

/**
 * Listen to full session (weeks + metadata)
 */
export const listenToSession = (
  sessionId: string,
  callback: (data: any) => void
) => {
  const ref = doc(db, "schedule", sessionId);

  return onSnapshot(ref, (docSnap) => {
    if (!docSnap.exists()) {
      callback(null);
      return;
    }

    callback(docSnap.data());
  });
};