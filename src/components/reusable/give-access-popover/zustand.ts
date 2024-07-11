import { create } from "zustand";
import type { UserWithActiveStatus } from "@/src/types/user-management.types";

export type GiveAccessPopoverData = {
  layerId: string;
  availableRoles: Role[];
  allowQuickInvite: boolean;
  allowGroupImport: boolean;
  onUserAdded: (user: UserWithActiveStatus, role: Role) => void;
  onUserInvited: (email: string) => void;
};

interface GiveAccessPopover {
  search: string;
  role: Role;
  open: boolean;
  allowPublicShareLink: boolean;
  data: GiveAccessPopoverData;
  refresh: number;
  setOpen: (data: boolean) => void;
  refreshSuggestions: () => void;
  setSearch: (search: string) => void;
  setRole: (role: Role) => void;
  setData: (data: GiveAccessPopoverData) => void;
  setAllowPublicShareLink: (allowPublicShareLink: boolean) => void;
}

const initalState = {
  search: "",
  role: "member" as Role,
  allowPublicShareLink: false,
  refresh: 0,
  open: false,
  data: {
    layerId: "",
    availableRoles: ["member", "educator", "moderator"] as Role[],
    allowQuickInvite: false,
    allowGroupImport: false,
    onUserAdded: () => {
      return;
    },
    onUserInvited: () => {
      return;
    },
  },
};

const useGiveAccessPopover = create<GiveAccessPopover>((set) => ({
  ...initalState,

  setOpen: (open) => set({ open }),
  setSearch: (search) => set({ search }),
  setRole: (role) => set({ role }),
  setData: (data) => set({ data }),
  refreshSuggestions: () => set({ refresh: Date.now() }),
  setAllowPublicShareLink: (allowPublicShareLink) =>
    set({ allowPublicShareLink }),
}));

export default useGiveAccessPopover;
