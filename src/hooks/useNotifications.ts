import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export const useNotifications = () => {
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "notifications"),
      (snapshot) => {
        let count = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();

          // simple example: unread logic (you can improve later)
          if (!data.readBy || data.readBy.length === 0) {
            count++;
          }
        });

        setTotalUnread(count);
      }
    );

    return () => unsubscribe();
  }, []);

  return { totalUnread };
};