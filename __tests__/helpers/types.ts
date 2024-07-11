import type { UserWithRoleInstitutionAndLayersDataType } from ".";

export type MockLayer =
  UserWithRoleInstitutionAndLayersDataType["layers"][number];

export type MockOrganization =
  UserWithRoleInstitutionAndLayersDataType["institution"];
