import type {
  Appointment,
  InstitutionUserDataField,
  InstitutionUserDataFieldValue,
  Invite,
} from "@prisma/client";
import type { ImportUserFieldsType } from "../components/institution-user-management/data-table/toolbar/import-users/schema";

export type CreateRole = {
  userId: string;
  layerId: string;
  role: Role;
};

export type ServerCreateRole = {
  userId: string;
  layerId: string;
  role: Role;
  institutionId: string;
  active: boolean;
};

export type InstitutionUserManagement = {
  dataFields: InstitutionUserDataField[];
  users: InstitutionUserManagementUser[];
  total?: number;
};

export type InstitutionUserManagementUser = UserWithAccess & {
  fieldData: InstitutionUserDataFieldValue[];
};

export type UserWithAccess = SimpleUser & {
  role: Role;
  accessLevel: AccessLevel;
  accessState: AccessState;
  invite: Invite | null;
  coursesJoinedCount?: number;
};

export type InstitutionUserManagementBaseFilter = {
  groupIds: string;
  layerIds: string;
  showStatus: "all" | "active" | "inactive";
};

export type InstitutionUserManagementFilter =
  InstitutionUserManagementBaseFilter &
    InstitutionManagementPagination &
    InstitutionManagementSorting &
    GetUsersWithAccess;

export type InstitutionManagementPagination = {
  skip: number;
  take: number;
};

export type InstitutionManagementSorting = {
  //
};

export type UserWithActiveStatus = SimpleUser & {
  active: boolean;
};

export type AccessLevel =
  | "admin"
  | "parent-access"
  | "access"
  | "partial-access";
export type AccessState = "active" | "inactive";

export type UserWithAvailability = UserWithAccess & {
  conflicts: Appointment[];
};

export type HasRoleInInstitution = {
  roles: Role[];
};

export type ServerHasRoleInInstitutionResponse = {
  hasRole: boolean;
};

export type LayerUserFilter = {
  allowedRoles: Role[];
  allowedAccessLevels: AccessLevel[];
  allowedAccessStates: AccessState[];
};

export const defaultFilter: LayerUserFilter = {
  allowedRoles: ["moderator", "educator", "member"],
  allowedAccessLevels: ["access"],
  allowedAccessStates: ["active", "inactive"],
};

export type GetUsersOfLayer = {
  layerId: string;
  search?: string;
  take?: number;
  filter?: LayerUserFilter;
};

export type GetUsersWithAccess = {
  layerId: string;
  search?: string;
  take?: number;
  roleFilter?: Role[];
};

export type SetStatusOfUsers = {
  active: boolean;
  userIds: string[];
};

export type ServerGetUsersWithAccess = GetUsersWithAccess &
  Partial<InstitutionManagementPagination>;

export type ServerGetUsersOfLayer = GetUsersOfLayer;

export type GetUsersForAddingToLayer = { layerId: string; search: string };

export type ServerGetForAddingToLayer = GetUsersForAddingToLayer & {
  institutionId: string;
};

export type HasRoleWithAccess = {
  layerIds: string[];
  rolesWithAccess: Role[];
};

export type ServerHasRoleWithAccess = {
  userId: string;
  layerIds: string[];
  rolesWithAccess: Role[];
  needsAllRoles?: boolean;
};

export type ServerHasRolesInAtLeastOneLayer = {
  userId: string;
  layerIds: string[];
  rolesWithAccess: Role[];
};

export type ServerHasRoleWithAccessResponse = {
  hasRoleWithAccess: boolean;
};

export type CreateInstitutionUser = {
  name: string;
  email: string;
  giveAccessToLayer?: string;
  role?: Role;
};

export type ImportUserArgs = {
  users: ImportUserFieldsType;
  fieldValues: FieldIdToEmailsWithValueMapping;
  groupValues: GroupIdToEmailIdsMapping;
};

export type FieldIdToEmailsWithValueMapping = Record<
  string,
  { [email: string]: string }[]
>;

export type GroupIdToEmailIdsMapping = Record<string, string[]>;

export type CreateUserDocumentsData = {
  userId: string;
  urls: string[];
};
