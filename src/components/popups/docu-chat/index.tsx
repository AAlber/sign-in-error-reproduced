import FileViewer from "../../reusable/file-viewer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../reusable/shadcn-ui/resizable";
import {
  Sheet,
  SheetContent,
  SheetNavBar,
} from "../../reusable/shadcn-ui/sheet";
import DocuChatDisplay from "./chat";
import useDocuChat from "./zustand";

export default function DocuChat() {
  const { open, block, messages, setOpen } = useDocuChat();

  return (
    <Sheet open={open} onOpenChange={setOpen} modal>
      <SheetContent side={"bottom"} className="h-full p-0">
        <div className="relative flex h-full flex-col ">
          <SheetNavBar>
            <p className="flex w-full justify-center font-medium text-contrast">
              {block?.name ?? ""}
            </p>
          </SheetNavBar>
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel defaultSize={67}>
              {block && <FileViewer url={block.specs.fileUrl} />}
            </ResizablePanel>
            <ResizableHandle withHandle className={{}} />
            <ResizablePanel defaultSize={25} maxSize={50} minSize={25}>
              {" "}
              {block && <DocuChatDisplay messageList={messages} />}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </SheetContent>
    </Sheet>
  );
}
