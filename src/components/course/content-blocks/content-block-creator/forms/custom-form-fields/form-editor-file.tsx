import { useEditor } from "@/src/components/editor/zustand";
import Form from "@/src/components/reusable/formlayout";
import { Button } from "@/src/components/reusable/shadcn-ui/button";

export default function FormEditorFile() {
  const { data: currentData, openEditor: openWorkbench } = useEditor();

  return (
    <Form.Item label="file">
      <Button
        onClick={() => openWorkbench(currentData)}
        className="flex w-full items-center justify-between"
      >
        <span>Document</span>
        <span className="font-normal text-muted-contrast">
          Pages: {currentData.pages.length}
        </span>
      </Button>
    </Form.Item>
  );
}
