// scripts/checkSchedules.ts

import { db } from "../src/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

const leagues = ["sunday", "monday", "wednesday"];
const seasonId = "spring2026";

async function checkLeague(league: string) {
  const weeksRef = collection(
    db,
    "leagues",
    league,
    "seasons",
    seasonId,
    "weeks"
  );

  const q = query(weeksRef, orderBy("week", "asc"));
  const snap = await getDocs(q);

  console.log(`\n${league}`);
  console.log("Weeks found:", snap.size);

  snap.docs.forEach((docSnap) => {
    const data = docSnap.data();
    console.log(
      `Week ${data.week}: ${data.games?.length ?? 0} games, ${
        data.bye?.length ?? data.byes?.length ?? 0
      } byes`
    );
  });
}

async function main() {
  console.log("Checking uploaded schedules...");

  for (const league of leagues) {
    await checkLeague(league);
  }

  console.log("\nSchedule check complete.");
}

main().catch((error) => {
  console.error("Schedule check failed:", error);
});