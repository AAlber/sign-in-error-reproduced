import { useClerk } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useStreamChatContext } from "../components/getstream";

const useAuthSignout = (origin: string) => {
  const { signOut: clerkSignOut } = useClerk();
  const { client } = useStreamChatContext();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const signOut = useCallback(async () => {
    try {
      setIsSigningOut(true);
      await clerkSignOut();
      if (client) {
        await client.disconnectUser().catch(console.log);
      }
      localStorage.clear();
      queryClient.clear();
      deleteAllCookies();
      await router.replace("/sign-in");
    } catch (error) {
      console.error(error);
      console.error(`Error signing out from ${origin}`);
    } finally {
      setIsSigningOut(false);
    }
  }, [clerkSignOut, client, router]);

  return { signOut, isSigningOut };
};

export default useAuthSignout;

/**
 * clear all cookies to refresh auth session
 * https://stackoverflow.com/questions/179355/clearing-all-cookies-with-javascript
 */
function deleteAllCookies() {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie?.indexOf("=");
    if (eqPos) {
      const name = eqPos > -1 ? cookie?.substring(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }
}
