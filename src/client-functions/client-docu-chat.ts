import type { Message } from "ai";
import { toast } from "../components/reusable/toaster/toast";
import api from "../pages/api/api";
import { toastNotEnoughAICredits } from "./client-utils";

export async function createDocuChatAssistant(
  url: string,
  blockId: string,
): Promise<
  | {
      success: true;
      assistantId: string;
    }
  | {
      success: false;
    }
> {
  if (!url) return { success: false };
  const response = await fetch(api.createDocuChatAssistant, {
    method: "POST",
    body: JSON.stringify({ url, blockId }),
  });

  if (response.status !== 200) {
    if (response.status === 402) {
      toastNotEnoughAICredits();
    } else {
      toast.responseError({
        response,
      });
    }
    return { success: false };
  }
  return response.json();
}

export async function getDocuChatThread(blockId: string): Promise<{
  threadId: string;
  messages: Message[];
}> {
  const response = await fetch(api.getDocuChatThread + `?blockId=${blockId}`, {
    method: "GET",
  });

  if (response.status !== 200) {
    toast.responseError({
      response,
    });
    return { threadId: "", messages: [] };
  }

  return response.json();
}

export async function getDocuChatThreadForSpecificUser(
  blockId: string,
  userId: string,
): Promise<{
  threadId: string;
  messages: Message[];
}> {
  const response = await fetch(
    api.getDocuChatThreadForSpecificUser +
      `?blockId=${blockId}&userId=${userId}`,
    {
      method: "GET",
    },
  );

  if (response.status !== 200) {
    toast.responseError({
      response,
    });
    return { threadId: "", messages: [] };
  }

  return response.json();
}
