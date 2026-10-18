import type { Offering } from "../config/offerings";

export type OfferingDirectoryItem = {
  id: string;
  title: string;
  description: string;
  type: Offering["type"];
  status: Offering["status"];
  startDate: string | null;
  endDate: string | null;
  schedule: string | null;
  location: string | null;
  multiVenue: boolean;
  sport: string | null;
  trainingFocus: string | null;
  hasRegistration: boolean;
};

export function toOfferingDirectoryItem(
  offering: Offering
): OfferingDirectoryItem {
  return {
    id: offering.id,
    title: offering.shortName ?? offering.name,
    description: offering.description ?? "",
    type: offering.type,
    status: offering.status,
    startDate: offering.dates?.startDate ?? null,
    endDate: offering.dates?.endDate ?? null,
    schedule: offering.schedule?.label ?? null,
    location:
      offering.location?.facilityName ??
      offering.location?.venueName ??
      null,
    multiVenue: offering.location?.multiVenue ?? false,
    sport: offering.instruction?.sport ?? null,
    trainingFocus: offering.instruction?.focus ?? null,
    hasRegistration:
      offering.capabilities.includes("registration"),
  };
}
