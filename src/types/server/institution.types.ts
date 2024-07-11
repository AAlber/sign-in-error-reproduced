import type {
  Institution,
  InstitutionMetadata,
  Prisma,
  User,
} from "@prisma/client";

export type InstitutionWithLayersData = Prisma.InstitutionGetPayload<{
  include: {
    layers: true;
  };
}>;

export type InstitutionWithUsersAndMetadata = Institution & {
  metadata: InstitutionMetadata;
  users: User[];
};

export type UpdateInstitutionGeneralInfoData = {
  name?: string;
  logoLink?: string | null;
};

export type CreateTrialSubscriptionData = {
  name: string;
  language: "en" | "de";
  theme: string;
  logo?: string;
};
