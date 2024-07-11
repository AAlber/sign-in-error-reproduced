import { useEffect } from "react";
import Form from "@/src/components/reusable/formlayout";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useWorkbench, {
  WorkbenchType,
} from "@/src/components/workbench-deprecated/zustand";
import type { AssessmentSpecs } from "@/src/types/content-block/types/specs.types";
import useContentBlockCreator from "../../zustand";

export default function FormAssessment() {
  const { content, openWorkbenchWithContent } = useWorkbench();
  const { setData, contentBlockType } = useContentBlockCreator();

  useEffect(() => {
    if (contentBlockType !== "Assessment") return;
    setData<"Assessment">({
      content: JSON.stringify(content),
    } satisfies AssessmentSpecs);
  }, [content, open]);

  return (
    <Form.Item label="file">
      <Button
        onClick={() =>
          openWorkbenchWithContent({
            content,
            workbenchType: WorkbenchType.ASSESSMENT,
          })
        }
        className="flex w-full items-center justify-between"
      >
        <span>Document</span>
        <span className="font-normal text-muted-contrast">
          Pages: {content.pages.length}
        </span>
      </Button>
    </Form.Item>
  );
}
