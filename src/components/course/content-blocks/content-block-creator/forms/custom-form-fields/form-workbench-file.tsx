import { useEffect } from "react";
import Form from "@/src/components/reusable/formlayout";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useWorkbench, {
  WorkbenchType,
} from "@/src/components/workbench-deprecated/zustand";
import useFile, { OpenOrigin } from "@/src/file-handlers/zustand";
import type { StaticWorkbenchFileSpecs } from "@/src/types/content-block/types/specs.types";
import useContentBlockCreator from "../../zustand";

export default function FormWorkbenchFile() {
  const { content, open, openWorkbenchWithContent, openEmptyWorkbench } =
    useWorkbench();

  const { setData, contentBlockType } = useContentBlockCreator();

  const elementCount = content.pages.reduce(
    (acc, page) => acc + page.elements.length,
    0,
  );

  useEffect(() => {
    if (contentBlockType !== "StaticWorkbenchFile") return;
    setData({
      content: JSON.stringify(content),
    } satisfies StaticWorkbenchFileSpecs);
  }, [content, open]);

  return (
    <Form.Item label="file">
      <Button
        onClick={() => {
          // Drive Update: get rid of this useFile, setOpenedFrom OpenOrigin
          const { setOpenedFrom } = useFile.getState();
          setOpenedFrom(OpenOrigin.BlockContentEditor);

          if (elementCount === 0)
            return openEmptyWorkbench(WorkbenchType.LEARNING);
          openWorkbenchWithContent({
            content: content,
            workbenchType: WorkbenchType.LEARNING,
          });
        }}
        className="flex w-full items-center justify-between"
      >
        <span>Document</span>
        <span className="font-normal text-muted-contrast">
          Pages: {content.pages.length} Elements: {elementCount}
        </span>
      </Button>
    </Form.Item>
  );
}
