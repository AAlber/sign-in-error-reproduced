import { ArrowUpDown, ChevronFirst, ChevronLast } from "lucide-react";
import {
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/src/components/reusable/shadcn-ui/context-menu";
import type { WorkbenchPage } from "@/src/components/workbench-deprecated/types";
import useWorkbench from "../../../zustand";

export default function WBPageContentMenuMove({
  page,
}: {
  page: WorkbenchPage;
}) {
  const { getPages, insertPage, removePage, setCurrentPage } = useWorkbench();

  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger className="gap-2">
        {" "}
        <ArrowUpDown className="h-4 w-4" />
        Move
      </ContextMenuSubTrigger>
      <ContextMenuSubContent className="w-48">
        <ContextMenuItem
          onClick={() => {
            removePage(page.id);
            insertPage(page, 0);
          }}
          className="gap-2"
        >
          <ChevronFirst className="h-4 w-4 rotate-90" />
          Move to top
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            removePage(page.id);
            insertPage(page, getPages().length);
          }}
          className="gap-2"
        >
          <ChevronLast className="h-4 w-4 rotate-90" />
          Move to bottom
        </ContextMenuItem>
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}
