import type {
  OfferingRegistration,
} from "../config/offerings";

export type ResolvedRegistrationStatus = {
  status: "Open" | "Closed";
  closesInDays: number | null;
  reopensInDays: number | null;
  reopensAt: string | null;
};

function parseDate(value?: string): Date | null {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function daysUntil(date: Date, now: Date): number {
  return Math.max(
    0,
    Math.ceil(
      (date.getTime() - now.getTime()) / 86400000
    )
  );
}

export function resolveRegistrationStatus(
  registration?: OfferingRegistration,
  now: Date = new Date()
): ResolvedRegistrationStatus {
  const opensAt = parseDate(registration?.opensAt);
  const closesAt = parseDate(registration?.closesAt);
  const reopensAt = parseDate(registration?.reopensAt);

  const override =
    registration?.manualOverride ?? "automatic";

  let isOpen = false;

  if (override === "open") {
    isOpen = true;
  } else if (override === "closed") {
    isOpen = false;
  } else if (registration?.automaticScheduling === true) {
    isOpen =
      opensAt !== null &&
      now >= opensAt &&
      (closesAt === null || now < closesAt);
  }

  return {
    status: isOpen ? "Open" : "Closed",

    closesInDays:
      isOpen && closesAt
        ? daysUntil(closesAt, now)
        : null,

    reopensInDays:
      !isOpen && reopensAt && reopensAt > now
        ? daysUntil(reopensAt, now)
        : null,

    reopensAt:
      !isOpen && reopensAt
        ? reopensAt.toISOString()
        : null,
  };
}
