import { useAssistant } from "ai/react";
import { useEffect } from "react";
import { getAutolessonThreadForChapter } from "@/src/client-functions/client-auto-lesson";
import api from "@/src/pages/api/api";
import { scrollToBottomOfElement } from "@/src/utils/utils";
import ChatSidebar from "./chapter-controller";
import AutoLessonInputForm from "./chat-input";
import ChatMessageList from "./chat-message-list";
import AutoLessonEmptyState from "./empty/empty-state";
import LoadingState from "./empty/loading-state";
import ChapterHeader from "./header";
import useAutoLessonChat from "./zustand";

export default function ChatContentDisplay() {
  const {
    userStatus,
    loadingThread,
    setLoadingThread,
    currentChapter,
    block,
    updateUserStatus,
    autoScroll,
  } = useAutoLessonChat();

  const assistant = useAssistant({
    api: api.handleNewAutoLessonThreadMessage,
    body: {
      assistantId: block.specs.assistantId,
      chapterTitle: block.specs.chapters[currentChapter]?.title,
      chapterDescription: block.specs.chapters[currentChapter]?.description,
      otherChapters: block.specs.chapters
        .filter((c, index) => index !== currentChapter)
        .map((c) => {
          return { title: c.title, description: c.description };
        }),
    },
    threadId: userStatus.userData?.chapters[currentChapter]?.threadId,
  });

  useEffect(() => {
    const chapter = block.specs.chapters[currentChapter];
    if (!chapter) return;
    setLoadingThread(true);
    assistant.setMessages([]);
    getAutolessonThreadForChapter(block.id, chapter.id).then((data) => {
      setLoadingThread(false);
      if (!data) return;
      assistant.setMessages(data.messages);
      updateUserStatus({
        status: "IN_PROGRESS",
        userData: {
          chapters: userStatus.userData
            ? userStatus.userData.chapters.map((c) => {
                if (c.chapterId === chapter.id) {
                  return {
                    ...c,
                    threadId: data.threadId,
                  };
                }
                return c;
              })
            : block.specs.chapters.map((c) => {
                if (c.id === chapter.id) {
                  return {
                    chapterId: c.id,
                    finished: false,
                    unlocked: true,
                    threadId: data.threadId,
                  };
                }
                return {
                  chapterId: c.id,
                  finished: false,
                  unlocked: false,
                  threadId: "",
                };
              }),
        },
      });
      scrollToBottomOfElement("chat-message-list");
    });
  }, [currentChapter]);

  useEffect(() => {
    if (autoScroll) {
      scrollToBottomOfElement("chat-message-list");
    }
  }, [assistant.messages, autoScroll]);

  return (
    <>
      <div className="flex h-full flex-1">
        <ChatSidebar />
        <div className="milkblur relative flex h-full flex-1 flex-col gap-2 bg-popover pb-2">
          <ChapterHeader />
          {loadingThread && <LoadingState />}
          {!loadingThread && assistant.messages.length === 0 && (
            <AutoLessonEmptyState />
          )}
          {!loadingThread && assistant.messages.length !== 0 && (
            <ChatMessageList assistant={assistant} />
          )}
          <AutoLessonInputForm assistant={assistant} />,
        </div>
      </div>
    </>
  );
}
