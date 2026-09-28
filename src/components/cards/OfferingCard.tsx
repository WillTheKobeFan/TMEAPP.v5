// src/components/cards/OfferingCard.tsx

import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";

import {
  OFFERING_STATUS_IDS,
  OFFERING_TYPE_IDS,
  type Offering,
  type OfferingStatusId,
  type OfferingTypeId,
} from "../../config/offerings";

// =============================================================================
// TYPES
// =============================================================================

export type OfferingCardProps = {
  offering: Offering;

  /**
   * Called when the entire card is pressed.
   */
  onPress?: (offering: Offering) => void;

  /**
   * Optional primary action.
   *
   * Examples:
   * - View
   * - Register
   * - Book
   * - View Program
   */
  onActionPress?: (offering: Offering) => void;

  /**
   * Overrides the automatically generated action label.
   */
  actionLabel?: string;

  /**
   * Extra parent styling.
   */
  style?: ViewStyle;
};

// =============================================================================
// TYPE DISPLAY
// =============================================================================

function getOfferingTypeLabel(
  type: OfferingTypeId
): string {
  switch (type) {
    case OFFERING_TYPE_IDS.LEAGUE:
      return "League";

    case OFFERING_TYPE_IDS.TOURNAMENT:
      return "Tournament";

    case OFFERING_TYPE_IDS.PICKUP:
      return "Pickup";

    case OFFERING_TYPE_IDS.CAMP:
      return "Camp";

    case OFFERING_TYPE_IDS.CLINIC:
      return "Clinic";

    case OFFERING_TYPE_IDS.TRAINING:
      return "Training";

    case OFFERING_TYPE_IDS.CLASS:
      return "Class";

    case OFFERING_TYPE_IDS.LESSON:
      return "Lesson";

    case OFFERING_TYPE_IDS.MEMBERSHIP:
      return "Membership";

    case OFFERING_TYPE_IDS.RENTAL:
      return "Rental";

    case OFFERING_TYPE_IDS.EVENT:
      return "Event";

    case OFFERING_TYPE_IDS.PARTY:
      return "Party";

    case OFFERING_TYPE_IDS.CUSTOM:
      return "Offering";

    default:
      return "Offering";
  }
}

// =============================================================================
// ICONS
// =============================================================================

function getOfferingIcon(
  type: OfferingTypeId
): string {
  switch (type) {
    case OFFERING_TYPE_IDS.LEAGUE:
      return "🏆";

    case OFFERING_TYPE_IDS.TOURNAMENT:
      return "🏅";

    case OFFERING_TYPE_IDS.PICKUP:
      return "🏀";

    case OFFERING_TYPE_IDS.CAMP:
      return "🏕️";

    case OFFERING_TYPE_IDS.CLINIC:
      return "📋";

    case OFFERING_TYPE_IDS.TRAINING:
      return "💪";

    case OFFERING_TYPE_IDS.CLASS:
      return "🎓";

    case OFFERING_TYPE_IDS.LESSON:
      return "🎯";

    case OFFERING_TYPE_IDS.MEMBERSHIP:
      return "🎟️";

    case OFFERING_TYPE_IDS.RENTAL:
      return "📅";

    case OFFERING_TYPE_IDS.EVENT:
      return "⭐";

    case OFFERING_TYPE_IDS.PARTY:
      return "🎉";

    case OFFERING_TYPE_IDS.CUSTOM:
      return "•";

    default:
      return "•";
  }
}

// =============================================================================
// STATUS
// =============================================================================

function getStatusLabel(
  status: OfferingStatusId
): string {
  switch (status) {
    case OFFERING_STATUS_IDS.DRAFT:
      return "Draft";

    case OFFERING_STATUS_IDS.UPCOMING:
      return "Upcoming";

    case OFFERING_STATUS_IDS.REGISTRATION_OPEN:
      return "Registration Open";

    case OFFERING_STATUS_IDS.ACTIVE:
      return "Active";

    case OFFERING_STATUS_IDS.COMPLETED:
      return "Completed";

    case OFFERING_STATUS_IDS.ARCHIVED:
      return "Archived";

    default:
      return "Available";
  }
}

// =============================================================================
// METADATA
// =============================================================================

function capitalize(value: string): string {
  if (!value) {
    return value;
  }

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

function getScheduleLabel(
  offering: Offering
): string | undefined {
  if (offering.schedule?.label) {
    return offering.schedule.label;
  }

  if (
    offering.schedule?.days &&
    offering.schedule.days.length > 0
  ) {
    return offering.schedule.days
      .map(capitalize)
      .join(" • ");
  }

  return undefined;
}

function formatMoney(
  value: number | undefined,
  currency = "USD"
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `$${value}`;
  }
}

