import { useState } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import confirmAction from "@/src/client-functions/client-options-modal";
import { hasEmptyElementsInWorkbench } from "@/src/client-functions/client-workbench";
import useNavigationOverlay from "@/src/components/reusable/page-layout/navigator/zustand";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useFile, { OpenOrigin } from "@/src/file-handlers/zustand";
import useCloudOverlay from "../../../cloud-overlay/zustand";
import useContentBlockCreator from "../../../course/content-blocks/content-block-creator/zustand";
import useWorkbench, { WorkbenchMode, WorkbenchType } from "../../zustand";

export default function FinishButton() {
  const { content, blockId, setOpen, setTitle, workbenchType, mode } =
    useWorkbench();
  const { driveObject } = useCloudOverlay();
  const { openCloud } = useNavigationOverlay();
  const { openModal } = useContentBlockCreator();
  const { openOrigin } = useFile();
  const { t } = useTranslation("page");
  const [saving, setSaving] = useState(false);

  const getFile = () => {
    const string = JSON.stringify(content, null, 2);
    return new Blob([string], { type: "application/json" });
  };
  const isAssessmentMode = workbenchType === WorkbenchType.ASSESSMENT;
  const titleEnding = isAssessmentMode ? ".assess" : ".learn";
  const type = isAssessmentMode ? "assessment" : "learning";

  const finish = async () => {
    setOpen(false);
    // save the progress to blockId
    if (mode === WorkbenchMode.CREATE && blockId) {
      // Edit the assessment or learning material
      if (workbenchType === WorkbenchType.ASSESSMENT)
        return await contentBlockHandler.update.block<"Assessment">({
          id: blockId,
          specs: {
            content: JSON.stringify(content),
          },
        });
      if (workbenchType === WorkbenchType.LEARNING)
        return await contentBlockHandler.update.block<"StaticWorkbenchFile">({
          id: blockId,
          specs: {
            content: JSON.stringify(content),
          },
        });
    } else if (openOrigin === OpenOrigin.BlockContentEditor) {
      if (workbenchType === WorkbenchType.ASSESSMENT)
        return openModal("Assessment");
      if (workbenchType === WorkbenchType.LEARNING)
        return openModal("StaticWorkbenchFile");
    } else if (openOrigin === OpenOrigin.Cloud) {
      setSaving(true);
      await driveObject.uploadFileToDrive(
        getFile(),
        undefined,
        "no-name" + titleEnding,
        type,
      );
      setSaving(false);
      openCloud();
    } else {
      return;
    }
  };

  return (
    <Button
      disabled={saving}
      variant={"cta"}
      onClick={async () => {
        if (content.title === "") setTitle("Untitled");
        const hasEmptyElements = hasEmptyElementsInWorkbench();
        if (hasEmptyElements) {
          confirmAction(
            () => {
              finish();
            },
            {
              title: "workbench.confirm_action_finish_empety",
              description: "workbench.confirm_action_finish_empety_description",
              actionName: "workbench.confirm_action_finish_empety_action",
            },
          );
        } else finish();
      }}
    >
      {t(saving ? "workbench_header_finish_button_loading" : "general.save")}
    </Button>
  );
}
