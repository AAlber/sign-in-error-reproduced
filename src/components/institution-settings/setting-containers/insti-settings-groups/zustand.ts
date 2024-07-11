import { create } from "zustand";
import type { UserGroup } from ".";

export type InstitutionGroupList = {
  groups: UserGroup[];
  setGroups: (groups: UserGroup[]) => void;
};

export const useInstitutionGroupList = create<InstitutionGroupList>((set) => ({
  groups: [],
  setGroups: (groups) => set({ groups }),
}));
