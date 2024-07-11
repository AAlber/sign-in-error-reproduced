import { create } from "zustand";

interface UserDropdownView {
  open: boolean;
  search: string;
  title: string;
  layerId: string;
  users: any[];
  userProfilesActive: boolean;
  showChatOption: boolean;
  onUserSelect?: (user: any) => void;
  setOpen: (data: boolean) => void;
  setSearch: (data: string) => void;
  setLayerId: (data: string) => void;
  setUsers: (data: any[]) => void;
  setUserProfilesActive: (data: boolean) => void;
  init: (data: {
    title: string;
    layerId: string;
    showChatOption: boolean;
    onUserSelect?: (user: any) => void;
  }) => void;
  reset: () => void;
}

const initalState = {
  open: false,
  title: "",
  layerId: "",
  users: [],
  search: "",
  userProfilesActive: false,
  showChatOption: false,
};

const useUserDropdownView = create<UserDropdownView>((set) => ({
  ...initalState,
  setUsers: (data) => set(() => ({ users: data })),
  setOpen: (data) => set(() => ({ open: data })),
  setSearch: (data) => set(() => ({ search: data })),
  setLayerId: (data) => set(() => ({ layerId: data })),
  setUserProfilesActive: (data) => set(() => ({ userProfilesActive: data })),
  reset: () => set(() => ({ ...initalState })),
  init: (data) =>
    set(() => ({
      ...data,
      open: true,
    })),
}));

export default useUserDropdownView;
