import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { auth, db } from "../../../src/lib/firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function UpdatesLayout() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Sign in anonymously if no user
        await signInAnonymously(auth);
        return;
      }

      // Create Firestore document for this user if it doesn't exist
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          unreadCounts: {
            sundayAM: 0,
            mondayPM: 0,
            tuesdayPM: 0,
            wednesdayPM: 0,
          },
        },
        { merge: true } // merge ensures we don't overwrite existing data
      );
    });

    return () => unsubscribe();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
