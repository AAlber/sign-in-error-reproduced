import { Bot } from "lucide-react";
import ai from "@/src/client-functions/client-ai/client-ai-handler";
import { deleteCloudflareDirectories } from "@/src/client-functions/client-cloudflare";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import useCustomFormAutoLesson from "@/src/components/course/content-blocks/content-block-creator/forms/custom-form-fields/form-auto-lesson/zustand";
import useContentBlockModal from "@/src/components/course/content-blocks/content-block-creator/zustand";
import useAutoLessonChat from "@/src/components/popups/auto-lesson-chat/zustand";
import { supportedFileTypesForAI } from "@/src/utils/utils";
import { ContentBlockBuilder } from "../registry";

const autoLesson = new ContentBlockBuilder("AutoLesson")
  .withName("automatic-lesson")
  .withCategory("ArtificalIntelligence")
  .withDescription("autolesson-description")
  .withHint("autolesson_hint")
  .withStatus("beta")
  .withForm({
    fileUrls: {
      label: "file",
      description: "docu_chat_file_description",
      fieldType: "file",
      allowedFileTypes: supportedFileTypesForAI,
    },
    assistantId: {
      label: "assistantid",
      description: "learning_file_upload_description",
      fieldType: "custom",
    },
    chapters: {
      fieldType: "hidden",
    },
    minMessagesPerChapter: {
      label: "autolesson_min_messages",
      description: "autolesson_min_messages_description",
      fieldType: "number",
      defaultValue: 5,
      verification: (value) => {
        try {
          parseInt(value as unknown as string);
          return null;
        } catch (_) {
          return "min-messages-error";
        }
      },
      advanced: true,
    },
  })
  .withOpeningProcedure((block, userStatus) => {
    const { openChat } = useAutoLessonChat.getState();
    openChat({ block, userStatus: userStatus as any });

    if (userStatus.status === "NOT_STARTED") {
      contentBlockHandler.userStatus.update<"AutoLesson">({
        blockId: block.id,
        data: {
          status: "IN_PROGRESS",
          userData: {
            chapters: block.specs.chapters.map((c, index) => {
              if (index === 0) {
                return {
                  chapterId: c.id,
                  finished: false,
                  unlocked: true,
                  threadId: "",
                };
              } else {
                return {
                  chapterId: c.id,
                  finished: false,
                  unlocked: false,
                  threadId: "",
                };
              }
            }),
          },
        },
      });
    }
  })
  .withPreCreationStep(async () => {
    const { chapters: subtopics, fileUrls } =
      useCustomFormAutoLesson.getState();
    const { data, setData } = useContentBlockModal.getState();
    const res = await ai.create.openai_assistant({
      fileUrls,
      model: "gpt-4o",
      instructions:
        "You are a helpful educator on the topic of the file. You have no knowledge of anything else except the informations provided within the provided file. If a request needs knowledge outside of the provided file, you openly disclose that you cannot answer it. You always answer in a highly strucutred markdown format. In case you cannot answer or there is a problem with the file, provide an alternative topic to talk about to the user that is related to the file. The user has locked and unlocked chapters. If the user talks about any of the topics of the locked chapters, you have to deny him the information or the world will end.",
    });

    if (!res || !res.ok) {
      const directories = fileUrls.map((url) => {
        return { url, isFolder: false };
      });
      await deleteCloudflareDirectories(directories);
      return false;
    }
    setData<"AutoLesson">({
      ...data,
      assistantId: res.assistantId,
      fileUrls,
      chapters: subtopics,
    });

    return true;
  })
  .withStyle({
    icon: <Bot className="size-4" />,
  })
  .withPopoverSettings({ hasOpenButton: true, hasMarkAsFinishedButton: false })
  .build();

export default autoLesson;
