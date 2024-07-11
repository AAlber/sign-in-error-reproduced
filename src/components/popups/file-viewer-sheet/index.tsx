// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import FileViewer from "../../reusable/file-viewer";
import {
  Sheet,
  SheetContent,
  SheetNavBar,
} from "../../reusable/shadcn-ui/sheet";
import useFileViewerSheet from "./zustand";

export default function FileViewerSheet() {
  const { open, fileUrl, secureMode, fileName, setOpen } = useFileViewerSheet();

  return (
    <Sheet open={open} onOpenChange={setOpen} modal>
      <SheetContent side={"bottom"} className="h-full p-0">
        <div className="relative flex h-full flex-col">
          <SheetNavBar title={fileName ?? ""} />
          <FileViewer url={fileUrl} secure={secureMode} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
