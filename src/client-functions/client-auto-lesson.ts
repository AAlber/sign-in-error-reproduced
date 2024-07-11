import type { Message } from "ai";
import useAutoLessonChat from "../components/popups/auto-lesson-chat/zustand";
import api from "../pages/api/api";
import type {
  GenerateChapterQuestionsResponse,
  GenerateChaptersRequest,
  GenerateChaptersResponse,
} from "../types/ai/ai-request-response.types";
import ai from "./client-ai/client-ai-handler";
import { deleteCloudflareDirectories } from "./client-cloudflare";

export async function generateChapters(
  urls: string[],
): Promise<GenerateChaptersResponse> {
  const response = await fetch(api.generateChapters, {
    method: "POST",
    body: JSON.stringify({
      fileUrls: urls,
    } satisfies GenerateChaptersRequest),
  });

  const data = await ai.handle.response<GenerateChaptersResponse>(response);

  if (!urls) return { chapters: [], fileUrls: [] };
  if (!data) {
    const directories = urls.map((url) => {
      return { url, isFolder: false };
    });
    await deleteCloudflareDirectories(directories);
    return { chapters: [], fileUrls: [] };
  }

  return {
    chapters: data.chapters,
    fileUrls: urls,
  };
}

export async function getAutolessonThreadForChapter(
  blockId: string,
  chapterId: string,
): Promise<{ threadId: string; messages: Message[] }> {
  const response = await fetch(
    api.getAutoLessonThread + `?blockId=${blockId}&chapterId=${chapterId}`,
    {
      method: "GET",
    },
  );

  return await response.json();
}

export async function getQuestionForChapter(
  blockId: string,
  chapterId: string,
): Promise<GenerateChapterQuestionsResponse | null> {
  const response = await fetch(
    api.getAutoLessonQuestionForChapter +
      `?blockId=${blockId}&chapterId=${chapterId}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    return null;
  }

  return await response.json();
}

export const handleMessageListScroll = (event: Event) => {
  const { setAutoScroll } = useAutoLessonChat.getState();
  const element = event.target as HTMLElement;
  if (element.scrollTop + element.clientHeight < element.scrollHeight) {
    setAutoScroll(false);
  } else {
    setAutoScroll(true);
  }
};
