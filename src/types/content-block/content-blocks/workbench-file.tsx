import { FileText } from "lucide-react";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import useWorkbench, {
  WorkbenchMode,
  WorkbenchType,
} from "@/src/components/workbench-deprecated/zustand";
import useFile, { OpenOrigin } from "@/src/file-handlers/zustand";
import { ContentBlockBuilder } from "../registry";
import type { UserDataForBlock } from "../types/user-data.types";

const workbenchFile = new ContentBlockBuilder("StaticWorkbenchFile")
  .withName("fuxam-file")
  .withHint("workbench_hint")
  .withStatus("deprecated")
  .withDescription("wb_file_description")
  .withForm({
    content: {
      label: "file",
      fieldType: "custom",
    },
  })
  .withOpeningProcedure((block, userStatus) => {
    // only moderator for now, user opens it differently
    const { openWorkbenchFromBlock } = useWorkbench.getState();
    const content = JSON.parse(block.specs.content);

    if (block.status === "DRAFT" || block.status === "COMING_SOON") {
      return openWorkbenchFromBlock({
        content,
        blockId: block.id,
        workbenchType: WorkbenchType.LEARNING,
        mode: WorkbenchMode.CREATE,
      });
    }

    const userContent =
      userStatus.userData && (userStatus.userData as any).content
        ? JSON.parse(
            (userStatus.userData as UserDataForBlock<"StaticWorkbenchFile">)
              .content || content,
          )
        : content;
    openWorkbenchFromBlock({
      content: userContent,
      blockId: block.id,
      workbenchType: WorkbenchType.LEARNING,
      mode: WorkbenchMode.FILLOUT,
    });
    contentBlockHandler.userStatus.update<"StaticWorkbenchFile">({
      blockId: block.id,
      data: {
        status: userStatus.status === "FINISHED" ? "FINISHED" : "IN_PROGRESS",
        userData: {
          lastViewedAt: new Date(),
        },
      },
    });
  })
  .withCategory("InfoMaterials")
  .withCustomCreation(() => {
    const { openEmptyWorkbench } = useWorkbench.getState();
    // Drive Update: get rid of this
    const { setOpenedFrom } = useFile.getState();
    setOpenedFrom(OpenOrigin.BlockContentEditor);
    return openEmptyWorkbench(WorkbenchType.LEARNING);
  })
  .withStyle({
    icon: <FileText className="h-4 w-4" />,
  })
  .withPopoverSettings({ hasOpenButton: true, hasMarkAsFinishedButton: true })
  .build();

export default workbenchFile;