function getPricingLabel(
  offering: Offering
): string | undefined {
  const pricing = offering.pricing;

  if (!pricing) {
    return undefined;
  }

  if (pricing.free) {
    return "Free";
  }

  if (pricing.label) {
    return pricing.label;
  }

  const currency = pricing.currency ?? "USD";

  const individualPrice = formatMoney(
    pricing.individualPrice,
    currency
  );

  if (individualPrice) {
    return individualPrice;
  }

  const teamPrice = formatMoney(
    pricing.teamPrice,
    currency
  );

  if (teamPrice) {
    return `${teamPrice} / team`;
  }

  const perSessionPrice = formatMoney(
    pricing.perSessionPrice,
    currency
  );

  if (perSessionPrice) {
    return `${perSessionPrice} / session`;
  }

  const perWeekPrice = formatMoney(
    pricing.perWeekPrice,
    currency
  );

  if (perWeekPrice) {
    return `${perWeekPrice} / week`;
  }

  const perMonthPrice = formatMoney(
    pricing.perMonthPrice,
    currency
  );

  if (perMonthPrice) {
    return `${perMonthPrice} / month`;
  }

  const memberPrice = formatMoney(
    pricing.memberPrice,
    currency
  );

  const nonMemberPrice = formatMoney(
    pricing.nonMemberPrice,
    currency
  );

  if (memberPrice && nonMemberPrice) {
    return `${memberPrice} member • ${nonMemberPrice} non-member`;
  }

  if (memberPrice) {
    return `${memberPrice} member`;
  }

  if (nonMemberPrice) {
    return `${nonMemberPrice} non-member`;
  }

  return undefined;
}

/**
 * Builds the compact secondary line underneath the title.
 *
 * Examples:
 *
 * Adult Men's Basketball • Sunday
 * Youth Basketball Camp
 * $30 / session
 * Sunday • $80
 */
function getMetadataLabel(
  offering: Offering
): string | undefined {
  const values: string[] = [];

  const audience = offering.audience?.label;
  const schedule = getScheduleLabel(offering);
  const pricing = getPricingLabel(offering);

  if (audience) {
    values.push(audience);
  }

  if (
    schedule &&
    !values.some(
      (value) =>
        value.toLowerCase() ===
        schedule.toLowerCase()
    )
  ) {
    values.push(schedule);
  }

  if (
    pricing &&
    !values.some(
      (value) =>
        value.toLowerCase() ===
        pricing.toLowerCase()
    )
  ) {
    values.push(pricing);
  }

  if (values.length === 0) {
    return undefined;
  }

  return values.slice(0, 2).join(" • ");
}

// =============================================================================
// ACTION LABEL
// =============================================================================

