import { useTranslation } from "react-i18next";
import FileInput from "../../reusable/file-input";
import { useAIAssistant } from "./zustand";

export default function PdfInput() {
  const { setFile, file } = useAIAssistant();
  const { t } = useTranslation("page");
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-muted-contrast">
        {t("workbench_ai_assistant_context_pdf_input")}
      </div>
      <FileInput
        file={file}
        setFile={setFile}
        placeholder="workbench_ai_assistant_context_pdf_input_placeholder"
        accept=".pdf"
      />
    </div>
  );
}
