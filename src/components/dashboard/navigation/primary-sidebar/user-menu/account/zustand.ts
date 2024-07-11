import { create } from "zustand";
import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";

interface Account {
  open: boolean;
  user: InstitutionUserManagementUser | null;
  setOpen: (open: boolean) => void;
}

const initalState = {
  open: false,
  user: null,
};

const useAccountOverview = create<Account>((set) => ({
  ...initalState,
  setOpen: (open) => set({ open }),
}));

export default useAccountOverview;