function getDefaultActionLabel(
  offering: Offering
): string {
  if (
    offering.status ===
    OFFERING_STATUS_IDS.REGISTRATION_OPEN
  ) {
    return "Register";
  }

  switch (offering.type) {
    case OFFERING_TYPE_IDS.RENTAL:
    case OFFERING_TYPE_IDS.LESSON:
      return "Book";

    case OFFERING_TYPE_IDS.TRAINING:
      return "View Training";

    case OFFERING_TYPE_IDS.CAMP:
    case OFFERING_TYPE_IDS.CLINIC:
    case OFFERING_TYPE_IDS.CLASS:
      return "View Program";

    case OFFERING_TYPE_IDS.MEMBERSHIP:
      return "View Membership";

    case OFFERING_TYPE_IDS.LEAGUE:
    case OFFERING_TYPE_IDS.TOURNAMENT:
    case OFFERING_TYPE_IDS.PICKUP:
      return "View";

    case OFFERING_TYPE_IDS.EVENT:
    case OFFERING_TYPE_IDS.PARTY:
      return "View Details";

    default:
      return "View Details";
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function OfferingCard({
  offering,
  onPress,
  onActionPress,
  actionLabel,
  style,
}: OfferingCardProps) {
  const typeLabel =
    getOfferingTypeLabel(offering.type);

  const icon =
    getOfferingIcon(offering.type);

  const statusLabel =
    getStatusLabel(offering.status);

  const metadataLabel =
    getMetadataLabel(offering);

  const resolvedActionLabel =
    actionLabel ??
    getDefaultActionLabel(offering);

  const handleCardPress = () => {
    onPress?.(offering);
  };

  const handleActionPress = () => {
    onActionPress?.(offering);
  };

  return (
    <Pressable
      onPress={
        onPress
          ? handleCardPress
          : undefined
      }
      disabled={!onPress}
      accessibilityRole={
        onPress ? "button" : undefined
      }
      accessibilityLabel={offering.name}
      style={({ pressed }) => [
        styles.card,
        pressed &&
          onPress &&
          styles.cardPressed,
        style,
      ]}
    >
      {/* ============================================================= */}
      {/* ICON */}
      {/* ============================================================= */}

      <View style={styles.iconContainer}>
        <Text style={styles.icon}>
          {icon}
        </Text>
      </View>

      {/* ============================================================= */}
      {/* MAIN CONTENT */}
      {/* ============================================================= */}

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text
            style={styles.typeLabel}
            numberOfLines={1}
          >
            {typeLabel}
          </Text>

          <View style={styles.statusPill}>
            <Text
              style={styles.statusText}
              numberOfLines={1}
            >
              {statusLabel}
            </Text>
          </View>
        </View>

        <Text
          style={styles.title}
          numberOfLines={2}
        >
          {offering.name}
        </Text>

        {metadataLabel && (
          <Text
            style={styles.metadata}
            numberOfLines={2}
          >
            {metadataLabel}
          </Text>
        )}

        {/* =========================================================== */}
        {/* ACTION */}
        {/* =========================================================== */}

        {onActionPress && (
          <View style={styles.actionRow}>
            <Pressable
              onPress={handleActionPress}
              accessibilityRole="button"
              accessibilityLabel={
                `${resolvedActionLabel}: ${offering.name}`
              }
              style={({ pressed }) => [
                styles.actionButton,
                pressed &&
                  styles.actionButtonPressed,
              ]}
            >
              <Text
                style={styles.actionText}
                numberOfLines={1}
              >
                {resolvedActionLabel}
              </Text>

              <Text
                style={styles.actionArrow}
                accessibilityElementsHidden
                importantForAccessibility="no"
              >
                ›
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </Pressable>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  card: {
    width: "100%",

    flexDirection: "row",
    alignItems: "flex-start",

    backgroundColor: "#FFFFFF",

    borderRadius: 17,

    paddingHorizontal: 14,
    paddingVertical: 13,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 7,

    elevation: 3,
  },

  cardPressed: {
    opacity: 0.92,

    transform: [
      {
        scale: 0.995,
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // ICON
  // ---------------------------------------------------------------------------

  iconContainer: {
    width: 42,
    height: 42,

    borderRadius: 13,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#F4F1FB",

    marginRight: 11,
  },

  icon: {
    fontSize: 20,
  },

  // ---------------------------------------------------------------------------
  // CONTENT
  // ---------------------------------------------------------------------------

  content: {
    flex: 1,
    minWidth: 0,
  },

  topRow: {
    minHeight: 23,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    gap: 8,
  },

  typeLabel: {
    flex: 1,

    fontSize: 11,
    fontWeight: "800",

    color: "#6E6590",

    textTransform: "uppercase",
    letterSpacing: 0.55,
  },

  statusPill: {
    flexShrink: 0,

    paddingHorizontal: 8,
    paddingVertical: 3,

    borderRadius: 999,

    backgroundColor: "#F1EEF9",
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",

    color: "#250F74",
  },

  title: {
    marginTop: 1,

    fontSize: 16,
    fontWeight: "800",

    lineHeight: 20,

    color: "#17131F",
  },

  metadata: {
    marginTop: 3,

    fontSize: 12,
    fontWeight: "500",

    lineHeight: 16,

    color: "#777180",
  },

  // ---------------------------------------------------------------------------
  // ACTION
  // ---------------------------------------------------------------------------

  actionRow: {
    marginTop: 9,

    flexDirection: "row",
    justifyContent: "flex-end",
  },

  actionButton: {
    minWidth: 92,
    maxWidth: 180,

    minHeight: 34,

    paddingLeft: 14,
    paddingRight: 11,

    borderRadius: 11,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#250F74",
  },

  actionButtonPressed: {
    opacity: 0.84,
  },

  actionText: {
    flexShrink: 1,

    fontSize: 12,
    fontWeight: "800",

    color: "#FFFFFF",

    textAlign: "center",
  },

  actionArrow: {
    marginLeft: 9,

    fontSize: 18,
    fontWeight: "600",

    lineHeight: 20,

    color: "#FFFFFF",
  },
});