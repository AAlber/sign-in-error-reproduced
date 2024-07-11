import { Paperclip } from "lucide-react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import useCloudOverlay from "@/src/components/cloud-overlay/zustand";
import useNavigationOverlay from "@/src/components/reusable/page-layout/navigator/zustand";
import useWorkbench from "@/src/components/workbench-deprecated/zustand";
import { OpenOrigin } from "@/src/file-handlers/zustand";
import type { SurveyLogic } from "../../..";
import { updateLogics } from "../../functions";

export default function LogicAttachFuxamContentFile({
  elementId,
  logic,
}: {
  elementId: string;
  logic: SurveyLogic;
}) {
  const { openCloudImport } = useNavigationOverlay();
  const { setOpen } = useWorkbench();
  const { t } = useTranslation("page");

  return (
    <button
      onClick={() => {
        setOpen(false);
        openCloudImport({
          openOrigin: OpenOrigin.Default,
          acceptedFileTypes: ["learning", "assessment"],
          onCancel: () => {
            setOpen(true);
          },
          onSelect: async () => {
            const { highlightedFile } = useCloudOverlay.getState();
            if (!highlightedFile) return;
            const url = highlightedFile.viewLink;
            updateLogics(elementId, logic.id, {
              actionLink: url,
              fileName: highlightedFile.name,
            });
            setOpen(true);
          },
        });
      }}
      className="relative flex grow cursor-pointer select-auto resize-none justify-start overflow-hidden rounded-md border border-border bg-background px-2 py-1 text-contrast outline-none ring-0 placeholder:text-muted hover:bg-foreground focus:outline-none focus:ring-0 "
    >
      <Paperclip
        className={classNames(
          "pointer-events-none mr-2 w-5",
          logic.fileName ? "text-primary" : "text-muted-contrast",
        )}
      />
      <span
        className={classNames(
          "pointer-events-none",
          !logic.fileName && "text-muted-contrast",
        )}
      >
        {logic.fileName
          ? logic.fileName
          : t(
              "workbench.sidebar_element_survey_logic_action_unlock_placeholder",
            )}
      </span>
    </button>
  );
}
