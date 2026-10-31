import AsyncStorage from "@react-native-async-storage/async-storage";

import type {
  CreateSandboxOrganizationInput,
  SandboxOrganization,
} from "./sandboxTypes";

const STORAGE_KEY = "@sportsync/sandbox-organizations/v1";

function isSandboxOrganization(
  value: unknown
): value is SandboxOrganization {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    (item.clientType === "organization" ||
      item.clientType === "training" ||
      item.clientType === "both") &&
    (item.facilityModel === "facility-based" ||
      item.facilityModel === "non-facility-based") &&
    item.environment === "sandbox" &&
    item.status === "setup" &&
    typeof item.createdAt === "string" &&
    typeof item.updatedAt === "string"
  );
}

export async function getSandboxOrganizations():
  Promise<SandboxOrganization[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);

  if (!stored) return [];

  const parsed: unknown = JSON.parse(stored);

  if (!Array.isArray(parsed)) {
    throw new Error("Invalid sandbox organization storage.");
  }

  if (!parsed.every(isSandboxOrganization)) {
    throw new Error("Invalid sandbox organization records.");
  }

  return parsed;
}

export async function createSandboxOrganization(
  input: CreateSandboxOrganizationInput
): Promise<SandboxOrganization> {
  const name = input.name.trim();

  if (!name) {
    throw new Error("Organization or training name is required.");
  }

  if (
    input.clientType !== "organization" &&
    input.clientType !== "training" &&
    input.clientType !== "both"
  ) {
    throw new Error("Invalid client type.");
  }

  if (
    input.facilityModel !== "facility-based" &&
    input.facilityModel !== "non-facility-based"
  ) {
    throw new Error("Invalid facility model.");
  }

  const existing = await getSandboxOrganizations();
  const normalizeName = (value: string) =>
    value.trim().replace(/\s+/g, " ").toLocaleLowerCase();

  const duplicate = existing.find(
    (item) => normalizeName(item.name) === normalizeName(name)
  );

  if (duplicate) {
    throw new Error(
      "Duplicate name: An organization or training client named " +
      duplicate.name +
      " already exists. Please use a different name, such as " +
      duplicate.name +
      " 2 or " +
      duplicate.name +
      " V2."
    );
  }

  const now = new Date().toISOString();

  const organization: SandboxOrganization = {
    id: `sandbox-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}`,
    name,
    clientType: input.clientType,
    facilityModel: input.facilityModel,
    status: "setup",
    environment: "sandbox",
    createdAt: now,
    updatedAt: now,
  };

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...existing, organization])
  );

  return organization;
}

export async function getSandboxOrganizationById(
  id: string
): Promise<SandboxOrganization | undefined> {
  const organizations = await getSandboxOrganizations();

  return organizations.find((item) => item.id === id);
}

export async function deleteSandboxOrganizationById(
  id: string
): Promise<SandboxOrganization> {
  if (!id.startsWith("sandbox-")) {
    throw new Error("Invalid sandbox ID.");
  }

  const existing = await getSandboxOrganizations();
  const selected = existing.find((item) => item.id === id);

  if (!selected || selected.environment !== "sandbox") {
    throw new Error("Sandbox not found. Nothing was deleted.");
  }

  const remaining = existing.filter((item) => item.id !== id);

  if (remaining.length !== existing.length - 1) {
    throw new Error("Duplicate sandbox IDs detected. Nothing was deleted.");
  }

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(remaining)
  );

  return selected;
}

export async function updateSandboxOrganizationById(
  id: string,
  input: CreateSandboxOrganizationInput
): Promise<SandboxOrganization> {
  if (!id.startsWith("sandbox-")) {
    throw new Error("Invalid sandbox ID.");
  }

  const name = input.name.trim().replace(/\s+/g, " ");

  if (!name) {
    throw new Error("Organization or training name is required.");
  }

  if (
    input.clientType !== "organization" &&
    input.clientType !== "training" &&
    input.clientType !== "both"
  ) {
    throw new Error("Invalid client type.");
  }

  if (
    input.facilityModel !== "facility-based" &&
    input.facilityModel !== "non-facility-based"
  ) {
    throw new Error("Invalid facility model.");
  }

  const existing = await getSandboxOrganizations();
  const matches = existing.filter((item) => item.id === id);

  if (matches.length !== 1 || matches[0].environment !== "sandbox") {
    throw new Error("Sandbox not found or duplicate IDs detected. Nothing changed.");
  }

  const normalize = (value: string) =>
    value.trim().replace(/\s+/g, " ").toLocaleLowerCase();

  const duplicate = existing.find(
    (item) => item.id !== id && normalize(item.name) === normalize(name)
  );

  if (duplicate) {
    throw new Error(
      `Duplicate name: "${duplicate.name}" already exists.`
    );
  }

  const selected = matches[0];

  const updated: SandboxOrganization = {
    ...selected,
    name,
    clientType: input.clientType,
    facilityModel: input.facilityModel,
    updatedAt: new Date().toISOString(),
  };

  const next = existing.map((item) =>
    item.id === id ? updated : item
  );

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));

  return updated;
}


// Update profile fields without changing sandbox identity or configuration.
export async function updateSandboxProfileById(
  id: string,
  profile: NonNullable<SandboxOrganization["profile"]>
): Promise<SandboxOrganization> {
  if (!id.startsWith("sandbox-")) {
    throw new Error("Invalid sandbox ID.");
  }

  const existing = await getSandboxOrganizations();
  const matches = existing.filter((item) => item.id === id);

  if (matches.length !== 1 || matches[0].environment !== "sandbox") {
    throw new Error(
      "Sandbox not found or duplicate IDs detected. Nothing changed."
    );
  }

  const selected = matches[0];

  const updated: SandboxOrganization = {
    ...selected,
    profile: {
      ...selected.profile,
      ...profile,
    },
    updatedAt: new Date().toISOString(),
  };

  const next = existing.map((item) =>
    item.id === id ? updated : item
  );

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));

  return updated;
}
