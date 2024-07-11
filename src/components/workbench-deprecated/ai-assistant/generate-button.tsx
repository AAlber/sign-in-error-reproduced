import { useTranslation } from "react-i18next";
import { generateContent } from "@/src/client-functions/client-generate-content";
import { toast } from "@/src/components/reusable/toaster/toast";
import { heading } from "@/src/components/workbench-deprecated/elements/element-heading";
import { multipleChoice } from "@/src/components/workbench-deprecated/elements/element-multiplechoice";
import { paragraph } from "@/src/components/workbench-deprecated/elements/element-paragraph";
import { singleChoice } from "@/src/components/workbench-deprecated/elements/element-singlechoice";
import { text } from "@/src/components/workbench-deprecated/elements/element-text";
import type { ServerGenerateContentResponse } from "@/src/types/soon_deprecated_ai";
import { Button } from "../../reusable/shadcn-ui/button";
import WithToolTip from "../../reusable/with-tooltip";
import useWorkbench from "../zustand";
import { PromptOrigin, useAIAssistant } from "./zustand";

export default function GenerateButton() {
  const {
    loading,
    setLoading,
    language,
    selectedTags,
    type,
    promptOrigin,
    prompt,
    file,
  } = useAIAssistant();

  const keyValuePairs: [string, any][] = [
    ["workbench_ai_assistant_elements_heading", heading],
    ["workbench_ai_assistant_elements_single_choice", singleChoice],
    ["workbench_ai_assistant_elements_multiple_choice", multipleChoice],
    ["workbench_ai_assistant_elements_paragraph", paragraph],
    ["workbench_ai_assistant_elements_text", text],
  ];
  const { addElement, addContentToNewPage } = useWorkbench();
  const map: Map<string, number> = new Map(keyValuePairs);
  const { t } = useTranslation("page");
  const enableGenerateButton = () => {
    if (selectedTags.length > 0) {
      if (promptOrigin === PromptOrigin.PDF) {
        if (file !== null) {
          return true;
        }
      } else if (promptOrigin === PromptOrigin.TEXT) {
        if (prompt.length > 0) {
          return true;
        }
      }
    }
    return false;
  };

  const hoverText = () => {
    if (selectedTags.length === 0) {
      return "workbench_ai_assistant_generate_button_hover_no_tags";
    } else if (promptOrigin === PromptOrigin.PDF) {
      if (file === null) {
        return "workbench_ai_assistant_generate_button_hover_no_file";
      }
    } else if (promptOrigin === PromptOrigin.TEXT) {
      if (prompt.length === 0) {
        return "workbench_ai_assistant_generate_button_hover_no_prompt";
      }
    }
    return "";
  };

  return (
    <div className="w-full">
      <WithToolTip
        side="top"
        disabled={enableGenerateButton()}
        text={hoverText()}
      >
        <Button
          variant={"cta"}
          className="w-full"
          enabled={enableGenerateButton()}
          onClick={async () => {
            setLoading(true);
            const types: any[] = [];
            selectedTags.forEach((type) => {
              types.push(map.get(type));
            });

            let content: ServerGenerateContentResponse | null = null;
            if (promptOrigin === PromptOrigin.TEXT) {
              content = await generateContent({
                type: "text",
                prompt: prompt,
                requestedElements: types,
                language: language,
              });
            } else if (promptOrigin === PromptOrigin.PDF) {
              content = await generateContent({
                type: "pdf",
                file: file!,
                requestedElements: types,
                language: language,
              });
            }

            if (!content) return setLoading(false);
            if (type === "page") {
              addContentToNewPage(content);
              toast.success("toast.workbench_create_page_success", {
                description: "toast.workbench_create_page_success_description",
              });
            } else {
              content.map((element) => addElement(element));
            }
            setLoading(false);
          }}
          loading={loading}
        >
          {t("workbench_ai_assistant_generate_button")}
        </Button>
      </WithToolTip>
    </div>
  );
}
