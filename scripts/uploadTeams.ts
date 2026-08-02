import admin from "firebase-admin";
import { teamSeed } from "../tools/teamSeed";
import serviceAccount from "./serviceAccountKey.json";

// -------------------- FIREBASE INIT --------------------
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      serviceAccount as admin.ServiceAccount
    ),
  });
}

const db = admin.firestore();

// -------------------- UPLOAD TEAMS --------------------
export async function uploadTeams() {
  console.log("🚀 Uploading teams...");

  const batch = db.batch();

  for (const team of teamSeed) {
    const ref = db.collection("teams").doc(team.teamId);

    console.log(`→ ${team.teamId} (${team.displayName})`);

    batch.set(
      ref,
      {
        teamId: team.teamId,
        displayName: team.displayName,
        league: team.league,
        leagueCode: team.teamId.split("_")[0].toUpperCase(),
        active: true,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  }

  await batch.commit();

  console.log(`✅ Uploaded ${teamSeed.length} teams`);
}

// -------------------- RUN --------------------
(async () => {
  try {
    await uploadTeams();
    console.log("🏁 Teams upload complete");
  } catch (err) {
    console.error("❌ Upload failed:", err);
  }
})();