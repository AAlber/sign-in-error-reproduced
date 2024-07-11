import { useClerk } from "@clerk/nextjs";
import type { StreamChat } from "stream-chat";
import type { StreamChatGenerics } from "@/src/components/reusable/page-layout/navigator/chat/types";
import useUser from "@/src/zustand/user";

/**
 * Updates zustand and getstream if there is a change in the
 * user's clerk profile
 */
export const useSyncClerkProfileWithGetstream = () => {
  const clerk = useClerk();
  const { setUser: setData } = useUser();

  const listener = (client: StreamChat<StreamChatGenerics>) => () =>
    clerk.addListener((e) => {
      const userId = client?.user?.id;

      const getStreamUser = {
        name: client?.user?.name,
        image: client?.user?.image,
      };

      const clerkUser = {
        name: e.user?.fullName,
        image: e.user?.imageUrl ?? e.user?.imageUrl,
      };

      if (!getStreamUser.name || !userId) return;

      const changedKeys = Object.keys(clerkUser).filter(
        (key) => getStreamUser[key] !== clerkUser[key],
      );

      if (changedKeys.length) {
        const changes = changedKeys.reduce((p, c) => {
          return { ...p, [c]: clerkUser[c] };
        }, {});

        setData(changes);
        client
          ?.partialUpdateUser({ id: userId, set: changes })
          .catch(console.log);
      }
    });

  return { listener };
};
