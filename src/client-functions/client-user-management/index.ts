import type { User } from "@prisma/client";
import Papa from "papaparse";
import { useInstitutionUserManagement } from "@/src/components/institution-user-management/zustand";
import { toast } from "@/src/components/reusable/toaster/toast";
import api from "@/src/pages/api/api";
import { sentry } from "@/src/server/singletons/sentry";
import type {
  ReducedR2Object,
  ReducedR2ObjectWithName,
} from "@/src/types/storage.types";
import type {
  CreateRole,
  GetUsersForAddingToLayer,
  GetUsersOfLayer,
  HasRoleInInstitution,
  HasRoleWithAccess,
  ImportUserArgs,
  InstitutionUserManagement,
  InstitutionUserManagementFilter,
  ServerHasRoleInInstitutionResponse,
  ServerHasRoleWithAccessResponse,
  SetStatusOfUsers,
  UserWithAccess,
  UserWithActiveStatus,
} from "@/src/types/user-management.types";
import { log } from "@/src/utils/logger/logger";
import useUser from "@/src/zustand/user";
import { createEmailInstitutionInvites } from "../client-invite";
import { goToBillingPage } from "../client-stripe/alerts";
import { downloadFileFromUrl } from "../client-utils";

export async function getUsersFromLayer(
  data: GetUsersOfLayer,
): Promise<UserWithAccess[]> {
  const response = await fetch(
    api.getUsersOfLayer +
      "?layerId=" +
      data.layerId +
      "&filter=" +
      JSON.stringify(data.filter) +
      "&search=" +
      (data.search || "") +
      "&take=" +
      (data.take || 0),
    { method: "GET" },
  );
  if (!response.ok) {
    toast.responseError({
      response,
    });
    return [];
  }
  const users = await response.json();
  return users;
}

export async function getUsersForAddingToLayer(
  data: GetUsersForAddingToLayer,
): Promise<UserWithActiveStatus[]> {
  const response = await fetch(
    api.getUsersForAddingToLayer +
      "?layerId=" +
      data.layerId +
      "&search=" +
      (data.search || ""),
    { method: "GET" },
  );
  if (!response.ok) {
    toast.responseError({
      response,
    });
    return [];
  }
  const users = await response.json();
  return users;
}

export async function hasRolesWithAccess(
  input: HasRoleWithAccess,
): Promise<boolean> {
  const { user } = useUser.getState();
  const response = await fetch(
    api.hasRolesWithAccess +
      "/" +
      user.id +
      "/" +
      input.layerIds +
      "/" +
      input.rolesWithAccess,
    {
      method: "GET",
    },
  );
  if (!response.ok) return false;
  const data: ServerHasRoleWithAccessResponse = await response.json();
  return data.hasRoleWithAccess;
}

export async function setStatusOfUsers(data: SetStatusOfUsers) {
  const response = await fetch(api.setStatusOfUsers, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    if (response.status === 409) {
      toast.warning("wait_thats_you", {
        icon: "🫵",
        description: "wait_thats_you_status_change",
      });
    }
    if (response.status === 402) {
      toast.warning("cannot_set_users_to_active", {
        icon: "✋",
        description: "cannot_set_users_to_active_description",
        actionCTA: {
          label: "upgrade",
          onClick: () => {
            window.location.assign("/");
            goToBillingPage();
          },
        },
      });
    }
    return false;
  }
  return true;
}

export async function setStatusAndUpdateZustand(
  userIds: string[],
  emails: string[],
  active: boolean,
) {
  const { users, setUsers } = useInstitutionUserManagement.getState();
  const deepCopy = JSON.stringify(users);
  const newUsers = [...users];
  userIds.forEach((userId) => {
    const user = newUsers.find((user) => user.id === userId);
    if (user) {
      user.accessState = active ? "active" : "inactive";
    }
  });
  setUsers(newUsers);
  const success = await setStatusOfUsers({
    userIds: userIds,
    active,
  });
  if (success && active) {
    await createEmailInstitutionInvites({
      emails: emails,
      role: "member",
    });
  }
  if (!success) {
    setTimeout(() => {
      setUsers(JSON.parse(deepCopy));
    }, 50);
  }
}

