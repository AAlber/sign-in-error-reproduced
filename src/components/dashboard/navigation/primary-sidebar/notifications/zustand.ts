import { create } from "zustand";

interface Notifications {
  unreadCount: number;
  refreshTrigger: number;
  refresh: () => void;
  setUnreadCount: (data: number) => void;
}

const initalState = {
  unreadCount: 0,
  refreshTrigger: 0,
  hasUnread: false,
};

const useNotifications = create<Notifications>((set) => ({
  ...initalState,
  setUnreadCount: (data) => set(() => ({ unreadCount: data })),
  refresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));

export default useNotifications;
