import type { Offering } from "@/config/offerings";
import type { OrganizationId } from "@/config/organizations";
import { getConfiguredOfferingsForOrganization } from "@/data/offerings";

export type DirectoryOffering = {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  type: Offering["type"];
  status: Offering["status"];
  scheduleLabel: string;
  locationLabel: string;
  pricingLabel: string;
  registrationEnabled: boolean;
  source: Offering;
};

function getPricingLabel(offering: Offering): string {
  const pricing = offering.pricing;

  if (!pricing) {
    return "Pricing not provided";
  }

  if (pricing.free === true) {
    return "Free";
  }

  if (pricing.label) {
    return pricing.label;
  }

  const amount =
    pricing.individualPrice ??
    pricing.teamPrice ??
    pricing.perSessionPrice ??
    pricing.perWeekPrice ??
    pricing.perMonthPrice;

  if (amount === undefined) {
    return "Pricing not provided";
  }

  const currency = pricing.currency ?? "USD";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

export function toDirectoryOffering(
  offering: Offering
): DirectoryOffering {
  return {
    id: offering.id,
    organizationId: offering.organizationId,
    title: offering.shortName ?? offering.name,
    description: offering.description ?? "",
    type: offering.type,
    status: offering.status,
    scheduleLabel:
      offering.schedule?.label ??
      offering.schedule?.days?.join(" • ") ??
      "Schedule not provided",
    locationLabel:
      offering.location?.facilityName ??
      offering.location?.venueName ??
      "Location not provided",
    pricingLabel: getPricingLabel(offering),
    registrationEnabled:
      offering.capabilities.includes("registration"),
    source: offering,
  };
}

export function getDirectoryOfferings(
  organizationId: OrganizationId
): DirectoryOffering[] {
  return getConfiguredOfferingsForOrganization(
    organizationId
  ).map(toDirectoryOffering);
}
