import type { InstitutionUserGroup, User } from "@prisma/client";
import cuid from "cuid";
import type { UserGroup } from "../components/institution-settings/setting-containers/insti-settings-groups";
import { useInstitutionGroupList } from "../components/institution-settings/setting-containers/insti-settings-groups/zustand";
import { toast } from "../components/reusable/toaster/toast";
import api from "../pages/api/api";
import type { CreateGroupArgs } from "../server/functions/server-institution-user-group";

type OmitIdCreateGroupArgs = Omit<CreateGroupArgs, "id">;
export async function createInstitutionUserGroup(
  data: OmitIdCreateGroupArgs | OmitIdCreateGroupArgs[],
) {
  data = Array.isArray(data) ? data : [data];

  // the id created here will be the group id in database
  const groups = data.map((group) => {
    const id = cuid();
    const newGroup = { id, members: 0, ...group };
    addGroup(newGroup);
    return newGroup;
  });

  return toast.transaction({
    transaction: async () =>
      fetch(api.createUserGroup, {
        method: "POST",
        body: JSON.stringify(groups satisfies CreateGroupArgs[]),
      }),
    successMessage: "toast_user_groups_success1",
    errorMessage: "toast_user_groups_error1",
    processMessage: "toast_user_groups_process1",
  });
}

export async function createInstitutionUserGroupAndAddUsers(
  data: {
    name: string;
    color: string;
    institutionId: string;
    userIds: string[];
  },
  getstreamCallback: (id: string) => Promise<void>,
) {
  toast.transaction({
    transaction: async () =>
      fetch(api.createUserGroup, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    successMessage: "Group created",
    errorMessage: "Group creation failed",
    processMessage: "Creating group...",
    onSuccess: async (response) => {
      const group = (await response.json()) as InstitutionUserGroup;
      await addUsersToInstitutionUserGroup(data.userIds, group.id, (id) =>
        getstreamCallback(id),
      );
    },
  });
}

export async function updateInstitutionUserGroup(data: {
  id: string;
  name: string;
  color: string;
  additionalInformation: string;
}) {
  updateGroup(data);

  return toast.transaction({
    transaction: async () =>
      fetch(api.updateUserGroup, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    successMessage: "toast_user_groups_success2",
    errorMessage: "toast_user_groups_error2",
    processMessage: "toast_user_groups_process2",
  });
}

export async function deleteInstitutionUserGroup(id: string) {
  removeGroup(id);

  return toast.transaction({
    transaction: async () => {
      const response = await fetch(api.deleteUserGroup, {
        method: "POST",
        body: JSON.stringify({ id }),
      });
      return response;
    },

    successMessage: "toast_user_groups_success3",
    errorMessage: "toast_user_groups_error3",
    processMessage: "toast_user_groups_process3",
  });
}

export async function getUserGroupsOfInstitution(
  search?: string,
  includeMembers?: boolean,
): Promise<UserGroup[]> {
  const url = new URL(api.getUserGroupsOfInstitution, window.location.origin);
  if (search) url.searchParams.append("search", search);
  if (typeof includeMembers === "boolean") {
    url.searchParams.append(
      "includeMembers",
      includeMembers.valueOf().toString(),
    );
  }

  const response = await fetch(url, { method: "GET" });
  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_user_groups_error4",
    });
    return [];
  }

  const groups = (await response.json()) as UserGroup[];
  return groups;
}

export async function getUsersOfUserGroups(ids: string[]): Promise<User[]> {
  const response = await fetch(api.getUsersOfUserGroups + ids, {
    method: "GET",
  });
  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_user_groups_error4",
    });
    return [];
  }

  const groups = await response.json();
  return groups;
}

export async function getEmailsOfUserGroup(id: string): Promise<Response> {
  const response = await fetch(api.getEmailsOfUserGroup + id, {
    method: "GET",
  });
  return response;
}

export async function getUserGroupsOfInstitutionForUser(
  userId: string,
): Promise<InstitutionUserGroup[]> {
  const response = await fetch(api.getUserGroupsOfInstitutionForUser + userId, {
    method: "GET",
  });
  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_user_groups_error4",
    });
    return [];
  }

  const groups = (await response.json()) as InstitutionUserGroup[];
  return groups;
}

export async function giveGroupAccessToLayer(groupId: string, layerId: string) {
  return toast.transaction({
    transaction: async () =>
      fetch(api.giveGroupAccessToLayer, {
        method: "POST",
        body: JSON.stringify({ groupId, layerId }),
      }),
    successMessage: "toast_user_groups_success4",
    errorMessage: "toast_user_groups_error5",
    processMessage: "toast_user_groups_process4",
  });
}

type InstitutionUserGroupWithMemberSince = InstitutionUserGroup & {
  memberSince: string;
};

export async function getGroupsOfUser(
  userId: string,
): Promise<InstitutionUserGroupWithMemberSince[]> {
  const response = await fetch(api.getGroupsOfUser + userId, { method: "GET" });
  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_user_groups_error4",
    });
    return [];
  }

  const groups =
    (await response.json()) as InstitutionUserGroupWithMemberSince[];
  return groups;
}

export async function addUsersToInstitutionUserGroup(
  ids: string[],
  groupId: string,
  getstreamCallback?: (id: string) => Promise<void>,
) {
  return toast.transaction({
    transaction: async () => {
      const response = await fetch(api.addUsersToUserGroup, {
        method: "POST",
        body: JSON.stringify({ ids, groupId }),
      });

      if (getstreamCallback) await getstreamCallback(groupId);

      return response;
    },
    successMessage: "toast_user_groups_success5",
    errorMessage: "toast_user_groups_error6",
    processMessage: "toast_user_groups_process5",
  });
}

export async function removeUsersFromUserGroups(
  ids: string[],
  groupIds: string[],
) {
  return await toast.transaction({
    transaction: async () =>
      fetch(api.removeUsersFromUserGroups, {
        method: "POST",
        body: JSON.stringify({ ids, groupIds }),
      }),
    successMessage: "toast_user_groups_success6",
    errorMessage: "toast_user_groups_error7",
    processMessage: "toast_user_groups_process6",
  });
}

export async function removeUsersFromAllUserGroups(ids: string[]) {
  return await toast.transaction({
    transaction: async () =>
      fetch(api.removeUsersFromAllUserGroups, {
        method: "POST",
        body: JSON.stringify({ ids }),
      }),
    successMessage: "toast_user_groups_success7",
    errorMessage: "toast_user_groups_error8",
    processMessage: "toast_user_groups_process7",
  });
}

export function addGroup(group: UserGroup) {
  const { groups, setGroups } = useInstitutionGroupList.getState();
  setGroups([...groups, group]);
}

export function removeGroup(groupId: string) {
  const { groups, setGroups } = useInstitutionGroupList.getState();
  setGroups(groups.filter((group) => group.id !== groupId));
}

export function updateGroup(group: Partial<InstitutionUserGroup>) {
  const { groups, setGroups } = useInstitutionGroupList.getState();
  setGroups(groups.map((g) => (g.id === group.id ? { ...g, ...group } : g)));
}
