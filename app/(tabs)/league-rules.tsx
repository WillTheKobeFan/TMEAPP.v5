import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import SubScreenLayout from "src/components/SubScreenLayout";

export default function LeagueRulesScreen() {
  return (
    <SubScreenLayout title="League Rules" titleFontSize={20}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>League Rules</Text>
          <Text style={styles.infoText}>
            League rules are based off standard high school basketball rules,
            with minor adjustments for adult league play.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏀 Gameplay Rules</Text>
          <Text style={styles.rule}>• Games consist of two 20-minute halves</Text>
          <Text style={styles.rule}>• Running clock except during specific situations</Text>
          <Text style={styles.rule}>• Teams must have at least 4 players to start</Text>
          <Text style={styles.rule}>• 5 players on the court at all times</Text>
          <Text style={styles.rule}>• Overtime periods are 2 minutes</Text>
          <Text style={styles.rule}>• Each overtime begins with a jump ball</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏱️ Clock Rules</Text>
          <Text style={styles.rule}>• Clock runs continuously unless stopped by rule</Text>
          <Text style={styles.rule}>• Clock stops for timeouts, injuries, and official stoppages</Text>
          <Text style={styles.rule}>• Clock stops on all whistles during the final 2 minutes</Text>
          <Text style={styles.rule}>• Clock stops after made baskets during the final 2 minutes</Text>
          <Text style={styles.rule}>• Mercy rule may apply during the final 5 minutes</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏀 Scoring</Text>
          <Text style={styles.rule}>• Field goal = 2 points</Text>
          <Text style={styles.rule}>• Three-point field goal = 3 points</Text>
          <Text style={styles.rule}>• Free throw = 1 point</Text>
          <Text style={styles.rule}>• Team with the most points at the end of regulation wins</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚨 Fouls</Text>
          <Text style={styles.rule}>• Personal fouls are tracked individually</Text>
          <Text style={styles.rule}>• A player fouls out after 5 personal fouls</Text>
          <Text style={styles.rule}>• Technical fouls count toward player foul totals</Text>
          <Text style={styles.rule}>• Unsportsmanlike behavior may result in ejection</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Bonus Free Throws</Text>
          <Text style={styles.rule}>• Team fouls reset at halftime</Text>
          <Text style={styles.rule}>• 7th team foul begins 1-and-1 bonus</Text>
          <Text style={styles.rule}>• 10th team foul begins double bonus</Text>
          <Text style={styles.rule}>• Double bonus awards two free throws</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔄 Substitutions</Text>
          <Text style={styles.rule}>• Substitutions may be made during dead-ball situations</Text>
          <Text style={styles.rule}>• Players must report before entering the game</Text>
          <Text style={styles.rule}>• Officials must allow substitutes onto the court</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏰ Timeouts</Text>
          <Text style={styles.rule}>• Each team receives 3 full timeouts per game</Text>
          <Text style={styles.rule}>• Unused timeouts do not carry into overtime</Text>
          <Text style={styles.rule}>• Each overtime includes 1 additional timeout</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏀 Jump Ball / Possession</Text>
          <Text style={styles.rule}>• Opening tip determines first possession</Text>
          <Text style={styles.rule}>• Alternating possession arrow is used after the opening tip</Text>
          <Text style={styles.rule}>• Held balls are awarded by possession arrow</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚫 Violations</Text>
          <Text style={styles.rule}>• Traveling</Text>
          <Text style={styles.rule}>• Double dribble</Text>
          <Text style={styles.rule}>• Carrying / palming</Text>
          <Text style={styles.rule}>• Backcourt violation</Text>
          <Text style={styles.rule}>• 5-second closely guarded count</Text>
          <Text style={styles.rule}>• 3-second lane violation</Text>
          <Text style={styles.rule}>• Out of bounds</Text>
          <Text style={styles.rule}>• Goaltending</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚖️ Sportsmanship</Text>
          <Text style={styles.rule}>• Respect officials, opponents, teammates, and staff</Text>
          <Text style={styles.rule}>• Excessive profanity may result in a technical foul</Text>
          <Text style={styles.rule}>• Fighting results in immediate ejection</Text>
          <Text style={styles.rule}>• Suspensions may be issued by league administration</Text>
          <Text style={styles.rule}>• League director decisions are final</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 League-Specific Rules</Text>
          <Text style={styles.rule}>• No dunking during warmups</Text>
          <Text style={styles.rule}>• Forfeit time is 10 minutes after scheduled start</Text>
          <Text style={styles.rule}>• Captains are responsible for roster eligibility</Text>
          <Text style={styles.rule}>• Players may only appear on approved rosters</Text>
          <Text style={styles.rule}>• Forfeit score may be recorded as 20–0</Text>
          <Text style={styles.rule}>• Technical fouls may result in free throws and possession</Text>
        </View>
      </ScrollView>
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },

  infoCard: {
    backgroundColor: "#F3EAFE",
    borderWidth: 1,
    borderColor: "#6A0DAD",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6A0DAD",
    marginBottom: 6,
  },

  infoText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },

  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
  },

  rule: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
    marginBottom: 4,
  },
});