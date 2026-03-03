import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BASE_WIDTH = 375; // reference width for scaling
const scaleFont = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

export default function Schedule() {
  const [selected, setSelected] = useState("");

  // ✅ NEW: Full Date Formatter
  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00"); // prevents iOS timezone shift

    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();

    const getOrdinal = (n: number) => {
      if (n > 3 && n < 21) return "th";
      switch (n % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };

    return `${month} ${day}${getOrdinal(day)}, ${year}`;
  };

  const eventsData: { [key: string]: string[] } = {

    // Sunday ALL Dates
  
    "2026-03-01": [
      "Week 2 of 10",
      "09am: Rich (0-0) \n Dex (0-1)",
      "10am: Tom (1-0) \n Edwards (1-0)",
      "11am: TeeJ (0-0) \n Ziller (0-1)",
      "12pm: Timmy (1-0) \n Prince (0-0)",
      "Bye: Dale (0-1)",
    ],

    "2026-03-08": [
      "Week 3 of 10",
      "09am: Tom (1-1) \n Rich (1-0)",
      "10am: Dex (0-2) \n Dale (0-1)",
      "11am: Timmy (2-0) \n Edwards (2-0)",
      "12pm: Prince (0-1) \n Ziller (0-2)",
      "Bye: TeeJ (1-0)",
    ],

    "2026-03-15": [
      "Week 4 of 10",
      "09am: Dale (0-0) \n TeeJ (0-0)",
      "10am: Ziller (0-0) \n Rich (0-0)",
      "11am: Tom (0-0) \n Prince (0-0)",
      "12pm: Timmy (0-0) \n Dex (0-0)",
      "Bye: Edwards (0-0)",
    ],

    "2026-03-22": [
      "Week 5 of 10",
      "09am: Tom (0-0) \n Ziller (0-0)",
      "10am: Edwards (0-0) \n Rich (0-0)",
      "11am: Timmy (0-0) \n TeeJ (0-0)",
      "12pm: Prince (0-0) \n Rich (0-0)",
      "Bye: Dex (0-0)",

      "*-Registration is due for next session, by week 6, \n March 29th, 2026* \n",

    ],

    "2026-03-29": [
      "Week 6 of 10",
      "09am: Tom (0-0) \n TeeJ (0-0)",
      "10am: Dale (0-0) \n Rich (0-0)",
      "11am: Ziller (0-0) \n Edwards (0-0)",
      "12pm: Prince (0-0) \n Dex (0-0)",
      "Bye: Timmy (0-0)",

    ],

     "2026-04-05": [
      "Week 7 of 10",
      "09am: Rich (0-0) \n TeeJ (0-0)",
      "10am: Dex (0-0) \n Edwards (0-0)",
      "11am: Ziller (0-0) \n Dale (0-0)",
      "12pm: Timmy (0-0) \n Tom (0-0)",
      "Bye: Prince (0-0)",

    ],

    "2026-04-12": [
      "Week 8 of 10",
      "09am: NO GAME",
      "10am: NO GAME",
      "11am: TeeJ (0-0) \n Dex (0-0)",
      "12pm: Prince (0-0) \n Edwards (0-0)",
      "Bye: Rich (0-0) \n Ziller (0-0) \n Tom (0-0) \n Timmy (0-0) \n Dale (0-0)",
    
    ],

    "2026-04-19": [
      "Week 9 of 10",
      "09am: NO GAME",
      "10am: NO GAME",
      "11am: Timmy (0-0) \n Dale (0-0)",
      "12pm: TeeJ (0-0) \n Prince (0-0)",
      "Bye: Tom (0-0) \n Ziller (0-0) \n Dex (0-0) \n Edwards (0-0) \n Rich (0-0)",
    
    ],

    "2026-04-26": [
      "Week 10 of 10",
      "09am: Tom (0-0) \n Dale (0-0)",
      "10am: Ziller (0-0) \n Dex (0-0)",
      "11am: Edwards (0-0) \n TeeJ (0-0)",
      "12pm: Prince (0-0) \n Rich (0-0)",
      "Bye: Timmy (0-0)",

    ],
    // Monday ALL Dates

    "2026-03-02": [
      "Week 7 of 8",
      "07pm: Mac Concrete (3-3) \n Gross (2-4)",
      "08pm: Justin (6-0) \n Mark (3-3)",
      "09pm: Ladd (3-3) \n Double Curry (1-5)",
    ],

    "2026-03-09": [
      "Week 8 of 8",
      "07pm: Ladd (3-3) \n Mark (3-3)",
      "08pm: Mac Concrete (3-3) \n Double Curry (1-5)",
      "09pm: Justin (6-0) \n Gross (2-4)",
    ],
 
    // Wednesday ALL Dates; 
    // use "" w/ * to get italized ex: 
    // "*-ALL playoff teams please bring $35 PER GAME for ref fees* \n",
    //  "*-Winner of 9pm game please stay for championship photo* \n",
    //  "*-Good luck to all teams !!!*",
    
    "2026-03-04": [
      "Week 1 of 10",
      "07pm: ReLeaf (0-0) \n Mark (0-0)",
      "08pm: Gross (0-0) \n Gibson (0-0)",
      "09pm: Edwards (0-0) \n Will (0-0)",
      "Bye: Rob (0-0)",
    ],

    "2026-03-11": [
      "Week 2 of 10",
      "07pm: Rob (0-0) \n Gross (0-0)",
      "08pm: ReLeaf (0-0) \n Gibson (0-0)",
      "09pm: Mark (0-0) \n Edwards (0-0)",
      "Bye: Will (0-0)",
    ],

    "2026-03-18": [
      "Week 3 of 10",
      "07pm: ReLeaf (0-0) \n Will (0-0)",
      "08pm: Gross (0-0) \n Mark (0-0)",
      "09pm: Rob (0-0) \n Gibson (0-0)",
      "Bye: Edwards (0-0)",
    ],

    "2026-03-25": [
      "Week 4 of 10",
      "07pm: Gross (0-0) \n Edwards (0-0)",
      "08pm: ReLeaf (0-0) \n Rob (0-0)",
      "09pm: Gibson (0-0) \n Will (0-0)",
      "Bye: Mark (0-0)",
    ],

    "2026-04-01": [
      "Week 5 of 10",
      "07pm: Mark (0-0) \n Gibson (0-0)",
      "08pm: Will (0-0) \n Rob (0-0)",
      "09pm: ReLeaf (0-0) \n Edwards (0-0)",
      "Bye: Gross (0-0)",
    ],

    "2026-04-08": [
      "Spring Break school closed, NO GAMES",
    ],

    "2026-04-15": [
      "Week 6 of 10",
      "07pm: Mark (0-0) \n Will (0-0)",
      "08pm: ReLeaf (0-0) \n Gross (0-0)",
      "09pm: Rob (0-0) \n Edwards (0-0)",
      "Bye: Gibson (0-0)",
    ],

    "2026-04-22": [
      "Week 7 of 10",
      "07pm: Gross (0-0) \n Will (0-0)",
      "08pm: Mark (0-0) \n Rob (0-0)",
      "09pm: Gibson (0-0) \n Edwards (0-0)",
      "Bye: ReLeaf (0-0)",
    ],

    "2026-04-29": [
      "Week 8 of 10",
      "07pm: ReLeaf (0-0) \n Mark (0-0)",
      "08pm: Gross (0-0) \n Gibson (0-0)",
      "09pm: Edwards (0-0) \n Will (0-0)",
      "Bye: Rob (0-0)",
    ],

    "2026-05-06": [
      "Week 9 of 10",
      "07pm: Will (0-0) \n Mark (0-0)",
      "08pm: Rob (0-0) \n Gibson (0-0)",
      "09pm: NO GAME",
      "Bye: Edwards (0-0) \n ReLeaf (0-0) \n Gross (0-0)",
    ],

    "2026-05-13": [
      "Week 10 of 10",
      "07pm: ReLeaf (0-0) \n Gross (0-0)",
      "08pm: Rob (0-0) \n Edwards (0-0)",
      "09pm: NO GAME",
      "Bye: Will (0-0) \n Gibson (0-0) \n Mark (0-0)",
    ],

  };

  const eventsForSelectedDate = eventsData[selected] || [];
  const weekTitle = eventsForSelectedDate.length > 0 ? eventsForSelectedDate[0] : "";
  const notes = eventsForSelectedDate.filter((item) => item.startsWith("*"));

  const parseGameBlocks = () => {
    const grid: string[][] = [];

    eventsForSelectedDate.forEach((item, index) => {
      // 🚫 Skip week title and notes
if (index === 0 || item.startsWith("Week") || item.startsWith("Playoff")) {
  return;
}

if (item.startsWith("*")) {
  return;
}
  if (item.toLowerCase().startsWith("bye")) {
  const content = item.split("Bye:")[1]?.trim();
  if (!content) return;

  const teams = content.split("\n");

  teams.forEach((teamLine, index) => {
    const match = teamLine.trim().match(/(.*)\s\((.*)\)/);
    const team = match ? match[1] : teamLine.trim();
    const record = match ? `(${match[2]})` : "";

    if (index === 0) {
      grid.push(["Bye:", team, record]);
    } else {
      grid.push(["", team, record]);
    }
  });

  grid.push(["", "", ""]); // spacing row
  return;
}

      if (item.includes("\n")) {
        const [firstLine, secondLine] = item.split("\n");
        const timeSplit = firstLine.split(":");
        const time = timeSplit[0] + ":";
        const firstTeamFull = timeSplit.slice(1).join(":").trim();
        const secondTeamFull = secondLine.trim();

        const match1 = firstTeamFull.match(/(.*)\s\((.*)\)/);
        const team1 = match1 ? match1[1] : firstTeamFull;
        const record1 = match1 ? `(${match1[2]})` : "";

        const match2 = secondTeamFull.match(/(.*)\s\((.*)\)/);
        const team2 = match2 ? match2[1] : secondTeamFull;
        const record2 = match2 ? `(${match2[2]})` : "";

        grid.push([time, team1, record1]);
        grid.push(["", team2, record2]);
        grid.push(["", "", ""]);
        return;
      }

      const timeSplit = item.split(":");
      const time = timeSplit[0] + ":";
      const teamFull = timeSplit.slice(1).join(":").trim();
      const match = teamFull.match(/(.*)\s\((.*)\)/);
      const team = match ? match[1] : teamFull;
      const record = match ? `(${match[2]})` : "";
      grid.push([time, team, record]);
      grid.push(["", "", ""]);
    });

    return grid;
  };

  const gridData = parseGameBlocks();

  return (
    <ScrollView style={styles.container}>
      <Calendar
        onDayPress={(day) => setSelected(day.dateString)}
        markedDates={{
          [selected]: { selected: true, selectedColor: "#3b82f6" },
        }}
        style={{ width: Dimensions.get("window").width }}
        theme={{
          todayTextColor: "#3b82f6",
          arrowColor: "#3b82f6",
          textDayFontSize: 12,
          textMonthFontSize: 14,
          textDayHeaderFontSize: 12,
        }}
      />

      {/* ✅ UPDATED DATE DISPLAY */}
      <Text style={styles.dateText}>
        {selected ? formatFullDate(selected) : "Select a date"}
      </Text>

      {weekTitle ? <Text style={styles.weekTitle}>{weekTitle}</Text> : null}

      <View style={styles.gridContainer}>
        <View style={[styles.gridRow, styles.gridHeader]}>
          <Text style={[styles.gridCell, styles.gridHeaderText]}>Time</Text>
          <Text style={[styles.gridCell, styles.gridHeaderText]}>Team</Text>
          <Text style={[styles.gridCell, styles.gridHeaderText]}>Record</Text>
        </View>

        {gridData.map((row, index) => (
          <View key={index} style={styles.gridRow}>
            {row.map((cell, i) => (
              <Text key={i} style={styles.gridCell}>
                {cell}
              </Text>
            ))}
          </View>
        ))}
      </View>

      {notes.length > 0 && (
        <View style={styles.notesContainer}>
          {notes.map((note, index) => (
            <Text key={index} style={styles.noteText}>
              {note.replace(/\*/g, "")}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },

  dateText: { 
    marginTop: 8, 
    textAlign: "center", 
    fontSize: scaleFont(16), 
    fontWeight: "600" 
  },

  weekTitle: { 
    textAlign: "center", 
    fontSize: scaleFont(16), 
    fontWeight: "600", 
    marginVertical: 6 
  },

  gridContainer: { marginTop: 8, marginHorizontal: 5 },
  gridRow: { flexDirection: "row", borderBottomWidth: 0.3, borderColor: "#ccc" },
  gridHeader: { backgroundColor: "#f2f2f2" },
  gridCell: { flex: 1, textAlign: "center", paddingVertical: 3, fontSize: scaleFont(14) },
  gridHeaderText: { fontWeight: "700", fontSize: scaleFont(14) },

  notesContainer: { marginTop: 8, marginHorizontal: 10 },
  noteText: { 
    fontSize: scaleFont(12), 
    fontStyle: "italic", 
    fontWeight: "bold",
    textAlign: "center", 
    marginBottom: 3, 
    color: "#555" },
});






