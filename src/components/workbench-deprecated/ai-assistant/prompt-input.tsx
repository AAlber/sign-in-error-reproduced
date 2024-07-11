import { useTranslation } from "react-i18next";
import Input from "../../reusable/input";
import { useAIAssistant } from "./zustand";

export default function PromptInput() {
  const { prompt, setPrompt } = useAIAssistant();
  const { t } = useTranslation("page");

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-muted-contrast">
        {t("workbench_ai_assistant_context_text_input")}
      </div>
      <Input
        placeholder="workbench_ai_assistant_context_text_input_placeholder"
        setText={setPrompt}
        text={prompt}
      />
    </div>
  );
}