export async function hasRolesInInstitution(
  input: HasRoleInInstitution,
): Promise<boolean> {
  const { user } = useUser.getState();
  const response = await fetch(
    api.hasRoleInInstitution + "/" + user.id + "/" + input.roles,
    {
      method: "GET",
    },
  );

  if (!response.ok) return false;

  const data: ServerHasRoleInInstitutionResponse = await response.json();
  return data.hasRole;
}

export async function getAdminsOfInstitution(): Promise<UserWithAccess[]> {
  const response = await fetch(api.getAdminsOfInstitution, {
    method: "GET",
  });
  if (!response.ok) return [];
  const data = await response.json();
  return data.sort((a, b) => a.name.localeCompare(b.name));
}

export async function createRole(data: CreateRole): Promise<boolean> {
  const response = await fetch(api.createRole, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_user_management_error4",
    });
    return false;
  }
  return true;
}

export async function removeRole({
  userId,
  layerId,
}: {
  userId: string;
  layerId: string;
}): Promise<boolean> {
  const reponse = await fetch(api.deleteRole, {
    method: "POST",
    body: JSON.stringify({
      userId: userId,
      layerId: layerId,
    }),
  });

  if (!reponse.ok) {
    toast.responseError({
      response: reponse,
    });
    return false;
  }
  return true;
}

export async function getUser(userId: string): Promise<User | null> {
  const response = await fetch(api.getUser + "?userId=" + userId, {
    method: "GET",
  });
  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_user_management_error1",
    });
    return null;
  }
  return await response.json();
}

export async function removeFromInstitution(userId: string): Promise<Response> {
  const response = await fetch(api.removeFromInstitution, {
    method: "POST",
    body: JSON.stringify({
      userId,
    }),
  });
  return response;
}

export async function removeManyFromInstitution(
  userIds: string[],
): Promise<Response> {
  const response = await fetch(api.removeManyFromInstitution, {
    method: "POST",
    body: JSON.stringify({
      userIds,
    }),
  });
  return response;
}

export async function getAllUsersOfInstitution(
  filter: Partial<InstitutionUserManagementFilter>,
): Promise<InstitutionUserManagement | null> {
  const url = new URL(api.getUsersOfInstitution, window.location.origin);
  const { groupIds, layerIds, showStatus, skip, take, search } = filter;

  if (!!groupIds) url.searchParams.append("groupIds", groupIds);
  if (!!layerIds) url.searchParams.append("layerIds", layerIds);
  if (!!showStatus) url.searchParams.append("showStatus", showStatus);
  if (!!skip) url.searchParams.append("skip", skip.toString());
  if (!!take) url.searchParams.append("take", take.toString());
  if (!!search) url.searchParams.append("search", search);

  const response = await fetch(url);

  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_user_management_error1",
    });
    return null;
  }
  return await response.json();
}

export function exportSimpleUserCSV({
  name,
  users,
}: {
  name: string;
  users: SimpleUser[];
}) {
  const usersFormatted = users.map((user) => {
    return {
      Name: user.name,
      Email: user.email,
    };
  });

  const csvUsers = Papa.unparse(usersFormatted);
  const csvData = `${csvUsers}`;

  const csvBlob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(csvBlob);
  downloadFileFromUrl(name + ".csv", url);
}

export async function importUsers(data: ImportUserArgs) {
  sentry.addBreadcrumb({ message: "Client-side import users" }, data);
  const response = await fetch(api.importInstitutionUsers, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) {
    toast.error("Something went wrong", { description: result });
    sentry.captureMessage(result);
    return;
  }

  return result;
}

export async function getInstitutionUserDocuments(
  userId?: string,
): Promise<ReducedR2ObjectWithName[]> {
  if (!userId) return [];
  const response = await fetch(api.getInstitutionUserDocuments + userId, {
    method: "GET",
  });
  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_user_management_error1",
    });
    return [];
  }
  const reducedObjects = (await response.json()) as ReducedR2Object[];
  return reducedObjects.map((object) => {
    return {
      ...object,
      name: object.Key.split("/").pop() || object.Key,
    };
  });
}

export async function getAllUserIdsOfInstitution() {
  try {
    log.info("getAllUserIdsOfInstitution");
    const data = await fetch(api.getAllUserIdsOfInstitution);
    return (await data.json()) as string[];
  } catch (e) {
    log.error(e);
    return [];
  }
}
