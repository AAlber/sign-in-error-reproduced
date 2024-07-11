import { FileQuestion } from "lucide-react";
import AssessmentPopover from "@/src/components/course/content-blocks/block-popover/popover-assessment";
import useWorkbench, {
  WorkbenchMode,
  WorkbenchType,
} from "@/src/components/workbench-deprecated/zustand";
import useFile, { OpenOrigin } from "@/src/file-handlers/zustand";
import { ContentBlockBuilder } from "../registry";
import type { UserDataForBlock } from "../types/user-data.types";

const assessment = new ContentBlockBuilder("Assessment")
  .withName("assessment")
  .withDescription("assessment-description")
  .withCategory("UserDeliverables")
  .withHint("assessment_hint")
  .withForm({
    content: {
      label: "file",
      fieldType: "custom",
    },
  })
  .withOpeningProcedure((block, userStatus) => {
    // getting the content of the assessment
    const { openWorkbenchFromBlock } = useWorkbench.getState();
    const content = JSON.parse(block.specs.content);
    const userContent = userStatus.userData
      ? JSON.parse(
          (userStatus.userData as UserDataForBlock<"Assessment">).content,
        )
      : content;

    if (block.status === "DRAFT" || block.status === "COMING_SOON") {
      return openWorkbenchFromBlock({
        content,
        blockId: block.id,
        workbenchType: WorkbenchType.ASSESSMENT,
        mode: WorkbenchMode.CREATE,
      });
    }
    // opening the workbench depending on the status of the user
    switch (userStatus.status) {
      case "NOT_STARTED":
        return openWorkbenchFromBlock({
          content,
          blockId: block.id,
          workbenchType: WorkbenchType.ASSESSMENT,
          mode: WorkbenchMode.FILLOUT,
        });
      case "IN_PROGRESS":
        return openWorkbenchFromBlock({
          content: userContent,
          blockId: block.id,
          workbenchType: WorkbenchType.ASSESSMENT,
          mode: WorkbenchMode.FILLOUT,
        });
      case "FINISHED":
        return openWorkbenchFromBlock({
          content: userContent,
          blockId: block.id,
          workbenchType: WorkbenchType.ASSESSMENT,
          mode: WorkbenchMode.READONLY,
        });
      case "REVIEWED":
        return openWorkbenchFromBlock({
          content: userContent,
          blockId: block.id,
          workbenchType: WorkbenchType.ASSESSMENT,
          mode: WorkbenchMode.READONLY,
        });
      default:
        return openWorkbenchFromBlock({
          content,
          blockId: block.id,
          workbenchType: WorkbenchType.ASSESSMENT,
          mode: WorkbenchMode.READONLY,
        });
    }
  })
  .withCustomCreation(() => {
    const { openEmptyWorkbench } = useWorkbench.getState();
    // Drive Update: get rid of this
    const { setOpenedFrom } = useFile.getState();
    setOpenedFrom(OpenOrigin.BlockContentEditor);
    return openEmptyWorkbench(WorkbenchType.ASSESSMENT);
  })
  .withStyle({
    icon: <FileQuestion className="h-4 w-4" />,
  })
  .withPopoverSettings({
    hasMarkAsFinishedButton: false,
    hasOpenButton: false,
    customContentComponent: AssessmentPopover,
  })
  .build();

export default assessment;
