// tools/uploadRostersFromExcel.ts

console.log("🔥 ROSTER SCRIPT STARTED");

import * as XLSX from "xlsx";
import path from "path";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../src/lib/firebase";

type RosterRow = {
  PlayerID?: string;
  League?: string;
  SeasonID?: string;
  TeamID?: string;
  TeamName?: string;
  DisplayName?: string;
  SearchName?: string;
  FirstName?: string;
  LastName?: string;
  Captain?: boolean | string;
  Status?: string;
};

const sheetArg = process.argv[2];

if (!sheetArg) {
  console.error("❌ Missing sheet name.");
  console.log(`Usage: npx ts-node tools/uploadRostersFromExcel.ts Sun`);
  process.exit(1);
}

const filePath = path.join(
  process.cwd(),
  "data",
  "rosters",
  "Rosters.2026.v1.2.xlsx"
);

console.log("FILE PATH:", filePath);

function clean(value: unknown): string {
  return String(value ?? "").replace(/\u00A0/g, " ").trim();
}

function toBoolean(value: unknown): boolean {
  const cleaned = clean(value).toLowerCase();
  return cleaned === "true" || cleaned === "yes" || cleaned === "1";
}

function normalizeLeague(value: string): string {
  const cleaned = value.toLowerCase();

  if (cleaned === "sun") return "sunday";
  if (cleaned === "mon") return "monday";
  if (cleaned === "tues" || cleaned === "tue") return "tuesday";
  if (cleaned === "wed") return "wednesday";

  return cleaned;
}

async function uploadRosters() {
  console.log("==============================");
  console.log("🚀 ROSTER UPLOAD STARTED");
  console.log("==============================");
  console.log(`📂 Workbook: ${filePath}`);
  console.log(`📄 Sheet: ${sheetArg}`);

  const workbook = XLSX.readFile(filePath);

  if (!workbook.SheetNames.includes(sheetArg)) {
    console.error(`❌ Sheet "${sheetArg}" not found.`);
    console.log("Available sheets:", workbook.SheetNames.join(", "));
    process.exit(1);
  }

  const sheet = workbook.Sheets[sheetArg];

  const rows = XLSX.utils.sheet_to_json<RosterRow>(sheet, {
    defval: "",
  });

  let uploaded = 0;
  let skipped = 0;

  for (const row of rows) {
    const playerId = clean(row.PlayerID);
    const league = normalizeLeague(clean(row.League || sheetArg));
    const seasonId = clean(row.SeasonID);
    const teamId = clean(row.TeamID);
    const teamName = clean(row.TeamName);
    const displayName = clean(row.DisplayName);

    if (!playerId || !league || !seasonId || !teamId || !displayName) {
      skipped++;
      continue;
    }

    const firstName = clean(row.FirstName);
    const lastName = clean(row.LastName);
    const rawSearchName = clean(row.SearchName);

    const searchName =
      rawSearchName ||
      [displayName, firstName, lastName]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    const player = {
      playerId,
      league,
      seasonId,
      teamId,
      teamName,
      displayName,
      searchName: searchName.toLowerCase(),
      firstName,
      lastName,
      captain: toBoolean(row.Captain),
      status: clean(row.Status).toLowerCase() || "active",
      updatedAt: new Date().toISOString(),
    };

    const ref = doc(
      db,
      "leagues",
      league,
      "seasons",
      seasonId,
      "rosters",
      playerId
    );

    await setDoc(ref, player, { merge: true });

    uploaded++;
    console.log(`✅ Uploaded: ${displayName} (${teamName})`);
  }

  console.log("");
  console.log("==============================");
  console.log("📦 FINAL STATS");
  console.log("==============================");
  console.log(`✅ Uploaded: ${uploaded}`);
  console.log(`⚠️ Skipped blank/incomplete rows: ${skipped}`);
  console.log("🏁 ROSTER UPLOAD COMPLETE");
}

uploadRosters().catch((error) => {
  console.error("❌ Upload failed:", error);
  process.exit(1);
});