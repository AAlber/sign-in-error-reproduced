import { AlignJustify, AlignLeft, Heading, List } from "lucide-react";
import { useTranslation } from "react-i18next";
import TagSelector from "../../reusable/tag-selector";
import useWorkbench, { WorkbenchType } from "../zustand";
import { useAIAssistant } from "./zustand";

export default function SelectContentTypes() {
  const { workbenchType } = useWorkbench();
  const { selectedTags, setSelectedTags } = useAIAssistant();
  const { t } = useTranslation("page");

  const contentTypes = [
    { icon: Heading, label: "workbench_ai_assistant_elements_heading" },
    { icon: AlignJustify, label: "workbench_ai_assistant_elements_text" },
    ...(workbenchType === WorkbenchType.ASSESSMENT
      ? [
          {
            icon: List,
            label: "workbench_ai_assistant_elements_single_choice",
          },
          {
            icon: List,
            label: "workbench_ai_assistant_elements_multiple_choice",
          },
        ]
      : []),
    { icon: AlignLeft, label: "workbench_ai_assistant_elements_paragraph" },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-muted-contrast">
        {t("workbench_ai_assistant_elements")}
      </div>
      <TagSelector
        maxTags={10}
        smallPadding
        title={""}
        description={""}
        availableTags={contentTypes}
        selectedTags={selectedTags}
        tagName={t("workbench_ai_assistant_elements_placeholder")}
        onChange={setSelectedTags}
        keepUsedTags={true}
      />
    </div>
  );
}
