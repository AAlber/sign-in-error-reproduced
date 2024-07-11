import { useClerk } from "@clerk/nextjs";
import pick from "lodash/pick";
import { type PropsWithChildren, useRef } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { StreamChat } from "stream-chat";
import {
  addUserToInstitutionChat,
  createChatClient,
  fetchGetStreamToken,
} from "@/src/client-functions/client-chat/client";
import { useSyncClerkProfileWithGetstream } from "@/src/client-functions/client-chat/useSyncClerkProfileWithGetstream";
import useUser from "../../zustand/user";
import type { StreamChatGenerics } from "../reusable/page-layout/navigator/chat/types";

interface GetStreamContextProps {
  client: StreamChat<StreamChatGenerics> | null;
}

const GetStreamContext = createContext<GetStreamContextProps>(
  {} as GetStreamContextProps,
);

const GetStreamProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { user: userState, isMemberOfCurrentInstitutionChat } = useUser();
  // const { signOut } = useAuthSignout("getStream");
  const { listener } = useSyncClerkProfileWithGetstream();
  const [client, setClient] = useState<StreamChat<StreamChatGenerics> | null>(
    null,
  );

  const clerk = useClerk();
  const clientRef = useRef(createChatClient());
  const hasUserConnected = useRef(false);

  useEffect(() => {
    const chatClient = clientRef.current;
    const isInInstiOnboardingPage = location.pathname.includes("onboarding");

    async function connect() {
      if (
        !userState.id ||
        !userState.currentInstitutionId ||
        isInInstiOnboardingPage
      ) {
        return false;
      }

      const user = pick(userState, [
        "email",
        "id",
        "name",
        "image",
        "currentInstitution",
      ]);

      const token = await fetchGetStreamToken();

      try {
        await chatClient.connectUser(user as any, token);
        setClient(chatClient);

        return true;
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
          // const errorMessage = e.message;
          // if (/userToken does not have a user_id/.test(errorMessage)) {
          //   await signOut();
          // }
        }
        return false;
      }
    }

    connect().then((success) => {
      if (hasUserConnected.current || !success) return;
      if (userState?.institution?.id && !isMemberOfCurrentInstitutionChat) {
        addUserToInstitutionChat().catch(console.log);
        useUser.setState({ isMemberOfCurrentInstitutionChat: true });
        hasUserConnected.current = true;
      }
    });

    return () => {
      // TODO: safely disconnect user on rerender, avoid increasing MAU
      // if (client) {
      //   chatClient.disconnectUser();
      //   setClient(null);
      // }
    };
  }, [userState]);

  /**
   * Subscribe to clerk auth user updates
   * e.g. updating profile image also updates user image on getstream
   */
  useEffect(() => {
    if (!client) return;
    const unsubscribe = listener(client);
    return () => {
      unsubscribe?.();
    };
  }, [clerk.user, client]);

  /**
   * If there is a mismatch between the user from local storage
   * and the clerk user id redirect to signout to resync state
   */
  useEffect(() => {
    if (userState.id && clerk.user?.id) {
      console.log();
      // if (userState.id !== clerk.user.id) signOut().catch(console.log);
    }
  }, [clerk.user?.id, userState.id]);

  return (
    <GetStreamContext.Provider value={{ client }}>
      {children}
    </GetStreamContext.Provider>
  );
};

export default GetStreamProvider;
export const useStreamChatContext = () => useContext(GetStreamContext);
