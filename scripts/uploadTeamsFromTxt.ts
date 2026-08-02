import { teamSeed } from "tools/teamSeed";
import { db } from "../src/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { SEASON_ID } from "src/config/constants";

console.log("🚀 UPLOADING TEAMS");

async function upload() {
  for (const team of teamSeed) {
    const ref = doc(
      db,
      "leagues",
      team.league.toLowerCase(),
      "seasons",
      SEASON_ID,
      "teams",
      team.teamId
    );

    console.log("➡️", ref.path);

    await setDoc(ref, {
      ...team,
      season: SEASON_ID,
      updatedAt: new Date().toISOString(),
    });
  }

  console.log("🔥 TEAMS DONE");
}

upload();