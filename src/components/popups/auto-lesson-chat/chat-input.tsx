import type { UseAssistantHelpers } from "ai/react";
import { useTranslation } from "react-i18next";
import AIInputField from "../../reusable/ai-input-field";
import { isAssistantStreaming, isLoading } from "./functions";
import UnlockNextChapterPopover from "./unlock-next-chapter";
import useAutoLessonChat from "./zustand";

export default function AutoLessonInputForm({
  assistant,
}: {
  assistant: UseAssistantHelpers;
}) {
  const { t } = useTranslation("page");
  const { loadingThread } = useAutoLessonChat();

  if (!assistant) return null;
  const aiIsStreaming = isLoading(assistant) || isAssistantStreaming(assistant);

  return (
    <div className="absolute inset-x-2 bottom-4 flex flex-row gap-2 rounded-t-lg px-10">
      <AIInputField
        value={assistant.input}
        onInputChange={assistant.handleInputChange}
        onSubmit={assistant.submitMessage}
        stop={assistant.stop}
        placeholder={t("placeholder")}
        isLoading={aiIsStreaming}
        isDisabled={loadingThread}
      >
        {true && <UnlockNextChapterPopover assistant={assistant} />}
      </AIInputField>
    </div>
  );
}
