import Image from "next/image";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import type { EditorData, EditorOptions } from "@/src/components/editor/types";
import { useEditor } from "@/src/components/editor/zustand";
import { sentry } from "@/src/server/singletons/sentry";
import { ContentBlockBuilder } from "../registry";

export const editorFile = new ContentBlockBuilder("EditorFile")
  .withName("editor-file")
  .withCategory("InfoMaterials")
  .withDescription("editor-file-description")
  .withHint("editor_file_hint")
  .withForm({
    content: {
      label: "file",
      fieldType: "custom",
    },
  })
  .withOpeningProcedure(async (block, userStatus) => {
    const { openEditor } = useEditor.getState();
    const options: EditorOptions = {
      canCreate: false,
      originBlockId: block.id,
    };
    try {
      const orginalAssessment: EditorData = JSON.parse(block.specs.content);

      if (block.status === "DRAFT" || block.status === "COMING_SOON") {
        return openEditor(orginalAssessment, {
          ...options,
          canCreate: true,
        });
      }

      openEditor(orginalAssessment, options);

      if (userStatus.status === "FINISHED") return;
      await contentBlockHandler.userStatus.update<"EditorFile">({
        blockId: block.id,
        data: {
          status: "IN_PROGRESS",
          userData: {
            lastViewedAt: new Date(),
            comments: [],
          },
        },
      });
    } catch (error) {
      sentry.captureMessage("Failed to open workbench", {
        extra: { error },
        level: "error",
      });
      return openEditor();
    }
  })
  .withCustomCreation(() => {
    const { openEditor } = useEditor.getState();
    return openEditor();
  })
  .withStyle({
    icon: (
      <div className="h-4 w-4 pt-[1px]">
        <Image
          height={25}
          width={25}
          src={"/logo-white.svg"}
          alt="logo white"
          className="dark:invert"
        />
      </div>
    ),
  })
  .withPopoverSettings({ hasOpenButton: true, hasMarkAsFinishedButton: true })
  .build();

export default editorFile;
