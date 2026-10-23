// Universal sandbox organization and training setup.
// Local testing only; not connected to production Firestore.

export const SANDBOX_CLIENT_TYPES = {
  ORGANIZATION: "organization",
  TRAINING: "training",
} as const;

export type SandboxClientType =
  (typeof SANDBOX_CLIENT_TYPES)[keyof typeof SANDBOX_CLIENT_TYPES];

export const SANDBOX_FACILITY_MODELS = {
  FACILITY_BASED: "facility-based",
  NON_FACILITY_BASED: "non-facility-based",
} as const;

export type SandboxFacilityModel =
  (typeof SANDBOX_FACILITY_MODELS)[keyof typeof SANDBOX_FACILITY_MODELS];

export type SandboxOrganization = {
  id: string;
  name: string;
  clientType: SandboxClientType;
  facilityModel: SandboxFacilityModel;
  status: "setup";
  environment: "sandbox";
  createdAt: string;
  updatedAt: string;
  profile?: {
    displayName?: string;
    description?: string;
    contactEmail?: string;
    contactPhone?: string;
  };
};

export type CreateSandboxOrganizationInput = {
  name: string;
  clientType: SandboxClientType;
  facilityModel: SandboxFacilityModel;
};
