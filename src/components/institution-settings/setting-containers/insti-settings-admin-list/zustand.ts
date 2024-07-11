import { create } from "zustand";
import type { UserWithAccess } from "@/src/types/user-management.types";

export type AdminList = {
  refresh: number;
  users: UserWithAccess[];
  refreshAdminList: () => void;
  setUsers: (users: UserWithAccess[]) => void;
};

export const useAdminList = create<AdminList>((set) => ({
  refresh: 0,
  users: [],
  refreshAdminList: () => set({ refresh: Math.random() }),
  setUsers: (users) => set({ users }),
}));
