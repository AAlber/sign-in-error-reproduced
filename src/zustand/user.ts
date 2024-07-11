import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import useAdministration from "../components/administration/zustand";
import type { UserData } from "../types/user-data.types";

type NotificationsPreference = {
  isSoundNotificationsEnabled: boolean;
  /** timestamp to when we should request
   * notifications permission again if request was skipped */
  requestPermissionAgainAt: number | undefined;
};

export interface User {
  user: UserData;
  isMemberOfCurrentInstitutionChat: boolean;
  notificationsPreference: NotificationsPreference;
  refresh: number;
  refreshUser: () => void;
  setNotificationsPreference: (
    data: Partial<User["notificationsPreference"]>,
  ) => void;
  setUser: (user: Partial<UserData>) => void;
  clearUser: () => void;
}

const useUser = create<User>()(
  persist(
    (set) => ({
      refresh: 0,
      user: {
        id: "",
        name: "",
        email: "",
        image: "",
        language: "en",
        streamToken: "",
        currentInstitutionId: "",
        institution: null,
      },
      isMemberOfCurrentInstitutionChat: false,
      notificationsPreference: {
        isSoundNotificationsEnabled: true,
        requestPermissionAgainAt: 0,
      },
      setNotificationsPreference: (data) =>
        set((state) => ({
          notificationsPreference: {
            ...state.notificationsPreference,
            ...data,
          },
        })),
      setUser: (data) => set((state) => ({ user: { ...state.user, ...data } })),
      clearUser: () => set({ user: {} as UserData }),
      refreshUser: () => set((state) => ({ refresh: state.refresh + 1 })),
    }),
    {
      name: "user",
    },
  ),
);

useUser.subscribe((state, prev) => {
  if (prev.user.currentInstitutionId !== state.user.currentInstitutionId) {
    useAdministration.getState().reset();
    state.isMemberOfCurrentInstitutionChat = false;
  }
});

export default useUser;

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("user", useUser);
}
