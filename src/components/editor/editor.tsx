import { DndContext, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { getEditorAIToken } from "@/src/client-functions/client-editor";
import { Sheet, SheetContent } from "../reusable/shadcn-ui/sheet";
import { EditorWrapper } from "./components/editor-wrapper";
import NavigationBar from "./components/navigation/navigation-bar/navigation-bar";
import { SheetNavBar } from "./editor-sheet-nav-bar";
import { useEditor } from "./zustand";

const Editor = () => {
  const { open, setOpen } = useEditor();

  const [aiToken, setAiToken] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  useEffect(() => {
    getEditorAIToken().then((token) => setAiToken(token));
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen} modal={false}>
      <SheetContent
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event?.preventDefault();
          }
        }}
        side="bottom"
        className="flex h-full flex-col gap-0 overflow-hidden bg-foreground p-0"
        onCloseAutoFocus={() => (document.body.style.pointerEvents = "")}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DndContext sensors={sensors}>
          <SheetNavBar>
            <NavigationBar />
          </SheetNavBar>
          {aiToken && <EditorWrapper aiToken={aiToken} />}
        </DndContext>
      </SheetContent>
    </Sheet>
  );
};

export default Editor;
