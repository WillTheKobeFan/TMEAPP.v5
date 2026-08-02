import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SubScreenLayout from "src/components/SubScreenLayout";
import BackButton from "src/components/BackButton";

export default function TermsOfService() {
  return (
    <SubScreenLayout title="Terms of Service">

      <View style={styles.container}>
        <Text>
          Terms of Service

          Effective Date: [Insert Date]

          Welcome to [Your App Name] (“App”), operated by [Your League Name] (“we,” “us,” or “our”).

          By accessing or using the App, you agree to comply with and be bound by these Terms of Service.

          ────────────────

          1. Eligibility

          You must be at least 18 years old to create or use an account.

          By registering, you confirm that the information you provide is accurate and kept up to date.

          ────────────────

          2. League Participation

          Participation in any league, event, or basketball activity is voluntary.

          We reserve the right to approve, deny, suspend, or remove participants at our discretion to maintain fair play and community standards.

          ────────────────

          3. User Accounts

          You are responsible for:

          • Maintaining the confidentiality of your account
          • Securing your login information
          • All activity that occurs under your account

          ────────────────

          4. Acceptable Use

          You agree not to:

          • Use the App for unlawful purposes
          • Harass, abuse, threaten, or impersonate others
          • Submit false scores, statistics, schedules, or misleading information
          • Attempt to interfere with the operation of the App

          ────────────────

          5. Scores, Content & Updates

          Schedules, standings, scores, and notifications may be updated at any time.

          While we strive for accuracy, we do not guarantee that all information will always be complete, error-free, or immediately updated.

          ────────────────

          6. Suspension & Termination

          We may suspend or terminate access to the App at any time if these Terms are violated or if continued access negatively impacts the league or community.

          ────────────────

          7. Limitation of Liability

          Use of the App and participation in league activities is at your own risk.

          We are not responsible for injuries, damages, losses, scheduling conflicts, data inaccuracies, or interruptions related to App usage or league participation.

          ────────────────

          8. Changes to These Terms

          We may update these Terms periodically.

          Continued use of the App after changes become effective constitutes acceptance of the updated Terms.

          ────────────────

          9. Contact

          Questions about these Terms?

          Email: [Your Email]
          League: [Your League Name]
        </Text>
      </View>
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});