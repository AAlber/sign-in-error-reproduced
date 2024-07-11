import { create } from "zustand";
import {
  defaultFilter,
  type LayerUserFilter,
  type UserWithAccess,
} from "@/src/types/user-management.types";

interface LayerUserManagment {
  open: boolean;
  search: string;
  title: string;
  layerId: string;
  users: UserWithAccess[];
  inviteRole: string;
  emailsToInvite: string[];
  filter: LayerUserFilter;
  submittedFilter: LayerUserFilter;
  refresh: number;
  setOpen: (data: boolean) => void;
  setFilter: (filter: LayerUserFilter) => void;
  setSubmittedFilter: (filter: LayerUserFilter) => void;
  setSearch: (data: string) => void;
  setUsers: (data: UserWithAccess[]) => void;
  setInviteEmails: (data: string[]) => void;
  setInviteRole: (data: string) => void;
  init: (data: {
    title: string;
    layerId: string;
    filter?: LayerUserFilter;
  }) => void;
  reset: () => void;
  refreshUsers: () => void;
  setLayerBeingHovered: (data: string) => void;
  layerBeingHovered: string;
}

const initalState = {
  open: false,
  refresh: 0,
  layerId: "",
  title: "",
  users: [],
  filter: defaultFilter,
  submittedFilter: defaultFilter,
  emailsToInvite: [],
  inviteRole: "member",
  search: "",
  userProfilesActive: false,
  layerBeingHovered: "",
};

const useUserLayerManagement = create<LayerUserManagment>((set) => ({
  ...initalState,
  setUsers: (data) => set(() => ({ users: data })),
  setOpen: (data) => set(() => ({ open: data })),
  setSearch: (data) => set(() => ({ search: data })),
  setInviteEmails: (data) => set(() => ({ emailsToInvite: data })),
  setFilter: (data) => set(() => ({ filter: data })),
  setInviteRole: (data) => set(() => ({ inviteRole: data })),
  setSubmittedFilter: (data) => set(() => ({ submittedFilter: data })),
  reset: () => set(() => ({ ...initalState })),
  refreshUsers: () => set((state) => ({ refresh: state.refresh + 1 })),
  init: (data) =>
    set(() => ({
      ...data,
      filter: data.filter || defaultFilter,
      open: true,
    })),
  setLayerBeingHovered: (data) => set(() => ({ layerBeingHovered: data })),
}));

export default useUserLayerManagement;
