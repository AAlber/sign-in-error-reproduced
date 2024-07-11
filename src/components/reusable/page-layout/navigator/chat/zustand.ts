import { mountStoreDevtool } from "simple-zustand-devtools";
import type { Channel } from "stream-chat";
import { create } from "zustand";
import type { StreamChatGenerics } from "./types";

interface Chat {
  activeMembers: number;
  currentChannel: Channel<StreamChatGenerics> | undefined;
  giphy: {
    isOpen: boolean;
    value: string;
  };
  isSearching: boolean;
  mutedChannels: string[];
  unseenMessageStart: Record<string, string>;
  unreadChannels: number;
  /**
   * Value will change on every sendMessage event, and reset to 0 on every currentChannel change.
   * Used to force rerender any component subscribe to it
   *
   * Currently used in:
   * 1. render-list
   */
  refresh: number;
}

type ChatMethod<T> = (data?: T) => void;
interface ChatMethods {
  setActiveMembers: ChatMethod<number>;
  setCurrentChannel: ChatMethod<Chat["currentChannel"]>;
  setGiphy: ChatMethod<Chat["giphy"]>;
  setIsSearching: ChatMethod<Chat["isSearching"]>;
  setMutedChannels: ChatMethod<Chat["mutedChannels"]>;
  setUnreadChannels: ChatMethod<Chat["unreadChannels"]>;
  setUnseenMessageStart: (data: {
    channelId: string;
    messageId: string;
  }) => void;
}

export const initialState: Chat = {
  activeMembers: 1,
  currentChannel: undefined,
  giphy: { isOpen: false, value: "" },
  isSearching: false,
  refresh: 0,
  mutedChannels: [],
  unreadChannels: 0,
  unseenMessageStart: {},
};

const useChat = create<Chat & ChatMethods>()((set) => ({
  ...initialState,
  setIsSearching: (data) =>
    set((state) => ({ isSearching: data ?? !state.isSearching })),
  setActiveMembers: (data) => set(() => ({ activeMembers: data ?? 0 })),
  setCurrentChannel: (data) => set(() => ({ currentChannel: data })),
  setGiphy: (data) =>
    set((state) => ({ giphy: { ...state["giphy"], ...data } })),
  setMutedChannels: (data) => set(() => ({ mutedChannels: data })),
  setUnreadChannels: (data) => set(() => ({ unreadChannels: data })),
  setUnseenMessageStart: (data) =>
    set((state) => {
      if (!data.channelId) return state;
      return {
        unseenMessageStart: {
          ...state.unseenMessageStart,
          [data.channelId]: data.messageId,
        },
      };
    }),
}));

export default useChat;

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("chat", useChat);
}

useChat.subscribe((state, prev) => {
  if (prev.currentChannel?.id !== state.currentChannel?.id) {
    state.refresh = 0;
  }
});
