import { MessageSquare } from "lucide-react";
import ai from "@/src/client-functions/client-ai/client-ai-handler";
import { deleteCloudflareDirectories } from "@/src/client-functions/client-cloudflare";
import { uploadContentBlockFiles } from "@/src/client-functions/client-cloudflare/uppy-logic";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { getDocuChatThread } from "@/src/client-functions/client-docu-chat";
import useContentBlockModal from "@/src/components/course/content-blocks/content-block-creator/zustand";
import useDocuChat from "@/src/components/popups/docu-chat/zustand";
import { supportedFileTypesForAI } from "@/src/utils/utils";
import { ContentBlockBuilder } from "../registry";

export const docuChat = new ContentBlockBuilder("DocuChat")
  .withName("Docu Chat")
  .withDescription("docu-chat-description")
  .withHint("docu_chat_hint")
  .withCategory("ArtificalIntelligence")
  .withStyle({
    icon: <MessageSquare className="size-4" />,
  })
  .withForm({
    assistantId: {
      label: "file",
      description: "docu_chat_file_description",
      fieldType: "file",
      allowedFileTypes: supportedFileTypesForAI,
    },
    fileUrl: {
      label: "file",
      description: "learning_file_upload_description",
      fieldType: "custom",
    },
  })
  .withPreCreationStep(async () => {
    const { setData } = useContentBlockModal.getState();
    const urls = await uploadContentBlockFiles();
    if (!urls || !urls[0])
      throw new Error("Error uploading file for content block");
    const res = await ai.create.openai_assistant({
      instructions:
        "You are a helpful educator on the topic of the file. You have no knowledge of anything else except the informations provided within the provided file. If a request needs knowledge outside of the provided file, you openly disclose that you cannot answer it. You always answer in a highly strucutred markdown format. In case you cannot answer or there is a problem with the file, provide an alternative topic to talk about to the user that is related to the file.",
      model: "gpt-3.5-turbo",
      fileUrls: urls,
    });
    console.log(res);
    if (!res || !res.ok) {
      await deleteCloudflareDirectories([{ url: urls[0], isFolder: false }]);
      return false;
    }
    setData<"DocuChat">({
      assistantId: res.assistantId,
      fileUrl: urls[0],
    });
    return true;
  })
  .withOpeningProcedure(async (block, userStatus) => {
    const { openChat } = useDocuChat.getState();
    const data = await getDocuChatThread(block.id);
    openChat({
      block,
      messages: data.messages,
      mode: "chat",
      userStatus: {
        ...userStatus,
        userData: {
          threadId: data.threadId,
          messageCount: data.messages.length,
        },
      },
    });
    if (userStatus.status === "FINISHED") return;
    await contentBlockHandler.userStatus.update<"DocuChat">({
      blockId: block.id,
      data: {
        status: "IN_PROGRESS",
      },
    });
  })
  .withPopoverSettings({ hasOpenButton: true, hasMarkAsFinishedButton: true })
  .build();

export default docuChat;
