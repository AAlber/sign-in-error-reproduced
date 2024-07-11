import { useEffect } from "react";
import type { Channel, EventHandler } from "stream-chat";
import { useChatContext } from "stream-chat-react";
import { toast } from "@/src/components/reusable/toaster/toast";
import useUser from "../../../../../../zustand/user";
import type { StreamChatGenerics } from "../types";
import useChat from "../zustand";

type SubscribeType = ReturnType<Channel<StreamChatGenerics>["on"]>;
const useGetActiveMembers = () => {
  const { client } = useChatContext<StreamChatGenerics>();
  const user = useUser((state) => state.user);
  const setActiveMembers = useChat((state) => state.setActiveMembers);

  useEffect(() => {
    let watchStartSubscription: SubscribeType;
    let watchStopSubscription: SubscribeType;

    const watchEventHandler: EventHandler<StreamChatGenerics> = (e) => {
      if (e.watcher_count) {
        setActiveMembers(e.watcher_count);
      }
    };

    async function fetchActiveMembers() {
      if (!client || !user.currentInstitutionId) return;
      const channel = client?.channel("team", user.currentInstitutionId);
      try {
        const { watcher_count } = await channel.watch({
          presence: false,
          state: false,
        });
        setActiveMembers(watcher_count ?? 1);

        watchStartSubscription = channel.on(
          "user.watching.start",
          watchEventHandler,
        );
        watchStopSubscription = channel.on(
          "user.watching.stop",
          watchEventHandler,
        );
      } catch (e) {
        toast.info("toast.active_members_error", {
          description: "toast.active_members_error_description",
        });
      }
    }

    fetchActiveMembers();

    return () => {
      if (watchStartSubscription && watchStopSubscription) {
        watchStartSubscription.unsubscribe();
        watchStopSubscription.unsubscribe();
      }
    };
  }, [client]);
  return null;
};

export default useGetActiveMembers;
