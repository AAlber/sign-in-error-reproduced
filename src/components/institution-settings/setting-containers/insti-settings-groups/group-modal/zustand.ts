import type { InstitutionUserGroup } from "@prisma/client";
import { create } from "zustand";

export type GroupModal = {
  open: boolean;
  name: string;
  color: string;
  editMode: boolean;
  groupId: string;
  userIdsToAddUponCreation: string[];
  additionalInformation: string;
  setOpen: (open: boolean) => void;
  openGroupCreation: () => void;
  openSettingsForGroup: (group: InstitutionUserGroup) => void;
  openGroupCreationAndAddUsers: (userIds: string[]) => void;
  setAdditionalInformation: (additionalInformation: string) => void;
  setName: (name: string) => void;
  setColor: (color: string) => void;
  reset: () => void;
};

const initialState = {
  open: false,
  name: "",
  color: "blue",
  editMode: false,
  groupId: "",
  userIdsToAddUponCreation: [],
  additionalInformation: "",
};

export const useUserGroupModal = create<GroupModal>()((set) => ({
  ...initialState,

  openGroupCreation: () =>
    set({
      ...initialState,
      open: true,
      editMode: false,
      userIdsToAddUponCreation: [],
    }),
  openGroupCreationAndAddUsers: (userIds: string[]) =>
    set({
      ...initialState,
      open: true,
      editMode: false,
      userIdsToAddUponCreation: userIds,
    }),
  openSettingsForGroup: (group) => {
    set({
      open: true,
      editMode: true,
      groupId: group.id,
      name: group.name,
      color: group.color,
      userIdsToAddUponCreation: [],
      additionalInformation: group.additionalInformation,
    });
  },
  setOpen: (open) => set({ open }),
  setName: (name) => set({ name }),
  setColor: (color) => set({ color }),
  setAdditionalInformation: (additionalInformation) =>
    set({ additionalInformation }),
  reset: () => set({ ...initialState }),
}));
