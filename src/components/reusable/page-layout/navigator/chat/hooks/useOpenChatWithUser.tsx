import { useChatContext } from "stream-chat-react";
import { useSetChannel } from "@/src/client-functions/client-chat/useSetChannel";
import pageHandler from "@/src/components/dashboard/page-handlers/page-handler";
import type { StreamChatGenerics } from "../types";

/**
 * Opens the chat window with the
 * selected user
 */

const useOpenChatWithUser = () => {
  const { setActiveChannel } = useSetChannel();
  const { setActiveChannel: setActiveChannelFromCtx } =
    useChatContext<StreamChatGenerics>();

  const openChatWithUser = async (
    id: string,
    name?: string,
    options?: { isChannel: boolean; type: "messaging" | "course" },
  ) => {
    const type = options?.type ?? "messaging";
    const isChannel = options?.isChannel ?? false;
    const isChatOpen = pageHandler.get.currentPage().titleKey === "CHAT";

    if (!isChatOpen) {
      /**
       * if we are already inside the chat window, then
       * don't set active channel to undefined, to avoid channel switch flicker
       */
      setActiveChannelFromCtx(undefined);
      pageHandler.set.page("CHAT");
    }

    await new Promise<void>((resolve) => {
      setTimeout(
        async () => {
          await setActiveChannel({
            id,
            isChannel,
            type,
            name,
          });
          resolve();
        },
        isChatOpen ? 0 : 600,
      );
    });
  };

  return { openChatWithUser };
};

export default useOpenChatWithUser;
