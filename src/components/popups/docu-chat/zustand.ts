import type { Message as ThreadMessage } from "ai/react";
import { create } from "zustand";
import type { ContentBlockUserStatusOfUser } from "@/src/types/content-block/types/user-data.types";
import type { ContentBlock } from "@/src/types/course.types";

type DocuChatMode = "chat" | "view";

interface DocuChat {
  open: boolean;
  messages: ThreadMessage[];
  block: ContentBlock<"DocuChat">;
  mode: DocuChatMode;
  userStatus: ContentBlockUserStatusOfUser<"DocuChat">;
  language: Language;
  user: SimpleUser | null;
  setOpen: (data: boolean) => void;
  openChat: (
    data:
      | {
          block: ContentBlock<"DocuChat">;
          userStatus: ContentBlockUserStatusOfUser<"DocuChat">;
          messages: ThreadMessage[];
          mode: "chat";
        }
      | {
          block: ContentBlock<"DocuChat">;
          userStatus: ContentBlockUserStatusOfUser<"DocuChat">;
          messages: ThreadMessage[];
          mode: "view";
          user: SimpleUser;
        },
  ) => void;
  setMode: (data: DocuChatMode) => void;
  setLanguage: (data: Language) => void;
  setMessages: (data: ThreadMessage[]) => void;
  reset: () => void;
}

const initalState = {
  open: false,
  user: null as SimpleUser | null,
  mode: "chat" as DocuChatMode,
  messages: [] as ThreadMessage[],
  language: "en" as Language,
  userStatus: {
    status: "NOT_STARTED",
  } as ContentBlockUserStatusOfUser<"DocuChat">,
  block: null as unknown as ContentBlock<"DocuChat">,
};

const useDocuChat = create<DocuChat>((set) => ({
  ...initalState,

  reset: () => set(() => ({ ...initalState })),
  setLanguage: (data) => set(() => ({ language: data })),
  setOpen: (data) => set(() => ({ open: data })),
  openChat: (data) => set(() => ({ ...data, open: true })),
  setMessages: (data) => set(() => ({ messages: data })),
  setMode: (data) => set(() => ({ mode: data })),
}));

export default useDocuChat;
