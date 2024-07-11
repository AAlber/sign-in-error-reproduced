import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import useWorkbench, { WorkbenchType } from "../zustand";

export default function WBFileNameInput() {
  const { content, setTitle, workbenchType, noNameError } = useWorkbench();
  const { t } = useTranslation("page");

  return (
    <div className="flex items-center">
      <div className={"flex items-center text-sm"}>
        <input
          type="text"
          maxLength={30}
          className={classNames(
            noNameError
              ? "placeholder-destructive"
              : "placeholder-muted-contrast",
            "max-w-lg border-transparent bg-transparent px-0 text-right text-sm text-contrast outline-none focus:border-transparent focus:ring-0",
          )}
          placeholder={t("workbench_header_file_input_placeholder")}
          value={content.title}
          onChange={(e) => {
            const title = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
            setTitle(title);
          }}
        />
      </div>
      <span className="text-muted-contrast">
        {workbenchType === WorkbenchType.ASSESSMENT
          ? t("workbench_header_file_assess")
          : t("workbench_header_file_learn")}
      </span>
    </div>
  );
}
