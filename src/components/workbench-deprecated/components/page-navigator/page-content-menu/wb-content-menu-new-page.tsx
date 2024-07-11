import {
  ArrowDown,
  ArrowUp,
  ChevronFirst,
  ChevronLast,
  Plus,
} from "lucide-react";
import {
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/src/components/reusable/shadcn-ui/context-menu";
import type { WorkbenchPage } from "@/src/components/workbench-deprecated/types";
import useWorkbench from "../../../zustand";

export default function WBPageContentMenuNewPage({
  page,
  index,
}: {
  page: WorkbenchPage;
  index: number;
}) {
  const { getPages, insertNewPage } = useWorkbench();

  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger className="gap-2">
        {" "}
        <Plus className="h-4 w-4" />
        New Page
      </ContextMenuSubTrigger>
      <ContextMenuSubContent className="w-48">
        <ContextMenuItem onClick={() => insertNewPage(index)} className="gap-2">
          <ArrowUp className="h-4 w-4" />
          Add above
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => insertNewPage(index + 1)}
          className="gap-2"
        >
          <ArrowDown className="h-4 w-4" />
          Add below
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => insertNewPage(0)} className="gap-2">
          <ChevronFirst className="h-4 w-4 rotate-90" />
          Add to top
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => insertNewPage(getPages().length)}
          className="gap-2"
        >
          <ChevronLast className="h-4 w-4 rotate-90" />
          Add to bottom
        </ContextMenuItem>
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}
