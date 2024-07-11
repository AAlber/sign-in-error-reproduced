import { StreamChat } from "stream-chat";
import type { StreamChatGenerics } from "@/src/components/reusable/page-layout/navigator/chat/types";
import { env } from "@/src/env/client.mjs";
import api from "@/src/pages/api/api";
import { log } from "@/src/utils/logger/logger";
import useUser from "@/src/zustand/user";

export function createChatClient() {
  return StreamChat.getInstance<StreamChatGenerics>(
    env.NEXT_PUBLIC_STREAM_API_KEY,
    {
      timeout: 60000,
      browser: true,
      allowServerSideConnect: false,
    },
  );
}

export async function fetchGetStreamToken() {
  const { user: user, setUser: setData } = useUser.getState();

  if (user?.streamToken) return Promise.resolve(user.streamToken);
  else {
    const data = await fetch(api.getStreamToken, {
      method: "POST",
    });

    const { token } = (await data.json()) as { token: string };
    setData({ streamToken: token });
    return token;
  }
}

export async function addUserToInstitutionChat() {
  const response = await fetch(api.addUserToInstitutionChat, {
    method: "POST",
  });

  if (!response.ok) {
    console.error("Add user to insti chat failed: " + (await response.json()));
    log.info("adding user to insti chat");
    return;
  }

  const data = await response.json();
  return data;
}
